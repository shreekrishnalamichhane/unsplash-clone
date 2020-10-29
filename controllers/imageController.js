const deepai = require('deepai');
deepai.setApiKey('074c7786-350f-41fe-98db-6290dc1a7206');
const { Unsplash, toJson, Image, User, Keyword, unsplash_image, Variable } = require("../utils/imports");

module.exports = {

    index: async (req, res) => {
        // async function toonify() {
        //     var result = await deepai.callStandardApi("densecap", {
        //       image: "https://images.unsplash.com/photo-1603614989939-43d9c327c2eb"
        //       }).then(data=>{
        //         console.log(data);
        //         res.json(data);
        //       }).catch(err=>{
        //         console.log(err);
        //       });
        //     // console.log(result);
        //   };
          
        //   toonify();
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
        res.send("Welcome");
      },
      keywords: async (req,res)=>{
        Keyword.find({"used": "FALSE"}).countDocuments().then(json=>{
          res.json(json);
        })
      },
      images: async (req,res)=>{
        Image.find().countDocuments().then(json=>{
          res.json(json);
        })
      },
      users: async (req,res)=>{
        User.find().countDocuments().then(json=>{
          res.json(json);
        })
      }

};
