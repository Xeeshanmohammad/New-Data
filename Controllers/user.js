const User = require('../Models/userModel')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const {StatusCodes} = require('http-status-codes')
const jwt = require('jsonwebtoken')

const {
  attachCookiesToResponse,
  createTokenUser,
} = require('../utils/jwt');

const crypto = require('crypto')


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

router.post('/login', async(req,res)=>{
const {email, password} = req.body
let existingUser;
try {
    existingUser = await User.findOne({email})
} catch (error) {
  return  console.log(error);
}
if(!existingUser){
  return  res.status(404).json({message:"User cannot found"})
}
const isPasswordMatch = await bcrypt.compareSync(password, existingUser.password)
if(!isPasswordMatch){
   return res.status(404).json({message:"Invalid Credentials"})
}
// const tokenUser = createTokenUser(existingUser);

  // // create refresh token
  // let refreshToken = '';
  // // check for existing token
  // const existingToken = await Token.findOne({ existingUser: existingUser._id });

  // if (existingToken) {
  //   const { isValid } = existingToken;
  //   if (!isValid) {
  //     throw new CustomError.UnauthenticatedError('Invalid Credentials');
  //   }
  //   refreshToken = existingToken.refreshToken;
  //   attachCookiesToResponse({ res, existingUser: tokenUser, refreshToken });
  //   res.status(StatusCodes.OK).json({ existingUser: tokenUser });
  //   return;
  // }

  // refreshToken = crypto.randomBytes(40).toString('hex');
  // const userAgent = req.headers['user-agent'];
  // const ip = req.ip;
  // const userToken = { refreshToken, ip, userAgent, user: existingUser._id };

  // await Token.create(userToken);

  // attachCookiesToResponse({ res, existingUser: tokenUser, refreshToken });
   //just for demo, normally provided by DB!!!!
   const id = new Date().getDate()

   // try to keep payload small, better experience for user
   // just for demo, in production use long, complex and unguessable string value!!!!!!!!!
   const token = jwt.sign({ id, email }, process.env.JWT_SECRET, {
     expiresIn: 60*60*1000,
   })

 return res.status(StatusCodes.OK).json({ message:"Login Successful",token,existingUser })
})


module.exports = router