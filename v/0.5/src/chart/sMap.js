
    /** sMap **


     Extends gMap in markers dataMode. Draws textboxes with heading,
     paragraph, link and image. The idea is to put all columns > 2 into
     the 3. column with html formatting.


     - Data Format 2--6 columns:
       1. lat
       2. long
       3. name  (optional)
       4. text  (optional)
       5. link  (optional)
       6. image (optional)


     - If < 4 columns, then behaves just as gMap
     - Only 6 columns will be read, columns > 6 are ignored.
    */
    sgvizler.chart.sMap = function (container) { this.container = container; };
    sgvizler.chart.sMap.prototype = {
        id:   "sMap",
        draw: function (data, chartOpt) {
            var chart,
                newData,
                newValue,
                noColumns = data.getNumberOfColumns(),
                r,
                c;


            if (noColumns > 3) {
                newData = data.clone();
                // drop columns > 3 from new
                for (c = noColumns - 1; c > 2; c -= 1) {
                    newData.removeColumn(c);
                }


                // build new 3. column
                for (r = 0; r < data.getNumberOfRows(); r += 1) {
                    newValue = "<div class='sgvizler sgvizler-sMap'>";
                    newValue += "<h1>" + data.getValue(r, 2) + "</h1>";
                    if (5 < noColumns && data.getValue(r, 5) !== null) {
                        newValue += "<div class='img'><img src='" + data.getValue(r, 5) + "'/></div>";
                    }
                    if (3 < noColumns && data.getValue(r, 3) !== null) {
                        newValue += "<p class='text'>" + data.getValue(r, 3) + "</p>";
                    }
                    if (4 < noColumns && data.getValue(r, 4) !== null) {
                        newValue += "<p class='link'><a href='" + sgvizler.parser.unprefixify(data.getValue(r, 4)) + "'>" + data.getValue(r, 4) + "</a></p>";
                    }
                    newValue += "</div>";
                    newData.setCell(r, 2, newValue);
                }
            } else { // do nothing.
                newData = data;
            }


            chart = new google.visualization.Map(this.container);
            chart.draw(newData, chartOpt);
        }
    };

