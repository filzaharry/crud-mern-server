import express from 'express'

import { deleteUser, getAllUsers, sendEmailToUser, updateUser } from '../controllers/users'
import { isAuthenticated } from '../middlewares'

export default(router:express.Router) => {
    router.get('/users', isAuthenticated, getAllUsers)
    router.delete('/user/:id', isAuthenticated, deleteUser)
    router.patch('/user/:id', isAuthenticated, updateUser)
    router.get('/user/:email', sendEmailToUser)
}