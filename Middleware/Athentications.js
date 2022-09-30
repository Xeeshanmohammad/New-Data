const jwt = require('jsonwebtoken')

const authenticationMiddleware = (req,res,next)=>{
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new Error('No token provided')
    }
    const token =  authHeader &&  authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const {id , name} = decoded
        req.user = {id,name}
        next()

    } catch (error) {
        throw new Error('Not authorized to access this route')
    }
}

module.exports = authenticationMiddleware