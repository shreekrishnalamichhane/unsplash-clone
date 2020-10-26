// // Unsplash Config Part
const fetch = require("node-fetch");
global.fetch = fetch;
const Unsplash = require("unsplash-js").default;
const toJson = require("unsplash-js").toJson;

module.exports = {
    PORT: process.env.PORT || 3000,
    unsplash_image : new Unsplash({
        accessKey: process.env.UNSPLASH_API_ACCESS_1,
        secret: process.env.UNSPLASH_API_SECRET_1,
    }),
    unsplash_user : new Unsplash({
        accessKey: process.env.UNSPLASH_API_ACCESS_2,
        secret: process.env.UNSPLASH_API_SECRET_2,
    })
};