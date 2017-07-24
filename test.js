var XcdPdf = require('./index.js');
var xcdPdf = new XcdPdf();

var option = {
	pdfFile : 'fdf'
}
xcdPdf.getTextCordinates(option, function(err, data){
	console.log(err, data)
});