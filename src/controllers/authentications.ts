import express, { Request, Response } from "express";

import { createUser, getUserByEmail, getUserBySessionToken } from "../db/users";
import { authentication, random } from "../helpers";
import { createLoginDuration } from "../db/loginDuration";

export const logout = async (req: any, res: any) => {
  try {
    const sessionToken = req.cookies["SABER_AUTH"];
    // Clear the cookie
    if (!sessionToken) {
      return res.sendStatus(403);
    }
    const existingUser = await getUserBySessionToken(sessionToken);

    await createLoginDuration({
      status: "logout",
      userId: existingUser?._id,
    });
    
    res.clearCookie("SABER_AUTH"); // Use res.clearCookie to remove the cookie
    // Send a response indicating success
    return res.status(200).send({ message: "Logged out successfully." });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400); // Send a 400 status code on error
  }
};

export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.sendStatus(400);
    }
    const user = await getUserByEmail(email).select("+authentication.salt +authentication.password");

    if (!user) {
      return res.sendStatus(400);
    }

    const exprectedHash = authentication(user.authentication?.salt ?? "", password);
    if (user.authentication?.password !== exprectedHash) {
      return res.sendStatus(403);
    }

    const salt = random();
    user.authentication.sessionToken = authentication(salt, user._id.toString());

    await user.save();

    res.cookie("SABER_AUTH", user.authentication?.sessionToken, { domain: "localhost", path: "/" });

    await createLoginDuration({
      status: "login",
      userId: user._id,
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const register = async (req: any, res: any) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.sendStatus(400);
    }
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.sendStatus(400);
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
