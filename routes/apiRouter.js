var debug = require("debug");
var debugLog = debug("btcexp:router");

var express = require('express');
var csurf = require('csurf');
var router = express.Router();
var util = require('util');
var moment = require('moment');
var bitcoinCore = require("bitcoin-core");
var qrcode = require('qrcode');
var bitcoinjs = require('bitcoinjs-lib');
var sha256 = require("crypto-js/sha256");
var hexEnc = require("crypto-js/enc-hex");
var Decimal = require("decimal.js");
var marked = require("marked");

var utils = require('./../app/utils.js');
var coins = require("./../app/coins.js");
var config = require("./../app/config.js");
var coreApi = require("./../app/api/coreApi.js");
var addressApi = require("./../app/api/addressApi.js");
const {xss, parseCommaSeparatedInts, parseHexString, shouldParseInt, parseCommaSeparatedHexStrings} = require('./validators')

const forceCsrf = csurf({ ignoreMethods: [] });




router.get("/blocks-by-height/:blockHeights", function(req, res, next) {
	const blockHeights = parseCommaSeparatedInts(req.params.blockHeights);

	coreApi.getBlocksByHeight(blockHeights).then(function(result) {
		res.json(result);

		next();
	});
});

router.get("/block-headers-by-height/:blockHeights", function(req, res, next) {
	const blockHeights = parseCommaSeparatedInts(req.params.blockHeights);

	coreApi.getBlockHeadersByHeight(blockHeights).then(function(result) {
		res.json(result);

		next();
	});
});

router.get("/block-stats-by-height/:blockHeights", function(req, res, next) {
	const blockHeights = parseCommaSeparatedInts(req.params.blockHeights);

	coreApi.getBlocksStatsByHeight(blockHeights).then(function(result) {
		res.json(result);

		next();
	});
});

router.get("/mempool-txs/:txids", function(req, res, next) {
	var txids = parseCommaSeparatedHexStrings(req.params.txids)
	var promises = [];

	for (var i = 0; i < txids.length; i++) {
		promises.push(coreApi.getMempoolTxDetails(txids[i], false));
	}

	Promise.all(promises).then(function(results) {
		res.json(results);

		next();

	}).catch(function(err) {
		res.json({success:false, error:xss(err)});

		next();
	});
});

router.get("/raw-tx-with-inputs/:txid", function(req, res, next) {
	var txid = parseHexString(req.params.txid)

	var promises = [];

	promises.push(coreApi.getRawTransactionsWithInputs([txid]));

	Promise.all(promises).then(function(results) {
		res.json(results);

		next();

	}).catch(function(err) {
		res.json({success:false, error:xss(err)});

		next();
	});
});

router.get("/block-tx-summaries/:blockHeight/:txids", function(req, res, next) {
	var blockHeight = shouldParseInt(req.params.blockHeight);
	var txids = parseCommaSeparatedHexStrings(req.params.txids);

	var promises = [];

	var results = [];

	promises.push(new Promise(function(resolve, reject) {
		coreApi.buildBlockAnalysisData(blockHeight, txids, 0, results, resolve);
	}));

	Promise.all(promises).then(function() {
		res.json(results);

		next();

	}).catch(function(err) {
		res.json({success:false, error:xss(err)});

		next();
	});
});

router.get("/utils/:func/:params", function(req, res, next) {
	var func = req.params.func;
	var params = req.params.params;

	var data = null;

	if (func === "formatLargeNumber") {
		if (params.indexOf(",") > -1) {
			const parts = parseCommaSeparatedInts(params)

			data = utils.formatLargeNumber(parts[0], parts[1]);

		} else {
			data = utils.formatLargeNumber(parseInt(params));
		}
	} else if (func === "formatCurrencyAmountInSmallestUnits") {
		const parts = parseCommaSeparatedInts(params);

		data = utils.formatCurrencyAmountInSmallestUnits(new Decimal(parts[0]), parseInt(parts[1]));

	} else {
		data = {success:false, error:`Unknown function`};
	}

	res.json(data);

	next();
});



module.exports = router;
