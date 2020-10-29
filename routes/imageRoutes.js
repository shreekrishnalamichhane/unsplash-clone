const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');



router.all('/*', (req, res, next) => {

    req.app.locals.layout = 'default';

    next();
})



router.route('/')
    .get(imageController.index);
router.route('/keywords')
    .get(imageController.keywords);
router.route('/images')
    .get(imageController.images);
router.route('/users')
    .get(imageController.users);
    

module.exports = router;
