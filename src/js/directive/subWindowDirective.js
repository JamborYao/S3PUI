/*
    ==========example====================

*/
module.exports = function ($rootScope, $compile, utilitySrv, testSrv) {
    return {
        restrict: 'E',
        templateUrl: ('public/template/sub_window.html'),
        replace: true,
        scope: {
            // users: "=",
            title: "@",
            platform: "@",
            query: "="
        },
        link: function (scope, e, a) {
            // console.log($(e).find('.hourly-charts'))
            scope.myChart = echarts.init($(e).find('.hourly-charts').get(0));
            scope.getData = function () {
                testSrv.getVoCDetailsByDate().then(function (data) {
                    scope.raw = data;
                    scope.tabledata = data.vocmentionedmost;
                    // console.log(scope.tabledata);
                    $compile($(e).find('#thread-table'))(scope);
                    // scope.users = data.topusers 
                    scope.$broadcast('set-user-data', data.topusers);
                    scope.$broadcast('set-sub-widows-charts-data', {data:data,pnscope:'posi'});
                    scope.chartOpt = initHourlyChartData(data.volhourlylist, utilitySrv);
                    console.log(scope.chartOpt)
                    scope.myChart.setOption(scope.chartOpt);
                    scope.myChart.resize();
                })
            }
            scope.$on('start-get-data-in-window', function (event, arg) {
                if (arg === 'sub') scope.getData(arg);
            });
        }
    }
}

function initHourlyChartData(raw, utility) {
    var seriesData = [], xAxisDate = [];
    console.log(raw)
    raw.map(function (item) {
        var tmp = {};
        xAxisDate.push(utility.timeToString(item.attachedobject));
        if(item.vocinfluence.detectedspikesvol){
            var entity = {value:item.vocinfluence.voctotalvol,symbol:'pin',symbolSize:20,label:{emphasis:{show:true}}};
            seriesData.push(entity);
        }else{
            seriesData.push(item.vocinfluence.voctotalvol);
        }
    })
    console.log(seriesData);
    var title = 'Hourly trend';
    var opt = {
        title: {
            text: title,
            textStyle: {
                fontSize: 12
            },
            x: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        dataZoom: [{
            show: true,
            realtime: true,
            start: 0,
            end: 100
        }, {
                type: 'inside',
                realtime: true,
                start: 0,
                end: 100
            }],
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {
                onZero: false
            },
            data: xAxisDate
        },
        yAxis: {},
        series: [{
            name: 'Vol',
            type: 'line',
            data: seriesData
        }]
    };
    return opt;
}