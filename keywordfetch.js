// Configuring a express
const express = require("express");
const app = express();


// Database Config
require("dotenv").config();
const mongoose = require("mongoose");

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

// const variables = require("../models/variables");
const {
  Keyword,
  Variable
} = require("./utils/imports");

//importing the custom functions
const {
  addImage,checkImage,addUser,checkUser,getUser,markUser,deleteUser,addKeyword,checkKeyword,getKeyword,markKeyword,markKeywordAsFetchDone ,unMarkAllKeyword ,deleteKeyword,addVariable,checkVariable,updateVariable,getVariable,getAllVariable,deleteVariable,incrementVariable,resetOneVariable,resetAllVariable} = require("./config/helper_functions");
const { response } = require("express");

// addKeyword("food");
setInterval(()=>{
  Keyword.find({used_for_keyword: "false"}).limit(1).then(newKeyword=>{
    console.log(newKeyword[0].name);
    fetch(`https://api.datamuse.com/words?rel_trg=${newKeyword[0].name}`).then(response => response.json()).then(data=>{
      for (let index = 0; index < data.length; index++) {
        addKeyword(data[index].word);
      }
      markKeywordAsFetchDone(newKeyword[0].name);
    })
  }).catch(err=>{
    console.log(err);
  })



},1500);

app.use('/',(req,res)=>{
  res.send("I am hacking unsplash");
})
app.listen(process.env.PORT || 5000, () => {
  console.log(
    `Server is running on port 3000 and address http://localhost:3000`
  );
});


