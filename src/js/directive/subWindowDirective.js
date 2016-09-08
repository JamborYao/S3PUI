/*
    ==========example====================

*/
module.exports = function ($rootScope,testSrv) {
    return{
        restrict: 'E',
        templateUrl: ('public/template/sub_window.html'),
        replace: true,
        scope: {
            // users: "=",
            title : "@",
            platform: "@",
            query:"="
        },
        link:function(scope,e,a){
            testSrv.getSubWindow().then(function(data){
                scope.raw = data;
                scope.topUsers = data.topusers
            })
        }
    }
}

function initHourlyChartData(raw) {

}