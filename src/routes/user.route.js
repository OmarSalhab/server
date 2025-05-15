const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const {} = require('../controllers/user.controller');

//User/Guest Role Queries
router.post('/',createUser);
router.post('/login',createUser);
router.get('/profile/:id',getUserById);
router.put('/:id',updateUser);

//Admin Role Queries
router.get('/',getAllUsers);
router.delete('/:id',deleteUser);


module.exports = router;