const { dbConnection } = require("./database/config");
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const openApiDocument = require("./docs/openapi.json");
const { handleJsonError } = require("./middlewares/handle-json-error");
require("dotenv").config();

//Create express server
const app = express();

// CORS
app.use(cors());

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
app.use("/api/events", require("./routes/events"));

// Docs
app.get("/api/docs.json", (req, res) => res.json(openApiDocument));
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument, { customSiteTitle: "Calendar API docs" })
);

// Errors
app.use(handleJsonError);

//Listen request
app.listen(process.env.PORT, () => {
  console.log(`Server running in port ${process.env.PORT}`);
});
