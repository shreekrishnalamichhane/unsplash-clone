// // Unsplash Config Part
// const Unsplash = require("unsplash-js").default;
// const toJson = require("unsplash-js").toJson;

// //Importing the databse models
// let Image1 = require("../models/Image");
// const User1 = require("../models/user").User;
// const Keyword1 = require("../models/keyword").Keyword;

// //importing configurations
// const { unsplash_image } = require("./configuration");
const {
  Unsplash,
  toJson,
  Image,
  User,
  Keyword,
  Variable,
  unsplash_image,
} = require("../utils/imports");

//return the orientation of the image according to w(width) and h(height) provided.
function getOrientation(w, h) {
  if (w == h) {
    return "square";
  } else if ((0.98 * w < h && h < 1.02 * w) || (0.98 * h < w && w < 1.02 * h)) {
    return "squarish";
  } else if (h < w) {
    return "landscape";
  } else {
    return "portrait";
  }
}

//extract the raw user profile image url from the full_profile_image url.
function userProfileRawConvert(url) {
  return url.split("?")[0];
}

//---------Image functions---------//

//add or update image
function addImage(
  current_keyword,
  id,
  created_at_host,
  width,
  height,
  color,
  blur_hash,
  description,
  alt_description,
  // tags,
  urls_raw,
  urls_full,
  urls_regular,
  urls_small,
  urls_thumb,
  links_html,
  links_download,
  user_id,
  user_username,
  user_name,
  user_first_name,
  user_last_name,
  user_twitter_username,
  user_instagram_username,
  user_portfolio_url,
  user_bio,
  user_profile_image_small,
  user_profile_image_medium,
  user_profile_image_large
) {
  //look for the existing image
  Image.find({ id })
    .limit(1)
    .then((image) => {
      //If Image already exists then update..
      if (image.length > 0) {

        //this variable looks if current_keyword is present in the tags list already??
        var isFound = false;
        //checking for current_keyword in the tags list.
        for (let index = 0; index < image[0].tags.length; index++) {
          if (current_keyword == image[0].tags[index]) {
            isFound = true;
          }
        }
        //If found only update the {update_count} and {updated_at}
        if (isFound) {
          Image.updateOne(
            { id },
            {
              $set: {
                update_count: image[0].update_count + 1,
                updated_at: Date.now(),
              },
            }
          ).then((update) => {
            // console.log(update);
            incrementVariable("total_image_updated");
            console.log("A image with id {", id, "} has been updated.")
            // this.incrementVariable('total_image_updated');
            // console.log(
            //   current_keyword,
            //   "Keyword is already present in the tags list. So skipped."
            // );
          });
        }
        //If not add the keyword in tags list and also update {update_count} and {updated_at}
        else {
          Image.updateOne(
            { id },
            {
              $set: {
                update_count: image[0].update_count + 1,
                updated_at: Date.now(),
              },
              $addToSet: {
                tags: current_keyword,
              },
            }
          ).then((update) => {
            // console.log(update);
            incrementVariable("total_image_updated");
            console.log("A image with id {", id, "} has been updated along with keyword {", current_keyword, "}.");
            // this.incrementVariable('total_image_updated');
            console.log(
              current_keyword,
              "Keyword is added in the tags list."
            );
          });
        }
        console.log("Image already exixts so updated");
      }
      //If Image do not exixts then add it.
      else {
        const newImage = new Image({
          id,
          created_at_host,
          width,
          height,
          orientation: getOrientation(width, height),
          color,
          blur_hash,
          description,
          alt_description,
          tags: [current_keyword
            // ,tags
          ],
          urls_raw,
          urls_full,
          urls_regular,
          urls_small,
          urls_thumb,
          links_html,
          links_download,
          user_id,
          user_username,
          user_name,
          user_first_name,
          user_last_name,
          user_twitter_username,
          user_instagram_username,
          user_portfolio_url,
          user_bio,
          user_profile_image_small,
          user_profile_image_medium,
          user_profile_image_large,
          user_profile_image_raw: userProfileRawConvert(
            user_profile_image_large
          ),
          update_count: 0,
          created_at: Date.now(),
          updated_at: Date.now(),
        });
        newImage.save().then((image) => {
          incrementVariable("total_image_write");
          console.log("A new image with id {", id, "} has been added to the database.");
          // this.incrementVariable('total_image_write');
          return image;
        });
      }
    });
}

