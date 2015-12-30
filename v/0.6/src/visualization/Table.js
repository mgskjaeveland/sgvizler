
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
         *  - 'headings'   :  "true" / "false"  (default: "true")
         *
         * @method draw
         * @public
         * @param {google.visualization.DataTable} data
         * @param {Object} [chartOptions]
         * @since 0.5.1
         **/
        C.Table = charts.add(modSC, "Table",
            function (data, chartOpt) {
                var c, noColumns = data.getNumberOfColumns(),
                    r, noRows = data.getNumberOfRows(),
                    opt = $.extend({ headings: true }, chartOpt),
                    table,
                    rows = [],
                    cells = [];

                if (opt.headings) {
                    for (c = 0; c < noColumns; c += 1) {
                        cells.push(['th', null, data.getColumnLabel(c)]);
                    }
                    rows.push(['tr', null, cells]);
                }

                for (r = 0; r < noRows; r += 1) {
                    cells = [];
                    for (c = 0; c < noColumns; c += 1) {
                        cells.push(['td', null, [C.util.linkify2HTMLElementArray(data.getValue(r, c))]]);
                    }
                    rows.push(['tr', null, cells]);
                }

                table = util.createHTMLElement('table', null, rows);
                $(this.container).empty().html(table);

                this.fireListener('ready');
            }
            );
