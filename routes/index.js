var express = require('express');
var router = express.Router();
var tea = require('../public/tea.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Tea Time(r)',
    tea: tea 
  });
});

module.exports = router;
