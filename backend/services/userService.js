const { User } = require("../models/User.js");

const listUsers = async (filters = {}, pagination = {}) => {
  const { search, role, status, page = 1, limit = 10 } = filters;

  // Build query
  const query = {};

  if (search) {
    query.$or = [
      { username: { $regex: search, $options: "i" } },
      { name: { $regex: search, $options: "i" } },
    ];
  }

  if (role) {
    query.role = role;
  }

  if (status) {
    query.status = status;
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Execute query
  const [users, total] = await Promise.all([
    User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    User.countDocuments(query),
  ]);

  return {
    users,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
  };
};

const getUserById = async (id) => User.findById(id).select("-password").lean();

const createUser = async (data) => {
  const user = await User.create(data);
  return user.toObject();
};

const updateUser = async (id, data) => {
  const user = await User.findByIdAndUpdate(id, data, { new: true })
    .select("-password")
    .lean();
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id).select("-password").lean();
  return user;
};

const updateProfile = async (userId, data) => {
  const user = await User.findByIdAndUpdate(userId, data, { new: true })
    .select("-password")
    .lean();
  return user;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  return { message: "Password updated successfully" };
};

module.exports = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  changePassword,
};
