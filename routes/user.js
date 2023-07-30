import express from "express";
// import {User} from "../models/user.js";

import { register, login } from "../controllers/user.js";
// import { specialFunc } from "../controllers/user.js";
import { getMyProfile } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { logout } from "../controllers/user.js";

const router = express.Router();

router.post("/new", register);
router.post("/login", login)
router.get("/logout", logout)
// router.get("/userid/special", specialFunc)

router.get("/me", isAuthenticated,getMyProfile);

// router.get("/userid/:id", getUserDetails)

// router.put("/userid/:id", updateUser)

// router.delete("/userid/:id", deleteUser)

export default router;