
var path = require('path');


exports.fromFileURL = function fromFileURL(path) {
    return path.substr(process.platform.match(/^win/) ? 8 : 7).replace(path.sep, '/');
};
