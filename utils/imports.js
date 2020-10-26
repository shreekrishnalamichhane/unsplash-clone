// Unsplash Config Part
const fetch = require("node-fetch");
global.fetch = fetch;

// Unsplash Config Part
const Unsplash = require("unsplash-js").default;
const toJson = require("unsplash-js").toJson;

const path = require('path');
//Importing the databse models
const parent = path.dirname(require.main.filename);
let Image = require(parent+"/models/Image");
const User = require(parent+"/models/User");
const Keyword = require(parent+"/models/Keyword");
const Variable = require(parent+"/models/Variables");
// let Image = require(__dirname + "");
// const User = require("../models/user");
// const Keyword = require("../models/keyword");
// console.log("hello",__dirname);
// const Variable = require("../models/variables");

//importing configurations
const { unsplash_image } = require(parent +"/config/configuration");

module.exports = {fetch , Unsplash , toJson , Image , User , Keyword , Variable , unsplash_image}