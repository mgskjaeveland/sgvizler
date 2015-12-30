    /** sDefList **


     Make a html dt list.


     Format, 2--N columns:
     1. Term
     2--N. Definition


     Available options:
     'cellSep'   :  string (can be html) to separate cells in definition columns. (default: ' ')
     'termPrefix  :  string (can be html) to prefix each term with. (default: '')
     'termPostfix :  string (can be html) to postfix each term with. (default: ':')
     'definitionPrefix  :  string (can be html) to prefix each definition with. (default: '')
     'definitionPostfix :  string (can be html) to postfix each definition with. (default: '')
    */
    sgvizler.chart.DefList = function (container) { this.container = container; };
    sgvizler.chart.DefList.prototype = {
        id:   "sDefList",
        draw: function (data, chartOpt) {
            var r,
                c,
                term,
                definition,
                noColumns = data.getNumberOfColumns(),
                noRows = data.getNumberOfRows(),
                opt = $.extend({ cellSep: ' ', termPrefix: '', termPostfix: ':', definitionPrefix: '', definitionPostfix: '' }, chartOpt),
                list = $(document.createElement('dl'));


            for (r = 0; r < noRows; r += 1) {
                term = opt.termPrefix + data.getValue(r, 0) + opt.termPostfix;
                list.append($(document.createElement('dt')).html(term));
                definition = opt.definitionPrefix;
                for (c = 1; c < noColumns; c += 1) {
                    definition += data.getValue(r, c);
                    if (c + 1 !== noColumns) {
                        definition += opt.cellSep;
                    }
                }
                definition += opt.definitionPostfix;
                list.append($(document.createElement('dd')).html(definition));
            }
            $(this.container).empty();
            $(this.container).append(list);
        }
    };
