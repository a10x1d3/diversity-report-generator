var app = angular.module('diversity-report', ['ngDialog', 'alpha-roster-import', 'fltmps-import']);

// Table column resizing
// https://unpkg.com/browse/angular-table-resize@2.0.1/demo/ 


app.controller('diversityReportCtrl', function ($scope, $http) {

	//┌──────────────────────────────────────┐
	//│ Controller Variables                 │
	//└──────────────────────────────────────┘
	$scope.newAlphaRecordObject = {
		displayDialog: false
	};
	$scope.showFltmpsHTML = false;
	$scope.departmentArray = [];
	$scope.initialArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	$scope.alphaDeptFilters = [];
	$scope.filterAlphaNameSpace = false;

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
		console.log($scope.alphaObject);
	}
	
	$scope.openAlphaRecordDialog = function()
	{
		console.log('executing record entry');
		// var deptOptions = $scope.setDeptOptionsHTML();
		$scope.newAlphaRecordObject.displayDialog = true;
	};
	
	$scope.closeAlphaRecordDialog = function()
	{
		console.log('Exiting new Alpha Roster Record dialog');

		$scope.newAlphaRecordObject.dept = null;
		$scope.newAlphaRecordObject.rateRank = null;
		$scope.newAlphaRecordObject.lastInitial = null;
		$scope.newAlphaRecordObject.lastName = null;
		$scope.newAlphaRecordObject.firstName = null;

		$scope.newAlphaRecordObject.displayDialog = false
	};

	$scope.addAlphaRecord = function() {
		console.log($scope.newAlphaRecordObject);
		if (!$scope.newAlphaRecordObject.dept || !$scope.newAlphaRecordObject.rateRank || !$scope.newAlphaRecordObject.lastName || !$scope.newAlphaRecordObject.firstName )
		{
			console.log("Add Alpha Record form incomplete; returning");

			return;
		}
		
		var recordObject = {
			"dept": $scope.newAlphaRecordObject.dept,
			"rateRank": $scope.newAlphaRecordObject.rateRank,
			"lastInitial": $scope.newAlphaRecordObject.lastName[0].toUpperCase(),
			"lastName": $scope.newAlphaRecordObject.lastName,
			"firstName": $scope.newAlphaRecordObject.firstName
		};

		if ( !$scope.alphaObject[recordObject.lastInitial] )
		{
			$scope.alphaObject[recordObject.lastInitial] = new Array;
			$scope.alphaInitialArray.push(recordObject.lastInitial);
			$scope.alphaInitialArray.sort();
		}
		$scope.alphaObject[recordObject.lastInitial].push(recordObject);

		$scope.closeAlphaRecordDialog();
	};

	$scope.setAlphaDeptFilter = function(dept)
	{
		console.log('toggling dept filter: ' + dept);

		if ($scope.alphaDeptFilters.includes(dept))
		{
			var index = $scope.alphaDeptFilters.indexOf(dept);
			console.log('removing' + dept + ' from filters from index of ' + index);
			$scope.alphaDeptFilters.splice(index, 1);
			return;
		}

		$scope.alphaDeptFilters.push(dept);
	};

	$scope.setAlphaNameSpaceFilter = function()
	{
		$scope.filterAlphaNameSpace = !$scope.filterAlphaNameSpace;
	}


	$scope.deptFilter = function (item)
	{
		if ( $scope.alphaDeptFilters.length == 0 )
		{
			return true;
		}

		if ($scope.alphaDeptFilters.includes(item.dept)) {
			return true; // this will be listed in the results
		}

		return false; // otherwise it won't be within the results
	};

	$scope.nameSpaceFilter = function(item) {
		if (!$scope.filterAlphaNameSpace)
		{
			return true;
		}

		if ( item.lastName.indexOf(' ') > -1 )
		{
			return true;
		}

		return false;
	};



	//┌──────────────────────────────────────┐
	//│ FLTMPS Import Tab Functions          │
	//└──────────────────────────────────────┘
	$scope.renderFltmpsHTML = function () {
		$scope.f = $scope.fltmpsRoster;
		$scope.showFltmpsHTML = true;

		$scope.unmuteTab('diversityRoster');
	};

});