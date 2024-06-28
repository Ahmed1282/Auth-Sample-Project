const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/user');

const AuthToken = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.SECRET);
    const user = await User.findOne({ where: { email: decoded.email } });
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'User not authorized' });
    }
    req.user = user;
    next();
    return res.status(StatusCodes.OK).json({ message: 'Authorized', user });
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid token' });
  }
};

const AuthRole = async (req, res, next) => {
    const user = req.user;
    console.log(user.roles)
  
    if (!user || user.roles !== 'SuperAdmin') {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Unauthorized', user });
    }
  
    next();
  } 

// const AuthRole = (roles) => {
//   return (req, res, next) => {
//     const user = req.user;
//     if (!user || !roles.includes(user.roles)) {
//       return res.status(StatusCodes.FORBIDDEN).json({ message: 'Unauthorized' });
//     }
//     console.log(user.roles);
//     next();
//   };
// };
  

module.exports = {
  AuthToken,
  AuthRole
};
