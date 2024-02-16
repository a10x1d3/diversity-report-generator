// Reference
// https://jsfiddle.net/maxisam/QrCXh/

var app = angular.module('alpha-roster-import', []);

app.directive('alphaReader', function ()
{
    return {
        scope:
        {
            alphaArray: "=alphaArray",
            departmentArray: "=departmentArray"
        },
        link: function (scope, element)
        {
            element.on('change', function (changeEvent)
            {
                var files = changeEvent.target.files;
                // console.log(files);
                
            
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
                                
                                if ( sailor.includes('\r') )
                                {
                                    sailor = sailor.replace('\r', '');
                                }

                                
                                sailor = sailor.split(',');
                                localAlphaArray.push(
                                    {
                                        "dept": sailor[0],
                                        "rateRank": sailor[1],
                                        "lastInitial": sailor[2][0],
                                        "lastName": sailor[2].toUpperCase(),
                                        "firstName": sailor[3].toUpperCase()
                                    }
                                    );
                                    
                                    if (localDepartmentArray.indexOf(sailor[0]) < 0)
                                    {
                                        
                                        console.log('hit index of: ' + localDepartmentArray.indexOf(sailor[0]));
                                        localDepartmentArray.push(sailor[0]);
                                    }

                                // console.log('localDeptArray' + localDepartmentArray + 'with dept:' + sailor[0]);
                                // console.log('running');

                            });
                            
                            localAlphaArray.sort((a, b) => (a.lastName > b.lastName) ? 1 : ((b.lastName > a.lastName) ? -1 : 0))
                            scope.alphaArray = localAlphaArray;
                            scope.departmentArray = localDepartmentArray;
                            console.log(scope.alphaArray);
                        });
                    };

                    r.readAsText(files[0]);
                }
            });
        }
    };
});