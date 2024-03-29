var app = angular.module('diversity-report', ["alpha-roster-import", "fltmps-import", "chart.js"]);

// Table column resizing
// https://unpkg.com/browse/angular-table-resize@2.0.1/demo/ 

app.config(function (ChartJsProvider) {
	// Configure all charts
	ChartJsProvider.setOptions({
		chartColors: ['#97bbcd', '#dcdcdc', '#edb96a', '#979eaf', '#d1f9cc', '#ff94f8', '#f2f2f2', '#f2836b', '#bcf6f6', '#edb9e2', '#f2e1ac', '#beeb9f', '#e8b3bf', '#ffe2c3', '#adecff', '#e2f315', '#bdd684', '#ffc4d0', '#cdd5c6']
	});
	
});


app.controller('diversityReportCtrl', function ($scope, $http) {

	//┌──────────────────────────────────────┐
	//│ Controller Functions & Variables     │
	//└──────────────────────────────────────┘
	$scope.newAlphaRecordObject = { displayDialog: false };
	$scope.showFltmpsHTML = false;
	$scope.departmentArray = [];
	$scope.alphaNumRegex = new RegExp(/[\W_]+/g);
	$scope.genderOptions = ['Male', 'Female'];
	$scope.leadershipRoleOptions = [
		{
			longTitle: 'Command TRIAD',
			shortTitle: 'TRIAD'
		}
	];
	$scope.paygradeArray = [
		'E-1', 'E-2', 'E-3', 
		'E-4', 'E-5', 'E-6', 
		'E-7', 'E-8', 'E-9', 
		'W-1', 'W-2', 'W-3', 
		'W-4', 'W-5', 
		'O-1', 'O-2', 'O-3', 
		'O-4', 'O-5'
	]


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
				state: 'muted'
			},
			diversityRoster: {
				title: 'Diversity Data',
				state: 'muted'
			},
			diversityReport: {
				title: 'Diversity Report',
				state: 'inactive'
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


	$scope.getTrueIndex = function(targetObject, lastInitial, record)
	{
		var counter = 0
		var trueIndex = 0;
		
		$scope[targetObject][lastInitial].forEach(item => {
			if ( JSON.stringify(item) == JSON.stringify(record) )
			{
				trueIndex = counter;
			}

			counter += 1;
		});

		return trueIndex;
	};


	$scope.toUpper = function(targetObject, record, lastInitial, property)
	{
		var index = $scope.getTrueIndex(targetObject, lastInitial, record);
		$scope[targetObject][lastInitial][index][property] = $scope[targetObject][lastInitial][index][property].toUpperCase();
	};



	//┌──────────────────────────────────────┐
	//│ Alpha Roster Import Tab Functions    │
	//└──────────────────────────────────────┘
	$scope.activeFilters = false;
	$scope.alphaDeptFilters = [];
	$scope.filterAlphaNameSpecialChar = false;
	$scope.filterAlphaRRSpecialChar = false;
	

	$scope.validatePaygrade = function(lastInitial, record)
	{
		var index = $scope.getTrueIndex('alphaObject', lastInitial, record);

		if ( $scope.alphaObject[lastInitial][index].paygrade )
		{
			$scope.alphaObject[lastInitial][index].missingPaygrade = false;
		}
	};


	$scope.removeAlphaRecord = function (lastInitial, record) {

		var index = $scope.getTrueIndex('alphaObject', lastInitial, record);

		$scope.alphaObject[lastInitial].splice(index, 1);
		$scope.alphaObject.recordCount -= 1;

		if ( $scope.alphaObject[lastInitial].length == 0 )
		{
			var alphaIndex = $scope.alphaInitialArray.indexOf(lastInitial);
			$scope.alphaInitialArray.splice(alphaIndex, 1)
		}
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
		$scope.newAlphaRecordObject.paygrade = null;
		$scope.newAlphaRecordObject.lastInitial = null;
		$scope.newAlphaRecordObject.lastName = null;
		$scope.newAlphaRecordObject.firstName = null;

		$scope.newAlphaRecordObject.displayDialog = false
	};

	$scope.addAlphaRecord = function() {
		console.log($scope.newAlphaRecordObject);
		if ( !$scope.newAlphaRecordObject.dept ||
			 !$scope.newAlphaRecordObject.rateRank ||
			 !$scope.newAlphaRecordObject.paygrade ||
			 !$scope.newAlphaRecordObject.lastName ||
			 !$scope.newAlphaRecordObject.firstName )
		{
			return;
		}
		
		var recordObject = {
			"dept": $scope.newAlphaRecordObject.dept,
			"rateRank": $scope.newAlphaRecordObject.rateRank.toUpperCase(),
			"paygrade": $scope.newAlphaRecordObject.paygrade,
			"lastInitial": $scope.newAlphaRecordObject.lastName[0].toUpperCase(),
			"lastName": $scope.newAlphaRecordObject.lastName.toUpperCase(),
			"firstName": $scope.newAlphaRecordObject.firstName.toUpperCase()
		};

		if ( !$scope.alphaObject[recordObject.lastInitial] )
		{
			console.log('found missing initial array');
			$scope.alphaObject[recordObject.lastInitial] = new Array;
		}
		
		$scope.alphaInitialArray.push(recordObject.lastInitial);
		$scope.alphaInitialArray.sort();
		
		$scope.alphaObject[recordObject.lastInitial].push(recordObject);
		$scope.alphaObject[recordObject.lastInitial].sort(byLastName);
		$scope.alphaObject.recordCount += 1;

		$scope.closeAlphaRecordDialog();
	};


	$scope.reverseAlphaLastFirstName = function(lastInitial, record)
	{
		var index = $scope.getTrueIndex('alphaObject', lastInitial, record);
		var targetRecord = angular.copy($scope.alphaObject[lastInitial][index]);

		targetRecord.lastName = angular.copy($scope.alphaObject[lastInitial][index].firstName);
		targetRecord.firstName = angular.copy($scope.alphaObject[lastInitial][index].lastName);
		targetRecord.lastInitial = targetRecord.lastName[0];
		targetRecord.highlightName = false;		
		$scope.alphaObject[lastInitial].splice(index, 1);

		if ( $scope.alphaObject[lastInitial].length == 0 )
		{
			var alphaIndex = $scope.alphaInitialArray.indexOf(lastInitial);
			$scope.alphaInitialArray.splice(alphaIndex, 1)
		}

		if ( !$scope.alphaObject[targetRecord.lastInitial] )
		{
			$scope.alphaObject[targetRecord.lastInitial] = new Array;
			$scope.alphaInitialArray.push(targetRecord.lastInitial);
			$scope.alphaInitialArray.sort();
		}

		$scope.alphaObject[targetRecord.lastInitial].push(targetRecord);
		$scope.alphaObject[targetRecord.lastInitial].sort(byLastName);
	};


	$scope.validateAlphaRoster = function()
	{
		console.log('validateAlphaRoster firing');
		var validRoster = true;

		$scope.alphaInitialArray.forEach(initial => {
			$scope.alphaObject[initial].forEach(record => {
				if ( !record.rateRank ||
					 !record.paygrade ||
					 !record.lastName ||
					 !record.lastName )
				{
					validRoster = false;
					return;
				}
			});
		});

		if ( !validRoster )
		{
			alert('One or more records are missing:\n • Rate / Rank\n • Last Name\n • First Name');
			return;
		}

		$scope.unmuteTab('fltmpsRoster')
	}


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
			$scope.activeFilters = false;
			return true;
		}
		else
		{	
			$scope.activeFilters = true;
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
			return true;
		}
		
		if ( $scope.filterFltmpsNameText && item.lastName.includes($scope.filterFltmpsNameText.toUpperCase()) )
		{
			item.lastNameSearchMatch = true;
			return true;
		}
		
		item.lastNameSearchMatch = false;
		return false;
	}
			
		

	



	//┌──────────────────────────────────────┐
	//│ Diversity Data | Vars & Functions    │
	//└──────────────────────────────────────┘
	$scope.filterDiversityUnmerged = false;

	$scope.EditDiversityCollObject = {
		displayDialog: false,
		collateralLevels: [
			'Command',
			'CB',
			'CG',
			'CSA',
			'RDNS',
			'RFO'
		],
		collateralTitles: [
			'CC',
			'CFL',
			'CFS',
			'CMEO',
			'CWO/IWO',
			'DAPA',
			'DAO',
			'EFMP',
			'EIWS',
			'ESO',
			'FAP',
			'LEGAL',
			'Muster',
			'MWR Rep',
			'SAPR',
			'SPC',
			'Enlisted Sponsorship',
			'Officer Sponsorship',
			'SWO',
			'Training'
		],
		selectedArray: []
	};

	$scope.loadDiversityObject = function()
	{
		// $scope.alphaInitialArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "V", "W", "Y", "Z"]
		$scope.diversityObject = savedDiversityObject;
	}

	$scope.logDiversityObject = function()
	{
		console.log(JSON.stringify($scope.diversityObject));
	};

	$scope.mergeDiversityData = function()
	{
		if ( $scope.diversityObject )
		{
			delete $scope.diversityObject
		}
		$scope.diversityObject = {};
		$scope.diversityObject.recordCount = 0;

		$scope.departmentArray.forEach(dept => {
			$scope.leadershipRoleOptions.push({
				longTitle: dept + ' Department Head',
				shortTitle: dept + ' DH',
			});

			$scope.leadershipRoleOptions.push({
				longTitle: dept + ' Leading Chief Petty Officer',
				shortTitle: dept + ' DLCPO',
			});

			$scope.leadershipRoleOptions.push({
				longTitle: dept + ' Leading Petty Officer',
				shortTitle: dept + ' DLPO',
			});
		});
		
		$scope.alphaInitialArray.forEach(initial => {
			
			$scope.alphaObject[initial].forEach(alphaRecord => {
				// console.log('working: ' + alphaRecord.lastName);
				var diversityRecord = {};
				
				if (!$scope.diversityObject[alphaRecord.lastInitial])
				{
					$scope.diversityObject[alphaRecord.lastInitial] = new Array;
				}
				
				diversityRecord.dept = alphaRecord.dept;
				diversityRecord.rateRank = alphaRecord.rateRank;
				diversityRecord.paygrade = alphaRecord.paygrade;
				diversityRecord.lastInitial = alphaRecord.lastInitial;
				diversityRecord.lastName = alphaRecord.lastName;
				diversityRecord.firstName = alphaRecord.firstName;
				

				$scope.fltmpsObject[alphaRecord.lastInitial].forEach(fltmpsRecord => {
					if ( alphaRecord.lastName.trim() == fltmpsRecord.lastName &&
						 alphaRecord.firstName.trim() == fltmpsRecord.firstName)
					{
						diversityRecord.uic = fltmpsRecord.uic
						diversityRecord.diversityGroup = fltmpsRecord.diversityGroup
						diversityRecord.genderGroup = fltmpsRecord.genderGroup
						diversityRecord.merged = true;
						
						$scope.diversityObject[alphaRecord.lastInitial].push(diversityRecord);
						$scope.diversityObject.recordCount += 1;
						return;
					}
				});

				if ( !diversityRecord.merged )
				{
					diversityRecord.merged = false;
					$scope.diversityObject[alphaRecord.lastInitial].push(diversityRecord)
					$scope.diversityObject.recordCount += 1;
				}
				
				//  console.log(diversityRecord);

				
			});
		});
	};


	$scope.removeDiversityEntry = function (lastInitial, record) {
		var index = $scope.getTrueIndex('diversityObject', lastInitial, record);

		$scope.diversityObject[lastInitial].splice(index, 1);
		$scope.diversityObject.recordCount -= 1;
	}


	$scope.validateDiversityRecord = function(lastInitial, record)
	{
		var index = $scope.getTrueIndex('diversityObject', lastInitial, record);

		if ($scope.diversityObject[lastInitial][index].merged) {
			return;
		}

		if ( $scope.diversityObject[lastInitial][index].genderGroup &&
			 $scope.diversityObject[lastInitial][index].diversityGroup &&
			 $scope.diversityObject[lastInitial][index].uic)
		{
			$scope.diversityObject[lastInitial][index].merged = true;
			return;
		}
	}


	$scope.clearLeadershipRole = function(lastInitial, record)
	{
		var index = $scope.getTrueIndex('diversityObject', lastInitial, record);

		delete $scope.diversityObject[lastInitial][index].leadershipRole;
	};


	$scope.setDiversityUnmergedFilter = function () {
		$scope.filterDiversityUnmerged = !$scope.filterDiversityUnmerged;
	};


	$scope.diversityFilter = function (item) {
		var filteredStatus = false;

		if ( !$scope.filterDiversityNameText &&
			 !$scope.filterDiversityUnmerged ) {
			item.lastNameSearchMatch = false;
			item.firstNameSearchMatch = false;
			item.unmergedMatch = false
			return true;
		}
		else
		{
			if ($scope.filterDiversityNameText && item.lastName.includes($scope.filterDiversityNameText.toUpperCase()))
			{ filteredStatus = true; item.lastNameSearchMatch = true; }
			else { item.lastNameSearchMatch = false; }

			if ($scope.filterDiversityNameText && item.firstName.includes($scope.filterDiversityNameText.toUpperCase()))
			{ filteredStatus = true; item.firstNameSearchMatch = true; }
			else { item.firstNameSearchMatch = false; }

			if ( $scope.filterDiversityUnmerged && item.merged == false )
			{
				filteredStatus = true; item.unmergedMatch = true;
			}
			else
			{
				item.unmergedMatch = false;
			}
		}
		
		return filteredStatus;
	};


	$scope.openDiversityCollDialog = function (lastInitial, record) {
		var index = $scope.getTrueIndex('diversityObject', lastInitial, record);
		console.log('opening diversity collateral dialog: ' + lastInitial + ' ' + index);

		$scope.openDiversityCollDialog.lastInitial = lastInitial;
		$scope.openDiversityCollDialog.index = index;

		$scope.EditDiversityCollObject.memberRateRank = $scope.diversityObject[lastInitial][index].rateRank;
		$scope.EditDiversityCollObject.memberLastName = $scope.diversityObject[lastInitial][index].lastName;
		$scope.EditDiversityCollObject.memberfirstName = $scope.diversityObject[lastInitial][index].firstName;

		if ($scope.diversityObject[lastInitial][index].collateralDuties)
		{
			console.log('item has collateral duties present');
			$scope.EditDiversityCollObject.selectedArray = angular.copy($scope.diversityObject[lastInitial][index].collateralDuties);
		}

		$scope.EditDiversityCollObject.displayDialog = true;
	};
	

	$scope.addDiversityCollDuty = function()
	{
		$scope.EditDiversityCollObject.selectedArray.push({collateralLevel: '', collateralTitle: ''})
	};

	$scope.removeDiversityCollDuty = function(index)
	{
		$scope.EditDiversityCollObject.selectedArray.splice(index, 1);
	};

	$scope.setDiversityCollDuty = function()
	{
		console.log('passing lastInitial, index to merge as: ' + $scope.openDiversityCollDialog.lastInitial + ' ' + $scope.openDiversityCollDialog.index);
		var missingFields = false;
		var lastInitial = $scope.openDiversityCollDialog.lastInitial
		var index = $scope.openDiversityCollDialog.index
		var selectedCollateralDuties = $scope.EditDiversityCollObject.selectedArray;

		if ($scope.EditDiversityCollObject.selectedArray.length == 0 )
		{
			console.log('no duty added; clearing diversityobject collateral duties');
			delete $scope.diversityObject[lastInitial][index].collateralDuties;
			$scope.CloseDiversityCollDialog();
			return;
		}

		$scope.EditDiversityCollObject.selectedArray.forEach(field => {

			if ( !field.collateralLevel || !field.collateralTitle )
			{
				missingFields = true;
			}
		});
		console.log('about to set vars and exit');
		
		if ( missingFields )
		{
			console.log('field not set; returning');
			return;
		}

		$scope.diversityObject[lastInitial][index].collateralDuties = selectedCollateralDuties;
		$scope.CloseDiversityCollDialog();
	}
	
	$scope.CloseDiversityCollDialog = function() {
		console.log('closing diversity collateral dialog');

		$scope.EditDiversityCollObject.selectedArray = [];
		$scope.openDiversityCollDialog.lastInitial = null;
		$scope.openDiversityCollDialog.index = null;
		$scope.EditDiversityCollObject.displayDialog = false;
		$scope.EditDiversityCollObject.memberRateRank = false;
		$scope.EditDiversityCollObject.memberLastName = false;
		$scope.EditDiversityCollObject.memberfirstName = false;
	};




	//┌──────────────────────────────────────┐
	//│ Diversity Report | Vars & Functions  │
	//└──────────────────────────────────────┘
	$scope.fiscalQuarters = [1, 2, 3, 4];
	$scope.report = {
		commandAcronym: 'CWA-66',
		fiscalYear: new Date().getFullYear()
	};
	$scope.chartColors = ['#97bbcd', '#dcdcdc', '#edb96a', '#979eaf', '#d1f9cc', '#ff94f8', '#f2f2f2', '#f2836b', '#bcf6f6', '#edb9e2', '#f2e1ac', '#beeb9f', '#e8b3bf', '#ffe2c3', '#adecff', '#e2f315', '#bdd684', '#ffc4d0', '#cdd5c6'];
	$scope.pieceLabelOptions = {
		pieceLabel: {
			render: 'label',
			fontColor: '#000',
			fontSize: '10',
			position: 'outside',
			outsidePadding: 4,
			textMargin: 4,
			segment: true,
			fontFamily: 'Segoe UI Light'
		}
	}
	$scope.mapRecord = {
		byRace: 'diversityGroup',
		bySex: 'genderGroup',
		byPaygrade: 'paygrade'
	}
	
	$scope.testChart = {
		type: 'pie',
		labels: ['BLACK OR AFRICAN AMERICAN, 32, 10%', 'AMERICAN INDIAN OR ALASKA NATIVE, 4, 1%', 'NATIVE HAWAIIAN OR OTHER PACIFIC ISLANDER, 2, 1%'],
		data: [1, 2, 7],
		options: {
			pieceLabel: {
				render: 'label',
				fontColor: '#000',
				fontSize: '10',
				position: 'outside',
				segment: true
			}
		},
		legendColors: ['#97bbcd', '#dcdcdc', '#edb96a']
	};


	$scope.chartObject = {
		allHands: {
			byRace: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			bySex: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			byPaygrade: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			}
		},
		cmdTriad: {
			byRace: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			bySex: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			byPaygrade: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			}
		},
		deptHead: {
			byRace: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			bySex: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			byPaygrade: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			}
		},
		deptLCPO: {
			byRace: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			bySex: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			byPaygrade: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			}
		},
		deptLPO: {
			byRace: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			bySex: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			byPaygrade: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			}
		},
		cmdColl: {
			byRace: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			bySex: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			byPaygrade: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			}
		},
		cbDeptColl: {
			byRace: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			bySex: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			byPaygrade: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			}
		},
		cgDeptColl: {
			byRace: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			bySex: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			byPaygrade: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			}
		},
		csaDeptColl: {
			byRace: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			bySex: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			byPaygrade: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			}
		},
		rdnsDeptColl: {
			byRace: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			bySex: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			byPaygrade: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			}
		},
		rfoDeptColl: {
			byRace: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			bySex: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			byPaygrade: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			}
		},
		cmdDeptCC: {
			byRace: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			bySex: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			byPaygrade: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			}
		},
		cmdDeptCFL: {
			byRace: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			bySex: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			byPaygrade: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			}
		},
		cmdDeptCFS: {
			byRace: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			bySex: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			},
			byPaygrade: {
				labels: [],
				data: [],
				legendColors: [],
				options: $scope.pieceLabelOptions
			}
		}
	}


	$scope.setChartLabel = function(chartobj, byTrait)
	{	
		var dataTotal = 0;

		$scope.chartObject[chartobj][byTrait].data.forEach(datum => {
			dataTotal += datum;
		});

		console.log(dataTotal);

		$scope.chartObject[chartobj][byTrait].labels.forEach(label => {
			var index = $scope.chartObject[chartobj][byTrait].labels.indexOf(label);
			var labelTotal = $scope.chartObject[chartobj][byTrait].data[index];
			var labelAvg = Math.floor( (labelTotal / dataTotal) * 100 );

			var compiledLabel = label + ', ' + labelTotal + ', ' + labelAvg + '%';
			$scope.chartObject[chartobj][byTrait].labels[index] = compiledLabel;
		});
	};


	$scope.getAllChartData = function(chartObj, byTrait)
	{
		console.log('firing getChartData()');

		var trait = $scope.mapRecord[byTrait];
		console.log(trait);

		$scope.alphaInitialArray.forEach(initial => {
			$scope.diversityObject[initial].forEach(record => {
				
				if ( !$scope.chartObject[chartObj][byTrait].labels.includes(record[trait]) )
				{
					$scope.chartObject[chartObj][byTrait].labels.push(record[trait]);
					var index = $scope.chartObject[chartObj][byTrait].labels.indexOf(record[trait])
					$scope.chartObject[chartObj][byTrait].data.push(1);
					$scope.chartObject[chartObj][byTrait].legendColors.push($scope.chartColors[index]);
					return;
				}

				if ( $scope.chartObject[chartObj][byTrait].labels.includes(record[trait]) )
				{
					var index = $scope.chartObject[chartObj][byTrait].labels.indexOf(record[trait]);
					$scope.chartObject[chartObj][byTrait].data[index] += 1;
				}
			});
		});

		console.log($scope.chartObject[chartObj][byTrait]);
		$scope.setChartLabel(chartObj, byTrait);
	};


	$scope.getRoleChartData = function (chartObj, byTrait, role) {
		console.log('firing getRoleChartData()');

		var trait = $scope.mapRecord[byTrait];
		console.log(trait);
		
		
		$scope.alphaInitialArray.forEach(initial => {
			$scope.diversityObject[initial].forEach(record => {
				if ( !record.leadershipRole )
				{
					return;
				}

				if ( !record.leadershipRole.shortTitle.includes(role) )
				{
					return;
				}

				if (!$scope.chartObject[chartObj][byTrait].labels.includes(record[trait])) {
					$scope.chartObject[chartObj][byTrait].labels.push(record[trait]);
					var index = $scope.chartObject[chartObj][byTrait].labels.indexOf(record[trait])
					$scope.chartObject[chartObj][byTrait].data.push(1);
					$scope.chartObject[chartObj][byTrait].legendColors.push($scope.chartColors[index]);
					return;
				}

				if ($scope.chartObject[chartObj][byTrait].labels.includes(record[trait])) {
					var index = $scope.chartObject[chartObj][byTrait].labels.indexOf(record[trait]);
					$scope.chartObject[chartObj][byTrait].data[index] += 1;
				}
			});
		});

		console.log($scope.chartObject[chartObj][byTrait]);
		$scope.setChartLabel(chartObj, byTrait);
	};


	$scope.getCollLevelChartData = function (chartObj, byTrait, level) {
		console.log('firing getRoleChartData()');

		var trait = $scope.mapRecord[byTrait];
		console.log(trait);


		$scope.alphaInitialArray.forEach(initial => {
			$scope.diversityObject[initial].forEach(record => {
				if (!record.collateralDuties) {
					return;
				}

				var limitMet = false;
				record.collateralDuties.forEach(duty => {
					if (duty.collateralLevel == level)
					{	
						if (limitMet)
						{
							return;
						}
						limitMet = true;
						if (!$scope.chartObject[chartObj][byTrait].labels.includes(record[trait])) {
							$scope.chartObject[chartObj][byTrait].labels.push(record[trait]);
							var index = $scope.chartObject[chartObj][byTrait].labels.indexOf(record[trait])
							$scope.chartObject[chartObj][byTrait].data.push(1);
							$scope.chartObject[chartObj][byTrait].legendColors.push($scope.chartColors[index]);
							return;
						}

						if ($scope.chartObject[chartObj][byTrait].labels.includes(record[trait])) {
							var index = $scope.chartObject[chartObj][byTrait].labels.indexOf(record[trait]);
							$scope.chartObject[chartObj][byTrait].data[index] += 1;
						}

						if (limitMet)
						{
							return;
						}
					}
				});
			});
		});

		console.log($scope.chartObject[chartObj][byTrait]);
		$scope.setChartLabel(chartObj, byTrait);
	};


	$scope.getCollRoleChartData = function (chartObj, byTrait, role) {
		var trait = $scope.mapRecord[byTrait];
		console.log(trait);


		$scope.alphaInitialArray.forEach(initial => {
			$scope.diversityObject[initial].forEach(record => {
				if (!record.collateralDuties) {
					return;
				}

				var limitMet = false;
				record.collateralDuties.forEach(duty => {
					if (duty.collateralTitle == role)
					{	
						if (limitMet)
						{
							return;
						}
						limitMet = true;
						if (!$scope.chartObject[chartObj][byTrait].labels.includes(record[trait])) {
							$scope.chartObject[chartObj][byTrait].labels.push(record[trait]);
							var index = $scope.chartObject[chartObj][byTrait].labels.indexOf(record[trait])
							$scope.chartObject[chartObj][byTrait].data.push(1);
							$scope.chartObject[chartObj][byTrait].legendColors.push($scope.chartColors[index]);
							return;
						}

						if ($scope.chartObject[chartObj][byTrait].labels.includes(record[trait])) {
							var index = $scope.chartObject[chartObj][byTrait].labels.indexOf(record[trait]);
							$scope.chartObject[chartObj][byTrait].data[index] += 1;
						}

						if (limitMet)
						{
							return;
						}
					}
				});
			});
		});

		console.log($scope.chartObject[chartObj][byTrait]);
		$scope.setChartLabel(chartObj, byTrait);
	};
});