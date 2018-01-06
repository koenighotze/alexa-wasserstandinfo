const cheerio = require('cheerio');
const Wreck = require('wreck');
const jsonfile = require('jsonfile');

const fetchPage = function(city, callback) {
    const url = 'https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/' + encodeURI(city) + '/W/currentmeasurement.json'
    Wreck.get(url, {
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

const handler = function (city, callback) {
    fetchPage(city, (err, body) => {
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
    handler("Bonn", (err, events) => {
        if (err) {
            console.warn(err);
        }
        else {
            console.log(events);
        }
    } );
}
