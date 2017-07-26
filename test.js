var XcdPdf = require('./index.js');
var xcdPdf = new XcdPdf();

var option = {
	pdfFile : './test_out.pdf',
	text : ['{{SS:#1:signature}}', '1/1/1800'],
	color : 'Red'
}
// xcdPdf.getTextCordinates(option, function(err, data){
// 	console.log(err, JSON.stringify(data))
// });

xcdPdf.changeTextColor(option, function(err, data){
	console.log(err, JSON.stringify(data))
});