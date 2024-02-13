// Reference
// https://jsfiddle.net/maxisam/QrCXh/

var app = angular.module('fltmps-import', []);

app.directive('fltmpsReader', function ()
{
    return {
        scope:
        {
            fltmpsObject: "=fltmpsObject",
            fltmpsArray: "=fltmpsArray"
        },
        link: function (scope, element)
        {
            element.on('change', function (changeEvent)
            {
                var files = changeEvent.target.files;
                // console.log(files);

                var localFltmpsObject = {};
                var localFltmpsArray = [];
                
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
                            // console.log("Current UIC: " + uicList[index]);
                            
                            var contents = value.target.result.split('\n');
                            contents.forEach(fltmpsRecord =>
                            {
                                
                                fltmpsRecord = fltmpsRecord.replaceAll('"', '');
                                fltmpsSailor = {};
                                rate = '';
                                fullName = '';
                                lastName = '';
                                firstName = '';
                                lastInitial = '';
                                
                                if (fltmpsRecord.includes("No Data Found")) { return; }
                                if (fltmpsRecord.includes("For Official Use Only")) { return; }
                                if (fltmpsRecord.includes("Rate,Name,Projected Gain Date")) { return; }
                                if (!fltmpsRecord) { return; }
                                
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

                                var recordObject = {
                                    "rankRate": rankRate,
                                    "lastName": lastName,
                                    "firstName": firstName,
                                    "uic": uicList[index],
                                    "diversityGroup": diversityGroup,
                                    "genderGroup": genderGroup
                                };

                                localFltmpsObject[lastInitial].push(recordObject);
                                localFltmpsArray.push(recordObject);
                                
                            }); // END contents.forEach

                        }; // END r.onload

                        r.readAsText(files[index]);
                        console.log(localFltmpsObject);
                    
                    } // END for (const [index, [key, value]] of Object.entries(Object.entries(files)))

                }; // END if (files.length)
                
                scope.$apply(function ()
                {
                    scope.fltmpsObject = localFltmpsObject;
                    scope.fltmpsArray = localFltmpsArray;
                }); // END scope.$apply
                
            }); // END element.on('change')

        } // END link

    }; // END return

});