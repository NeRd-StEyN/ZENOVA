// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/users'); // Adjust path as needed

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // Fetch token from cookies
    if (!token) {
      return res.redirect('/'); // Redirect if token is missing
    }

    const decoded = jwt.verify(token, process.env.secret_key); // Replace 'yourSecretKey' with your actual secret key
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      return res.redirect('/'); // Redirect if user is not found
    }

    req.token = token;
    req.user = user;
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error('Auth error:', error.message);
    res.redirect('/'); // Redirect on error
  }
};

module.exports = auth;

