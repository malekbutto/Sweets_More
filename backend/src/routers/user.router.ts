import { Router } from "express";
import { sample_users } from "../data";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";

const router = Router();

router.get("/users/seed", asyncHandler(async (req, res) => {
  const usersCount = await UserModel.countDocuments();
  if (usersCount > 0){
    res.send("Seed is already done!");
    return;
  }
  await UserModel.create(sample_users);
  res.send("Seed Is Done")
})
);


router.post("/login", asyncHandler (
  async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({email, password});
  
    if (user) {
      res.send(generateTokenResponse(user));
    }
    else {
      const BAD_REQUEST = 400;
      res.status(BAD_REQUEST).send("Email or Password are not valid!");
    }
  }
))

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
