import express from "express"
import login from "./controllers/login.controller"
import register from "./controllers/register.controller"
import user from "./controllers/user.controller"
const routes = express.Router()

routes.use("/auth/",login)
routes.use("/auth/",register)
routes.use("/users/",user)

export default routes