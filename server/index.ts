import express from "express";
const app = express()
const PORT = 3000
import routes from "./api/routes"

app.use(express.json()) 
app.use("/api/",routes)


app.listen(PORT,() =>{
  console.log(`Listening on port ${PORT}`)
}) 