var parseInvesting = require('parseInvesting');

function parse_investing_with_parameters(send_func){
	var dataFrom = '2014-01-01',
	dateTo = '2015-01-01',
	// Possible values. To get all countries just make empty array []
	countries = [4, 5,6,7,9,10,11,12,14,15,17,20,21,22,23,24,25,26,27,29,32,33,34,35,36,37,38,39,41,42,43,
		44,45,46,48,51,52,53,54,55,56,57,59,60,61,63,68,70,71,72,75,80,84,85,87,89,90,92,93,94,96,97,100,103,
		105,106,107,109,110,111,112,113,121,122,123,125,138,143,145,162,163,170,172,178,188,193,202],
	importances = [1,2,3]

	parseInvesting.parse_investing(dataFrom,dateTo,countries,importances,send_func)
}


