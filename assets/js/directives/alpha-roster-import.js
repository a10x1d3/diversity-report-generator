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
                                dept = sailor[0];
                                rateRank = sailor[1];
                                lastInitial = sailor[2][0];
                                lastName = sailor[2].toUpperCase();
                                firstName = sailor[3].toUpperCase();

                                var recordObject = {
                                        "dept": dept,
                                        "rateRank": rateRank,
                                        "lastInitial": lastInitial,
                                        "lastName": lastName,
                                        "firstName": firstName
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
                            scope.alphaInitialArray = localAlphaInitialArray;
                            scope.alphaObject = localAlphaObject;
                            scope.departmentArray = localDepartmentArray;
                            
                        });
                    };

                    r.readAsText(files[0]);
                }
            });
        }
    };
});