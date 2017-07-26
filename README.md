# xcd-pdf


var XcdPdf = require('./index.js');
var xcdPdf = new XcdPdf();


var option = {
	pdfFile : './response.pdf',
	text : ['text1', 'text2','text3'],
	color : 'Red'
}

// Getting the cordinates of texts

xcdPdf.getTextCordinates(option, function(err, data){
	console.log(err, JSON.stringify(data))
});

// Change the color of the texts

xcdPdf.changeTextColor(option, function(err, data){
	console.log(err, JSON.stringify(data))
});
