var XcdPdf = require('./index.js');
var xcdPdf = new XcdPdf();

var option = {
	pdfFile : './test.pdf',
	text : ['{{SS:#1:signature}}', '1/1/1800'],
	colorRGB : '0 0 0'
}
// xcdPdf.getTextCordinates(option, function(err, data){
// 	console.log(err, JSON.stringify(data))
// });

xcdPdf.changeTextColor(option, function(err, data){
	console.log(err, JSON.stringify(data))
});