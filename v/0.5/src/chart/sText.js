
    /** sText **


     Write text.


     Any number of columns. Everything is displayed as text.


     Available options:
     'cellSep'       :  string (can be html) to separate cells in each column. (default: ', ')
     'cellPrefix     :  string (can be html) to prefix each cell with. (default: '')
     'cellPostfix    :  string (can be html) to postfix each cell  with. (default: '')
     'rowPrefix      :  string (can be html) to prefix each row with. (default: '<p>')
     'rowPostfix     :  string (can be html) to postfix each row with. (default: '</p>')
     'resultsPrefix  :  string (can be html) to prefix the results with. (default: '<div>')
     'resultsPostfix :  string (can be html) to postfix the results with. (default: '</div>')
    */
    sgvizler.chart.Text = function (container) { this.container = container; };
    sgvizler.chart.Text.prototype = {
        id:   "sText",
        draw: function (data, chartOpt) {
            var noColumns = data.getNumberOfColumns(),
                noRows = data.getNumberOfRows(),
                opt = $.extend({ cellSep: ', ',
                                 cellPrefix: '', cellPostfix: '',
                                 rowPrefix: '<p>', rowPostfix: '</p>',
                                 resultsPrefix: '<div>', resultsPostfix: '</div>' },
                               chartOpt),
                text = opt.resultsPrefix,
                r,
                c,
                row;


            for (r = 0; r < noRows; r += 1) {
                row = opt.rowPrefix;
                for (c = 0; c < noColumns; c += 1) {
                    row += opt.cellPrefix + data.getValue(r, c) + opt.cellPostfix;
                    if (c + 1 !== noColumns) {
                        row += opt.cellSep;
                    }
                }
                text += row + opt.rowPostfix;
            }
            text += opt.resultsPostfix;


            $(this.container).empty();
            $(this.container).html(text);
        }
    };
