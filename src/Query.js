
    /**
     * Important class. Runs SPARQL query against SPARQL
     * endpoints.
     *
     * Dependencies:
     *
     *   - sgvizler.util
     *   - sgvizler.namespace
     *   - sgvizler.registry
     *   - sgvizler.parser
     *   - sgvizler.loader
     *   - sgvizler.logger
     *   - sgvizler.defaults
     *   - jQuery
     *   - google.visualization
     * 
     * 
     * Example of how to use the Query class:
     * 
     *     var sparqlQueryString = "SELECT * {?s ?p ?o} LIMIT 10",
     *         containerID = "myElementID",
     *         Q = new sgvizler.Query();
     * 
     *     // Note that default values may be set in the sgvizler object.
     *     Q.query(sparqlQueryString)
     *         .endpointURL("http://dbpedia.org/sparql")
     *         .endpointOutputFormat("json")                    // Possible values 'xml', 'json', 'jsonp'.
     *         .chartFunction("google.visualization.BarChart")  // The name of the function to draw the chart.
     *         .draw(containerID);                              // Draw the chart in the designated HTML element.
     *
     * @class sgvizler.Query
     * @constructor
     * @param {Object} queryOptions
     * @param {Object} chartOptions
     * @since 0.5
     **/

    // Note: the parameter names in the documention are different just
    // for better readability.
    S.Query = function (queryOpt, chartOpt) {

        /*global $ */

        // Module dependencies:
        var util = S.util,
            getset = util.getset,
            prefixesSPARQL = S.namespace.prefixesSPARQL,
            registry = S.registry,
            moduleGooVis = registry.GVIZ,
            fDataTable = registry.DATATABLE,
            parser = S.parser,
            loadDependencies = S.loader.loadDependencies,
            logger = S.logger,
            defaults = S.defaults,

            /* Constants for query formats (qf) */
            qfXML = 'xml',
            qfJSON = 'json',
            qfJSONP = 'jsonp',

            /**
             * Contains properties relevant for query business. Get
             * and set values using get/setter functions.
             *
             * Default values are found in sgvizler.defaults (these
             * may be get/set with the get/setter function on the
             * sgvizler class) and are loaded on construction---and
             * get overwritten by properties in the constructed
             * parameter.
             * @property queryOptions
             * @type Object
             * @private
             * @since 0.5
             **/
            queryOptions,

            /**
             * Contains properties relevant for chart drawing
             * business. Get and set values using get/setter
             * functions.
             *
             * Default values are found in sgvizler.defaults (these
             * may be get/set with the get/setter function on the
             * sgvizler class) and are loaded on construction---and
             * get overwritten by properties in the constructed
             * parameter.
             * @property chartOptions
             * @type Object
             * @private
             * @since 0.5
             **/
            chartOptions,

            //TODO
            listeners = {},

            /**
             * DataTable query results.
             * @property dataTable
             * @type google.visualization.DataTable
             * @private
             * @since 0.5
             **/
            dataTable,

            /**
             * The raw results as retuned by the endpoint.
             * @property queryResult
             * @type Object either XML or JSON
             * @private
             * @since 0.5
             **/
            queryResult,

            /**
             * The number of rows in the query results.
             * @property noOfResults
             * @type number
             * @public
             * @since 0.5
             **/
            noOfResults,

            // TODO: better logging.
            // processQueryResults = function (data) {
            //     var noRows = getResultRowCount(data);
            //     if (noRows === null) {
            //         S.logger.displayFeedback(this, "ERROR_UNKNOWN");
            //     } else if (noRows === 0) {
            //         S.logger.displayFeedback(this, "NO_RESULTS");
            //     } else {
            //         S.logger.displayFeedback(this, "DRAWING");
            //         return getGoogleJSON(data);
            //     }
            // },

            /**
             * Add a url as an RDF source to be included in the SPARQL
             * query in the `FROM` block.
             * @method addFrom
             * @public
             * @param {String} url
             * @since 0.5
             **/
            addFrom = function (url) {
                queryOptions.froms.push(url);
            },

            /**
             * Remove all registered FROMs.
             *
             * See also `addFrom`.
             * @method clearFroms
             * @public
             * @since 0.5
             **/
            clearFroms = function () {
                queryOptions.froms = [];
            },

            //// Getters/Setters
            // TODO redefine query function setters when query is
            // issued: only one query per Query.

           /**
            * Get query string.
            * @method query
            * @public
            * @return {string}
            */
           /**
            * Set query string.
            * @method query
            * @public
            * @param {string} queryString
            * @chainable
            */
            query = function (queryString) {
                if (queryString !== undefined) {
                    clearFroms();
                }
                return getset('query', queryString, queryOptions, this);
            },
            /**
             * Get endpoint URL.
             * @method endpointURL
             * @public
             * @return {string}
             * @since 0.5
             **/
            /**
             * Set endpoint URL.
             * @method endpointURL
             * @public
             * @param {string} url
             * @chainable
             * @example
             *     sgvizler.endpointURL('http://sparql.dbpedia.org');
             *   sets this Query object's endpoint to DBpedia.
             * @since 0.5
             **/
            endpointURL = function (url) {
                return getset('endpoint', url, queryOptions, this);
            },

            /**
             * Get endpoint output format.
             * @method endpointOutputFormat
             * @public
             * @return {string}
             * @since 0.5
             **/
            /**
             * Set endpoint output format. Legal values are `'xml'`,
             * `'json'`, `'jsonp'`.
             * @method endpointOutputFormat
             * @public
             * @param {string} format
             * @chainable
             * @since 0.5
             **/
            endpointOutputFormat = function (format) {
                return getset('endpoint_output_format', format, queryOptions, this);
            },

            // TODO
            endpointResultsURLPart = function (value) {
                return getset('endpoint_results_urlpart', value, queryOptions, this);
            },

            /**
             * Get URL to online SPARQL query validator.
             * @method validatorURL
             * @public
             * @return {string}
             * @since 0.5
             **/
            /**
             * Set URL to online SPARQL query validator. Appending a
             * SPARQL query to the end of this URL should give a page
             * which validates the given query.
             * @method validatorURL
             * @public
             * @param {string} url
             * @chainable
             * @since 0.5
             * @example
             *     TODO
             **/
            validatorURL = function (url) {
                return getset('validator_url', url, queryOptions, this);
            },

            // TODO
            loglevel = function (value) {
                return getset('loglevel', value, queryOptions, this);
            },

            // TODO
            logContainer = function (value) {
                return getset('logContainer', value, queryOptions, this);
            },

            /**
             * Get the name of datatable preprocessing function.
             * @method datatableFunction
             * @public
             * @return {string}
             * @since 0.5
             **/
            /**
             * Set the name of datatable preprocessing function. The
             * function should be availble in the global object, or
             * registered with dependencies in Sgvizler's registry;
             * see TODO
             * @method datatableFunction
             * @public
             * @param {string} functionName
             * @chainable
             * @since 0.5
             **/
            datatableFunction = function (functionName) {
                return getset('datatable', functionName, queryOptions, this);
            },

            /**
             * Get the name of chart function.
             * @method chartFunction
             * @public
             * @return {string}
             * @since 0.5
             **/
            /**
             * Set the name of chart function. The function should be
             * availble in the global object, or registered with
             * dependencies in Sgvizler's registry; see TODO
             * @method chartFunction
             * @public
             * @param {string} functionName
             * @chainable
             * @since 0.5
             **/
            chartFunction = function (functionName) {
                return getset('chart', functionName, queryOptions, this);
            },

            /**
             * Get the height of the chart container.
             * @method chartHeight
             * @public
             * @return {string}
             * @since 0.5
             **/
            /**
             * Set the height of the chart container.
             * @method chartHeight
             * @public
             * @param {number} height
             * @chainable
             * @since 0.5
             **/
            chartHeight = function (height) {
                return getset('height', height, chartOptions, this);
            },

            /**
             * Get the width of the chart container.
             * @method chartWidth
             * @public
             * @return {string}
             * @since 0.5
             **/
            /**
             * Set the width of the chart container.
             * @method chartWidth
             * @public
             * @param {number} width
             * @chainable
             * @since 0.5
             **/
            chartWidth = function (width) {
                return getset('width', width, chartOptions, this);
            },

            /**
             * Get the query string with prefixes added and encoded
             * for URL insertion.
             * @method getEncodedQuery
             * @public
             * @return {String}
             * @since 0.5
             **/
            getEncodedQuery = function () {
                return encodeURIComponent(prefixesSPARQL() + query());
            },

            /**
             * Extends the query string by including the urls in
             * `from` as `FROM` statements in the (SPARQL) `query`.
             * @method insertFrom
             * @private
             * @since 0.5
             **/
            insertFrom = function () {
                var i, len = queryOptions.froms.length,
                    from;
                if (len) {
                    from = "";
                    for (i = 0; i < len; i += 1) {
                        from += 'FROM <' + queryOptions.froms[i] + '>\n';
                    }
                    query(query().replace(/((WHERE)?(\s)*\{)/i, '\n' + from + '$1'));
                }
            },

            /**
             * Sets and returns `noOfResults`, i.e., the number of
             * rows in the query result.
             * @method getResultRowCount
             * @private
             * @param {google.visualization.DataTable} dataTable
             * @return {Number}
             * @since 0.5
             **/
            getResultRowCount = function (dataTable) {
                if (noOfResults === undefined) {
                    if (endpointOutputFormat() === qfXML) {
                        noOfResults = parser.countXML(dataTable);
                    } else {
                        noOfResults = parser.countJSON(dataTable);
                    }
                }
                return noOfResults;
            },

            /**
             * Converts "raw" query results into Google JSON, using
             * sgvizler.parser.
             * @method getGoogleJSON
             * @private
             * @param {Object} data Query result set
             * @return {JSON} JSON edable by google.visualization.DataTable
             * @since 0.5
             **/
            getGoogleJSON = function (data) {
                var gJSON = {};
                if (getResultRowCount(data)) {
                    if (endpointOutputFormat() === qfXML) {
                        gJSON = parser.convertXML(data);
                    } else {
                        gJSON = parser.convertJSON(data);
                    }
                }
                return gJSON;
            },

            // TODO: add different listeners. onQuery, onResults, onDraw?
            /**
             * Add a function which is to be fired when the
             * listener named `name` is fired.
             *
             * See `fireListener`
             *
             * @method addListener
             * @private
             * @param {String} name The name of the listener.
             * @param {Function} func The function to fire.
             * @example
             *     addListener("ready", function () { console.log("Ready!") });
             * @since 0.6.0
             **/
            addListener = function (name, func) {
                if (typeof func === 'function') { // accept only functions.
                    listeners[name] = listeners[name] || [];
                    listeners[name].push(func);
                } else {
                    throw new TypeError();
                }
            },

            /**
             * Fires (runs, executes) all functions registered
             * on the listener `name`.
             *
             * See `addListener`.
             *
             * @method fireListener
             * @private
             * @param {String} name The name of the listener.
             * @since 0.6.0
             **/
            fireListener = function (name) {
                if (listeners[name]) {
                    while (listeners[name].length) {
                        (listeners[name].pop())(); // run function.
                    }
                }
            },

            /**
             * Sends query to endpoint using AJAX. "Low level" method,
             * consider using `saveQueryResults()`.
             * @method sendQuery
             * @private
             * @async
             * @return {jQuery.Promise} A Promise containing the query results.
             * @since 0.5
             **/
            // TODO .fail, .progress: logging.
            sendQuery = function () {
                var promise, // query promise.
                    myEndpointOutput = endpointOutputFormat();

                insertFrom();

                if (myEndpointOutput !== qfJSONP &&
                        window.XDomainRequest) {

                    // special query function for IE. Hiding variables in inner function.
                    // TODO See: https://gist.github.com/1114981 for inspiration.
                    promise = (
                        function () {
                            /*global XDomainRequest */
                            var qx = $.Deferred(),
                                xdr = new XDomainRequest(),
                                url = endpointURL() +
                                    "?query=" + getEncodedQuery() +
                                    "&output=" + myEndpointOutput;
                            xdr.open("GET", url);
                            xdr.onload = function () {
                                var data;
                                if (myEndpointOutput === qfXML) {
                                    data = $.parseXML(xdr.responseText);
                                } else {
                                    data = $.parseJSON(xdr.responseText);
                                }
                                qx.resolve(data);
                            };
                            xdr.send();
                            return qx.promise();
                        }()
                    );
                } else {
                    promise = $.ajax({
                        url: endpointURL(),
                        data: {
                            query: prefixesSPARQL() + query(),
                            output: (myEndpointOutput === qfJSONP) ? qfJSON : myEndpointOutput
                        },
                        dataType: myEndpointOutput
                    });
                }
                return promise;
            },

            /**
             * Saves the query result set in the private property
             * `results`. Works like a wrapper for sendQuery().
             *
             * See also saveDataTable().
             *
             * @TODO: also put the results in the promise object---and
             * how to get them out?
             *
             * @method saveQueryResults.
             * @private
             * @async
             * @return {jQuery.Promise} A Promise which resolves when
             * the results are saved.
             * @since 0.5
             **/
            saveQueryResults = function () {
                var qr;

                if (queryResult !== undefined) {
                    qr = queryResult;
                } else {
                    qr = sendQuery();
                    qr.fail(
                        function (xhr, textStatus, thrownError) {
                            logger.log("Error: A '" + textStatus + "' occurred in Query.saveQueryResults()");
                            fireListener('onFail');
                        }
                    );
                    // add callback to save query results in object.
                    qr.done(
                        function (data) {
                            queryResult = data;
                            fireListener('onDone');
                        }
                    );
                }
                return qr;
            },

            /**
             * Converts the the query result set into a
             *  google.visualization.DataTable, and if specified,
             *  applies datatable preprocessing function, and saves
             *  the datatable in the private property
             *  `dataTable`.
             *
             * @TODO: also put the results in the promise object---and
             * how to get them out?
             *
             * @method saveDataTable
             * @private
             * @async
             * @return {jQuery.Promise} A Promise which resolves when
             * the datatable is saved.
             * @since 0.5
             **/
            saveDataTable = function () {
                /*global google */
                var qdt, // query data table.
                    myDatatableFunction = datatableFunction();

                if (dataTable) { // dataTable already computed.
                    qdt = dataTable;
                } else {
                    qdt =
                        $.when(
                            saveQueryResults(),
                            loadDependencies(fDataTable),
                            // Get possible preprocess function.
                            (function () {
                                var loader = {};
                                if (myDatatableFunction) {
                                    loader = loadDependencies(myDatatableFunction);
                                }
                                return loader;
                            }())
                        )
                        //TODO .fail(function () {})
                        .done(
                            function () {
                                dataTable = new google.visualization.DataTable(getGoogleJSON(queryResult));
                                if (myDatatableFunction) {
                                    var func = util.getObjectByPath(myDatatableFunction);
                                    dataTable = func(dataTable);
                                }
                            }
                        );
                    // TODO .fail, .progress: logging.
                }
                return qdt;
            },

            /**
             * Draws the result of the query in a given container.
             * @method draw
             * @public
             * @param {String} containerId The elementId of the
             * container to draw the result of the query.
             * @since 0.5
             **/
            draw = function (containerId) {
                /*global google */
                // Get query results and necessary charting functions in parallel,
                // then draw chart in container.

                var myChart = chartFunction();

                $.when(saveDataTable(),
                       loadDependencies(myChart))
                    .then(
                        function () {
                            try {
                                // chart is loaded by loadDependencies.
                                var Func = util.getObjectByPath(myChart),
                                    chartFunc = new Func(document.getElementById(containerId)),
                                    ready = function () {
                                        logger.log(myChart + " for " + containerId + " is ready.");
                                        fireListener('onDraw');
                                    };

                                // log when chart is loaded.
                                if (util.startsWith(myChart, moduleGooVis)) {
                                    google.visualization.events.addListener(chartFunc, 'ready', ready);
                                } else if (chartFunc.addListener) {
                                    chartFunc.addListener('ready', ready);
                                }

                                // dataTable is set by saveDataTable.
                                chartFunc.draw(dataTable, chartOptions);
                            } catch (x) {
                                // TODO: better error reporting, what went wrong?
                                logger.log(myChart + " -- " + x);
                            }
                        }
                    );
            };

        /////////////////////////////////////////////////////////
        // Initialize things.

        // Load default values, and overwrite them with values given
        // in constructer parameters.
        queryOptions = $.extend(defaults.getQueryOptions(),
                                queryOpt);
        chartOptions = $.extend(defaults.getChartOptions(),
                                defaults.getChartSpecificOptions(chartFunction()),
                                chartOpt);

        // Safeguard constructor.
        if (!(this instanceof S.Query)) {
            throw new Error("Constructor 'Query' called as a function. Use 'new'.");
        }

        ////////////////////////////////////////////////////////
        // PUBLICs

        return {

            //// attributes
            noOfResults: noOfResults,

            //// functions
            draw: draw,
            getEncodedQuery: getEncodedQuery,

            // listeners
            onFail: function (func) {
                addListener('onFail', func);
            },
            onDone: function (func) {
                addListener('onDone', func);
            },
            onDraw: function (func) {
                addListener('onDraw', func);
            },

            /**
             * @method getDataTable
             * @public
             * @param {Function} success
             * @param {Function} fail
             * @async
             * @beta
             */
            getDataTable: function (success, fail) {
                $.when(saveDataTable())
                    .then(
                        function () {
                            var data = dataTable.clone();
                            success(data);
                        },
                        function () {
                            var data = dataTable.clone();
                            fail(data);
                        }
                    );
            },
            // TODO
            /*getQueryResults : function (success, fail) {
                $.when(saveQueryResults()).then(success(queryResult), fail);
            },
            getGoogleJSON: function (success, fail) {
                getQueryResults(
                    function (queryResult) {
                        success(getGoogleJSON(queryResult));
                    },
                    fail
                );
            },*/

            //// FROM
            addFrom: addFrom,
            clearFroms: clearFroms,

            //// Getters/setters. Cascade pattern.
            query: query,
            endpointURL: endpointURL,
            endpointOutputFormat: endpointOutputFormat,
            endpointResultsURLPart: endpointResultsURLPart,
            validatorURL: validatorURL,
            loglevel: loglevel,
            logContainer: logContainer,
            datatableFunction: datatableFunction,
            chartFunction: chartFunction,
            chartHeight: chartHeight,
            chartWidth: chartWidth
        };
    };
