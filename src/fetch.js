const cheerio = require('cheerio');
const Wreck = require('wreck');
const jsonfile = require('jsonfile');

const fetchPage = function(callback) {
    console.log("Fetching events...");
    const city = encodeURI("Düsseldorf")
    Wreck.get('https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/' + city + '/W/currentmeasurement.json', {
              timeout: 2000
         })
         .then( (res) => {
             callback(null, JSON.parse(res.payload));
         })
         .catch(error => {
             console.log("Fetching failed with", error);
             callback(error);
         });
};

const toDate = function (str) {
    const [firstDay, firstMonth, firstYear] = str.split('.');
    return new Date(firstYear, firstMonth, firstDay);
}

const handler = function (callback) {
    fetchPage( (err, body) => {
        if (err) {
            callback(err);
        }
        else {
            callback(null, body)
        }
    });
};

module.exports = {
    'handler': handler
};

if (process.env.NODE_ENV === 'development') {
    handler((err, events) => {
        if (err) {
            console.warn(err);
        }
        else {
            console.log(events);
        }
    } );
}
