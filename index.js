import express from "express"

const api = express()
const PORT = 3010

api.get("/",(req,res)=>{
    res.send("Hola mundo")
})


api.listen(PORT,()=>{
    console.log("Running on port:"+ PORT)
})