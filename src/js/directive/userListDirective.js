/*
    ==========example====================

*/
module.exports = function ($rootScope, testSrv) {
    return {
        restrict: 'E',
        templateUrl: ('public/template/user_list.html'),
        replace: true,
        scope: {
            // users: "=",
            title: "@",
            platform: "@",
            query: "=",
            pnscope: "@",
            noPop: "@"
        },
        link: function (scope, e, a) {
            scope.onClick = function (userid) {
                if (a.noPop === undefined) {
                    var param = {
                        platform: scope.platform,
                        topic: scope.query.topic,
                        userid: userid,
                        pnscope: scope.pnscope 
                    }
                    $rootScope.popSubWin({
                        fn: 'getVoCDetailsByUser',
                        param: param
                    });
                }
            }
            scope.getData = function (location, force) {
                if (location == 'home') {
                    testSrv.getUser(scope.platform, 5, scope.query.topic, scope.pnscope).then(function (data) {
                        scope.users = data.slice(0, 5);
                        scope.complete = true;
                    })
                }
            }
            scope.getData('', true);
            scope.$on('start-get-data', function (event, arg) {
                scope.getData(arg);
            });

            scope.$on('set-user-data', function (event, arg) {
                if (a.location == 'sub') {
                    scope.users = arg;
                    scope.complete = true;
                }
            });

        }
    }
}