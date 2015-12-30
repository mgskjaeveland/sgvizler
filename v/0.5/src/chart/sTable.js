
    /** sTable **


     Make a html table.


     Available options:
     'headings'   :  "true" / "false"  (default: "true")
    */
    sgvizler.chart.Table = function (container) { this.container = container; };
    sgvizler.chart.Table.prototype = {
        id:   "sTable",
        draw: function (data, chartOpt) {
            var noColumns = data.getNumberOfColumns(),
                noRows = data.getNumberOfRows(),
                opt = $.extend({'headings': true }, chartOpt),
                table = $(document.createElement('table')),
                c,
                r,
                row;


            if (opt.headings) {
                row = $(document.createElement('tr'));
                for (c = 0; c < noColumns; c += 1) {
                    row.append($(document.createElement('th')).html(data.getColumnLabel(c)));
                }
                table.append(row);
            }


            for (r = 0; r < noRows; r += 1) {
                row = $(document.createElement('tr'));
                for (c = 0; c < noColumns; c += 1) {
                    row.append($(document.createElement('td')).html(data.getValue(r, c)));
                }
                table.append(row);
            }
            $(this.container).empty();
            $(this.container).append(table);
        }
    };
