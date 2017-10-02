var express = require('express');
var router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/:role?', function (req, res) {
  // console.log('get /user route', req.params.role);
  // check if logged in
  if (req.isAuthenticated()) {
    // if we want 'any' role, we don't actually need to send the role     
    if ((req.params.role == 'any') || (req.params.role == undefined))  {
      var userInfo = {
        username: req.user.username
      }
      res.send(userInfo);
    } else if ((req.params.role == 'Aeon') && ((req.user.role == 'Administrator') || (req.user.role == 'Site Manager'))){
      // admins and site managers can both see the site manager view
      var userInfo = {
        username: req.user.username,
        role: req.user.role
      };
      res.send(userInfo);
    } else if (req.user.role == req.params.role) {
      // check user role is the same as being requested
      var userInfo = {
        username: req.user.username,
        role: req.user.role
      };
      res.send(userInfo);
    } else {
      console.log('cascade failure');
      res.send(false);
    }
    // send back user object from database
    // console.log('logged in', req.user);
  } else {
    // failure best handled on the server. do redirect here.
    console.log('user route not logged in');
    // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
    res.send(false);
  }
});

// clear all server session information about this user
router.get('/logout', function (req, res) {
  // Use passport's built-in method to log out the user
  // console.log('Logged out');
  req.logOut();
  res.sendStatus(200);
});


module.exports = router;