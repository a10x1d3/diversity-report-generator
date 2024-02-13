var app = angular.module('diversity-report', ['alpha-roster-import', 'fltmps-import']);

// Table column resizing
// https://unpkg.com/browse/angular-table-resize@2.0.1/demo/ 


app.controller('diversityReportCtrl', function ($scope) {

	//┌──────────────────────────────────────┐
	//│ Controller Variables                 │
	//└──────────────────────────────────────┘
	$scope.showFltmpsHTML = false;
	


	//┌──────────────────────────────────────┐
	//│ Tab UI Functions                     │
	//└──────────────────────────────────────┘
	$scope.ui = {
		activeTab: 'Alpha Roster',
		tabs: [ 
			{ title: 'Alpha Roster' },
			{ title: 'FLTMPS' },
			{ title: 'Tab 3' },
			{ title: 'Tab 4' }
		]
	};
	$scope.activateTab = function (tab) { $scope.ui.activeTab = tab; };



	//┌──────────────────────────────────────┐
	//│ Alpha Roster Import Tab Functions    │
	//└──────────────────────────────────────┘
	$scope.removeAlphaEntry = function (index) {
		console.log(index);
		$scope.alphaRoster.splice(index, 1);
	}

	$scope.logAlphaRoster = function ()
	{
		console.log($scope.alphaRoster);
	}
	


	//┌──────────────────────────────────────┐
	//│ FLTMPS Import Tab Functions          │
	//└──────────────────────────────────────┘
	$scope.renderFltmpsHTML = function () {
		$scope.f = $scope.fltmpsRoster;
		$scope.showFltmpsHTML = true;
	};



});