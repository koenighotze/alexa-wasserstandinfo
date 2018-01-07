const Wreck = require('wreck');

const fetchPage = function(uuid, callback) {
    const url = 'https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/' + uuid + '/W/currentmeasurement.json'
    console.log("Fetching from " + url);
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

const handler = function (cityUUID, callback) {
    fetchPage(cityUUID, (err, body) => {
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
    handler("47174d8f-1b8e-4599-8a59-b580dd55bc87", (err, events) => {
        if (err) {
            console.warn(err);
        }
        else {
            console.log(events);
        }
    } );
}
