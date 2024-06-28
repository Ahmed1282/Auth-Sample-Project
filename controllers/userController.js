const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require('http-status-codes');


const createUser = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Email is already in use' });
    }
    const user = await User.create({ username, email, password, roles, });
    res.status(201).json(user);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validatePassword(password))) {
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
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.username = username || user.username;
    user.email = email || user.email;
    user.password = password || user.password;
    user.phone = phone || user.phone;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
