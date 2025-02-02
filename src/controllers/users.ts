import express from "express";
import nodemailer from "nodemailer";

import { deleteUserById, getUserById, getUsers } from "../db/users";

export const getAllUsers = async (req: any, res: any) => {
    try {
        const users = await getUsers();
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const deleteUser = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const deleteUser = await deleteUserById(id);
        return res.json(deleteUser);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const sendEmailToUser = async (req: any, res: any) => {
    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || "587"),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    try {
        const { email } = req.params;
        console.log(process.env.EMAIL_USER);

        
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,                    // Receiver email (Gmail)
          subject: "Hello from Mailtrap!",            // Subject line
          text: "Hi, Salam Kenal", // Plain text body
          html: "<b>Hi, Salam Kenal</b>", // HTML body
        };
        const info = await transporter.sendMail(mailOptions);
        //
        return res.json(201);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const updateUser = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { username } = req.body;
        const { email } = req.body;

        if (!username || !email) {
            return res.sendStatus(400);
        }

        const user: any = await getUserById(id);

        user.username = username;
        user.email = email;

        await user?.save();

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
