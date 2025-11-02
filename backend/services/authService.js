const { User } = require("../models/User.js");
const { generateToken } = require("../config/jwt.js");

const register = async (userData) => {
  const { username, password } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error("Username already registered");
  }

  // Create new user with name from username
  const user = await User.create({
    username,
    password,
    name: username, // Use username as name for now
  });

  // Generate token
  const token = generateToken({ userId: user._id });

  return {
    user: {
      id: user._id,
      username: user.username,
      role: user.role,
    },
    token,
  };
};

const login = async (credentials) => {
  const { username, password } = credentials;

  // Find user by username
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  // Generate token
  const token = generateToken({ userId: user._id });

  return {
    user: {
      id: user._id,
      username: user.username,
      role: user.role,
    },
    token,
  };
};

module.exports = { register, login };
