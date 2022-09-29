const Pokemon = require("../Models/pokemonModel");
const User = require('../Models/userModel')
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/pokemon", async (req, res) => {
  let pokemons;
  try {
    const {page=1, limit=10} = req.query
    pokemons = await Pokemon.find()
    .limit(limit*1)
    .skip((page-1)*limit)
    .populate('user')
  } catch (error) {
    return console.log(error);
  }
  if (!pokemons) {
    return res.status(404).json({ message: "No pokemons found" });
  }
  return res.status(200).json({ totals:pokemons.length, pokemons });
});

router.post("/addpokemon", async (req, res) => {
  const { name, abilities, attacks, image,user } = req.body;
   let existingUser = await User.findById(user);
   if (!existingUser) {
     return res.status(400).json({ message: "Unable TO FInd User By This ID" });
   }
  const pokemon = new Pokemon({
    name, abilities, attacks, image,user
  });
  try {
    await pokemon.save()
    const session = await mongoose.startSession();
    session.startTransaction();
    await pokemon.save(session );
    existingUser.pokemons.push(pokemon);
    await existingUser.save( session );
    await session.commitTransaction();
    
  } catch (err) {
    return res.status(500).json({ message: err });
  }
  return res.status(200).json({ pokemon });

})


module.exports = router;
