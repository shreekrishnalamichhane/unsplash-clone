const deepai = require('deepai');
deepai.setApiKey('074c7786-350f-41fe-98db-6290dc1a7206');
const { Unsplash, toJson, Image, User, Keyword, unsplash_image, Variable } = require("../utils/imports");

module.exports = {

    index: async (req, res) => {
        // async function toonify() {
        //     var result = await deepai.callStandardApi("content-moderation", {
        //       image: ""
        //       }).then(data=>{
        //         console.log(data);
        //         res.json(data);
        //       }).catch(err=>{
        //         console.log(err);
        //       });
        //     // console.log(result);
        //   };
          
          // toonify();
        // Image.findOne({color:"#FDD14F"}).then(
        //     image =>{
        //         res.json(image);
        //     }
        // )
        // Image.find({id : "roYLDeEMJBo"}).then(
        //     image =>{
        //         res.json(image);
        //     }
        // )

        // unsplash_image.search
        //     .photos("computer", 1, 30 , {orderBy: "latest"}).then(toJson).then(json=>{
        //       res.json(json);
        //     })
        Keyword.find({name : "dynamically"}).limit(10).then(json=>{
          res.json(json);
        
        })}
};
