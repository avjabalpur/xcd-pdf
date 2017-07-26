var _ = require('lodash');
var promiss = require('bluebird');
var fs = require('fs');
var path = require('path');
var PDFParser = require("pdf2json/pdfparser");
var async = require('async');

function XcdPdf(options){
 this.options = options || {};
 this.getTextCordinates = _.partial(logValue, _, getTextCordinates, _);
 this.changeTextColor = _.partial(logValue, _, changeTextColor, _);
}

function getTextCordinates(option, error, next){
	if(error){
		return next(error, null);	
	}
	else {
		var items = [];
		var pdfParser = new PDFParser();
		  pdfParser.on("pdfParser_dataError", function(error){
		  	next(error, null)
		  });
		  pdfParser.on("pdfParser_dataReady", function (pdfData){
		   var pageNumber = 0;

		   _.map(_.get(pdfData, 'formImage.Pages'), function(page){
		   	var obj = {
		   		page : ++pageNumber,
		   		texts : []
		   	}


		   	_.forEach(_.get(page, 'Texts'), function(text){
		   		var item = text;
      			item.text = decodeURIComponent(_.get(_.first(_.get(item, 'R')), 'T'));
      			if(_.get(option,'text').indexOf(item.text)>-1)
      			{
      				obj.texts.push(item);
      			}
		   	})
		   	items.push(obj)
		   })
		   next(null, items)
		  });
		  pdfParser.loadPDF(_.get(option, 'pdfFile'), 1);
	}
}


function changeTextColor(option, error, next){
	if(error){
		return next(error, null);	
	}
	else {
		console.log(option);
		var pdfParser = new PDFParser();
		  pdfParser.on("pdfParser_dataError", function(error){
		  	next(error, null)
		  });
		  pdfParser.on("pdfParser_dataReady", function (pdfData){
		   //var pageNumber = 0;
		   fs.writeFile("./F1040EZ.fields.json", JSON.stringify(pdfData));
		  
		   //next(null, items)
		  });
		  pdfParser.loadPDF(_.get(option, 'pdfFile'), 1);
	}
}



function logValue(option, handler, callback){

	if (!fs.existsSync(_.get(option, 'pdfFile'))) {
	    return handler(option, 'unable to find the file', callback)
	}
	return handler(option, null, callback)
}

module.exports = XcdPdf;