    /** sList **


     Make a html list, either numbered (ol) or bullets (ul). Each row
     becomes a list item.


     Any number of columns in any format. Everything is displayed as text.


     Available options:
     'list'      :  "ol" / "ul"  (default: "ul")
     'cellSep'   :  string (can be html) to separate cells in row. (default: ', ')
     'rowPrefix  :  string (can be html) to prefix each row with. (default: '')
     'rowPostfix :  string (can be html) to postfix each row with. (default: '')
    */
    sgvizler.chart.List = function (container) { this.container = container; };
    sgvizler.chart.List.prototype = {
        id:   "sList",
        draw: function (data, chartOpt) {
            var noColumns = data.getNumberOfColumns(),
                noRows = data.getNumberOfRows(),
                opt = $.extend({ list: 'ul', cellSep: ', ', rowPrefix: '', rowPostfix: '' }, chartOpt),
                list = $(document.createElement(opt.list)),
                r,
                c,
                rowtext;


            for (r = 0; r < noRows; r += 1) {
                rowtext = opt.rowPrefix;
                for (c = 0; c < noColumns; c += 1) {
                    rowtext += data.getValue(r, c);
                    if (c + 1 !== noColumns) {
                        rowtext += opt.cellSep;
                    }
                }
                rowtext += opt.rowPostfix;
                list.append($(document.createElement('li')).html(rowtext));
            }
            $(this.container).empty();
            $(this.container).append(list);
        }
    };

