const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/user');

const AuthToken = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'No token provided' });
  }

  try {
    let tokenString = token;
    if (!token.startsWith('Bearer ')) {
      tokenString = `Bearer ${token}`;
    } 
    const decoded = jwt.verify(tokenString.split(' ')[1], process.env.SECRET);
    //const decoded = jwt.verify(token.includes("Bearer  "), process.env.SECRET);
    const user = await User.findOne({ where: { email: decoded.email } });
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'User not authorized' });
    }
    req.user = user;
    console.log(user)
    next();
    //return res.status(StatusCodes.OK).json({ message: 'Authorized', user });
  } catch (error) {
    console.log("🚀 ~ AuthToken ~ error:", error)
    console.error('JWT Verification Error:', error.message);
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid token' });
  }
};

// const AuthRole = (role) = async (req, res, next) => {
//     const user = req.user;
//     console.log(user.roles)
  
//     if (!user || user.roles !== role) {
//       return res.status(StatusCodes.FORBIDDEN).json({ message: 'Unauthorized', user });
//     }
  
//     next();
//   } 


const AuthRole = (roles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !roles.includes(user.roles)) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Unauthorized' });
    }
    console.log(user.roles);
    next();
  };
};
  

module.exports = {
  AuthToken,
  AuthRole
};
