var app = angular.module('diversity-object-import', []);

app.directive('diversityReader', function ()
{
    return {
        scope:
        {
            diversityObject: "=diversityObject"
        },
        link: function (scope, element)
        {
            element.on('change', function (changeEvent)
            {
                var files = changeEvent.target.files;
            
                if (files.length)
                {
                    var r = new FileReader();
                    r.onload = function (e)
                    {
                        var contents = e.target.result.split('\n');
                        
                        scope.$apply(function ()
                        {
                            scope.diversityObject = JSON.parse(contents[0]);
                        });
                    };

                    r.readAsText(files[0]);
                }
            });
        }
    };
});