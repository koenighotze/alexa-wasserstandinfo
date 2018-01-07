const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

const fetchStations = function () {
  const s3params = {
              Bucket: 'dschmitz.wasserstandsinfo',
              Key: 'stations.json'
          }
  return s3.getObject(s3params).promise()
          .then(data => {
            return JSON.parse(data.Body)
          })
          .catch(err => { throw err })
}

const findStationData = function (city, stations) {
  const searchedCity = city.toLowerCase()
  return stations.find(station => station.name.toLowerCase().indexOf(searchedCity) !== -1)
}

module.exports = {
    fetchStations,
    findStationData
};

if (process.env.NODE_ENV === 'development') {
    fetchStations()
      .then(data => console.log(data))
      .catch(err => console.log(err))
}
