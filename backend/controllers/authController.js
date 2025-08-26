const authService = require("../services/authService.js");

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email and password are required" });
    }

    const result = await authService.register({ username, email, password });

    // Set HTTP-only cookie
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    // Remove token from response body for security
    const { token, ...responseData } = result;
    res.status(201).json(responseData);
  } catch (error) {
    if (
      error.message === "Username already registered" ||
      error.message === "Email already registered"
    ) {
      return res.status(409).json({ message: error.message });
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const result = await authService.login({ username, password });

    // Set HTTP-only cookie
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    // Remove token from response body for security
    const { token, ...responseData } = result;
    res.json(responseData);
  } catch (error) {
    if (error.message === "Invalid credentials") {
      return res.status(401).json({ message: error.message });
    }
    next(error);
  }
};

const logout = async (req, res) => {
  // Clear the token cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  res.json({ message: "Logged out successfully" });
};

const verify = async (req, res) => {
  try {
    // User is already authenticated by middleware
    res.json({
      success: true,
      message: "Token is valid",
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    res.status(401).json({ message: "Token verification failed" });
  }
};

const getProfile = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

module.exports = { register, login, logout, verify, getProfile };
