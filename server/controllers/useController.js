import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

// @desc Auth user and get token
// @route POST /api/users/login
// @access Public
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(401).json({ error: 'Invalid credentials' })
  }
})

// @desc Get User Profile
// @route GET /api/users/profile
// @access Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
})

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }
    const updatedUser = await user.save()
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
})

// @desc Register new user
// @route POST /api/users/register
// @access Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400).json({ message: 'User already exists' })
  }
  const user = await User.create({ name, email, password })
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400).json({ message: 'Invalid user data' })
  }
})