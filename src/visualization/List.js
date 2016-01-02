
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
         *  - 'rowPrefix  :  string (can be html) to prefix each row with. (default: '')
         *  - 'rowPostfix :  string (can be html) to postfix each row with. (default: '')
         * 
         * @method draw
         * @public
         * @param {google.visualization.DataTable} data
         * @param {Object} [chartOptions]
         * @since 0.3.0
         **/
        C.List = charts.add(modSC, "List",
            function (data, chartOpt) {
                var c, noColumns = data.getNumberOfColumns(),
                    r, noRows = data.getNumberOfRows(),
                    opt = $.extend({ list: 'ul',
                                     cellSep: ', ',
                                     rowPrefix: '',
                                     rowPostfix: '' },
                                   chartOpt),
                    list = '<' + opt.list + '>';

                for (r = 0; r < noRows; r += 1) {
                    list += '<li>' + opt.rowPrefix;
                    for (c = 0; c < noColumns; c += 1) {
                        list += C.util.linkify2String(data.getValue(r, c));
                        if (c + 1 !== noColumns) { // Don't add after last element in a row.
                            list += opt.cellSep;
                        }
                    }
                    list += opt.rowPostfix + '</li>';
                }
                list += '</' + opt.list + '>';

                $(this.container)
                    .empty()
                    .html(list);

                this.fireListener('ready');
            }
            );

