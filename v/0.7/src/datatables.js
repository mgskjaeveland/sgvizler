
    /**
     * Factory for creating new datatypes functions.
     * 
     * Dependencies:
     * 
     *  - sgvizler.registry
     * 
     * @class sgvizler.datatables
     * @static
     */
    S.datatables = (function () {

        // Module dependencies:
        var addFunction = S.registry.addFunction,

            /**
             * Create new Chart type.
             * @method datatablesAdd
             * @public
             * @for sgvizler
             * @param {String} module The module/namespace name to
             * which the function belongs.
             * @param {String} name The name of the function.
             * @param {Function} func The datatable processing function.
             * @param {Object} dependencies The list of dependencies
             * for the chart type: function name -- google
             * package/javascript URL pairs.
             * @return {Function} The datatable processing function.
             * @since 0.6.0
             */
            add = function (module, name, func, dependencies) {
                addFunction(module, name, 'datatable', dependencies);
                return func;
            };

        /////////////////////////////////////////////////////////
        // PUBLICs chartFactory

        return {
            add: add
        };
    }());

