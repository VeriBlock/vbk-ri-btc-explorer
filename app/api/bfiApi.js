const request = require("request");
const config = require("./../config.js");
var utils = require("./../utils.js");

const baseUrl = `${config.bfiApiUrl}/chains`

const options = {
  headers: {
    'User-Agent': 'request'
  }
};

const getBfiByBlockHeight = (blockHeight) => {
  return new Promise((resolve, reject) => {
    options.url = `${baseUrl}/blocks/best/${blockHeight}`

    requestAPI(options).then(data => {
      resolve(data);
    }).catch(error => {
      reject(error);
    })
  });
}

const getBfiByBlockHash = (blockHash) => {
  return new Promise((resolve, reject) => {
    options.url = `${baseUrl}/blocks/${blockHash}`

    requestAPI(options).then(data => {
      resolve(data);
    }).catch(error => {
      reject(error);
    })
  });
}

const getBfiByTransactionId = (txId) => {
  return new Promise((resolve, reject) => {
    options.url = `${baseUrl}/transactions/${txId}`

    requestAPI(options).then(data => {
      resolve(data);
    }).catch(error => {
      reject(error);
    })
  });
}

const requestAPI = (optionsData) => {
  return new Promise((resolve, reject) => {
    request(optionsData, (error, response, body) => {
      if (error == null && response && response.statusCode && response.statusCode === 200) {
        const data = JSON.parse(body);
        resolve({
          spFinality: data.spFinality,
          isAttackInProgress: data.isAttackInProgress
        })
      } else {
        const fullError = {
          error,
          response,
          body
        };
        utils.logError("n294vg6yn2m0", fullError);
        reject(fullError);
      }
    });
  })
}

module.exports = {
  getBfiByBlockHeight,
  getBfiByBlockHash,
  getBfiByTransactionId
};