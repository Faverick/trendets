
var app = angular.module('TrendetsApp', ['ng', 'ngRoute', 'ngResource', 'ngAnimate']);

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

app.controller('FormController', ["$scope", function($scope){
	$scope.filterFormVisibility = false;

	$scope.btnFilterClick = function() {
		if($scope.filterFormVisibility == true)
			$scope.filterFormVisibility = false;
		else
			$scope.filterFormVisibility = true;
	}

	$scope.countries = [
		{fullName: "Argentina", currency: "ARS"},
		{fullName: "Australia", currency: "AUD"},
		{fullName: "Austria", currency: "EUR"},
		{fullName: "Bahrain", currency: "BHD"},
		{fullName: "Belgium", currency: "EUR"},
		{fullName: "Botswana", currency: "BWA"},
		{fullName: "Brasil", currency: "BRA"},
		{fullName: "Bulgaria", currency: "EUR"},
		{fullName: "Canada", currency: "CAD"},
		{fullName: "Chile", currency: "CLP"},
		{fullName: "China", currency: "CNY"},
		{fullName: "Colombia", currency: "COP"},
		{fullName: "Costa Rica", currency: "CRI"},
		{fullName: "Croatia", currency: "KUN"},
		{fullName: "Cyprus", currency: "CYP"},
		{fullName: "Czech Republic", currency: "CZK"},
		{fullName: "Denmark", currency: "DKK"},
		{fullName: "Ecuador", currency: "ECU"},
		{fullName: "Egypt", currency: "EGP"},
		{fullName: "Estonia", currency: "EUR"},
		{fullName: "Euro Zone", currency: "EUR"},
		{fullName: "Finland", currency: "EUR"},
		{fullName: "France", currency: "EUR"},
		{fullName: "Germany", currency: "EUR"},
		{fullName: "Greece", currency: "EUR"},
		{fullName: "Hong Kong", currency: "HKD"},
		{fullName: "Hungary", currency: "HUF"},
		{fullName: "Iceland", currency: "ISK"},
		{fullName: "India", currency: "INR"},
		{fullName: "Indonesia", currency: "IDR"},
		{fullName: "Ireland", currency: "EUR"},
		{fullName: "Israel", currency: "ILS"},
		{fullName: "Italy", currency: "EUR"},
		{fullName: "Japan", currency: "JPY"},
		{fullName: "Jordan", currency: "JOD"},
		{fullName: "Kenya", currency: "KES"},
		{fullName: "Kuwait", currency: "KWD"},
		{fullName: "Latvia", currency: "EUR"},
		{fullName: "Lebanon", currency: "LBP"},
		{fullName: "Lithuania", currency: "EUR"},
		{fullName: "Luxembourg", currency: "EUR"},
		{fullName: "Malawi", currency: "MWK"},
		{fullName: "Malaysia", currency: "MYR"},
		{fullName: "Malta", currency: "EUR"},
		{fullName: "Mauritius", currency: "MUR"},
		{fullName: "Mexico", currency: "MXN"},
		{fullName: "Morocco", currency: "MAD"},
		{fullName: "Namibia", currency: "NAD"},
		{fullName: "Netherlands", currency: "EUR"},
		{fullName: "New Zealand", currency: "NZD"},
		{fullName: "Nigeria", currency: "NGN"},
		{fullName: "Norway", currency: "EUR"},
		{fullName: "Oman", currency: "OMR"},
		{fullName: "Pakistan", currency: "PKR"},
		{fullName: "Palestinian Territory", currency: ""},
		{fullName: "Peru", currency: "PEN"},
		{fullName: "Philippines", currency: "PHP"},
		{fullName: "Poland", currency: "EUR"},
		{fullName: "Portugal", currency: "EUR"},
		{fullName: "Qatar", currency: "QAR"},
		{fullName: "Romania", currency: "EUR"},
		{fullName: "Russia", currency: "RUB"},
		{fullName: "Rwanda", currency: "RWF"},
		{fullName: "Saudi Arabia", currency: "SAR"},
		{fullName: "Singapore", currency: "SGD"},
		{fullName: "Slovakia", currency: "EUR"},
		{fullName: "Slovenia", currency: "EUR"},
		{fullName: "South Africa", currency: "RND"},
		{fullName: "South Korea", currency: "KRW"},
		{fullName: "Spain", currency: "EUR"},
		{fullName: "Sri Lanka", currency: "LKR"},
		{fullName: "Sweden", currency: "EUR"},
		{fullName: "Switzerland", currency: "CHF"},
		{fullName: "Taiwan", currency: "TWD"},
		{fullName: "Tanzania", currency: "TZS"},
		{fullName: "Thailand", currency: "THB"},
		{fullName: "Tunisia", currency: "TND"},
		{fullName: "Turkey", currency: "TRY"},
		{fullName: "Uganda", currency: "UGX"},
		{fullName: "Ukraine", currency: "UAH"},
		{fullName: "United Arab Emirates", currency: "AED"},
		{fullName: "United Kingdom", currency: "GBP"},
		{fullName: "United States", currency: "USD"},
		{fullName: "Venezuela", currency: "VEF"},
		{fullName: "Vietnam", currency: "VND"},
		{fullName: "Zambia", currency: "ZMK"},
		{fullName: "Zimbabwe", currency: "ZWD"}
	]
}]);

app.run();