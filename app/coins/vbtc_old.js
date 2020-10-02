var Decimal = require("decimal.js");
Decimal8 = Decimal.clone({ precision:8, rounding:8 });

var currencyUnits = [
	{
		type:"native",
		name:"vBTC",
		multiplier:1,
		default:true,
		values:["", "vbtc", "vBTC"],
		decimalPlaces:8
	},
	{
		type:"native",
		name:"mvBTC",
		multiplier:1000,
		values:["mvbtc"],
		decimalPlaces:5
	},
	{
		type:"native",
		name:"vbits",
		multiplier:1000000,
		values:["vbits"],
		decimalPlaces:2
	},
	{
		type:"native",
		name:"vsat",
		multiplier:100000000,
		values:["vsat", "vsatoshi"],
		decimalPlaces:0
	},
	{
		type:"exchanged",
		name:"USD",
		multiplier:"usd",
		values:["usd"],
		decimalPlaces:2,
		symbol:"$"
	},
	{
		type:"exchanged",
		name:"EUR",
		multiplier:"eur",
		values:["eur"],
		decimalPlaces:2,
		symbol:"€"
	},
];

module.exports = {
	name:"vBitcoin",
	ticker:"vBTC",
	logoUrl:"/img/logo/btc.svg",
	siteTitle:"vBitcoin Explorer",
	siteDescriptionHtml:"<b>vBTC Explorer</b> is <a href='https://github.com/janoside/btc-rpc-explorer). If you run your own [Bitcoin Full Node](https://bitcoin.org/en/full-node), **BTC Explorer** can easily run alongside it, communicating via RPC calls. See the project [ReadMe](https://github.com/janoside/btc-rpc-explorer) for a list of features and instructions for running.",
	nodeTitle:"vBitcoin Full Node",
	nodeUrl:"https://bitcoin.org/en/full-node",
	demoSiteUrl: "https://btc.chaintools.io",
	miningPoolsConfigUrls:[
	],
	maxBlockWeight: 4000000,
	targetBlockTimeSeconds: 600,
	currencyUnits:currencyUnits,
	currencyUnitsByName:{"vBTC":currencyUnits[0], "mvBTC":currencyUnits[1], "vbits":currencyUnits[2], "vsat":currencyUnits[3]},
	baseCurrencyUnit:currencyUnits[3],
	defaultCurrencyUnit:currencyUnits[0],
	feeSatoshiPerByteBucketMaxima: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 50, 75, 100, 150],
	genesisBlockHash: "0000000cc7ada94e458c41fdb841ee6a69b7fd572dcf216d551537c72c730d50",
	genesisCoinbaseTransactionIdsByNetwork: {
		"test": "e494ea0589627ef3ee8a62981bf5f77df5e46a812bb7e9c311c1fd9903e67a03"
	},
	genesisBlockHashesByNetwork: {
		"test": "00000006cf4c4e6177695242a1347023b7b1bdef8119237a11511b9e490bf8d9"
	},
	genesisCoinbaseTransactionsByNetwork: {
		"test": {
			"txid": "e494ea0589627ef3ee8a62981bf5f77df5e46a812bb7e9c311c1fd9903e67a03",
			"hash": "e494ea0589627ef3ee8a62981bf5f77df5e46a812bb7e9c311c1fd9903e67a03",
			"version": 1,
			"size": 144,
			"vsize": 144,
			"weight": 576,
			"locktime": 0,
			"vin": [
				{
					"coinbase": "04ffff0f1d01040956657269426c6f636b",
					"sequence": 4294967295
				}
			],
			"vout": [
				{
					"value": 50.00000000,
					"n": 0,
					"scriptPubKey": {
						"asm": "047c62bbf7f5aa4dd5c16bad99ac621b857fac4e93de86e45f5ada73404eeb44dedcf377b03c14a24e9d51605d9dd2d8ddaef58760d9c4bb82d9c8f06d96e79488 OP_CHECKSIG",
						"hex": "41047c62bbf7f5aa4dd5c16bad99ac621b857fac4e93de86e45f5ada73404eeb44dedcf377b03c14a24e9d51605d9dd2d8ddaef58760d9c4bb82d9c8f06d96e79488ac",
						"type": "pubkey"
					}
				}
			],
			"hex": "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff1104ffff0f1d01040956657269426c6f636bffffffff0100f2052a010000004341047c62bbf7f5aa4dd5c16bad99ac621b857fac4e93de86e45f5ada73404eeb44dedcf377b03c14a24e9d51605d9dd2d8ddaef58760d9c4bb82d9c8f06d96e79488ac00000000"
		}
	},
	genesisCoinbaseOutputAddressScripthash:"8b01df4e368ea28f8dc0423bcf7a4923e3a12d307c875e47a0cfbf90b5c39161",
	historicalData: [

	],
	exchangeRateData:{
		jsonUrl:"https://api.coindesk.com/v1/bpi/currentprice.json",
		responseBodySelectorFunction:function(responseBody) {
			//console.log("Exchange Rate Response: " + JSON.stringify(responseBody));

			var exchangedCurrencies = ["USD", "GBP", "EUR"];

			if (responseBody.bpi) {
				var exchangeRates = {};

				for (var i = 0; i < exchangedCurrencies.length; i++) {
					if (responseBody.bpi[exchangedCurrencies[i]]) {
						exchangeRates[exchangedCurrencies[i].toLowerCase()] = responseBody.bpi[exchangedCurrencies[i]].rate_float;
					}
				}

				return exchangeRates;
			}
			
			return null;
		}
	},
	blockRewardFunction:function(blockHeight) {
		var eras = [ new Decimal8(30) ];
		for (var i = 1; i < 34; i++) {
			var previous = eras[i - 1];
			eras.push(new Decimal8(previous).dividedBy(2));
		}

		var index = Math.floor(blockHeight / 210000);

		return eras[index];
	}
};
