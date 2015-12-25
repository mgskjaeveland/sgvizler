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
            function (data, chartOptions) {
                var text = C.util.genericTextDraw(
                    data,
                    $.extend({ dataFunction: C.util.linkify2String,
                               cellSep: ', ',
                               cellPrefix: '', cellPostfix: '',
                               rowPrefix: '<p>', rowPostfix: '</p>',
                               resultsPrefix: '<div>', resultsPostfix: '</div>'
                             },
                             chartOptions)
                );

                $(this.container)
                    .empty()
                    .html(text);

                this.fireListener('ready');
            }
            );
