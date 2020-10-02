var btc = require("./coins/btc.js");
var ltc = require("./coins/ltc.js");
var vbtc = require("./coins/vbtc.js");

module.exports = {
	"BTC": btc,
	"LTC": ltc,
	"vBTC": vbtc,

	"coins":["BTC", "LTC", "vBTC"]
};
