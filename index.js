const express = require("express");
require("dotenv").config();

//Create express server
const app = express();

//Public directory
app.use(express.static("public"));

//Listen request
app.listen(process.env.PORT, () => {
  console.log(`Server running in port ${process.env.PORT}`);
});
