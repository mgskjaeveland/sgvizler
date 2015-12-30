        /** 
         * Write text.
         *
         * Any number of columns. Everything is displayed as text.
         * 
         * @class sgvizler.visualization.Text
         * @extends sgvizler.charts.Chart
         * @constructor
         * @param {Object} container The container element where the
         * chart will be drawn.
         * @since 0.3.0
         **/

        /** 
         * Available options:
         * 
         *  - 'cellSep'       :  string (can be html) to separate cells in each column. (default: ', ')
         *  - 'cellPrefix     :  string (can be html) to prefix each cell with. (default: '')
         *  - 'cellPostfix    :  string (can be html) to postfix each cell  with. (default: '')
         *  - 'rowPrefix      :  string (can be html) to prefix each row with. (default: '<p>')
         *  - 'rowPostfix     :  string (can be html) to postfix each row with. (default: '</p>')
         *  - 'resultsPrefix  :  string (can be html) to prefix the results with. (default: '<div>')
         *  - 'resultsPostfix :  string (can be html) to postfix the results with. (default: '</div>')
         *
         * @method draw
         * @public
         * @param {google.visualization.DataTable} data
         * @param {Object} [chartOptions]
         * @since 0.3.0
         **/
        C.Text = charts.add(modSC, "Text",
            function (data, chartOpt) {
                var c, noColumns = data.getNumberOfColumns(),
                    r, noRows = data.getNumberOfRows(),
                    opt = $.extend({ cellSep: ', ',
                                     cellPrefix: '', cellPostfix: '',
                                     rowPrefix: '<p>', rowPostfix: '</p>',
                                     resultsPrefix: '<div>', resultsPostfix: '</div>' },
                                   chartOpt),
                    text = opt.resultsPrefix,
                    row;


                for (r = 0; r < noRows; r += 1) {
                    row = opt.rowPrefix;
                    for (c = 0; c < noColumns; c += 1) {
                        row += opt.cellPrefix + C.util.linkify2String(data.getValue(r, c)) + opt.cellPostfix;
                        if (c + 1 !== noColumns) { // Don't add for last element in row.
                            row += opt.cellSep;
                        }
                    }
                    text += row + opt.rowPostfix;
                }
                text += opt.resultsPostfix;

                $(this.container)
                    .empty()
                    .html(text);

                this.fireListener('ready');
            }
            );
