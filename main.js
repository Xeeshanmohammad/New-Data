const express = require ("express")
const app = express()
require('dotenv').config()
const cors = require('cors')
const cookieParser = require('cookie-parser')


const connectDb = require('./Database/db')

//functionality
const userRouter = require('./Controllers/user')
const pokemonRouter = require('./Controllers/pokemon')

//Middleware
const errorHandler = require('./Middleware/error-handler')
const notFound = require('./Middleware/not-found')

app.use(express.json())

app.use(cookieParser())

app.use(cors())



app.use('/api/user',userRouter)
app.use('/api/pokemon',pokemonRouter)

app.use(errorHandler)
app.use(notFound)

const start = async()=>{
    const port = process.env.PORT
    try {
        connectDb(process.env.PORT)
        app.listen(port, console.log(`Server is listening on : ${port}`))
    } catch (error) {
        
    }
}

start()