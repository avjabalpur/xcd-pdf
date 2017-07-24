var _ = require('lodash');
//var pdfreader = require('pdfreader');
var promiss = require('bluebird');
var fs = require('fs');
var path = require('path')

function XcdPdf(options){
 this.options = options || {};
 this.getTextCordinates = _.partial(logValue, _, getTextCordinates, _);
}

function getTextCordinates(option, error, next){
	next(error);
}


function logValue(option, handler, callback){

	if (!fs.existsSync(_.get(option, 'pdfFile'))) {
	    // Do something
	     console.log('Checking the file');
	     return handler(option, 'unable to find the file', callback)
	}

	return handler(option, null, callback)

}

module.exports = XcdPdf;