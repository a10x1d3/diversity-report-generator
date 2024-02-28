var app = angular.module('diversity-report', ['alpha-roster-import', 'fltmps-import']);

// Table column resizing
// https://unpkg.com/browse/angular-table-resize@2.0.1/demo/ 


app.controller('diversityReportCtrl', function ($scope) {

	//┌──────────────────────────────────────┐
	//│ Controller Variables                 │
	//└──────────────────────────────────────┘
	$scope.showFltmpsHTML = false;
	$scope.departmentArray = [];
	$scope.initialArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];


	//┌──────────────────────────────────────┐
	//│ Tab UI Functions                     │
	//└──────────────────────────────────────┘
	$scope.ui = {
		activeTab: 'alphaRoster',
		tabs: { 
			alphaRoster: {
				title: 'Alpha Roster',
				state: 'active'
			},
			fltmpsRoster: {
				title: 'FLTMPS',
				state: 'inactive'
			},
			diversityRoster: {
				title: 'Tab 3',
				state: 'muted'
			},
			diversityReport: {
				title: 'Tab 4',
				state: 'muted'
			}
		}
	};

	$scope.setTabState = function (tab)
	{
		var currentActiveTab = $scope.ui.activeTab;
		
		if ($scope.ui.activeTab == tab)
		{
			console.log('tab alredy active');
			return;
		}

		if ($scope.ui.tabs[tab].state == 'muted')
		{
			console.log('tab is muted; NOOP');
			return;
		}

		$scope.ui.tabs[tab].state = 'active';
		$scope.ui.activeTab = tab;
		$scope.ui.tabs[currentActiveTab].state = 'inactive';
	};

	$scope.unmuteTab = function(tab)
	{
		$scope.ui.tabs[tab].state = 'inactive';
	};




	//┌──────────────────────────────────────┐
	//│ Alpha Roster Import Tab Functions    │
	//└──────────────────────────────────────┘
	$scope.removeAlphaEntry = function (lastInitial, index) {
		console.log(lastInitial);
		console.log(index);
		$scope.alphaObject[lastInitial].splice(index, 1);
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

		$scope.unmuteTab('diversityRoster');
	};



});