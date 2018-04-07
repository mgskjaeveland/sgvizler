        /**
         * Make a standard simple html table.
         *
         * @class sgvizler.visualization.Table
         * @extends sgvizler.charts.Chart
         * @constructor
         * @param {Object} container The container element where the
         * chart will be drawn.
         * @since 0.5.1
         **/

        /**
         * Available options:
         *  - 'includeHeaders'   :  "true" / "false"  (default: "true")
         *
         * @method draw
         * @public
         * @param {google.visualization.DataTable} data
         * @param {Object} [chartOptions]
         * @since 0.5.1
         **/
        C.Table = charts.add(modSC, "Table",
            function (data, chartOptions) {
                var table = C.util.genericTextDraw(
                    data,
                    $.extend({ dataFunction: C.util.linkify2String,
                               includeHeaders: true,
                               resultsPrefix: '<table>', resultsPostfix: '</table>',
                               headingRowPrefix: '<tr>', headingRowPostfix: '</tr>',
                               headingCellPrefix: '<th>', headingCellPostfix: '</th>',
                               rowPrefix: '<tr>', rowPostfix: '</tr>',
                               cellPrefix: '<td>', cellPostfix: '</td>',
                               cellSep: ''
                             },
                             chartOptions)
                );

                $(this.container).empty().html(table);
                this.fireListener('ready');
            }
            );
