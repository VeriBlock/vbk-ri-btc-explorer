var btc = require("./coins/btc.js");
var ltc = require("./coins/ltc.js");
var btcsq = require("./coins/btcsq.js");
var phl = require("./coins/phl.js");
var pexa = require("./coins/pexa.js");

module.exports = {
	"BTC": btc,
	"LTC": ltc,
	"BTCSQ": btcsq,
	"PHL": phl,
	"PEXA": pexa,

	"coins":["BTC", "LTC", "BTCSQ", "PHL", "PEXA"]
};
