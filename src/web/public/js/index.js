
var app = angular.module('TrendetsApp', ['ng', 'ngRoute', 'ngResource', 'ngAnimate', 'TrendetsApp.Interaction', 'ui.bootstrap']);

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
	$scope.formFilter = {
		dateFrom:'2014-04-09',
		dateTo: '2014-11-01',
		country: [],
		importance: ["bull1"],
		descriptionText: ""
	}

	$scope.btnFilterClick = function() {
		if($scope.filterFormVisibility == true)
			$scope.filterFormVisibility = false;
		else
			$scope.filterFormVisibility = true;
	}

	$scope.submitForm = function() {
		dataResources.submit($scope.formFilter);
		console.log($scope.countries[0].checked);
		console.log($scope.countries[1].checked);
	}

	$scope.onCheckboxChecked = function() {
		console.log("countryName");
		$scope.formFilter.country.push(countryName);
	}

	$scope.onCheckboxUnchecked = function(countryName) {
		var index = $scope.formFilter.country.indexOf(countryName);
		if (index > -1) {
    		$scope.formFilter.country.splice(index, 1);
		}
	}

	// $scope.onCheckboxChanged = function() {
	// 	if($scope.checkBoxState == )
	// }

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
}]);

app.run();