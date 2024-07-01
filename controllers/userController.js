const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require('http-status-codes');
const { validationResult, check } = require('express-validator');
const bcrypt = require('bcrypt');


const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }
  try {
    const { username, email, password, roles } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Email is already in use' });
    }
    const hashedPassword = await bcrypt.hash(password.toString(), 10);
    const user = await User.create({ username, email, password: hashedPassword, roles, });
    res.status(201).json(user);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password.toString(), user.password))) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid email or password' });
    }
    //token created 
    const token = jwt.sign({  email: user.email }, process.env.SECRET, { expiresIn: '1h' });
    res.status(StatusCodes.OK).json({ token });
    console.log(token);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    console.log("PK " + req.params.id);
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }
  try {
    const { username, email, password, phone } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
    }
    user.username = username || user.username;
    user.email = email || user.email;
    user.password = password || user.password;
    user.phone = phone || user.phone;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
    }
    await user.destroy();
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};


module.exports = {
  createUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
  getAllUsers
};
