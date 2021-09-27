import express from "express"
const register = express.Router()
import UserModel from '../models/user.model'

register.post("/register",async (req,res)=>{
    const {email,password,verifyPassword, username} = req.body
    if(password !== verifyPassword){
       return res.status(400).send("Passwords do not match")
    }
    console.log(email)
    if(await UserModel.existsMail(email)){
        return res.status(400).send("Email already exists")
    }
    let user = await UserModel.addUser({email,password,username})
    res.json(user)
    console.log(user)
})


export default register