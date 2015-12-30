

    sgvizler.charts = {
        // Package for handling rendering functions. The rendering
        // functions themselves are kept in sgvizler.chart.*

        all: [],

        loadCharts: function () {
            var googlecharts = [
                { 'id': "gLineChart",        'func': google.visualization.LineChart },
                { 'id': "gAreaChart",        'func': google.visualization.AreaChart },
                { 'id': "gSteppedAreaChart", 'func': google.visualization.SteppedAreaChart },
                { 'id': "gPieChart",         'func': google.visualization.PieChart },
                { 'id': "gBubbleChart",      'func': google.visualization.BubbleChart },
                { 'id': "gColumnChart",      'func': google.visualization.ColumnChart },
                { 'id': "gBarChart",         'func': google.visualization.BarChart },
                { 'id': "gSparkline",        'func': google.visualization.ImageSparkLine },
                { 'id': "gScatterChart",     'func': google.visualization.ScatterChart },
                { 'id': "gCandlestickChart", 'func': google.visualization.CandlestickChart },
                { 'id': "gGauge",            'func': google.visualization.Gauge },
                { 'id': "gOrgChart",         'func': google.visualization.OrgChart },
                { 'id': "gTreeMap",          'func': google.visualization.TreeMap },
                { 'id': "gTimeline",         'func': google.visualization.AnnotatedTimeLine },
                { 'id': "gMotionChart",      'func': google.visualization.MotionChart },
                { 'id': "gGeoChart",         'func': google.visualization.GeoChart },
                { 'id': "gGeoMap",           'func': google.visualization.GeoMap },
                { 'id': "gMap",              'func': google.visualization.Map },
                { 'id': "gTable",            'func': google.visualization.Table }
            ],
                chart;

            $.merge(this.all, googlecharts);
            for (chart in sgvizler.chart) {
                if (sgvizler.chart.hasOwnProperty(chart)) {
                    this.register(
                        sgvizler.chart[chart].prototype.id,
                        sgvizler.chart[chart]
                    );
                }
            }
        },

        register: function (id, func) {
            this.all.push({'id': id, 'func': func});
        },

        getChart: function (containerId, chartId) {
            var i,
                container = document.getElementById(containerId);
            for (i = 0; i < this.all.length; i += 1) {
                if (chartId === this.all[i].id) {
                    return new this.all[i].func(container);
                }
            }
        }
    };
