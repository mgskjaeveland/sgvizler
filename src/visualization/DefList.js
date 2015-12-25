        /**
         * Make a html dt list.
         *
         * Format, 2--N columns:
         * 1. Term
         * 2--N. Definition
         *
         * @class sgvizler.visualization.DefList
         * @extends sgvizler.charts.Chart
         * @constructor
         * @param {Object} container The container element where the
         * chart will be drawn.
         */

        /**
         * Available options:
         *
         *  - 'cellSep'   :  string (can be html) to separate cells in definition columns. (default: ' ')
         *  - 'termPrefix  :  string (can be html) to prefix each term with. (default: '')
         *  - 'termPostfix :  string (can be html) to postfix each term with. (default: ':')
         *  - 'definitionPrefix  :  string (can be html) to prefix each definition with. (default: '')
         *  - 'definitionPostfix :  string (can be html) to postfix each definition with. (default: '')
         *
         * @method draw
         * @public
         * @param {google.visualization.DataTable} data
         * @param {Object} [chartOptions]
         * @since 0.3.0
         **/
        C.DefList = charts.add(modSC, "DefList",
            function (data, chartOptions) {
                var termPrefix = chartOptions.termPrefix || '',
                    termPostfix = chartOptions.termPostfix || ':',
                    definitionPrefix = chartOptions.definitionPrefix || '',
                    definitionPostfix = chartOptions.definitionPostfix || '',
                    text = C.util.genericTextDraw(
                        data,
                        $.extend({ dataFunction: C.util.linkify2String,
                                   resultsPrefix: '<dl>', resultsPostfix: '</dl>',
                                   cellPrefixNo1: '<dt>' + termPrefix, cellPostfixNo1: termPostfix + '</dt>',
                                   cellPrefixNo2: '<dd>' + definitionPrefix, rowPostfix: definitionPostfix + '</dd>',
                                   cellSep: ' '
                                 },
                                 chartOptions)
                    );

                $(this.container)
                    .empty()
                    .html(text);

                this.fireListener('ready');
            }
            );
