import express from "express"
import cors from "cors"

import "./src/config/db.config.js"

const api = express()
const PORT = 5000

import usersRoute from "./src/routes/users.route.js"
import clinicsRoute from "./src/routes/clinics.route.js"
import patientsRoute from "./src/routes/patients.route.js"
import diagnosisRoute from "./src/routes/diagnosis.route.js"
import medicationsRoute from "./src/routes/medications.route.js"

api.use(cors())
api.use(express.json())

api.use("/users", usersRoute)
api.use("/clinics", clinicsRoute)
api.use("/patients", patientsRoute)
api.use("/diagnosis", diagnosisRoute)
api.use("/medications", medicationsRoute)

api.get("/", (req, res) => {
  res.send("Hola mundo")
})


api.listen(PORT, () => {
  console.log("Running on port:" + PORT)
})