var btc = require("./coins/btc.js");
var ltc = require("./coins/ltc.js");
var vbtc = require("./coins/vbtc.js");
var phl = require("./coins/phl.js");
var pexa = require("./coins/pexa.js");

module.exports = {
	"BTC": btc,
	"LTC": ltc,
	"vBTC": vbtc,
	"PHL": phl,
	"PEXA": pexa,

	"coins":["BTC", "LTC", "vBTC", "PHL", "PEXA"]
};
