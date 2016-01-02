
    //TODO publish libs at libFolder

    /**
     * Static class for handling functions used for drawing charts,
     * mainpulating datacharts, and what their dependencies are.
     * 
     * Dependencies:
     * 
     *  - sgvizler.util
     * 
     * See also:
     * 
     *   - sgvizler.charts, sgvizler.datatables (classes for creating new such functions)
     *   - sgvizler.loader (class for loading dependencies)
     * 
     * @class sgvizler.registry
     * @static
     */
    S.registry = (function () {

        // Module dependencies:
        var util = S.util,

            /**
             * The Google Visualization package name.
             * @property GVIZ
             * @type String
             * @private
             * @final 
             * @since 0.6.0
             **/
            GVIZ = 'google.visualization',

            /**
             * The Google Visualization DataTable class name.
             * @property DATATABLE
             * @type String
             * @private
             * @final 
             * @since 0.6.0
             **/
            DATATABLE = GVIZ + '.DataTable',

            /**
             * The Google Maps package name.
             * @property GVIZ
             * @type String
             * @private
             * @final 
             * @since 0.6.0
             **/
            GMAP = 'google.maps',

            /**
             * Stores the modules of the registered functions
             * according to the type of function, i.e., `chart` or
             * `datatable`.
             * @property modules
             * @type Object
             * @private
             * @since 0.6.0
             **/
            modules = {
                chart: [GVIZ],//, GMAP],
                datatable: []
            },

            /**
             * Stores registered function names and their
             * dependencies, e.g., specifies which google
             * visualization packages to load for the different
             * charts.
             * 
             * Property legend:
             * 
             *  - `t`: type. Values: `core`, `datatable`, `chart` (default)
             *  - `d`: dependences. Object containing functions--gviz package/js file
             *    - `i`: the function itself, as in I.
             * 
             * @property registry
             * @type Object
             * @private
             * @since 0.6.0
             **/
            registry = {
                google: {
                    //////////////////////////////////////////////////////
                    // google.visualization
                    visualization: {
                        DataTable: {
                            t: 'core',
                            d: { i: GVIZ }
                        },
                        LineChart: {
                            d: { i: 'corechart' }
                        },
                        AreaChart: {
                            d: { i: 'corechart' }
                        },
                        SteppedAreaChart: {
                            d: { i: 'corechart' }
                        },
                        PieChart: {
                            d: { i: 'corechart' }
                        },
                        BubbleChart: {
                            d: { i: 'corechart' }
                        },
                        ColumnChart: {
                            d: { i: 'corechart' }
                        },
                        BarChart: {
                            d: { i: 'corechart' }
                        },
                        ImageSparkLine: {
                            d: { i: 'imagesparkline' }
                        },
                        ScatterChart: {
                            d: { i: 'corechart' }
                        },
                        CandlestickChart: {
                            d: { i: 'corechart' }
                        },
                        Gauge: {
                            d: { i: 'gauge' }
                        },
                        OrgChart: {
                            d: { i: 'orgchart' }
                        },
                        TreeMap: {
                            d: { i: 'treemap' }
                        },
                        AnnotatedTimeLine: {
                            d: { i: 'annotatedtimeline' }
                        },
                        MotionChart: {
                            d: { i: 'motionchart' }
                        },
                        GeoChart: {
                            d: { i: 'geochart' }
                        },
                        GeoMap: {
                            d: { i: 'geomap' }
                        },
                        Map: {
                            d: { i: 'map' }
                        },
                        Table: {
                            d: { i: 'table' }
                        }
                    },
                    //////////////////////////////////////////////////////
                    // google.maps
                    maps: {
                        Map: {
                            d: { i: 'map' }
                        }
                    }
                }
            };

        ////////////////////////////////////////////
        // PUBLICs

        return {

            // Constants
            GVIZ: GVIZ,
            GMAP: GMAP,
            DATATABLE: DATATABLE,

            /**
             * Get list of registered chart module (names), i.e., modules for
             * which there are registered functions for drawing
             * charts.
             * @method chartModules
             * @protected
             * @return {Array} (an array of strings)
             * @since 0.6.0
             **/
            chartModules: function () {
                return modules.chart;
            },

            /**
             * Get list of registered chart functions names (not the
             * functions themselves).
             * @method chartsFunctions
             * @protected
             * @return {Array} (an array of strings)
             * @since 0.6.0
             **/
            chartFunctions: function () {
                var i, len,
                    libs = modules.chart,//TODO: should be chartModules() but gives "is not defined"-error.
                    lib,
                    func,
                    charts = [];

                for (i = 0, len = libs.length; i < len; i += 1) {
                    lib = util.getObjectByPath(libs[i], registry);
                    for (func in lib) {
                        if (lib.hasOwnProperty(func) &&
                                (lib[func].t === undefined ||
                                 lib[func].t === 'chart')) {
                            charts.push(libs[i] + "." + func);
                        }
                    }
                }
                return charts;
            },

            /**
             * Get list of dependencies, either google visualization
             * packages or javascripts (URLs), for given function
             * name.
             * @method getDependencies
             * @protected
             * @param {String} functionName
             * @return {Array} (an array of strings)
             * @since 0.6.0
             **/
            getDependencies: function (functionName) {
                var regFunc = util.getObjectByPath(functionName, registry),
                    deps = (regFunc && regFunc.d) || {};

                // rename i to functionName:
                if (deps.i) {
                    deps[functionName] = deps.i;
                    delete deps.i;
                }
                return deps;
            },

            /**
             * Add function to registry.
             * @method addFunction
             * @protected
             * @param {String} module name of module to which function belongs.
             * @param {String} name name of function.
             * @param {String} type of function, usually either `'chart'`, `'datatable'`.
             * @param {Object} dependencies list of function
             * name--dependency pairs. Example: `{ 'XYZ':
             * 'http://example.org/XYZ.js' }` if the function requires
             * the XYX function to draw and this function is located
             * at `http://example.org/XYZ.js`.
             * @since 0.6.0
             **/
            addFunction: function (module, name, type, dependencies) {
                var regFunc; // The function's place in registry.

                // Add module if it is new.
                if (!util.isInArray(module, modules[type])) {
                    modules[type].push(module);
                }

                // Add function to registry.
                regFunc = util.getObjectByPath(module + "." + name, registry, true);

                if (type) {
                    regFunc.t = type;
                }
                if (dependencies) {
                    regFunc.d = dependencies;
                }
            }

        };
    }());