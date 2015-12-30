

    /*global google, $, jQuery */
    /*jslint browser: true */

    var sgvizler = {

        go: function () {
            this.loadLibs();

            google.load('visualization',
                        '1.0',
                        {'packages':
                         ['annotatedtimeline',
                          'corechart',
                          'gauge',
                          'geomap',
                          'geochart',
                          'imagesparkline',
                          'map',
                          'orgchart',
                          'table',
                          'motionchart',
                          'treemap'
                         ]
                        }
                       );

            google.setOnLoadCallback(function () {
                sgvizler.charts.loadCharts();
                sgvizler.drawFormQuery();
                sgvizler.drawContainerQueries();
            });
        },

        loadLibs: function () {
            var i,
                libs = [
                    '//cdnjs.cloudflare.com/ajax/libs/d3/2.10.0/d3.v2.min.js',
                    'http://www.data2000.no/sgvizler/lib/raphael-dracula.min.js'
                ];
            if (sgvizler.ui.isElement(sgvizler.ui.id.script)) {
                this.option.homefolder = $('#' + sgvizler.ui.id.script).attr('src').replace(/sgvizler\.js$/, "");
            }
            // load external scripts
            for (i = 0; i < libs.length; i += 1) {
                $.ajax(libs[i], { dataType: "script", async: false });
            }

            // load stylesheet
            $('head').append('<link rel="stylesheet" href="' + this.option.homefolder + 'sgvizler.chart.css" type="text/css" />');
        },

        drawFormQuery: function () {
            var query = new sgvizler.query(sgvizler.ui.id.chartCon),
                params = sgvizler.ui.getUrlParams();
            $.extend(query,
                     sgvizler.option.query,
                     { query: params.query, endpoint: params.endpoint, chart: params.chart });

            if (sgvizler.ui.isElement(query.container) && query.query) {
                $.extend(query.chartOptions,
                         { width: params.width, height: params.height });
                query.draw();
            }
            sgvizler.ui.displayUI(query);
        },

        drawContainerQueries: function () {
            $('[' + this.ui.attr.prefix + 'query]').each(function () {
                var query = new sgvizler.query();
                $.extend(query,
                         sgvizler.option.query,
                         sgvizler.ui.getQueryOptionAttr(this));
                $.extend(query.chartOptions,
                         sgvizler.ui.getChartOptionAttr(this));
                query.draw();
            });
        },

        // kept in separate files:
        option: {},   // settings, global variables.
        chart: {},    // the set of user-defined rendering functions.
        charts: {},   // functions for handling rendering functions.
        parser: {},   // SPARQL results XML/JSON parser.
        ui: {}       // html get/set functions.
    };

    jQuery.ajaxSetup({
        accepts: {
            xml:  "application/sparql-results+xml",
            json: "application/sparql-results+json"
        }
    });
