
    /**
     * Factory for creating new chart types. Ensures that chart types
     * correctly inherit methods from the inner class Chart.
     *
     * Dependencies:
     *
     *  - sgvizler.util
     *  - sgvizler.registry
     *
     * 
     * 
     * @class sgvizler.charts
     * @static
     */
    S.charts = (function () {

        var
            // Module dependencies:
            inherit = S.util.inherit,
            addFunction = S.registry.addFunction,

            Chart, // parent chart class. Created below so that
                   // documentation of methods falls into the right
                   // class.

            /**
             * Create new Chart type.
             * @method chartsAdd
             * @public
             * @for sgvizler
             * @param {String} module The module/namespace name to
             * which the function belongs.
             * @param {String} name The name of the function.
             * @param {Function} draw The function which will be the
             * `draw()` function of the new chart type.
             * @param {Object} dependencies The list of dependencies
             * for the chart type: function name -- google
             * package/javascript URL pairs.
             * @return {Object} The chart type.
             * @since 0.6.0
             **/
            add = function (module, name, draw, dependencies) {
                // This is the object from which new are created.
                var NewChart = function (container) {
                    Chart.call(this, container);
                };

                // Set inheritance.
                inherit(NewChart, Chart);

                // Copy draw() into new object.
                NewChart.prototype.draw = draw;

                addFunction(module, name, 'chart', dependencies);
                return NewChart;
            };


        /////////////////////////////////////////////////////////
        // Inner class Chart

        /**
         * Inner class which all chart types created by
         * sgvizler.charts inherit from, i.e., don't create new charts
         * from this class, but use sgvizler.charts.create() instead.
         * @class sgvizler.charts.Chart
         * @constructor
         * @param {Object} container The container element where the
         * chart will be drawn.
         */
        // This function builds the class Chart.
        Chart = (function () {
            var C = function (container) {
                this.container = container;
                this.listeners = {};
            };
            C.prototype = {

                /**
                 * Add a function which is to be fired when the
                 * listener named `name` is fired.
                 *
                 * See `fireListener`
                 *
                 * @method addListener
                 * @public
                 * @param {String} name The name of the listener.
                 * @param {Function} func The function to fire.
                 * @example
                 *     addListener("ready", function () { console.log("Ready!") });
                 * @since 0.6.0
                 **/
                addListener: function (name, func) {
                    if (typeof func === 'function') { // accept only functions.
                        this.listeners[name] = this.listeners[name] || [];
                        this.listeners[name].push(func);
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
                 * @public
                 * @param {String} name The name of the listener.
                 * @since 0.6.0
                 **/
                fireListener: function (name) {
                    if (this.listeners[name]) {
                        while (this.listeners[name].length) {
                            (this.listeners[name].pop())(); // run function.
                        }
                    }
                }
            };
            return C;
        }());

        /////////////////////////////////////////////////////////
        // PUBLICs for sgvizler.charts
        return {
            add: add
        };
    }());
