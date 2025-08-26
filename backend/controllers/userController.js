const userService = require("../services/userService.js");

const getAll = async (req, res, next) => {
  try {
    const { search, role, status, page, limit } = req.query;
    const filters = { search, role, status, page, limit };
    const users = await userService.listUsers(filters);
    res.json(users);
  } catch (e) {
    next(e);
  }
};

const getOne = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (e) {
    next(e);
  }
};

const create = async (req, res, next) => {
  try {
    const created = await userService.createUser(req.body);
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const updated = await userService.updateUser(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json(updated);
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const deleted = await userService.deleteUser(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updated = await userService.updateProfile(req.user._id, req.body);
    res.json(updated);
  } catch (e) {
    next(e);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(
      req.user._id,
      currentPassword,
      newPassword
    );
    res.json({ message: "Password updated successfully" });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
  updateProfile,
  changePassword,
};
