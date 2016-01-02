
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
        C.DefList = charts.add(modSC, 'DefList',
            function (data, chartOpt) {
                var r, noRows = data.getNumberOfRows(),
                    c, noColumns = data.getNumberOfColumns(),
                    opt = $.extend({ cellSep: ' ',
                                     termPrefix: '',
                                     termPostfix: ':',
                                     definitionPrefix: '',
                                     definitionPostfix: '' },
                                   chartOpt),
                    list = "",
                    term,
                    definition;

                for (r = 0; r < noRows; r += 1) {
                    term = '<dt>' +
                        opt.termPrefix +
                        C.util.linkify2String(data.getValue(r, 0)) +
                        opt.termPostfix +
                        '</dt>';
                    definition = '<dd>' +
                        opt.definitionPrefix;

                    for (c = 1; c < noColumns; c += 1) {
                        definition += C.util.linkify2String(data.getValue(r, c));
                        if (c + 1 !== noColumns) {
                            definition += opt.cellSep;
                        }
                    }
                    definition += opt.definitionPostfix +
                        '</dd>';
                    list += term + definition;
                }

                $(this.container)
                    .empty()
                    .html(list);

                this.fireListener('ready');
            }
            );
