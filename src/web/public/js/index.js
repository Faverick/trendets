define(['angular',
	'angularRoute',
	'angularResource',
    'angularAnimate',
    'moment',
	'js/interaction',
	'datetimepicker',
	'js/chart/chartManager'
	
], function(angular, angularRoute, angularResource, angularAnimate, moment, interaction, datetimepicker, chartManager){

	var app = angular.module('TrendetsApp', ['ng', 'ngRoute', 'ngResource', 'ngAnimate', 'TrendetsApp.Interaction',
												'ui.bootstrap.datetimepicker']);

	app.filter('range', function() {
	  return function(input, from, to) {
	    from = parseInt(from);
	    to = parseInt(to);
	    var newInput = [];
	    for (var i=from; i<to; i++)
	      newInput.push(input[i]);

	    return newInput;
	  };
	});

	app.controller('FormController', ["$scope", 'dataResources', function($scope, dataResources){
		$scope.filterFormVisibility = false;
		$scope.selectedStock = "EUR/USD";
		$scope.selectedTimeFrame = "timeFrame1H";
		$scope.formFilter = {
			dateFrom:'2014-04-09',
			dateTo: '2014-11-01',
			country: ["Italy"],
			importance: ["bull1"],
			descriptionText: ""
		}
		$scope.dataResources = dataResources;
		$("#" + $scope.selectedTimeFrame).addClass('active');

		$scope.btnFilterClick = function() {
			if($scope.filterFormVisibility == true)
				$scope.filterFormVisibility = false;
			else
				$scope.filterFormVisibility = true;
		}

		$scope.submitForm = function() {
			chartManager.makeChart(null);
		
			var url = {
				url : formRequest()
			};
			dataResources.submit($scope.formFilter, url, refreshChart);
		}

		var refreshChart = function(dataSeries){
			chartManager.makeChart(dataSeries);
		}

		$scope.clearStartDate = function() {
	        $scope.start_date = null;
	    }

	    $scope.clearStopDate = function() {
	        $scope.stop_date = null;
	    }

	    $scope.onStockClick = function(stockCode) {
	    	$scope.selectedStock = stockCode;
	    }

	    $scope.onTimeFrameButtonClick = function(timeFrame) {
	    	$("#" + $scope.selectedTimeFrame).removeClass('active');
	    	$scope.selectedTimeFrame = timeFrame;
	    	$("#" + $scope.selectedTimeFrame).addClass('active');
	    }

		function formRequest()
		{
			var request = 'http://195.128.78.52/';
			var stockString = $scope.selectedStock.replace('/','');
			request = request.concat(stockString+'_');
			//TODO: check if dates from and to are correct

			// form the name of the file
			var startDate = moment($scope.start_date);
			var year = startDate.year();
			request = request.concat(year % 100);
			request = request.concat(("0" + (startDate.month() + 1)).slice(-2));
			request = request.concat(("0" + startDate.date()).slice(-2) + '_');

			var stopDate = moment($scope.stop_date);
			var year = stopDate.year();
			request = request.concat(year % 100);
			request = request.concat(("0" + (stopDate.month() + 1)).slice(-2));
			request = request.concat(("0" + stopDate.date()).slice(-2)  + '.csv?');

			//concat market id
			request = request.concat('market=5');

			//concat stock id
			var stockId = getStockIdByCode($scope.selectedStock);
			request = request.concat('&em=' + stockId);

			//concat the code of stock
			request = request.concat('&code=' + stockString);

			//concat date of start date
			request = request.concat('&df=' + startDate.date());

			//concat month of start date
			request = request.concat('&mf=' + startDate.month());

			//concat year of start date
			request = request.concat('&yf=' + startDate.year());

			//concat start date
			request = request.concat('&from=' + ("0" + startDate.date()).slice(-2) + '.' + ("0" + (startDate.month() + 1)).slice(-2) + 
				'.' + startDate.year());

			//concat date of stop date
			request = request.concat('&dt=' + stopDate.date());

			//concat month of stop date
			request = request.concat('&mt=' + stopDate.month());

			//concat year of stop date
			request = request.concat('&yt=' + stopDate.year());

			//concat stop date
			request = request.concat('&to=' + ("0" + stopDate.date()).slice(-2) + '.' + ("0" + (stopDate.month() + 1)).slice(-2) + 
				'.' + stopDate.year());

			//concat timeFrame
			request = request.concat('&p=' + timeFrameDictionary[$scope.selectedTimeFrame]);

			//concat filename
			request = request.concat('&f='+stockString+'_');
			var startDate = moment($scope.start_date);
			var year = startDate.year();
			request = request.concat(year % 100);
			request = request.concat(("0" + (startDate.month() + 1)).slice(-2));
			request = request.concat(("0" + startDate.date()).slice(-2) + '_');

			var stopDate = moment($scope.stop_date);
			var year = stopDate.year();
			request = request.concat(year % 100);
			request = request.concat(("0" + (stopDate.month() + 1)).slice(-2));
			request = request.concat(("0" + stopDate.date()).slice(-2));

			//concat file format
			request = request.concat('&e=.csv');
			
			//concat stock pair
			request = request.concat('&cn=' + stockString);

			//concat date format
			request = request.concat('&dtf=1');

			//concat time format
			request = request.concat('&tmf=2');

			//concat parameters of time to be give
			request = request.concat('&MSOR=1&mstimever=0');

			//concat the separator (";")
			request = request.concat('&sep=3&sep2=1');

			//concat format of file representative
			request = request.concat('&datf=1');

			//concat the presence of header
			request = request.concat('&at=1');

			console.log(request);
			return request;
		}

		function getStockIdByCode(stockCode)
		{
			var stockId = null;
			$scope.stocks.forEach(function (stock)
			{
				if (stock['code'] === stockCode) {
					stockId = stock['id'];
				}
			});

			return stockId;
		}

		var timeFrameDictionary = {
			"timeFrame5": 3,
			"timeFrame15": 5,
			"timeFrame30": 6,
			"timeFrame1H": 7,
			"timeFrame1D": 8,
			"timeFrame1W": 9,
			"timeFrame1M": 10
		}

		$scope.countries = [
			{fullName: "Argentina", currency: "ARS", checked: false},
			{fullName: "Australia", currency: "AUD", checked: false},
			{fullName: "Austria", currency: "EUR", checked: false},
			{fullName: "Bahrain", currency: "BHD", checked: false},
			{fullName: "Belgium", currency: "EUR", checked: false},
			{fullName: "Botswana", currency: "BWA", checked: false},
			{fullName: "Brasil", currency: "BRA", checked: false},
			{fullName: "Bulgaria", currency: "EUR", checked: false},
			{fullName: "Canada", currency: "CAD", checked: false},
			{fullName: "Chile", currency: "CLP", checked: false},
			{fullName: "China", currency: "CNY", checked: false},
			{fullName: "Colombia", currency: "COP", checked: false},
			{fullName: "Costa Rica", currency: "CRI", checked: false},
			{fullName: "Croatia", currency: "KUN", checked: false},
			{fullName: "Cyprus", currency: "CYP", checked: false},
			{fullName: "Czech Republic", currency: "CZK", checked: false},
			{fullName: "Denmark", currency: "DKK", checked: false},
			{fullName: "Ecuador", currency: "ECU", checked: false},
			{fullName: "Egypt", currency: "EGP", checked: false},
			{fullName: "Estonia", currency: "EUR", checked: false},
			{fullName: "Euro Zone", currency: "EUR", checked: true},
			{fullName: "Finland", currency: "EUR", checked: false},
			{fullName: "France", currency: "EUR", checked: false},
			{fullName: "Germany", currency: "EUR", checked: true},
			{fullName: "Greece", currency: "EUR", checked: false},
			{fullName: "Hong Kong", currency: "HKD", checked: false},
			{fullName: "Hungary", currency: "HUF", checked: false},
			{fullName: "Iceland", currency: "ISK", checked: false},
			{fullName: "India", currency: "INR", checked: false},
			{fullName: "Indonesia", currency: "IDR", checked: false},
			{fullName: "Ireland", currency: "EUR", checked: false},
			{fullName: "Israel", currency: "ILS", checked: false},
			{fullName: "Italy", currency: "EUR", checked: true},
			{fullName: "Japan", currency: "JPY", checked: false},
			{fullName: "Jordan", currency: "JOD", checked: false},
			{fullName: "Kenya", currency: "KES", checked: false},
			{fullName: "Kuwait", currency: "KWD", checked: false},
			{fullName: "Latvia", currency: "EUR", checked: false},
			{fullName: "Lebanon", currency: "LBP", checked: false},
			{fullName: "Lithuania", currency: "EUR", checked: false},
			{fullName: "Luxembourg", currency: "EUR", checked: false},
			{fullName: "Malawi", currency: "MWK", checked: false},
			{fullName: "Malaysia", currency: "MYR", checked: false},
			{fullName: "Malta", currency: "EUR", checked: false},
			{fullName: "Mauritius", currency: "MUR", checked: false},
			{fullName: "Mexico", currency: "MXN", checked: false},
			{fullName: "Morocco", currency: "MAD", checked: false},
			{fullName: "Namibia", currency: "NAD", checked: false},
			{fullName: "Netherlands", currency: "EUR", checked: false},
			{fullName: "New Zealand", currency: "NZD", checked: false},
			{fullName: "Nigeria", currency: "NGN", checked: false},
			{fullName: "Norway", currency: "EUR", checked: false},
			{fullName: "Oman", currency: "OMR", checked: false},
			{fullName: "Pakistan", currency: "PKR", checked: false},
			{fullName: "Palestinian Territory", currency: false, checked: false},
			{fullName: "Peru", currency: "PEN", checked: false},
			{fullName: "Philippines", currency: "PHP", checked: false},
			{fullName: "Poland", currency: "EUR", checked: false},
			{fullName: "Portugal", currency: "EUR", checked: false},
			{fullName: "Qatar", currency: "QAR", checked: false},
			{fullName: "Romania", currency: "EUR", checked: false},
			{fullName: "Russia", currency: "RUB", checked: true},
			{fullName: "Rwanda", currency: "RWF", checked: false},
			{fullName: "Saudi Arabia", currency: "SAR", checked: false},
			{fullName: "Singapore", currency: "SGD", checked: false},
			{fullName: "Slovakia", currency: "EUR", checked: false},
			{fullName: "Slovenia", currency: "EUR", checked: false},
			{fullName: "South Africa", currency: "RND", checked: false},
			{fullName: "South Korea", currency: "KRW", checked: false},
			{fullName: "Spain", currency: "EUR", checked: false},
			{fullName: "Sri Lanka", currency: "LKR", checked: false},
			{fullName: "Sweden", currency: "EUR", checked: false},
			{fullName: "Switzerland", currency: "CHF", checked: false},
			{fullName: "Taiwan", currency: "TWD", checked: false},
			{fullName: "Tanzania", currency: "TZS", checked: false},
			{fullName: "Thailand", currency: "THB", checked: false},
			{fullName: "Tunisia", currency: "TND", checked: false},
			{fullName: "Turkey", currency: "TRY", checked: false},
			{fullName: "Uganda", currency: "UGX", checked: false},
			{fullName: "Ukraine", currency: "UAH", checked: false},
			{fullName: "United Arab Emirates", currency: "AED", checked: false},
			{fullName: "United Kingdom", currency: "GBP", checked: true},
			{fullName: "United States", currency: "USD", checked: true},
			{fullName: "Venezuela", currency: "VEF", checked: false},
			{fullName: "Vietnam", currency: "VND", checked: false},
			{fullName: "Zambia", currency: "ZMK", checked: false},
			{fullName: "Zimbabwe", currency: "ZWD", checked: false}
		]

		$scope.stocks = [
			{code:"AUD/CAD", id:"181410"},
			{code:"AUD/CHF", id:"181411"},
			{code:"AUD/DKK", id:"181418"},
			{code:"AUD/JPY", id:"181408"},
			{code:"AUD/NOK", id:"181417"},
			{code:"AUD/NZD", id:"181409"},
			{code:"AUD/SEK", id:"181419"},
			{code:"AUD/SGD", id:"181416"},
			{code:"AUD/USD", id:"66699"},
			{code:"CAD/CHF", id:"181389"},
			{code:"CAD/JPY", id:"181390"},
			{code:"CAD/USD", id:"181455"},
			{code:"CHF/DKK", id:"181403"},
			{code:"CHF/JPY", id:"21084"},
			{code:"CHF/SGD", id:"181396"},
			{code:"CHF/USD", id:"181454"},
			{code:"DKK/USD", id:"181402"},
			{code:"EUR/AUD", id:"181414"},
			{code:"EUR/BYR", id:"176166"},
			{code:"EUR/CAD", id:"181413"},
			{code:"EUR/CHF", id:"106"},
			{code:"EUR/CNY", id:"83226"},
			{code:"EUR/GBP", id:"88"},
			{code:"EUR/HKD", id:"181407"},
			{code:"EUR/HUF", id:"181422"},
			{code:"EUR/JPY", id:"84"},
			{code:"EUR/KZT", id:"176172"},
			{code:"EUR/LVL", id:"176177"},
			{code:"EUR/MDL", id:"176179"},
			{code:"EUR/NOK", id:"181401"},
			{code:"EUR/NZD", id:"181415"},
			{code:"EUR/RUB", id:"66860"},
			{code:"EUR/SEK", id:"181406"},
			{code:"EUR/SGD", id:"181395"},
			{code:"EUR/TJS", id:"176174"},
			{code:"EUR/UAH", id:"176168"},
			{code:"EUR/USD", id:"83"},
			{code:"EUR/UZS", id:"176170"},
			{code:"GBP/AUD", id:"181412"},
			{code:"GBP/CAD", id:"181388"},
			{code:"GBP/CHF", id:"181387"},
			{code:"GBP/JPY", id:"181386"},
			{code:"GBP/NOK", id:"181400"},
			{code:"GBP/SEK", id:"181405"},
			{code:"GBP/SGD", id:"181394"},
			{code:"GBP/USD", id:"86"},
			{code:"HKD/USD", id:"181420"},
			{code:"HUF/USD", id:"181421"},
			{code:"JPY/USD", id:"181450"},
			{code:"MXN/USD", id:"181385"},
			{code:"NOK/USD", id:"181399"},
			{code:"NZD/CAD", id:"181392"},
			{code:"NZD/JPY", id:"181391"},
			{code:"NZD/SGD", id:"181398"},
			{code:"NZD/USD", id:"181425"},
			{code:"PLN/USD", id:"181423"},
			{code:"RUB/EUR", id:"176165"},
			{code:"RUB/LVL", id:"176176"},
			{code:"RUB/USD", id:"176164"},
			{code:"SEK/USD", id:"181404"},
			{code:"SGD/JPY", id:"181397"},
			{code:"SGD/USD", id:"181393"},
			{code:"USD/BYR", id:"176167"},
			{code:"USD/CAD", id:"66700"},
			{code:"USD/CHF", id:"85"},
			{code:"USD/CNY", id:"83225"},
			{code:"USD/DEM", id:"82"},
			{code:"USD/DKK", id:"398508"},
			{code:"USD/HKD", id:"398511"},
			{code:"USD/HUF", id:"398512"},
			{code:"USD/IDR", id:"182106"},
			{code:"USD/INR", id:"181873"},
			{code:"USD/JPY", id:"87"},
			{code:"USD/KZT", id:"176173"},
			{code:"USD/LVL", id:"176178"},
			{code:"USD/MDL", id:"176180"},
			{code:"USD/MXN", id:"398515"},
			{code:"USD/NOK", id:"398516"},
			{code:"USD/PLN", id:"398513"},
			{code:"USD/RUB", id:"901"},
			{code:"USD/SEK", id:"398509"},
			{code:"USD/SGD", id:"398510"},
			{code:"USD/TJS", id:"176175"},
			{code:"USD/UAH", id:"176169"},
			{code:"USD/UZS", id:"176171"},
			{code:"USD/ZAR", id:"398514"},
			{code:"XAG/USD", id:"181426"},
			{code:"XAU/USD", id:"181427"},
			{code:"ZAR/USD", id:"181424"}
		]
	}]);



	app.run();
})