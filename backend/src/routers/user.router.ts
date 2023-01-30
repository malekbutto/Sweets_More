import { Router } from "express";
import { sample_users } from "../data";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { User, UserModel } from "../models/user.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import bcrypt from 'bcryptjs';

const router = Router();

router.get(
  "/users/seed",
  asyncHandler(async (req, res) => {
    const usersCount = await UserModel.countDocuments();
    if (usersCount > 0) {
      res.send("Seed is already done!");
      return;
    }
    await UserModel.create(sample_users);
    res.send("Seed Is Done");
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email, password });

    if (user) {
      res.send(generateTokenResponse(user));
    } else {
      res.status(HTTP_BAD_REQUEST).send("Email or Password is not valid!");
    }
  })
);

router.post("/register", asyncHandler(async (req, res) => {
    // const { name, email, userName, password, phone, address } = req.body;
    const { name, email, password, address } = req.body;
    const user = await UserModel.findOne({email});
    // const userWithUserName = await UserModel.findOne({username});
    if (user) {
      res.status(HTTP_BAD_REQUEST).send("User is already exist, please login!");
      return;
    }
    // if (userWithUserName){
    //   res.status(HTTP_BAD_REQUEST).send("Username is already exist, please login!");
    //   }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser:User = {
      id:'',
      name,
      email: email.toLowerCase(),
      // userName,
      password: encryptedPassword,
      // phone,
      address,
      isAdmin: false
    }

    const dbUser = await UserModel.create(newUser);
    res.send(generateTokenResponse(dbUser));

  })
);

const generateTokenResponse = (user: any) => {
  const token = jwt.sign(
    {
      email: user.email,
      isAdmin: user.isAdmin,
    },
    "someRandomText",
    {
      expiresIn: "30d",
    }
  );
  user.token = token;
  return user;
};

export default router;
