        /**
         * Write text.
         *
         * Any number of columns. Everything is displayed as text.
         *
         * @class sgvizler.visualization.Generic
         * @extends sgvizler.charts.Chart
         * @constructor
         * @param {Object} container The container element where the
         * chart will be drawn.
         * @since 0.6.1
         **/

        /**
         * Available options:
         *
         * In `NoX` `X` should replaced with a number 1 =< X =< no. of columns.
         *
         *  - 'dataFunction'           :  function applied to every cell value. (default: identify function)
         *  - 'includeHeaders'         :  include column headings or not. (default: false)
         *  - 'headingCellSep'         :  string to separate cells in each column. (default: '')
         *  - 'headingCellSepNoX'      :  string to separate cells in each column. (default: headingCellSep)
         *  - 'headingCellPrefix'      :  string to prefix each cell with. (default: '')
         *  - 'headingCellPostfix'     :  string to postfix each cell with. (default: '')
         *  - 'headingCellPrefixNoX'   :  string to prefix each cell with. (default: headingCellPrefixNoX)
         *  - 'headingCellPostfixNoX'  :  string to postfix each cell with. (default: headingCellPostfixNoX)
         *  - 'headingRowPrefix'       :  string to prefix each row with. (default: '')
         *  - 'headingRowPostfix'      :  string to postfix each row with. (default: '')
         *  - 'headingRowPrefixNoX'    :  string to prefix each row with. (default: headingRowPrefixNoX)
         *  - 'headingRowPostfixNoX'   :  string to postfix each row with. (default: headingRowPostfixNoX)
         *  - 'cellSep'                :  string (can be html) to separate cells in each column. (default: '')
         *  - 'cellSepNoX'             :  string (can be html) to separate cells in each column. (default: cellSep)
         *  - 'cellPrefix'             :  string (can be html) to prefix each cell with. (default: '')
         *  - 'cellPostfix'            :  string (can be html) to postfix each cell with. (default: '')
         *  - 'cellPrefixNoX'          :  string (can be html) to prefix each first cell in every row with. (default: cellPrefix)
         *  - 'cellPostfixNoX'         :  string (can be html) to postfix each first cell in every row with. (default: cellPostfix)
         *  - 'rowPrefix'              :  string (can be html) to prefix each row with. (default: '')
         *  - 'rowPostfix'             :  string (can be html) to postfix each row with. (default: '')
         *  - 'rowPrefixNoX'           :  string (can be html) to prefix each row with. (default: rowPrefix)
         *  - 'rowPostfixNoX'          :  string (can be html) to postfix each row with. (default: rowPostfix)
         *  - 'resultsPrefix'          :  string (can be html) to prefix the results with. (default: '')
         *  - 'resultsPostfix'         :  string (can be html) to postfix the results with. (default: '')
         *
         * @method draw
         * @public
         * @param {google.visualization.DataTable} data
         * @param {Object} [chartOptions]
         * @since 0.6.1
         **/
        C.Generic = charts.add(modSC, "Generic",
            function (data, chartOptions) {
                var text = C.util.genericTextDraw(data, $.extend({}, chartOptions));

                $(this.container)
                    .empty()
                    .html(text);

                this.fireListener('ready');
            }
            );
