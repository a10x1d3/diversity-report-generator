var app = angular.module('diversity-report', ['ngDialog', 'alpha-roster-import', 'fltmps-import']);

// Table column resizing
// https://unpkg.com/browse/angular-table-resize@2.0.1/demo/ 


app.controller('diversityReportCtrl', function ($scope, $http) {

	//┌──────────────────────────────────────┐
	//│ Controller Functions & Variables     │
	//└──────────────────────────────────────┘
	$scope.newAlphaRecordObject = { displayDialog: false };
	$scope.showFltmpsHTML = false;
	$scope.departmentArray = [];
	$scope.alphaNumRegex = new RegExp(/[\W_]+/g);


	byLastName = function(lastNameA, lastNameB)
	{
		if (lastNameA.lastName < lastNameB.lastName) {
			return -1;
		}
		if (lastNameA.lastName > lastNameB.lastName) {
			return 1;
		}
		return 0;
	}

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
				title: 'Diversity Data',
				state: 'inactive'
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
			return;
		}

		if ($scope.ui.tabs[tab].state == 'muted')
		{
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
	$scope.alphaDeptFilters = [];
	$scope.filterAlphaNameSpecialChar = false;
	$scope.filterAlphaRRSpecialChar = false;


	$scope.removeAlphaEntry = function (lastInitial, index) {
		$scope.alphaObject[lastInitial].splice(index, 1);
	}

	$scope.logAlphaRoster = function ()
	{
		console.log($scope.alphaObject);
	}
	
	$scope.openAlphaRecordDialog = function()
	{
		$scope.newAlphaRecordObject.displayDialog = true;
	};
	
	$scope.closeAlphaRecordDialog = function()
	{
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
			return;
		}
		
		var recordObject = {
			"dept": $scope.newAlphaRecordObject.dept,
			"rateRank": $scope.newAlphaRecordObject.rateRank.toUpperCase(),
			"lastInitial": $scope.newAlphaRecordObject.lastName[0].toUpperCase(),
			"lastName": $scope.newAlphaRecordObject.lastName.toUpperCase(),
			"firstName": $scope.newAlphaRecordObject.firstName.toUpperCase()
		};

		if ( !$scope.alphaObject[recordObject.lastInitial] )
		{
			$scope.alphaObject[recordObject.lastInitial] = new Array;
			$scope.alphaInitialArray.push(recordObject.lastInitial);
			$scope.alphaInitialArray.sort();
		}
		
		$scope.alphaObject[recordObject.lastInitial].push(recordObject);
		$scope.alphaObject[recordObject.lastInitial].sort(byLastName);

		$scope.closeAlphaRecordDialog();
	};

	$scope.setAlphaDeptFilter = function(dept)
	{
		if ($scope.alphaDeptFilters.includes(dept))
		{
			var index = $scope.alphaDeptFilters.indexOf(dept);
			$scope.alphaDeptFilters.splice(index, 1);
			return;
		}

		$scope.alphaDeptFilters.push(dept);
	};

	$scope.setAlphaRRFilter = function()
	{
		$scope.filterAlphaRRSpecialChar = !$scope.filterAlphaRRSpecialChar;
	};

	$scope.setAlphaNameSpecialChar = function ()
	{
		$scope.filterAlphaNameSpecialChar = !$scope.filterAlphaNameSpecialChar;
	}

	$scope.setAlphaNameSpaceFilter = function()
	{
		$scope.filterAlphaNameSpace = !$scope.filterAlphaNameSpace;
	}


	$scope.alphaFilter = function (item)
	{
		var filteredStatus = false;
		if ( $scope.alphaDeptFilters.length == 0 &&
			 !$scope.filterAlphaNameText &&
			 !$scope.filterAlphaNameSpecialChar &&
			 !$scope.filterAlphaRRSpecialChar )
		{
			item.deptMatch = false;
			item.rrMatch = false;
			item.lastNameSearchMatch = false;
			item.lastNameCharMatch = false;
			item.firstNameSearchMatch = false;
			item.firstNameCharMatch = false;
			return true;
		}
		else
		{	
			if ($scope.alphaDeptFilters.includes(item.dept))
			{ filteredStatus = true; item.deptMatch = true; }
			else { item.deptMatch = false; }
			
			if ($scope.filterAlphaRRSpecialChar && $scope.alphaNumRegex.test(item.rateRank) )
			{ filteredStatus = true; item.rrMatch = true; }
			else { item.rrMatch = false; }

			if ($scope.filterAlphaNameText && item.lastName.includes($scope.filterAlphaNameText.toUpperCase()))
			{ filteredStatus = true; item.lastNameSearchMatch = true; }
			else { item.lastNameSearchMatch = false; }
			
			if ($scope.filterAlphaNameText && item.firstName.includes($scope.filterAlphaNameText.toUpperCase()))
			{ filteredStatus = true; item.firstNameSearchMatch = true; }
			else { item.firstNameSearchMatch = false; }
			
			if ($scope.filterAlphaNameSpecialChar && $scope.alphaNumRegex.test(item.lastName))
			{ filteredStatus = true; item.lastNameCharMatch = true; }
			else { item.lastNameCharMatch = false; }
			
			if ($scope.filterAlphaNameSpecialChar && $scope.alphaNumRegex.test(item.firstName))
			{ filteredStatus = true; item.firstNameCharMatch = true; }
			else { item.firstNameCharMatch = false; }
		}

		return filteredStatus;
	};

	



	//┌──────────────────────────────────────┐
	//│ FLTMPS Import Tab Functions          │
	//└──────────────────────────────────────┘
	$scope.renderFltmpsHTML = function () {
		$scope.f = $scope.fltmpsRoster;
		$scope.showFltmpsHTML = true;

		$scope.unmuteTab('diversityRoster');
	};

	$scope.deleteFltmpsData = function()
	{
		delete $scope.fltmpsObject;
		$scope.showFltmpsHTML = false;
	}

	$scope.setFltmpsDiversityFilter = function (group) {
		if ($scope.fltmpsDiversityFilter.includes(group)) {
			var index = $scope.fltmpsDiversityFilter.indexOf(group);
			$scope.fltmpsDiversityFilter.splice(index, 1);
			return;
		}

		$scope.fltmpsDiversityFilter.push(group);
	};


	$scope.setFltmpsUICFilter = function (uic) {
		if ($scope.fltmpsUICFilter.includes(uic)) {
			var index = $scope.fltmpsUICFilter.indexOf(uic);
			$scope.fltmpsUICFilter.splice(index, 1);
			return;
		}

		$scope.fltmpsUICFilter.push(uic);
	};


	$scope.fltmpsFilter = function (item) {
		var filteredStatus = false;
		
		if ( !$scope.filterFltmpsNameText )
		{
			item.lastNameSearchMatch = false;
			item.firstNameSearchMatch = false;
			
			return true;
		}
		else {
			if ($scope.filterFltmpsNameText && item.lastName.includes($scope.filterFltmpsNameText.toUpperCase()))
			{ filteredStatus = true; item.lastNameSearchMatch = true; }
			else { item.lastNameSearchMatch = false; }

			if ($scope.filterFltmpsNameText && item.firstName.includes($scope.filterFltmpsNameText.toUpperCase()))
			{ filteredStatus = true; item.firstNameSearchMatch = true; }
			else { item.firstNameSearchMatch = false; }
			
		}

		return filteredStatus;
	};



	//┌──────────────────────────────────────┐
	//│ Diversity Data | Vars & Functions    │
	//└──────────────────────────────────────┘


	$scope.mergeDiversityData = function()
	{
		$scope.alphaInitialArray.forEach(initial => {

			$scope.alphaObject[initial].forEach(alphaRecord => {
				console.log(alphaRecord);

				
			});
		});
	};

});