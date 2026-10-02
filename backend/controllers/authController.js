const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const formatUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (await User.findOne({ email })) {
    return res.status(409).json({ message: "Email is already registered" });
  }
  const user = await User.create({ name, email, password, role });
  res.status(201).json({ token: signToken(user._id), user: formatUser(user) });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  res.json({ token: signToken(user._id), user: formatUser(user) });
};

exports.me = async (req, res) => {
  res.json({ user: formatUser(req.user) });
};