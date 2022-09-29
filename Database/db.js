const mongoose = require('mongoose')

const connectDb = ()=>{
    return mongoose.connect('mongodb://localhost:27017/pokemon',{

    }).then(()=>console.log('Database is connected '))
    .catch((error)=>console.log('Database is not connected'))
}

module.exports = connectDb