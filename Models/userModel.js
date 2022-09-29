const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:6
    },
    pokemons:[{
        type:mongoose.Types.ObjectId,
        ref:'Pokemons',
        required:true
    }],
})

module.exports = mongoose.model('User', userSchema)