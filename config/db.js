const mongoose = require("mongoose");

const url = process.env.MONGO_URI;

const connectDB = () => {
  mongoose
    .connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => console.log("Connected to the database"))
    .catch((err) => console.log("Something failed"));
};

module.exports = connectDB;