//check if image already exixts
async function checkImage(id) {
  return await Image.find({ id }).limit(1);
}

//---------user dunctions---------//

//add or update user 
async function addUser(host_id, name) {
  const user = User.find({ host_id })
    .limit(1)
    .then((user) => {
      if (user.length > 0) {
        //Update
        console.log("User already exixts");
        User.updateOne(
          { host_id },
          {
            $set: {
              repeat: user[0].repeat + 1,
              updated_at: Date.now(),
            },
          }
        )
          .then((update) => {
            // console.log(update);
            console.log("A user {", name, "} with id {", host_id, "} has been updated.")
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        //Create
        const newUser = new User({
          host_id,
          name,
          repeat: 0,
          used: false,
          created_at: Date.now(),
          updated_at: Date.now(),
        });
        newUser
          .save()
          .then((user) => {
            // console.log(user);
            console.log("New user {", name, "} with id {", host_id, "} has been added to database.")
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
}

//check if user already exists
async function checkUser(host_id) {
  return await User.findOne({ host_id }).limit(1);
}

//get a user whose {used == false}
async function getUser() {
  return await User.findOne({ used: false }).limit(1);
}
//mark a user as used or simply {used = true}
function markUser(host_id) {
  User.updateOne(
    { host_id },
    {
      $set: {
        used: true,
      },
    }
  )
    .then((mark) => {
      // console.log(mark);
      console.log("A user with id {", host_id, "} has been marked as done.")
    })
    .catch((err) => {
      console.log(err);
    });
}

//delete a user from database
function deleteUser(host_id) {
  User.deleteOne({ host_id })
    .then((user) => {
      // console.log(user);
      console.log("A user with id {", host_id, "} has been deleted from the database.");
    })
    .catch((err) => {
      console.log(err);
    });
}




//---------keyword functions---------//

//add or update user
function addKeyword(name) {
  name = name.toLowerCase();
  // console.log(name);
  Keyword.find({ name: name.toLowerCase() }).then((keyword) => {
    if (keyword.length > 0) {
      let previousRepeat = keyword[0].repeat;
      let newRepeat = previousRepeat + 1;
      Keyword.updateOne(
        { name: name.toLowerCase() },
        {
          $set: {
            repeat: newRepeat,
            updated_at: Date.now(),
          },
        }
      )
        .then((update) => {
          // console.log(update);
          console.log("A keyword { ", name, "} has been updated..");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const newKeyword = new Keyword({
        name,
        repeat: 0,
        used: false,
        used_for_keyword : false,
        created_at: Date.now(),
        updated_at: Date.now(),
      });
      newKeyword
        .save()
        .then((keyword) => {
          // console.log(keyword);
          console.log("A new keyword { ", name, "} has been added to the database..");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
  // Keyword.find({name: "Hello"}).then(keyword=>{
  //     console.log(keyword);
  // })
}

//check if keyword already exixts
async function checkKeyword(keyword) {
  let name = keyword.toLowerCase();
  return await Keyword.find({ name }).limit(1);
}

//get a keyword whose {used == false}
async function getKeyword() {
  return await Keyword.findOne({ used: "FALSE" }).limit(1);

}

//mark a user as used or simply {used = true}
function markKeyword(keyword) {
  let name = keyword.toLowerCase();
  Keyword.updateOne(
    { name },
    {
      $set: {
        used: true,
        updated_at: Date.now()
      },
    }
  )
    .then((mark) => {
      // console.log(mark);
      console.log("A keyword {", keyword, "} has been marked as done.");
    })
    .catch((err) => {
      console.log(err);
    });
}

//mark keyword as {used_for_keyword = true}

function markKeywordAsFetchDone(keyword){
  let name = keyword.toLowerCase();
  Keyword.updateOne({name},{
    $set:{
      used_for_keyword: "true",
      updated_at: Date.now()
    }
  }).then(mark=>{
    // console.log(mark);
  })
  .catch(err=>{
    console.log(err);
  })
}

//unmark all keyword as {used = false}
function unMarkAllKeyword(){
  Keyword.updateMany({used: "true"},{
  $set:{
    used: "false"
  }
}).then(update=>{
  console.log(update);
})
}
//delete a keyword from database
function deleteKeyword(name) {
  Keyword.deleteOne({ name: name.toLowerCase() })
    .then(keyword => {
      // console.log(keyword);
      console.log("A keyword {", name, "} has been deleted.");
    })
}




//---------Variable functions---------//

//Add Variable with value
function addVariable(name, value, isinteger) {
  const newVariable = new Variable({
    name,
    value,
    isinteger,
    created_at: Date.now(),
    updated_at: Date.now(),
  });
  newVariable
    .save()
    .then((variable) => {
      // console.log(variable);
      console.log("A new variable {", name, "} with value {", value, "} has been added to the database.")
    })
    .catch((err) => {
      console.log(err);
    });
}
//check variable 
async function checkVariable(name) {
  return await Variable.find({ name }).limit(1);
}
//Update Variable value
function updateVariable(name, newValue) {
  Variable.updateOne(
    { name },
    {
      $set: {
        value: newValue,
        updated_at: Date.now(),
      },
    }
  )
    .then((update) => {
      // console.log(update);
      console.log("A variable {", name, "} has been updated to {", newValue, "}.");
    })
    .catch((err) => {
      console.log(err);
    });
}

//Get Variable corresponding to the name provided
async function getVariable(name) {
  return await Variable.find({ name }).limit(1);
}
//Get all variables
async function getAllVariable() {
  return await Variable.find();
}

//Delete a variable from database
function deleteVariable(name) {
  Variable.deleteOne({ name })
    .then((variable) => {
      // console.log(variable);
      console.log("A variable {", name, "} has been deleted from database.")
    })
    .catch((err) => {
      console.log(err);
    });
}

//increment variable by 1
function incrementVariable(variablename) {
  const name = variablename.toLowerCase();

  Variable.find({ name }).limit(1).then(variable => {
    // console.log(variable);
    newValue = parseInt(variable[0].value) + 1;
    Variable.updateOne({ name }, {
      $set: {
        value: (parseInt(variable[0].value) + 1)
      }
    }).then(increment => {
      // console.log(increment);
      console.log("A variable {", variable[0].name, "} has been incremented to {", newValue, "}.")
    }).catch(err => {
      console.log(err);
    })
  })
}

//Reset Variable by name
function resetOneVariable(name) {
  Variable.updateOne({ name }, {
    $set: {
      value: 0
    }
  }).then(reset => {
    // console.log(reset);
    console.log("A variable {", name, "} has been reset to 0");
  }).catch(err => {
    console.log(err);
  })
}

//Reset all variable
function resetAllVariable() {
  Variable.updateMany({ isinteger: true }, {
    $set: {
      value: 0
    }
  }).then(resetall => {
    // console.log(resetall);
    console.log("All integer variables has been reset to 0");
  }).catch(err => {
    console.log(err);
  })
}
module.exports = {
  addImage,checkImage,addUser,checkUser,getUser,markUser,deleteUser,addKeyword,checkKeyword,getKeyword,markKeyword,markKeywordAsFetchDone ,unMarkAllKeyword ,deleteKeyword,addVariable,checkVariable,updateVariable,getVariable,getAllVariable,deleteVariable,incrementVariable,resetOneVariable,resetAllVariable
};

