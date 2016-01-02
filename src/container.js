
    /**
     * Draws charts specified in HTML containers, here we call them
     * "sgvizler-containers".
     *
     * Example of use: The following sgvizler-container will be
     * selected by sgvizler due to the use of designated
     * attributes. The result is a pie chart (draw with
     * `google.visualization.PieChart`) showing the number of instance
     * per class in the endpoint at
     * `http://sws.ifi.uio.no/sparql/ndp`.
     *
     *     <div id="ex1"
     *          data-sgvizler-endpoint="http://sws.ifi.uio.no/sparql/npd"
     *          data-sgvizler-query="SELECT ?class (count(?instance) AS ?noOfInstances)
     *                               WHERE{ ?instance a ?class }
     *                               GROUP BY ?class
     *                               ORDER BY ?class"
     *          data-sgvizler-chart="google.visualization.PieChart"
     *          style="width:800px; height:400px;"></div>
     *
     * These container must have an id attribute (or else sgvizler
     * will not know where to put the chart) and a query attribute (or
     * else the container will be ignored by sgvizler).
     *
     * Dependencies:
     *
     *  - sgvizler.util
     *  - sgvizler.loader
     *  - sgvizler.logger
     *  - sgvizler.Query
     *  - jQuery
     *
     * @class sgvizler.container
     * @static
     */

    S.container = (function () {

        /*global $ */

        // Module dependencies:
        var util = S.util,
            loadDependencies = S.loader.loadDependencies,
            logger = S.logger,
            Query = S.Query,

            // CONSTANTS
            /**
             * The prefix of attributes which values designated for
             * sgvizler should be given. Currently `data-sgvizler-`.
             *
             * Note that `data-` prefixed attribute names is valid
             * HTML5.
             * @property PREFIX
             * @type string
             * @final
             * @private
             * @since 0.2
             **/
            PREFIX = 'data-sgvizler-',

            /**
             * The prefix of attributes which values designated for
             * sgvizler and which are sent to the chart function
             * should be given. Currently
             * `data-sgvizler-chart-options`.
             *
             * @property PREFIXCHART
             * @type string
             * @final
             * @private
             * @since 0.2
             **/
            PREFIXCHART = PREFIX + 'chart-options',

            /**
             * In attributes where multiple values may be given the
             * properties VALUEASSIGN and VALUESPILT decides how to
             * parse the attribute value into multiple name--value
             * pairs.
             * @property VALUEASSIGN
             * @type string
             * @final
             * @private
             * @since 0.2
             **/
            VALUEASSIGN = '=',

            /**
             * In attributes where multiple values may be given the
             * properties VALUEASSIGN and VALUESPILT decides how to
             * parse the attribute value into multiple name--value
             * pairs.
             *
             * @property VALUESPILT
             * @type string
             * @final
             * @private
             * @since 0.2
             **/
            VALUESPLIT = '|',

            /**
             * Collects values designated for sgvizler in the given
             * element---by element id.
             *
             * See also property PREFIX.
             *
             * @method getQueryAttributes
             * @private
             * @param {string} elementID The ID for which the attributes should be collected.
             * @return {Object} List of name--value pairs.
             * @since 0.2
             **/
            getQueryAttributes = function (elementID) {
                var i, len,
                    queryOpt = {},
                    elmAttrs = document.getElementById(elementID).attributes;
                for (i = 0, len = elmAttrs.length; i < len; i += 1) {
                    if (util.startsWith(elmAttrs[i].name, PREFIX)) {
                        queryOpt[elmAttrs[i].name.substring(PREFIX.length)] = elmAttrs[i].value;
                    }
                }
                return queryOpt;
            },

            /**
             * Collects values designated for sgvizler, and which are
             * options to the chart function, in the given
             * element---by element id.
             *
             * See also property CHARTPREFIX.
             *
             * @method getChartAttributes
             * @private
             * @param {string} elementID The ID for which the attributes should be collected.
             * @return {Object} List of name--value pairs.
             * @since 0.2
             **/
            getChartAttributes = function (elementID) {
                var i, j, ilen, jlen,
                    options,
                    assignment,
                    path,
                    o,
                    chartOpt = {},
                    attrValue = $("#" + elementID).attr(PREFIXCHART);
                if (attrValue !== undefined) {
                    options = attrValue.split(VALUESPLIT);
                    for (i = 0, ilen = options.length; i < ilen; i += 1) {
                        assignment = options[i].split(VALUEASSIGN);
                        path = assignment[0].split(".");
                        o = chartOpt;
                        for (j = 0, jlen = path.length - 1; j < jlen; j += 1) {
                            if (o[path[j]] === undefined) {
                                o[path[j]] = {};
                            }
                            o = o[path[j]];
                        }
                        o[path[j]] = assignment[1];
                    }
                }
                // get width and heigth from css. take only numbers.
                chartOpt.width = /(\d+)/.exec($("#" + elementID).css('width'))[1];
                chartOpt.height = /(\d+)/.exec($("#" + elementID).css('height'))[1];
                return chartOpt;
            },

            /**
             * Finds all sgvizler-containers on the page and loads
             * their dependencies in one go.
             * @method loadDependenciesOnPage
             * @private
             * @param {Array|string} [strFunctions] Array (or just a
             * single string) of function names to get in addition to
             * the functions specifies in sgvizler-containers.
             * @since 0.6.0
             **/
            loadDependenciesOnPage = function (strFunctions) {
                strFunctions = util.toArray(strFunctions);

                // Collect functions specified in html tags.
                $('[' + PREFIX + 'chart]').each(function () {
                    strFunctions.push($(this).attr(PREFIX + "chart"));
                });
                logger.log("initializer: loading functions: " + strFunctions);
                loadDependencies(strFunctions);
            },

            /**
             * Draws the sgvizler-containers with the given element id.
             * @method containerDraw
             * @public
             * @for sgvizler
             * @param {String} elementID
             * @since 0.6.0
             **/
            draw = function (elementID) {
                var queryOptions = getQueryAttributes(elementID),
                    chartOptions = getChartAttributes(elementID),
                    froms = (queryOptions.rdf && queryOptions.rdf.split(VALUESPLIT)) || [],
                    query = new Query(queryOptions, chartOptions);

                while (froms.length) {
                    query.addFrom(froms.pop());
                }

                logger.log("drawing id: " + elementID);
                query.draw(elementID);
            },

            /**
             * Draws all sgvizler-containers on page.
             * @method containerDrawAll
             * @public
             * @for sgvizler
             * @since 0.3
             **/
            drawAll = function () {
                // Load dependencies for charts found on page.
                loadDependenciesOnPage();

                // Draw all containers with sgvizler query string attribute.
                $('[' + PREFIX + 'query]').each(function () {
                    draw($(this).attr("id"));
                });
            };


         /////////////////////////////////////////
         // PUBLICs

        return {
            draw: draw,
            drawAll: drawAll
        };

    }());
