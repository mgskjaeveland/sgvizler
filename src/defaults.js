
    /**
     * A set of default values used mostly, if not only, by the
     * sgvizler.Query class. These values may be get and set by the
     * get-setters of the sgvizler class.
     *
     * Dependencies:
     *
     *   - sgvizler.registry
     *
     * @class sgvizler.defaults
     * @static
     */
    S.defaults = (function () {

        // Module dependencies
        var moduleGooVis = S.registry.GVIZ,

            // Note: all property names must be lowercase.
            queryDefaults = {
                query: "SELECT ?class (count(?instance) AS ?noOfInstances)\n" +
                    "WHERE{ ?instance a ?class }\n" +
                    "GROUP BY ?class\n" +
                    "ORDER BY ?class",
                froms: [],
                endpoint: "http://sws.ifi.uio.no/sparql/world",
                endpoint_output_format: 'json',  // xml, json, jsonp
                endpoint_results_urlpart: "?output=text&amp;query=",
                validator_url: "http://sparql.org/validate/query" +
                    "?languageSyntax=SPARQL" +
                    "&amp;outputFormat=sparql" +
                    "&amp;linenumbers=true" +
                    "&amp;query=",
                chart: moduleGooVis + '.Table',
                loglevel: 2
            },

            chartDefaults = {
                width:  800,
                height: 400,
                chartArea: {
                    left:   '5%',
                    top:    '5%',
                    width:  '75%',
                    height: '80%'
                }
            },
            chartSpecificDefaults = (function () {
                var options = {};
                options[moduleGooVis + '.GeoMap'] = {
                    dataMode: 'markers'
                };
                options[moduleGooVis + '.Map'] = {
                    dataMode: 'markers'
                };
                options[moduleGooVis + '.Sparkline'] = {
                    showAxisLines: false
                };
                return options;
            }());
        return {
            /**
             * Collects query option default values. Should only be
             * used if you want to edit this values persistently
             * (passed by reference). If you want a copy of these
             * values, use method `getQueryOptions`.
             *
             * @property query
             * @type Object
             * @protected
             * @since 0.6.0
             **/
            query: queryDefaults,

            /**
             * Collects chart option default values. Should only be
             * used if you want to edit this values persistently
             * (passed by reference). If you want a copy of these
             * values, use method `getChartOptions`.
             *
             * @property chart
             * @type Object
             * @protected
             * @since 0.6.0
             **/
            chart: chartDefaults,

            /**
             * @method getQueryOptions
             * @protected
             * @return {Object} A copy of the query default options.
             * @since 0.6.0
             **/
            getQueryOptions: function () {
                return $.extend({}, queryDefaults);
            },

            /**
             * @method getChartOptions
             * @protected
             * @return {Object} A copy of the chart default options.
             * @since 0.6.0
             **/
            getChartOptions: function () {
                return $.extend({}, chartDefaults);
            },

            /**
             * @method getChartSpecificOptions
             * @protected
             * @param {String} chart The function name to retrieve options for, e.g., `'google.visualization.Map'`.
             * @return {Object} A copy of the chart specific default options.
             * @since 0.6.0
             **/
            getChartSpecificOptions: function (chart) {
                return $.extend({}, chartSpecificDefaults[chart]);
            },

            /**
             * @method setChartSpecificOption
             * @protected
             * @param {String} chart The function name to set the option for, e.g., `'google.visualization.Map'`.
             * @param {String} option The name of the option to set.
             * @param {String} value The value to set.
             * @example
             *     setChartSpecificOption('google.visualization.Map', 'dataMode', 'markers');
             *   sets the `'dataMode'` option for the
             *   `'google.visualization.Map'` function to the value
             *   `'markers'`.
             * @since 0.6.0
             **/
            setChartSpecificOption: function (chart, option, value) {
                chartSpecificDefaults[chart] = chartSpecificDefaults[chart] || {};
                chartSpecificDefaults[chart][option] = value;
            }
        };
    }());
