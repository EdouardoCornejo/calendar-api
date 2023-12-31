const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_API, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
    });

    console.warn("DB Online");
  } catch (error) {
    console.error("DBConection ~ error:", error);
  }
};

module.exports = {
  dbConnection,
};
