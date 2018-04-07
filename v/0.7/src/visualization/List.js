        /**
         * Make a html list, either numbered (ol) or bullets
         * (ul). Each row becomes a list item.
         *
         * Any number of columns in any format. Everything is
         * displayed as text.
         *
         * @class sgvizler.visualization.List
         * @extends sgvizler.charts.Chart
         * @constructor
         * @param {Object} container The container element where the
         * chart will be drawn.
         * @since 0.3.0
         **/

        /**
         * Available options:
         *
         *  - 'list'      :  "ol" / "ul"  (default: "ul")
         *  - 'cellSep'   :  string (can be html) to separate cells in row. (default: ', ')
         *  - 'rowPrefix  :  string (can be html) to prefix each row with. (default: '<li>')
         *  - 'rowPostfix :  string (can be html) to postfix each row with. (default: '</li>')
         *
         * @method draw
         * @public
         * @param {google.visualization.DataTable} data
         * @param {Object} [chartOptions]
         * @since 0.3.0
         **/
        C.List = charts.add(modSC, "List",
            function (data, chartOptions) {
                var list = chartOptions.list || "ul", // set list type
                    text = C.util.genericTextDraw(
                        data,
                        $.extend({ dataFunction: C.util.linkify2String,
                                   resultsPrefix: '<' + list + '>', resultsPostfix: '</' + list + '>',
                                   rowPrefix: '<li>', rowPostfix: '</li>',
                                   cellSep: ', '
                                 },
                                 chartOptions)
                    );

                $(this.container)
                    .empty()
                    .html(text);

                this.fireListener('ready');
            }
            );
