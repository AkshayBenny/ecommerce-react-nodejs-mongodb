import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'

export const protect = asyncHandler(async (req, res, next) => {
  let fullToken = req.headers.authorization
  let token
  if (fullToken && fullToken.startsWith('Bearer')) {
    try {
      token = fullToken.split(' ')[1]
      let decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).selected('-password') //return everything except the password
      next()
    } catch (error) {
      res.status(401).json({ message: 'Not authorized' })
      throw new Error('Invalid token')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('No token found')
  }
  next()
})
