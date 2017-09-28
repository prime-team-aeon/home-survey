var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');

// Handles CSV upload from admin view
router.post('/upload', function (req, res) {
  console.log('/csv/upload POST');

  if (req.isAuthenticated()) {
    console.log('req.body', req.body);
    
  } else {
    // not authenticated
    res.sendStatus(403);
  }
});

module.exports = router;