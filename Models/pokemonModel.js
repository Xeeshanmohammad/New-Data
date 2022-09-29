const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    abilities:{
        type:String,
        required:true,
        enum:['Feint Attack', 'Doom News']
    },
    attacks:{
        type:String,
        required:true,
    },
    image:[{
        type:String,
        required:true,
    }],
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
})

module.exports = mongoose.model('Pokemons', blogSchema)