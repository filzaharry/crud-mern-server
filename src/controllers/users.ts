import express from 'express'

import { deleteUserById, getUserById, getUsers } from '../db/users'

export const getAllUsers = async (req:any, res:any) => {
    try {
        const users = await getUsers()
        return res.status(200).json(users)
    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
        
    }
}

export const deleteUser = async (req:any, res:any) => {
    try {
        const {id} = req.params;
        const deleteUser = await deleteUserById(id)
        return res.json(deleteUser)
    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
        
    }
}

export const sendEmailToUser = async (req:any, res:any) => {
    try {
        const {email} = req.params;
        // const deleteUser = await deleteUserById(id)
        return res.json(201)
    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
        
    }
}

export const updateUser = async (req:any, res:any) => {
    try {
        const { id } = req.params
        const { username } = req.body
        const { email } = req.body

        if(!username || !email) {
            return res.sendStatus(400)
        }

        const user :any= await getUserById(id)

        
        

        user.username = username;
        user.email = email;

        await user?.save();

        return res.status(200).json(user).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
        
    }
}