// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express         = require('express');        // call express
var app             = express();                 // define our app using express
var bodyParser      = require('body-parser');
var blync           = require('blync-usb30');
var notifyparams    = require("./notify.json");
var _               = require("lodash");

var Vstspayload      = require('./app/models/Vstspayload');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var timer;

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
// Initialize our Blync30 USB
try {
    // How many Blyncs are hooked up?
    var deviceCount = blync.getDevices().length;
    var device = blync.getDevice(0);
} catch (error) {
    throw new Error("Error when trying to connect to the Blync USB 30 : " + error);
}

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'VSTS Blync notification Up and Running' });   
});

router.route('/vstshook') // (accessed at POST http://localhost:8080/api/vstshook)

    .post(function(req, res) {

        var payload = new Vstspayload(req.body);      // cleaning the payload received from VSTS

        console.log('Hook received: ' + payload.eventType);
        console.log(payload.msg);

        var filtered = _.find(notifyparams, {"type": payload.eventType});
        if (filtered) {
            device.setColor(filtered.color, filtered.control);
            console.log("Changing Blync setup to : " + filtered.color + " / " + filtered.control);
        }
        res.json({ message: 'Notified' });
        // Timer back to green light after 30 secs
        timer = setTimeout(backToNormal, 30000);
    });

function backToNormal(params) {
    device.setColor('green', 'on');
}

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
