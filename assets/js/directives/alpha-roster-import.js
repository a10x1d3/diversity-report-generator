// Reference
// https://jsfiddle.net/maxisam/QrCXh/

var app = angular.module('alpha-roster-import', []);

app.directive('alphaReader', function ()
{
    return {
        scope:
        {
            alphaObject: "=alphaObject",
            alphaInitialArray: "=alphaInitialArray",
            departmentArray: "=departmentArray"
        },
        link: function (scope, element)
        {
            element.on('change', function (changeEvent)
            {
                var files = changeEvent.target.files;
                // console.log(files);

                var localAlphaObject = { recordCount: 0 };
                var localAlphaInitialArray = [];
            
                if (files.length)
                {
                    var r = new FileReader();
                    r.onload = function (e)
                    {
                        var contents = e.target.result.split('\n');
                        
                        scope.$apply(function ()
                        {
                            var localAlphaArray = [];
                            var localDepartmentArray = [];

                            contents.forEach(sailor => {
                                var dept = '';
                                var rateRank = '';
                                var lastInitial = '';
                                var lastName = '';
                                var firstName = '';

                                if ( sailor.includes('\r') )
                                {
                                    sailor = sailor.replace('\r', '');
                                }

                                
                                sailor = sailor.split(',');
                                dept = sailor[0].trim();
                                rateRank = sailor[1].trim();
                                lastInitial = sailor[2][0];
                                lastName = sailor[2].toUpperCase().trim();
                                firstName = sailor[3].toUpperCase().trim();

                                var recordObject = {
                                        "dept": dept,
                                        "rateRank": rateRank,
                                        "lastInitial": lastInitial,
                                        "lastName": lastName,
                                        "firstName": firstName,
                                        "match": false
                                }

                                if ( !localAlphaObject[lastInitial] )
                                {
                                    localAlphaObject[lastInitial] = new Array;
                                }
                                localAlphaObject[lastInitial].push(recordObject);
                                localAlphaObject.recordCount += 1;

                                if ( localAlphaInitialArray.indexOf(lastInitial) < 0 )
                                {
                                    localAlphaInitialArray.push(lastInitial);
                                }
                                    
                                if (localDepartmentArray.indexOf(sailor[0]) < 0)
                                {
                                    localDepartmentArray.push(sailor[0]);
                                }


                            });

                            localAlphaInitialArray.sort();

                            function byLastName(lastNameA, lastNameB)
                            {
                                if (lastNameA.lastName < lastNameB.lastName) {
                                    return -1;
                                }
                                if (lastNameA.lastName > lastNameB.lastName) {
                                    return 1;
                                }
                                return 0;
                            }

                            localAlphaInitialArray.forEach(initial => {
                                localAlphaObject[initial].sort(byLastName);
                            });

                            scope.alphaInitialArray = localAlphaInitialArray;
                            scope.alphaObject = localAlphaObject;
                            scope.departmentArray = localDepartmentArray.sort();
                            
                        });
                    };

                    r.readAsText(files[0]);
                }
            });
        }
    };
});