var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var hummus = require('hummus');
var extractText = require('./lib/text-extraction');

function XcdPdf(options){
 this.options = options || {};
 this.getTextCordinates = _.partial(logValue, _, getTextCordinates, _);
 this.changeTextColor = _.partial(logValue, _, changeTextColor, _);
 this.getPageDetails = _.partial(logValue, _, getPageDetails, _);
}

function getTextCordinates(option, error, next){
	if(error){
		return next(error, null);	
	}
	else {

		var pdfReader = hummus.createReader(_.get(option,'pdfFile'));
		var pagesPlacements = extractText(pdfReader);
		var item =[];

		for(var i= 0; i < pagesPlacements.length; ++i) {
         	var obj ={};
         	
 	        pagesPlacements[i].forEach((placement)=> {
 
 	        	if(_.get(option,'text').indexOf(placement.text)>-1)
 	  			{
 	        		obj = {
 	        			coordLeft : _.nth(_.get(placement, 'globalBBox'), 0),
	        			coordBottom : _.nth(_.get(placement, 'globalBBox'), 1),
	        			coordRight : _.nth(_.get(placement, 'globalBBox'), 2),
	        			coordTop : _.nth(_.get(placement, 'globalBBox'), 3),
 	        			pageNumber : (i+1),
 	        			placeHolder : _.get(placement,'text')
 	        		}
 	        		item.push(obj);				        
 	  			}
 	        });
 		}

		next(null,item)
	}
}


function changeTextColor(option, error, next){
	if(error){
		return next(error, null);	
	}
	else {
		var pdfReader = hummus.createReader(_.get(option,'pdfFile'));
		var pagesPlacements = extractText(pdfReader);
		var pdfWriter = hummus.createWriterToModify(_.get(option,'pdfFile'), {
			modifiedFilePath: option.outputFile
		});

		for(var i = 0; i < pagesPlacements.length; ++i) {
	        var pageModifier = new hummus.PDFPageModifier(pdfWriter, i);
			var cxt = pageModifier.startContext().getContext();
	        pagesPlacements[i].forEach((placement)=> {
	        	if(_.get(option,'text').indexOf(placement.text) >- 1)
	  			{
	                cxt.q();
	                cxt.cm.apply(cxt, _.get(placement,'matrix'));
	                cxt.drawRectangle(_.nth(_.get(placement, 'localBBox'), 0),_.nth(_.get(placement, 'localBBox'), 1),_.nth(_.get(placement, 'localBBox'), 2)-_.nth(_.get(placement, 'localBBox'), 0),_.nth(_.get(placement, 'localBBox'), 3)-_.nth(_.get(placement, 'localBBox'), 1),{color:_.get(option,'color') || 'Red', width:8});
	                cxt.Q();
	  			}
	        });
			pageModifier.endContext().writePage();
	    }
	    pdfWriter.end();
	    next(null, option.outputFile)
	}
}

function getPageDetails(option, error, next){
	if(error){
		return next(error, null);	
	}
	else {
		var pages =[];
		var pdfReader = hummus.createReader(_.get(option,'pdfFile'));
		var pageCount = pdfReader.getPagesCount();
		_.range(0, pageCount).map(
			function(p){
				var pageInfo =  pdfReader.parsePage(p);
				pages.push({
					pageNumber : (p + 1),
					mediaBox : pageInfo.getMediaBox(),
					cropBox : pageInfo.getCropBox(),
					trimBox : pageInfo.getTrimBox(),
					bleedBox : pageInfo.getBleedBox(),
					artBox : pageInfo.getArtBox(),
					height : _.nth(pageInfo.getMediaBox(), 3),
					width : _.nth(pageInfo.getMediaBox(), 2),
				})
			})
		next(null,pages)
	}
}



function logValue(option, handler, callback){

	if (!fs.existsSync(_.get(option, 'pdfFile'))) {
	    return handler(option, 'unable to find the file', callback)
	}
	return handler(option, null, callback)
}

module.exports = XcdPdf;