// //importing configurations
const { get } = require("mongoose");
// const variables = require("../models/variables");
const {
  Unsplash,
  toJson,
  Image,
  User,
  Keyword,
  Variable,
  unsplash_image,
} = require("../utils/imports");

//for 50req/hr = 72000 ms,
//for 5000req/hr = 5000 ms => 1 req/5 sec
var fetch_delay = 75000,
  //for 50req/hr = 1000 ms
  //for 5000req/hr = 75ms
  decode_delay = 1000;

//importing the custom functions
const {
  addImage, checkImage, addUser, checkUser, getUser, markUser, deleteUser, addKeyword, checkKeyword, getKeyword, markKeyword, markKeywordAsFetchDone, unMarkAllKeyword, deleteKeyword, addVariable, checkVariable, updateVariable, getVariable, getAllVariable, deleteVariable, incrementVariable, resetOneVariable, resetAllVariable
} = require("./helper_functions");

function startImageFetch(current_keyword, total_count, total_pages, current_page) {
  let fetch_loop = current_page;
  let request_interval_30 = setInterval(function () {
    // console.log(
    //   "-----------------------------current_keyword : ",
    //   current_keyword
    // );
    // console.log("-----------------------------Total : ", total_count);
    // console.log("-----------------------------Total pages : ", total_pages);
    // console.log("-----------------------------current Page : ", current_page);
    if (fetch_loop > total_pages - 1) {
      //update the {is_running} variable to false.
      // console.log("falseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
      updateVariable("is_running", "false");
      //increment the {complete_sessions} by 1.
      incrementVariable("complete_sessions");
      //Mark the current keyword as done.
      markKeyword(current_keyword);
      //Reset {current_keyword} to null.
      updateVariable("current_keyword", "null");
      //Reset {current_total_count} , {current_total_pages} & {current_page} to 0
      resetOneVariable("current_page");
      resetOneVariable("current_total_count");
      resetOneVariable("current_total_pages");
      //Stop the process.
      clearInterval(request_interval_30);
      imageFetch();
    }
    updateVariable("current_page", fetch_loop);
    console.log("fetch_loop: ", fetch_loop);
    unsplash_image.search
      .photos(current_keyword, fetch_loop, 30, { orderBy: "latest" })
      .then(toJson)
      .then((json) => {
        incrementVariable("total_image_requests_30");
        // console.log(json);
        startImageDecode(json, current_keyword);
      });
    fetch_loop++;
  }, fetch_delay);
}

function startImageDecode(json, current_keyword) {
  let decode_loop = 0;
  let decode_total = json.results.length;
  let decode_interval = setInterval(function () {
    if (decode_loop > decode_total - 2) {
      clearInterval(decode_interval);
    }
    console.log("decode_loop: ", decode_loop);
    addImage(
      current_keyword,
      json.results[decode_loop].id,
      json.results[decode_loop].created_at,
      json.results[decode_loop].width,
      json.results[decode_loop].height,
      json.results[decode_loop].color,
      json.results[decode_loop].blur_hash,
      json.results[decode_loop].description == ""
        ? null
        : json.results[decode_loop].description,
      json.results[decode_loop].alt_description == ""
        ? null
        : json.results[decode_loop].alt_description,
      // json.results[decode_loop].tags[0].title,
      json.results[decode_loop].urls.raw,
      json.results[decode_loop].urls.full,
      json.results[decode_loop].urls.regular,
      json.results[decode_loop].urls.small,
      json.results[decode_loop].urls.thumb,
      json.results[decode_loop].links.html,
      json.results[decode_loop].links.download,
      json.results[decode_loop].user.id,
      json.results[decode_loop].user.username,
      json.results[decode_loop].user.name,
      json.results[decode_loop].user.first_name == ""
        ? null
        : json.results[decode_loop].user.first_name,
      json.results[decode_loop].user.last_name == ""
        ? null
        : json.results[decode_loop].user.last_name,
      json.results[decode_loop].user.twitter_username == ""
        ? null
        : json.results[decode_loop].user.twitter_username,
      json.results[decode_loop].user.instagram_username == ""
        ? null
        : json.results[decode_loop].user.instagram_username,
      json.results[decode_loop].user.portfolio_url == ""
        ? null
        : json.results[decode_loop].user.portfolio_url,
      json.results[decode_loop].user.bio == ""
        ? null
        : json.results[decode_loop].user.bio,
      json.results[decode_loop].user.profile_image.small,
      json.results[decode_loop].user.profile_image.medium,
      json.results[decode_loop].user.profile_image.large
    );
    incrementVariable("total_image_decoded");
    addUser(
      json.results[decode_loop].user.id,
      json.results[decode_loop].user.username
    );
    decode_loop++;
  }, decode_delay);
}

