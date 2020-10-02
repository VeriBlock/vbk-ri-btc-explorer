var sha256 = require("crypto-js/sha256");
var hexEnc = require("crypto-js/enc-hex");
const bech32 = require('bech32-buffer')

function parseHexString(str) {
    var result = [];
    // Ignore any trailing single digit; I don't know what your needs
    // are for this case, so you may want to throw an error or convert
    // the lone digit depending on your needs.
    while (str.length >= 2) {
        result.push(parseInt(str.substring(0, 2), 16));
        str = str.substring(2, str.length);
    }

    return result;
}

function createHexString(arr) {
    var result = "";
    for (i in arr) {
        var str = arr[i].toString(16);
        // Pad to two digits, truncate to last two if too long.  Again,
        // I'm not sure what your needs are for the case, you may want
        // to handle errors in some other way.
        str = str.length == 0 ? "00" :
            str.length == 1 ? "0" + str :
                str.length == 2 ? str :
                    str.substring(str.length-2, str.length);
        result += str;
    }

    return result;
}

function getBtcBlockHash(header) {
    var hex = hexEnc.stringify(sha256(sha256(hexEnc.parse(header))));
    return createHexString(parseHexString(hex).reverse())
}

function payoutToAddress(payout) {
    const version = 1;
    const prefix = 'tb';
    const data = Buffer.concat([Buffer.from([version]), bech32.to5BitArray(Buffer.from(payout, 'hex'))]);
    return bech32.encode5BitArray(prefix, data);
}

module.exports = {
    getBtcBlockHash,
    payoutToAddress
};
