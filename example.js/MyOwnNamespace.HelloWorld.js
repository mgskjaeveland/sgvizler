// Meta comment - chart function object documentation:
/**
 * Hello World chart function. Writes a table where all values are
 * replaced by the string "Hello World", or an other string. We assume
 * the container is a <table>.
 *
 * @class MyOwnNamespace.HelloWorld
 * @extends sgvizler.charts.Chart
 * @constructor
 * @param {Object} container The container element where the
 * chart will be drawn.
 * @since 0.6.1
 **/

// Meta comment - documentation of draw(.,.) function:
 /**
  * Available options:
  *
  *  - 'word' :  The word to replace all result values with  (default: "Hello World")
  *
  * @method draw
  * @public
  * @param {google.visualization.DataTable} datatable
  * @param {Object} [chartOptions]
  * @since 0.6.1
  **/

var MyOwnNamespace = {};
MyOwnNamespace.HelloWorld = sgvizler.chartsAdd(
    "MyOwnNamespace",
    "HelloWorld",
    function (datatable, chartOptions) {
            // collect from numbers from the datatable:
        var c, noColumns = datatable.getNumberOfColumns(),
            r, noRows    = datatable.getNumberOfRows(),
            // set default values for chart options
            opt = $.extend({ word: 'Hello World' }, chartOptions),
            tablecontents = "";

        for (r = 0; r < noRows; r += 1) {
            tablecontents += '<tr>';
            for (c = 0; c < noColumns; c += 1) {
                tablecontents += '<td>' + opt.word + '</td>';
            }
            tablecontents += '</tr>';
        }

        $(this.container)
            .empty()
            .html(tablecontents);

        // here we're using an external library:
        new Tablesort(this.container);
    },
    // dependencies, 'Tablesort' is the function we need.
    { Tablesort: "//cdnjs.cloudflare.com/ajax/libs/tablesort/1.6.1/tablesort.min.js" }
);