function imageFetch() {


  checkStatisticsVariables();
  //=======================Starting============================
  //checking for the value of {is_running}
  checkVariable("is_running").then(is_runningVariable => {
    if (is_runningVariable.length > 0) {
      //==============variable is present===============
      //checking for the value of {is_running} variable
      if (is_runningVariable[0].value == "true") {
        //get already exixting values from database.

        //getting the value of variables from database and calling startImageFetching() function.
        getAllVariable().then(variable => {
          //=================Declaring Variables==================
          let current_keyword;
          let current_total_count;
          let current_total_pages;
          let current_page;
          if (variable.length > 0) {
            //variable present
            // console.log(variable);
            for (let index = 0; index < variable.length; index++) {
              if (variable[index].name == "current_keyword") {
                current_keyword = variable[index].value;
              }
              else if (variable[index].name == "current_total_count") {
                current_total_count = variable[index].value;
              }
              else if (variable[index].name == "current_total_pages") {
                current_total_pages = variable[index].value;
              }
              else if (variable[index].name == "current_page") {
                current_page = variable[index].value;
              }
            }
            console.log(current_keyword);
            console.log(current_total_count);
            console.log(current_total_pages);
            console.log(current_page);
            startImageFetch(current_keyword, current_total_count, current_total_pages, current_page);
          }
          else {
            //Variable Not present 
            //create one
            addVariable("current_keyword", null);
            updateVariable("is_running", "false");
          }
        }).catch(err => {
          console.log(err)
        });
      }
      else {
        //new start code
        //take a new keyword from the database.
        getKeyword().then(newKeyword => {
          //=================Declaring Variables==================
          // console.log(newKeyword);
          let current_keyword = newKeyword.name;
          updateVariable("is_running", true);
          fetchTotalData(current_keyword);
        });
      }
    }
    else {
      //Variable is not present and need to create one
      console.log("Creating a {is_running} variable.");
      addVariable("is_running", false, false);
    }
  }).catch(err => {
    console.log(err);
  })
}



function keywordFetch() {
  setInterval(() => {
    Keyword.find({ used_for_keyword: false }).limit(1).then(newKeyword => {
      console.log(newKeyword[0].name);
      fetch(`https://api.datamuse.com/words?rel_trg=${newKeyword[0].name}`).then(response => response.json()).then(data => {
        for (let index = 0; index < data.length; index++) {
          addKeyword(data[index].word);
        }
        markKeywordAsFetchDone(newKeyword[0].name);
      })
      // markKeywordAsFetchDone(newKeyword[0].name);
    }).catch(err => {
      console.log(err);
    })
  }, 3000);
}
module.exports = {
  imageFetch, keywordFetch
};


function checkStatisticsVariables() {
  //=================Looking for the global data statistics variables====================
  //Looking if {total_image_requests_30} variable is present on in database
  checkVariable("total_image_requests_30")
    .then((total_image_requests_30) => {
      //If present
      if (total_image_requests_30.length > 0 && total_image_requests_30[0].value) {
        // console.log("{total_image_requests_30} variable is found and good to go.");
        console.log("{total_image_requests_30} :", total_image_requests_30[0].value);
      }
      //If not present
      else {
        // console.log("{total_image_requests_30} variable is not found. So creating one.");
        addVariable("total_image_requests_30", 0, true);
      }
    })
    .catch((err) => {
      console.log(err);
    });

  //Looking if {total_image_decoded} variable is present on in database
  checkVariable("total_image_decoded")
    .then((total_image_decoded) => {
      //If present
      if (total_image_decoded.length > 0 && total_image_decoded[0].value) {
        // console.log("{total_image_decoded} variable is found and good to go.");
        console.log("{total_image_decoded} :", total_image_decoded[0].value);
      }
      //If not present
      else {
        // console.log("{total_image_decoded} variable is not found. So creating one.");
        addVariable("total_image_decoded", 0, true);
      }
    })
    .catch((err) => {
      console.log(err);
    });

  //Looking if {total_image_write} variable is present on in database
  checkVariable("total_image_write")
    .then((total_image_write) => {
      //If present
      if (total_image_write.length > 0 && total_image_write[0].value) {
        // console.log("{total_image_write} variable is found and good to go.");
        console.log("{total_image_write} :", total_image_write[0].value);
      }
      //If not present
      else {
        // console.log("{total_image_write} variable is not found. So creating one.");
        addVariable("total_image_write", 0, true);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  //Looking if {total_image_updated} variable is present on in database
  checkVariable("total_image_updated")
    .then((total_image_updated) => {
      //If present
      if (total_image_updated.length > 0 && total_image_updated[0].value) {
        // console.log("{total_image_updated} variable is found and good to go.");
        console.log("{total_image_updated} :", total_image_updated[0].value);
      }
      //If not present
      else {
        // console.log("{total_image_updated} variable is not found. So creating one.");
        addVariable("total_image_updated", 0, true);
      }
    })
    .catch((err) => {
      console.log(err);
    });

}

async function fetchTotalData(keyword) {
  // console.log(keyword);
  unsplash_image.search.photos(keyword, 1, 30, { orderBy: "latest" }).then(toJson).then(response => {
    let total_pages;

    if (response.total_pages == 0) {
      //update the {is_running} variable to false.
      // console.log("falseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
      updateVariable("is_running", "false");
      //increment the {complete_sessions} by 1.
      incrementVariable("complete_sessions");
      //Mark the current keyword as done.
      markKeyword(keyword);
      //Reset {current_keyword} to null.
      updateVariable("current_keyword", "null");
      //Reset {current_total_count} , {current_total_pages} & {current_page} to 0
      resetOneVariable("current_page");
      resetOneVariable("current_total_count");
      resetOneVariable("current_total_pages");
      //Stop the process.
      console.log(keyword , " has been skipped");
      imageFetch();
    }
    else if (response.total_pages <= 5) {
      total_pages = response.total_pages;
      updateVariable("current_keyword", keyword);
      updateVariable("current_total_count", response.total);
      updateVariable("current_total_pages", total_pages);
      updateVariable("current_page", 1);
      console.log(response.total, response.total_pages);
      startImageFetch(keyword, response.total, total_pages, 1);
    }
    else {
      total_pages = 5;
      updateVariable("current_keyword", keyword);
      updateVariable("current_total_count", response.total);
      updateVariable("current_total_pages", total_pages);
      updateVariable("current_page", 1);
      console.log(response.total, response.total_pages);
      startImageFetch(keyword, response.total, total_pages, 1);
    }

  })
}