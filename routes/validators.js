const xssModule = require('xss')

const parseCommaSeparated = (param, inner) => {
    var parts = param.split(",");
    if(parts.length === 0) {
        throw new Error("Empty argument")
    }

    return parts.map((el, i) => inner(el, i))
}

const shouldParseInt = (i) => {
    const parsed = parseInt(i);
    if(isNaN(parsed)) {
        throw new Error("Element " + i + " is not an int")
    }
    return parsed
}

const parseCommaSeparatedInts = (param) => {
    return parseCommaSeparated(param, (el, i) => {
        return shouldParseInt(el)
    });
}

function parseHexString(str) {
    var result = [];
    if(str.length < 2) {
        return shouldParseInt(str)
    }
    while (str.length >= 2) {
        var el = str.substring(0, 2)
        result.push(shouldParseInt(el))
        str = str.substring(2, str.length);
    }

    return result;
}

const parseCommaSeparatedHexStrings = (param) => {
    return parseCommaSeparated(param, (el, i) => {
        return parseHexString(el)
    })
}

const xss = (s) => {
    return xssModule.filterXSS(s)
}

module.exports = {
    parseCommaSeparated,
    shouldParseInt,
    parseCommaSeparatedInts,
    parseHexString,
    parseCommaSeparatedHexStrings,
    xss
}
