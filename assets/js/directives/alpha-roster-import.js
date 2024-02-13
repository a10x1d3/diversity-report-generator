// Reference
// https://jsfiddle.net/maxisam/QrCXh/

var app = angular.module('alpha-roster-import', []);

app.directive('alphaReader', function ()
{
    return {
        scope:
        {
            fileReader: "=alphaFileReader",
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
                            var alphaRoster = [];
                            console.log(typeof (alphaRoster));
                            contents.forEach(sailor => {
                                // console.log(sailor);

                                if ( sailor.includes('\r') )
                                {
                                    sailor = sailor.replace('\r', '');
                                }


                                sailor = sailor.split(',');
                                alphaRoster.push(
                                    {
                                        "dept": sailor[0],
                                        "rateRank": sailor[1],
                                        "lastInitial": sailor[2][0],
                                        "lastName": sailor[2].toUpperCase(),
                                        "firstName": sailor[3].toUpperCase()
                                    }
                                );
                            });
                            alphaRoster.sort((a, b) => (a.lastName > b.lastName) ? 1 : ((b.lastName > a.lastName) ? -1 : 0))
                            scope.fileReader = alphaRoster;
                            console.log(scope.fileReader);
                        });
                    };

                    r.readAsText(files[0]);
                }
            });
        }
    };
});