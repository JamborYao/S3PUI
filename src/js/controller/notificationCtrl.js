module.exports = function ($scope, $location, $timeout, $filter, $http, $sce, $rootScope, CONST) {
    // var moment = require('moment');
    // var socket = new WebSocket("ws://10.168.176.18/api/SystemDetected/");
    // $scope.Notifications = Notifications; //{date: "12/01/2016", dataSource: "su", messageType: 4, link: "somelink"}
    // $scope.Notifications.clearUnRead();
    // socket.addEventListener('message',function(m){
    //     // console.log(JSON.parse(m.data))
    //     $scope.$apply($scope.notifications.push(JSON.parse(m.data)));
    // })
    // console.log($scope.CONST.MESSAGE_TYPES);
    $scope.search = {
            datasource: 'all',
            messagetype: 'all',
            bgTime: $filter('date')((function (d) {
                d.setDate(d.getDate() - 1);
                return d
            })(new Date), 'yyyy-MM-dd'),
            egTime: $filter('date')(new Date(), 'yyyy-MM-dd'),
            downloadable: 'all'
        }
        // $scope.date = $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.selectPlatform = function (platform) {
        $scope.selectedPlatform = platform;
        $scope.$broadcast('admin-select-platform', platform)
    }
    $scope.collections = function () {
        return $scope.Notifications.collection.splice(0);
    }();
    $scope.$watch('Notifications.collection', function (newV, oldV) {
        if (newV.length) {
            $scope.collections.push($scope.Notifications.collection.pop());
        }
    }, true)
    // $scope.$watch('search', function (newV, oldV) {
    //     $scope.listNotification();
    // }, true)
    $scope.getPlatforms = function () {
        //simulate api calling
        $timeout(function () {
            // $scope.platforms = [{
            //     key: 'twitter',
            //     name: 'Twitter'
            // }, {
            //     key: 'so',
            //     name: 'Stackoverflow'
            // }, {
            //     key: 'sf',
            //     name: c
            // }, {
            //     key: 'su',
            //     name: 'Superuser'
            // }, {
            //     key: 'msdn',
            //     name: 'MSDN'
            // }, {
            //     key: 'tn',
            //     name: 'Telnet'
            // }];
            $scope.platforms = CONST.ALL_ENABLED_PLARFORMS
            $('.ui.fluid.dropdown').dropdown({
                // onChange: function (value, text, $choice) {
                //     $scope.listNotification();
                // }
            });
            $('.popup').popup();
        }, 50)
    }();
    // $('.admin.cards .card').dimmer({
    //     on: 'hover'
    // });

    $scope.listNotification = function () {
        $('#nc-main').dimmer('show');
        var params = angular.copy($scope.search);
        params.bgTime = Math.floor(moment.utc(params.bgTime) / 1000);
        params.egTime = Math.floor(moment.utc(params.egTime).endOf('day') / 1000);
        console.log(params)
        $scope.service.getSysDetections(params.datasource, params.messagetype, params.downloadable, params.bgTime, params.egTime).then(function (data) {
            // console.log(data);
            // $scope.collections = angular.extend($scope.collections, data);
            $('#nc-main').dimmer('hide');
            $scope.collections = data;
            // $scope.$digest();
        })
    }
    $scope.listNotification();
    $scope.generateDownloadUrl = function (entity) {
        var downloadTemplate = '<a href="' + entity.link + '" target="_blank">Download Data</a>';
        return entity.hasDownload ? $sce.trustAsHtml(downloadTemplate) : 'N/A';
    }
    $scope.showdetails = function (entity) {
        var param = {
            platform: entity.forumName,
            msgType: entity.msgType,
            topic:entity.topic,
            timestamp:entity.TimeStamp
        }
        $rootScope.popSubWin({
            fn: 'getVoCDetailsBySpikeDetected',
            param: param
        });
    }

}