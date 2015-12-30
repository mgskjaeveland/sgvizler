
    /**
     * Handles all logging, either to console or designated HTML
     * container.
     *
     * Needs more work.
     *
     * @class sgvizler.logger
     * @static
     */
    S.logger = (function () {

        /*global $, console*/

        // Module dependencies:
        //var util = S.util,
        var
            /**
             * The timestamp for the load start of the current running
             * version of sgvizler. Used to calculate time elapse of
             * future events.
             * @property start
             * @type number
             * @private
             * @since 0.6.0
             **/
            startTime = Date.now(),

            /**
             * @method timeElapsed
             * @private
             * @return {number} The number of seconds elapsed since
             * this sgvizler got loaded.
             * @since 0.6.0
             **/
            elapsedTime = function () {
                return (Date.now() - startTime) / 1000;
            },

            /**
             * @property waitingCharts
             * @type number
             * @private
             * @beta
             **/
            waitingCharts = 0;

        return {

            /**
             * Logs a message.
             * @method log
             * @protected
             * @param {string} message The message to log.
             * @beta
             */
            log: function (message) {
                console.log(elapsedTime() + "s: " + message);
            },

            // TODO
            loadingChart: function () {
                waitingCharts += 1;
                if (!$('body,html').css('cursor', 'progress')) {
                    $('body,html').css('cursor', 'progress');
                }
            },
            doneLoadingChart: function () {
                waitingCharts -= 1;
                if (waitingCharts === 0 && $('body,html').css('cursor', 'progress')) {
                    $('body,html').css('cursor', 'default');
                }
            }

            // TODO
        //     displayFeedback: function (query, messageName) {
        //         var message,
        //             container = query.logContainer();

        //         if (query.loglevel() === 0) {
        //             message = "";
        //         } else if (query.loglevel() === 1) {
        //             if (messageName === "LOADING") {
        //                 message = "Loading...";
        //             } else if (messageName === "ERROR_ENDPOINT" || messageName === "ERROR_UNKNOWN") {
        //                 message = "Error.";
        //             }
        //         } else {
        //             if (messageName === "LOADING") {
        //                 message = "Sending query ...";
        //             } else if (messageName === "ERROR_ENDPOINT") {
        //                 message = "Error querying endpoint. Possible errors:" +
        //                     util.html.ul(
        //                         util.html.a(query.endpoint(), "SPARQL endpoint") + " down? " +
        //                             util.html.a(query.endpoint() + query.endpointQueryURL + query.encodedQuery(),
        //                                         "Check if query runs at the endpoint") + ".",
        //                         "Malformed SPARQL query? " +
        //                             util.html.a(query.validatorQueryURL() + query.encodedQuery(), "Check if it validates") + ".",
        //                         "CORS supported and enabled? Read more about " +
        //                             util.html.a(S.homepage + "/wiki/Compatibility", "CORS and compatibility") + ".",
        //                         "Is your " + util.html.a(S.homepage + "/wiki/Compatibility", "browser support") + "ed?",
        //                         "Hmm.. it might be a bug! Please file a report to " +
        //                             util.html.a(S.homepage + "/issues/", "the issues") + "."
        //                     );
        //             } else if (messageName === "ERROR_UNKNOWN") {
        //                 message = "Unknown error.";
        //             } else if (messageName === "NO_RESULTS") {
        //                 message = "Query returned no results.";
        //             } else if (messageName === "DRAWING") {
        //                 message = "Received " + query.noRows + " rows. Drawing chart...<br/>" +
        //                     util.html.a(query.endpoint + query.endpoint_query_url + query.encodedQuery,
        //                                 "View query results", "target='_blank'") + " (in new window).";
        //             }
        //         }
        //         if (message) {
        //             $('#' + container).append(util.html.tag("p", message));
        //         }
        //     }
        };
    }());
