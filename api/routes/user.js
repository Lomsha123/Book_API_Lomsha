const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserController = require("../controllers/users")

const User = require("../models/user");
const checkAuth = require("../middleWare/check-auth");

router.post("/signup", UserController.user_signup);

router.post("/login", UserController.user_login);

router.delete("/:userId", checkAuth, UserController.user_delete_user);

module.exports = router;