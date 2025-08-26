const { User } = require("../models/User.js");
const { generateToken } = require("../config/jwt.js");

const register = async (userData) => {
  const { username, email, password } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error("Email already registered");
    }
    if (existingUser.username === username) {
      throw new Error("Username already registered");
    }
  }

  // Create new user with name from username
  const user = await User.create({
    username,
    email,
    password,
    name: username, // Use username as name for now
  });

  // Generate token
  const token = generateToken({ userId: user._id, email: user.email });

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
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
  const token = generateToken({ userId: user._id, email: user.email });

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

module.exports = { register, login };
