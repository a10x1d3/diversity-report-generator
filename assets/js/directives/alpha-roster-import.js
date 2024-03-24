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
                var pgArray = [
                    { rateRank: 'ENS',   paygrade: 'O-1' }, { rateRank: 'LTJG',  paygrade: 'O-2' }, { rateRank: 'LT',    paygrade: 'O-3' },
                    { rateRank: 'LCDR',  paygrade: 'O-4' }, { rateRank: 'CDR',   paygrade: 'O-5' },
                    { rateRank: 'CWTSR', paygrade: 'E-1' }, { rateRank: 'CWTSA', paygrade: 'E-2' }, { rateRank: 'CWTSN', paygrade: 'E-3' },
                    { rateRank: 'CWT3',  paygrade: 'E-4' }, { rateRank: 'CWT2',  paygrade: 'E-5' }, { rateRank: 'CWT1',  paygrade: 'E-6' },
                    { rateRank: 'CWTC',  paygrade: 'E-7' }, { rateRank: 'CWTCS', paygrade: 'E-8' }, { rateRank: 'CWTCM', paygrade: 'E-9' },
                    { rateRank: 'CTRSR', paygrade: 'E-1' }, { rateRank: 'CTRSA', paygrade: 'E-2' }, { rateRank: 'CTRSN', paygrade: 'E-3' },
                    { rateRank: 'CTR3',  paygrade: 'E-4' }, { rateRank: 'CTR2',  paygrade: 'E-5' }, { rateRank: 'CTR1',  paygrade: 'E-6' },
                    { rateRank: 'CTRC',  paygrade: 'E-7' }, { rateRank: 'CTRCS', paygrade: 'E-8' }, { rateRank: 'CTRCM', paygrade: 'E-9' },
                    { rateRank: 'CTMSR', paygrade: 'E-1' }, { rateRank: 'CTMSA', paygrade: 'E-2' }, { rateRank: 'CTMSN', paygrade: 'E-3' },
                    { rateRank: 'CTM3',  paygrade: 'E-4' }, { rateRank: 'CTM2',  paygrade: 'E-5' }, { rateRank: 'CTM1',  paygrade: 'E-6' },
                    { rateRank: 'CTMC',  paygrade: 'E-7' }, { rateRank: 'CTMCS', paygrade: 'E-8' }, { rateRank: 'CTMCM', paygrade: 'E-9' },
                    { rateRank: 'ITSR',  paygrade: 'E-1' }, { rateRank: 'ITSA',  paygrade: 'E-2' }, { rateRank: 'ITSN',  paygrade: 'E-3' },
                    { rateRank: 'IT3',   paygrade: 'E-4' }, { rateRank: 'IT2',   paygrade: 'E-5' }, { rateRank: 'IT1',   paygrade: 'E-6' },
                    { rateRank: 'ITC',   paygrade: 'E-7' }, { rateRank: 'ITCS',  paygrade: 'E-8' }, { rateRank: 'ITCM',  paygrade: 'E-9' },
                    { rateRank: 'YNSR',  paygrade: 'E-1' }, { rateRank: 'YNSA',  paygrade: 'E-2' }, { rateRank: 'YNSN',  paygrade: 'E-3' },
                    { rateRank: 'YN3',   paygrade: 'E-4' }, { rateRank: 'YN2',   paygrade: 'E-5' }, { rateRank: 'YN1',   paygrade: 'E-6' },
                    { rateRank: 'YNC',   paygrade: 'E-7' }, { rateRank: 'YNCS',  paygrade: 'E-8' }, { rateRank: 'YNCM',  paygrade: 'E-9' },
                    { rateRank: 'CTTSR', paygrade: 'E-1' }, { rateRank: 'CTTSA', paygrade: 'E-2' }, { rateRank: 'CTTSN', paygrade: 'E-3' },
                    { rateRank: 'CTT3',  paygrade: 'E-4' }, { rateRank: 'CTT2',  paygrade: 'E-5' }, { rateRank: 'CTT1',  paygrade: 'E-6' },
                    { rateRank: 'CTTC',  paygrade: 'E-7' }, { rateRank: 'CTTCS', paygrade: 'E-8' }, { rateRank: 'CTTCM', paygrade: 'E-9' },
                    { rateRank: 'CWO-1', paygrade: 'W-1' }, { rateRank: 'CWO-2', paygrade: 'W-2' }, { rateRank: 'CWO-3', paygrade: 'W-3' },
                    { rateRank: 'CWO-4', paygrade: 'W-4' }, { rateRank: 'CWO-5', paygrade: 'W-5' }
                ];
            
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
                                var paygrade = ''
                                var missingPaygrade = true;

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
                                
                                pgArray.forEach(pg => {
                                    if ( rateRank.includes('LCDR') )
                                    {
                                        paygrade = 'O-4';
                                        missingPaygrade = false;
                                    }
                                    else if ( rateRank.includes('LTJG') )
                                    {
                                        paygrade = 'O-2';
                                        missingPaygrade = false;
                                    }
                                    else if ( rateRank.includes(pg.rateRank) )
                                    {
                                        paygrade = pg.paygrade;
                                        missingPaygrade = false;
                                    }

                                    if ( !missingPaygrade )
                                    {
                                        return;
                                    }
                                });
                                
                                var recordObject = {
                                        "dept": dept,
                                        "rateRank": rateRank,
                                        "lastInitial": lastInitial,
                                        "lastName": lastName,
                                        "firstName": firstName,
                                        "paygrade": paygrade,
                                        "missingPaygrade": missingPaygrade,
                                        "match": false
                                }
                                
                                if (missingPaygrade) { console.log(recordObject); }

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