const express = require("express");
require("dotenv").config();
const { dbConnection } = require("./database/config");

//Create express server
const app = express();

//Public directory
app.use(express.static("public"));

//DB Connection
dbConnection();

//Body parse
app.use(express.json());

// Routes
// Auth
app.use("/api/auth", require("./routes/auth"));

// CRUD,

//Listen request
app.listen(process.env.PORT, () => {
  console.log(`Server running in port ${process.env.PORT}`);
});
