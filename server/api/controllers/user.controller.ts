import express from "express"
const user = express.Router()
import UserModel from '../models/user.model'
user.get("/:id",async (req,res)=>{
    let user = await UserModel.getUserById(req.params.id)
    if(user === null) {
        return res.status(404).json({})
    }
    let data = {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt
    }
    res.json(data)
})


export default user