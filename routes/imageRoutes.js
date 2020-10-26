const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');



router.all('/*', (req, res, next) => {

    req.app.locals.layout = 'default';

    next();
})



router.route('/')
    .get(imageController.index);
    

module.exports = router;
