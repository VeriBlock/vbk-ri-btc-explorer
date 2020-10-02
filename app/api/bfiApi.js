var request = require("request");
var config = require("./../config.js");
var utils = require("./../utils.js");

function getBlockBfi(blockHeight) {
	return new Promise(function(resolve, reject) {
		// need to query the total number of tx first, then build paging info from that value
		var options = {
			url: `${config.bfiApiUrl}/api/chains/blocks/best/${blockHeight}`,
			headers: {
				'User-Agent': 'request'
			}
		};

		request(options, function(error, response, body) {
			if (error == null && response && response.statusCode && response.statusCode == 200) {
				var data = JSON.parse(body);

				resolve({
					spFinality: data.spFinality,
					isAttackInProgress: data.isAttackInProgress
				})
			} else {
				var fullError = {error:error, response:response, body:body};

				utils.logError("n294vg6yn2m0", fullError);

				reject(fullError);
			}
		});
	});
}

module.exports = {
	getBlockBfi: getBlockBfi
};
