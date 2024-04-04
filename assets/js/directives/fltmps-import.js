var app = angular.module('fltmps-import', []);

app.directive('fltmpsReader', function ()
{
    return {
        scope:
        {
            fltmpsObject: "=fltmpsObject",
            fltmpsInitialArray: "=fltmpsInitialArray",
            fltmpsDiversityGroupArray: "=fltmpsDiversityGroupArray",
            fltmpsUicArray: "=fltmpsUicArray"
        },
        link: function (scope, element)
        {
            element.on('change', function (changeEvent)
            {
                var files = changeEvent.target.files;
                var localFltmpsObject = {};
                var localFltmpsObject = { recordCount: 0 };
                var localFltmpsInitialArray = [];
                var localfltmpsDiversityGroupArray = [];
                var localFltmpsUICArray = [];
                
                if (files.length)
                {
                    
                    var uicList = [];
                    var uic = '';
                    var diversityGroup = '';
                    var genderGroup = '';

                    for (const [index, [key, value]] of Object.entries(Object.entries(files)))
                    {
                        uic = value.name.match(/\d{5}\b/g)[0];
                        uicList.push(uic);
                        var r = new FileReader();

                        r.onload = function (value)
                        {
                            var contents = value.target.result.split('\n');
                            contents.forEach(fltmpsRecord =>
                            {
                                
                                fltmpsRecord = fltmpsRecord.replaceAll('"', '');
                                fltmpsRecord = fltmpsRecord.trim();
                                fltmpsSailor = {};
                                rate = '';
                                fullName = '';
                                lastName = '';
                                firstName = '';
                                lastInitial = '';
                                
                                if (fltmpsRecord.includes("No Data Found")) { return; }
                                if (fltmpsRecord.includes("For Official Use Only")) { return; }
                                if (fltmpsRecord.includes("Rate,Name")) { return; }
                                if (!fltmpsRecord || fltmpsRecord.length <= 0) { return; }
                                
                                if (fltmpsRecord.includes("Diversity Grouping") )
                                {
                                    fltmpsRecord = fltmpsRecord.split(',')[0];
                                    diversityGroup = fltmpsRecord.split(': ')[1];
                                    return;
                                }

                                if (fltmpsRecord.includes("Gender:"))
                                {
                                    fltmpsRecord = fltmpsRecord.split(';')[0];
                                    genderGroup = fltmpsRecord.split(': ')[1];
                                    return;
                                }
                                
                                if ( fltmpsRecord )
                                {
                                    fltmpsRecord = fltmpsRecord.split(',');
                                    fullName = fltmpsRecord[1].split(' ');
                                    rankRate = fltmpsRecord[0];
                                    lastName = fullName[0];
                                    lastInitial = lastName[0];
                                    firstName = fullName[1];
                                }

                                if ( !localFltmpsObject[lastInitial] )
                                {
                                    localFltmpsObject[lastInitial] = new Array;
                                }

                                if (localFltmpsInitialArray.indexOf(lastInitial) < 0) {
                                    localFltmpsInitialArray.push(lastInitial);
                                }

                                var recordObject = {
                                    "rankRate": rankRate,
                                    "lastName": lastName,
                                    "firstName": firstName,
                                    "uic": uicList[index],
                                    "diversityGroup": diversityGroup,
                                    "genderGroup": genderGroup
                                };

                                if ( !localfltmpsDiversityGroupArray.includes(diversityGroup) )
                                {
                                    localfltmpsDiversityGroupArray.push(diversityGroup);
                                }
                                
                                if (!localFltmpsUICArray.includes(uicList[index]) )
                                {
                                    localFltmpsUICArray.push(uicList[index]);
                                }

                                localFltmpsObject[lastInitial].push(recordObject);
                                localFltmpsObject.recordCount += 1;
                                
                            }); // END contents.forEach
                            
                            localFltmpsInitialArray.sort();
                            
                        }; // END r.onload
                        
                        r.readAsText(files[index]);

                    } // END for (const [index, [key, value]] of Object.entries(Object.entries(files)))

                }; // END if (files.length)
                
                scope.$apply(function ()
                {
                    scope.fltmpsObject = localFltmpsObject;
                    scope.fltmpsInitialArray = localFltmpsInitialArray;
                    scope.fltmpsDiversityGroupArray = localfltmpsDiversityGroupArray;
                    scope.fltmpsUicArray = localFltmpsUICArray;
                }); // END scope.$apply
                
            }); // END element.on('change')

        } // END link

    }; // END return

});