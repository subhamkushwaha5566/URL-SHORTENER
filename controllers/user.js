const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const { setUser } = require("../service/auth");

async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await User.create({
      name,
      email,
      password,
    });
    return res.status(201).json({ success: true, message: "User created" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({
        error: "Invalid Username or Password",
      });
    }

    const sessionId = uuidv4();
    setUser(sessionId, user);
    res.cookie("uid", sessionId, { 
      httpOnly: true, 
      path: "/",
      sameSite: "none",
      secure: true 
    });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error during login" });
  }
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
};
