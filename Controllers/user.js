const User = require('../Models/userModel')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const auth = require('../Middleware/Athentications')

router.post('/signup', async(req,res)=>{
    const {name,email,password} = req.body
    let existingUser;
    try {
        existingUser = await User.findOne({email})
    } catch (error) {
      return  console.log(error);
    }
    if(existingUser){
      return  res.status(403).json({message:'User Already exist'})
    }
    const bcryptPassword = bcrypt.hashSync(password)
    const user = new User({
        name,
        email,
        password:bcryptPassword,
        pokemons:[]
    })
    try {
        await user.save()
    } catch (error) {
     return  console.log(error); 
    }
    
    return res.status(201).json({user})
})

router.get('/', async(req,res)=>{
    let users;
    try {
        users = await User.find()
    } catch (error) {
        console.log(error);
    }
    if(!users){
     return  res.status(403).json({message:"No user found"})
    }
    return res.status(200).json({users})
})

router.post('/login', auth, async(req,res)=>{
    const { email, password } = req.body;
  
    // checking if user has given password and email both
  
    if (!email || !password ) {
      res.status(400).json({
        success: false,
        message:"Please Enter Email & Password",
      })
    }
  try {
  const user = await User.findOne({ "email":req.body.email});
    if (user) {
      const isPasswordMatched = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatched) {
      res.status(401).json({
        success: false,
        message:"Invalid email or password",
      })
    }
    else{
    res.cookie("user",user._id,{
      httpOnly:true,
      maxAge:1000*60*60 //1hr
    });
    res.status(200).json({
      success: true,
      message:"logged in succesfully",
    })}
    }
    else{
      res.status(401).json({
        success: false,
        message:"Invalid email or password ",
      })
    }
  } catch (error) {
    res.status(401).json({
      message:"Oops! Something went wrong",
    })
  }
  });


module.exports = router