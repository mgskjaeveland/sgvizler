

        /**
         * Extends google.visualization.Map in markers dataMode. Draws
         * textboxes with heading, paragraph, link and image. 
         * 
         * Data Format 2--6 columns:
         * 
         *   1. lat
         *   2. long
         *   3. name  (optional)
         *   4. text  (optional)
         *   5. link  (optional)
         *   6. image (optional)
         * 
         * - If < 4 columns, then behaves just as gMap
         * - Only 6 columns will be read, columns > 6 are ignored.
         * 
         * @class sgvizler.visualization.Map
         * @extends sgvizler.charts.Chart
         * @constructor
         * @param {Object} container The container element where the
         * chart will be drawn.
         * @since 0.3.0
         **/

        /**
         * Same options available as for google.visualization.Map.
         * 
         * @method draw
         * @public
         * @param {google.visualization.DataTable} data
         * @param {Object} [chartOptions]
         * @since 0.3.0
         */
        C.Map = charts.add(modSC, "Map",
            function (data, chartOpt) {
                /*global google */
                var c, noColumns = data.getNumberOfColumns(),
                    r, noRows = data.getNumberOfRows(),
                    that = this,
                    opt = $.extend({ dataMode: 'markers',
                                     showTip: true,
                                     useMapTypeControl: true
                                   },
                                   chartOpt),
                    chart,
                    newData,
                    newValue;

                C.util.loadCSS();

                // The idea is to put all columns > 2 into the
                // 3. column with html formatting.

                if (noColumns > 3) {
                    newData = data.clone();
                    // drop columns > 3 from new
                    for (c = noColumns - 1; c > 2; c -= 1) {
                        newData.removeColumn(c);
                    }

                    // build new 3. column
                    for (r = 0; r < noRows; r += 1) {
                        newValue = "<div class='sgvizler sgvizler-sMap'>";
                        newValue += "<h1>" + data.getValue(r, 2) + "</h1>";
                        if (5 < noColumns && data.getValue(r, 5) !== null) {
                            newValue += "<div class='img'><img src='" + data.getValue(r, 5) + "'/></div>";
                        }
                        if (3 < noColumns && data.getValue(r, 3) !== null) {
                            newValue += "<p class='text'>" + data.getValue(r, 3) + "</p>";
                        }
                        if (4 < noColumns && data.getValue(r, 4) !== null) {
                            newValue += "<p class='link'><a href='" + namespace.unprefixify(data.getValue(r, 4)) + "'>" + data.getValue(r, 4) + "</a></p>";
                        }
                        newValue += "</div>";
                        newData.setCell(r, 2, newValue);
                    }
                } else { // do nothing.
                    newData = data;
                }

                chart = new google.visualization.Map(this.container);
                chart.draw(newData, opt);

                google.visualization.events.addListener(
                    chart,
                    'ready',
                    function () { that.fireListener('ready'); }
                );
            },
            {'google.visualization.Map': 'map' }
            );
