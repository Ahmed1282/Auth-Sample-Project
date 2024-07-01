const { check, param } = require('express-validator');

const validateUserCreation = [
    check('username').notEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Invalid email'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('roles').notEmpty().withMessage('Role is required').isIn(['SuperAdmin', 'Admin']).withMessage('Invalid role')
  ];
  
  const validateUserUpdate = [
    check('username').optional().notEmpty().withMessage('Username cannot be empty'),
    check('email').optional().isEmail().withMessage('Invalid email'),
    check('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('roles').optional().isIn(['SuperAdmin', 'Admin']).withMessage('Invalid role')
  ];

  const validateProduct = [
    check('name').notEmpty().withMessage('Name is required'),
    check('price').isFloat({ gt: 0 }).withMessage('Price should be greater than 0'),
    check('categoryId').notEmpty().withMessage('Category ID not correct')
    ];

    const validateProductId = [
        param("id").isInt().withMessage("Not found"),
    ]

  module.exports = {
    validateUserCreation,
    validateUserUpdate,
    validateProductId,
    validateProduct
  };