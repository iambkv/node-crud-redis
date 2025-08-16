const mongoose = require("mongoose");
const express = require("express");

const app = express();

app.use(express.json());

//Routes
const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes);

mongoose
  .connect("mongodb://localhost:27017/NodeRedisDB")
  .then(console.log("Mongodb connected successfuly"))
  .catch(console.error());

app.listen(4002, () => {
  console.log("App is running on PORT 4002");
});
