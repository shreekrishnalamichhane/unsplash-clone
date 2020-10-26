// Configuring a express
const express = require("express");
const app = express();

// Database Config
require("dotenv").config();
const mongoose = require("mongoose");

//importing the custom functions
const { imageFetch } = require("./config/running_functions");

//importing configurations
const { unsplash_image, PORT } = require("./config/configuration");

//Connecting to databse
mongoose
  .connect(process.env.MONGOBD_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    console.log("MongoDB Connected Successfully.");
  })
  .catch((err) => {
    console.log("Database connection failed.");
  });




// imageFetch();



const imageRoutes = require("./routes/imageRoutes");
const { Variable, Keyword } = require("./utils/imports");
const { addVariable, deleteVariable, updateVariable, getVariable, checkImage, addKeyword, checkKeyword, getKeyword, markKeyword, addUser, checkUser, getUser, deleteUser, markUser, deleteKeyword, incrementVariable, resetAllVariable, resetOneVariable, unMarkAllKeyword } = require("./config/helper_functions");
const e = require("express");
app.use(imageRoutes);





/* Start The Server */

app.listen(process.env.PORT || 5000, () => {
  console.log(
    `Server is running on port ${process.env.PORT || 5000} and address http://localhost:${process.env.PORT || 5000}`
  );
});
