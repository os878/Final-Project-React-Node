require("dotenv").config()
const express = require("express")
const cors = require("cors")

const corsOptions = require("./config/corsOptions.js")
const PORT = process.env.PORT || 7001
const app = express()
const mongoose = require('mongoose')
const connectDB = require("./config/dbConn")
connectDB()
//middlewares
app.use(cors(corsOptions))
app.use(express.json({ limit: "20mb" }))
app.use(express.static("public"))
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port
${PORT}`))
})
mongoose.connection.on('error', err => {
    console.log(err)
})
app.use("/api/supplier", require("./routes/supplierRoutes"))
app.use("/api/gift", require("./routes/giftRoutes"))
app.use("/api/category", require("./routes/categoryRoutes"))
app.use("/api/customer", require("./routes/customerRoutes"))
app.use("/api/auth", require("./routes/authRoutes"))
app.use(express.static("public"))