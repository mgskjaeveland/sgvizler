// Sgvizler - https://dev.data2000.no/sgvizler/
// (c) 2011--2013 - Martin G. Skjæveland - MIT license

(function (window, undefined) { // trick: safekeep 'undefined', and minify.
    "use strict";

    /*global window, jQuery */
    /*jslint todo: true */

    var document = window.document, // trick: minify.
        S = {}, // local scope sgvizler variable.

        // Used in end. (Odd names such that these variables are not
        // accidentally accessed by child modules.)
        globalGetSet,
        globalDefaultsQuery,
        globalDefaultsChart;


        //// OTHER SOURCE FILES ARE CONCATENATED IN BELOW
        //// ENDING WITH end.js.part

    /**
     * Holds central constants.
     * 
     * @class sgvizler.core
     */

    S.core = (function () {

        // global public constants
        var

            /**
             * The version number of this sgvizler.
             * @property {string} VERSION
             * @final
             * @public
             * @for sgvizler
             * @since 0.6.0
             **/
            VERSION = "0.6.0",

            /**
             * sgvizler's homepage.
             * @property {string} HOMEPAGE
             * @final
             * @public
             * @for sgvizler
             * @since 0.6.0
             **/
            HOMEPAGE = "http://dev.data2000.no/sgvizler/",

            // global private constants
            LOGOIMAGE = "http://beta.data2000.no/sgvizler/misc/image/mr.sgvizler.png",
            CHARTSCSS = "http://beta.data2000.no/sgvizler/release/0.6/sgvizler.charts.css";

        return {
            VERSION: VERSION,
            HOMEPAGE: HOMEPAGE,
            LOGOIMAGE: LOGOIMAGE,
            CHARTSCSS: CHARTSCSS
        };
    }());

    /**
     * A helpful set of static utility functions: type checking
     * variables, generic get-setter, get-setting values in
     * hierarchial objects, array functions, DOM manipulation, and
     * inheritance.
     *
     * Dependencies:
     *
     *   - jQuery
     *
     * @class sgvizler.util
     * @static
     */
    S.util = (function () {

        /*global $ */

        var

            /**
             * Checks if `input` is a string.
             * @method isString
             * @protected
             * @param input
             * @return {boolean} True iff `input` is a string.
             * @since 0.6.0
             **/
            isString = function (input) {
                return typeof input === 'string';
            },

            /**
             * Checks if `input` is a number.
             * @method isNumber
             * @protected
             * @param input
             * @return {boolean} True iff `input` is a number.
             * @since 0.6.0
             **/
            isNumber = function (input) {
                return typeof input === 'number';
            },

            /**
             * Checks if `input` is a boolean.
             * @method isBoolean
             * @protected
             * @param input
             * @return {boolean} True iff `input` is a boolean.
             * @since 0.6.0
             **/
            isBoolean = function (input) {
                return typeof input === 'boolean';
            },

            /**
             * Checks if `input` is a primitive, i.e., either a string,
             * a number or a boolean.
             * @method isPrimitive
             * @protected
             * @param input
             * @return {boolean} True iff `input` is a string, a number or a boolean.
             * @since 0.6.0
             **/
            isPrimitive = function (input) {
                return isString(input) || isNumber(input) || isBoolean(input);
            },

            /**
             * Checks if `input` is a function.
             * @method isFunction
             * @protected
             * @param input
             * @requires jQuery
             * @return {boolean} True iff `input` is a function.
             * @since 0.6.0
             **/
            isFunction = $.isFunction,

            /**
             * Checks if `input` is an array.
             * @method isArray
             * @protected
             * @param input
             * @requires jQuery
             * @return {boolean} True iff `input` is an array.
             * @since 0.6.0
             **/
            isArray = $.isArray,

            /**
             * Checks if `input` is a URL.
             * @method isURL
             * @protected
             * @param input
             * @return {boolean} True iff `input` is a URL.
             * @since 0.6.0
             **/
            URLpattern = new RegExp(
                '^(https?:\\/\\/)?'                                       // protocol
                    + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'  // domain name
                    + '((\\d{1,3}\\.){3}\\d{1,3}))'                       // OR ip (v4) address
                    + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'                   // port and path
                    + '(\\?[;&a-z\\d%_.~+=-]*)?'                          // query string
                    + '(\\#[-a-z\\d_]*)?$',                                // fragment locator
                'i'
            ),

            isURL = function (input) {
                return URLpattern.test(input);
            },

            /**
             * Establish "classical inheritance" from Parent to
             * Child. Child is linked to the Parent's prototype
             * through a new proxy object. This means the Child has a
             * prototype object of its own, and access to the Parent's
             * prototype.
             *
             * Taken from book "JavaScript Patterns".
             * @method inherit
             * @protected
             * @param {Object} Child
             * @param {Object} Parent
             * @since 0.6.0
             **/
            inherit = (function () {
                var Proxy = function () {};
                return function (Child, Parent) {
                    Proxy.prototype = Parent.prototype;
                    Child.prototype = new Proxy();
                    //Child.superobject = Parent.prototype;
                    Child.prototype.constructor = Child;
                };
            }()),


            /**
             * Generic set/get method. If `value` is defined, then the
             * attribute/property `attr` of `setObject` is set to
             * `value` and `returnObject` is returned. Otherwise, the
             * (value of) `attr` attribute/property is
             * returned. Useful for a casading pattern.
             * @method getset
             * @protected
             * @param {string} attr The name of the property to get/set.
             * @param {Object} [value] The value to set.
             * @param {Object} setObject The object for which the property shall be set/get.
             * @param {Object} returnObject The object to return if value is undefined.
             * @return {any} Either `returnObject` or `setObject[attr]`
             * @example
             *     getset('age', 55, person.myArray, person)
             *   sets `person.myArray.age = 55` and returns `person`.
             *
             *     getset('age', undefined, person.myArray, person)
             *   returns `person.myArray.age`.
             * @since 0.6.0
             **/
            getset = function (attr, value, setObject, returnObject) {
                if (value !== undefined) {
                    setObject[attr] = value;
                }
                return (value !== undefined) ? returnObject : setObject[attr];
            },

            /**
             * Checks if a string starts with (is the prefix of) an other string.
             * @method startsWith
             * @protected
             * @param {string} string
             * @param {string} prefix
             * @return {boolean} True iff `prefix` is the prefix of `string`.
             * @example
             *     startsWith("Hal", "Hallo!");  // returns true
             *     startsWith("hal", "Hallo!");  // returns false
             * @since 0.6.0
             **/
            startsWith = function (string, prefix) {
                return string.lastIndexOf(prefix, 0) === 0;
            },

            /**
             * Gets the object located at `path` from `object`. `path`
             * is given in dot notation.
             *
             * @method getObjectByPath
             * @protected
             * @param {string} path
             * @param {Object} [object=window]
             * @param {boolean} [create=false]
             * @return {Object} Returns the object/value located at
             * the `path` of `object`; otherwise, if `create` is true,
             * it is created.
             * @example
             *     getObjectByPath('sgvizler.visualization.Table', registry, true)
             *   returns the object located at
             *   `registry['sgvizler']['visualization']['Table']` if it
             *   exists; otherwise, since `'create' === true`, the path
             *   and (empty) object is created and returned.
             * @since 0.6.0
             **/
            getObjectByPath = function (path, object, create) {
                var i, len,
                    segments = path.split('.'),
                    cursor = object || window; // window is the global scope.

                for (i = 0, len = segments.length; i < len; i += 1) {
                    if (cursor !== undefined &&                   // cursor must be defined
                            cursor[segments[i]] === undefined &&
                            create) {                             // create new child element.
                        cursor[segments[i]] = {};
                    }
                    cursor = cursor && cursor[segments[i]];     // if cursor is undefined, it remains undefined.
                }
                return cursor;
            },

            /**
             * Checks if a an array contains a given element.
             * @method isInArray
             * @protected
             * @param {any} item
             * @param {Array} array
             * @return {boolean} True iff `array` contains an element `item`.
             * @since 0.6.0
             **/
            isInArray = function (item, array) {
                return ($.inArray(item, array) !== -1);
            },

            /**
             * Removes duplicates from an array.
             * @method removeDuplicates
             * @protected
             * @param {Array} array
             * @return {Array} The input array with duplicates removed.
             * @example
             *     removeDuplicates([1, 1, 1, 2, 4, 3, 2]);  // returns [1, 2, 4, 3]
             * @since 0.6.0
             **/
            removeDuplicates = function (array) {
                var i, len,
                    unique = [];
                for (i = 0, len = array.length; i < len; i += 1) {
                    if (!isInArray(array[i], unique)) {
                        unique.push(array[i]);
                    }
                }
                return unique;
            },

            /**
             * Converts `input` to an array. If `input` is undefined,
             * then an empty array is returned. If `input` is
             * primitive, then it is put in an (empty) array. If `input`
             * /is/ an array, then the `input` is simply returned.
             *
             * Useful for converting input to other methods to arrays.
             * @method toArray
             * @protected
             * @param {undefined|primitive|Array} input
             * @return {Array} An array representation of `input`.
             * @example
             *     toArray(undefined);       // returns []
             *     toArray('myString');      // returns ['myString']
             *     toArray([1, 2, 3]);       // returns [1, 2, 3]
             *     toArray(function () {});  // throws TypeError
             * @since 0.6.0
             **/
            toArray = function (input) {
                var output;
                if (input === undefined) {
                    output = [];
                } else if (isPrimitive(input)) {
                    output = [input];
                } else if (isArray(input)) {
                    output = input;
                } else {
                    throw new TypeError();
                }
                return output;
            },

            /**
             * Creates an HTML element according to a custom made
             * "array syntax". Used to make HTML DOM manipulation more
             * code compact.
             * @method createHTMLElement
             * @protected
             * @param {string} elementType The type of element to
             * create, e.g., "div" or "h1".
             * @param {Object} [attributes] Object of
             * attribute--value's to be added to the element.
             * @param {Array|primitive} [children] An array of
             * children to be added to the element; each element in
             * the `children` array is an array of three elements, one
             * for each parameter of this method. If this argument is
             * a primitive, then it is inserted as a text node.
             * @return {Object} Element (ready for insertion into DOM.)
             * @example
             *     createHTMLElement('ul', { 'class': "myClass", 'id': "myID" }, [ ['li', null, "One" ],
             *                                                                     ['li', { 'id': "ABC" } , 2 ],
             *                                                                     ['li', null, true] ] );
             *
             *   will create the HTML element:
             *
             *     <ul id="myID" class="myClass">
             *       <li>One</li>
             *       <li id="ABC">2</li>
             *       <li>true</li>
             *     </ul>
             * @since 0.6.0
             **/
            createHTMLElement = function createHTMLElement(elementType, attributes, children) {
                var i, len,
                    element = $(document.createElement(elementType)),
                    attr,
                    childs = toArray(children), // [sic]
                    child;

                // Add attributes to element.
                for (attr in attributes) {
                    if (attributes.hasOwnProperty(attr)) {
                        element.attr(attr, attributes[attr]);
                    }
                }

                // Add children to element. String are "simply" added, else it
                // should be an array of arguments to (recursive) create() call.
                for (i = 0, len = childs.length; i < len; i += 1) {
                    child = childs[i];
                    if (isPrimitive(child)) {
                        element.append(child);
                    } else if (isArray(child)) {
                        element.append(createHTMLElement.apply(undefined, child));
                    } else {
                        throw new TypeError();
                    }
                }
                return element;
            };

        return {
            isString: isString,
            isNumber: isNumber,
            isBoolean: isBoolean,
            isPrimitive: isPrimitive,
            isFunction: isFunction,
            isArray: isArray,
            isURL: isURL,

            startsWith: startsWith,

            isInArray: isInArray,
            toArray: toArray,
            removeDuplicates: removeDuplicates,

            getObjectByPath: getObjectByPath,

            getset: getset,
            inherit: inherit,

            createHTMLElement: createHTMLElement
        };
    }());

    /**
     * Static class for handling prefixes and namespaces. Use for
     * storing prefixes used in SPARQL queries and for formatting
     * result sets, i.e., replacing namespaces with prefixes, which
     * many chart functions automatically do.
     *
     * Already defined prefixes are `rdf`, `rdfs`, `owl` and `xsd`.
     *
     * Dependencies:
     *
     *   - sgvizler.util
     *
     * @class sgvizler.namespace
     * @static
     */
    S.namespace = (function () {

        // Module dependencies:
        var startsWith = S.util.startsWith,
            isString = S.util.isString,

            /**
             * Stores prefix--namespace pairs.
             * @property nss
             * @type Object
             * @private
             * @since 0.1
             **/
            nss = {
                'rdf' : "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                'rdfs': "http://www.w3.org/2000/01/rdf-schema#",
                'owl' : "http://www.w3.org/2002/07/owl#",
                'xsd' : "http://www.w3.org/2001/XMLSchema#"
            },

            /**
             * @property baseURL
             * @type String
             * @private
             * @since 0.6.0
             **/
            baseURL = null;

        /////////////////////////////////////////////////////////
        // PUBLICs

        return {

            /**
             * Get a namespace.
             *
             * See also set.
             *
             * @method get
             * @protected
             * @param {string} prefix The prefix to get the namespace for.
             * @return {string} The namespace set for 'prefix';
             * undefined if 'prefix' does not exist.
             * @example
             *     get('xsd');  // returns "http://www.w3.org/2001/XMLSchema#"
             * @since 0.6.0
             **/
            get: function (prefix) {
                return nss[prefix];
            },

            /**
             * Set a namespace.
             *
             * See also get.
             *
             * @method set
             * @protected
             * @param {string} prefix The prefix to set.
             * @param {string} namespace The namespace to set.
             * @example
             *     set('foaf', "http://xmlns.com/foaf/0.1/");
             *   sets `'foaf'` as prefix for the FOAF namespace.
             * @since 0.6.0
             **/
            set: function (prefix, namespace) {
                nss[prefix] = namespace;
            },

            /**
             * Get Base URL value.
             *
             * See also setBaseURL.
             *
             * @method getBaseURL
             * @return {string} The base URL.
             * @protected
             * @since 0.6.0
             **/
            getBaseURL: function () {
                return baseURL;
            },
            /**
             * Set Base URL value.
             *
             * See also setBaseURL.
             *
             * @method getBaseURL
             * @param {string} url The base URL.
             * @protected
             * @since 0.6.0
             **/
            setBaseURL: function (url) {
                baseURL = url;
            },

            /**
             * Get all prefixes in SPARQL format.
             * @method prefixesSPARQL
             * @protected
             * @return {string} An SPARQL formatted prefix declaration
             * text block containing all set prefixes.
             * @since 0.1
             **/
            prefixesSPARQL: function () {
                var prefix,
                    prefixes = "";
                for (prefix in nss) {
                    if (nss.hasOwnProperty(prefix)) {
                        prefixes += "PREFIX " + prefix + ": <" + nss[prefix] + ">\n";
                    }
                }
                return prefixes;
            },

            /**
             * Replace a namespace with its prefix, for string which
             * starts with a namespace. Typically used for URLs of
             * resources.
             *
             * Leaves other strings untouched.
             *
             * See also unprefixify.
             *
             * @method prefixify
             * @protected
             * @param {string} url
             * @return {string}
             * @example
             *     prefixify("http://www.w3.org/2002/07/owl#Class");  // returns "owl:Class"
             *     prefixify("Hello World!");   // returns "Hello World!"
             * @since 0.3.3
             **/
            prefixify: function (url) {
                var prefix;
                if (isString(url)) {
                    for (prefix in nss) {
                        if (nss.hasOwnProperty(prefix) &&
                                startsWith(url, nss[prefix])) {
                            return url.replace(nss[prefix], prefix + ":");
                        }
                    }
                }
                return url;
            },

            /**
             * Replace a prefix with its namespace, for string which
             * starts with a prefix: Typically used for prefixed URLs
             * (QNames) of resources.
             *
             * Leaves other strings untouched.
             *
             * See also prefixify.
             *
             * @method unprefixify
             * @protected
             * @param {string} qname
             * @return {string}
             * @example
             *     unprefixify("owl:Class");     // returns "http://www.w3.org/2002/07/owl#Class"
             *     unprefixify("Hello World!");  // returns "Hello World!"
             * @since 0.3.3
             **/
            unprefixify: function (qname) {
                var prefix;
                if (isString(qname)) {
                    for (prefix in nss) {
                        if (nss.hasOwnProperty(prefix) &&
                                startsWith(qname, prefix + ":")) {
                            return qname.replace(prefix + ":", nss[prefix]);
                        }
                    }
                }
                return qname;
            }
        };

    }());

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


    /** 
     * Parses a SPARQL result set, assumed to be in either W3C's
     * [XML](http://www.w3.org/TR/rdf-sparql-XMLres/) or
     * [JSON](http://www.w3.org/TR/rdf-sparql-json-res/) format, into
     * [Google
     * JSON](https://developers.google.com/chart/interactive/docs/reference#DataTable)
     * which is the JSON format that the
     * `google.visualization.DataTable` class accepts.
     * 
     * Variable notation: xtable, xcol(s), xrow(s) -- x is 's'(parql)
     * or 'g'(oogle).
     * 
     * Dependencies:
     *   - `sgvizler.namespace`
     *   - jQuery - for xml "browsing".
     * 
     * @class sgvizler.parser
     * @static
     */

    S.parser = (function () {

        /*global $ */

        // Module dependencies:
        var namespace = S.namespace,

            /**
             * Convertion table for turning XSD datatypes into the
             * "javascript" datatypes which the
             * `google.visualization.DataTable` accepts, which is: `string`,
             * `number`, `boolean`, `date`, `datetime`, `timeofday`.
             * @property datatypeXSD2JS
             * @type Object
             * @private
             * @since 0.1
             **/

            datatypeXSD2JS = (function () {
                var xsdns = namespace.get('xsd'),
                    table = [];
                table[xsdns + "float"]    = 'number';
                table[xsdns + "decimal"]  = 'number';
                table[xsdns + "int"]      = 'number';
                table[xsdns + "integer"]  = 'number';
                table[xsdns + "long"]     = 'number';
                table[xsdns + "boolean"]  = 'boolean';
                table[xsdns + "date"]     = 'date';
                table[xsdns + "dateTime"] = 'datetime';
                table[xsdns + "time"]     = 'timeofday';
                return table;
            }()),


            /** 
             * Converts XSD datatypes into Google JSON datatypes. 
             * 
             * See also property `datatypeXSD2JS`.
             * @method getGoogleJsonDatatype
             * @private
             * @param {string} sdatatype An XSD datatype, full URL.
             * @return {string} gdatatype, defaults to `string`
             * @since 0.1
             **/
            getGoogleJsonDatatype = function (sdatatype) {
                return datatypeXSD2JS[sdatatype] || 'string';
            },

           /** Converts results values into Google JSON values
            * according to the Google JSON datatype, i.e., values
            * other than strings and booleans need special
            * treatment. If the value is an URL, we "prefixify" it.
            * 
            * See also `sgvizler.namespace.prefixify`
            * 
            * @method getGoogleJsonValue
            * @private
            * @param {string|number|boolean} value The value from the SPARQL result set.
            * @param {string} gdatatype The Google JSON datatype.
            * @param {string} stype The `type` of the value in the
            *  SPARQL endpoint, e.g. `uri` or `literal`.
            * @return {Date|number|string} The converted value.
            * @since 0.1
            **/
            getGoogleJsonValue = function (value, gdatatype, stype) {
                var newvalue;
                if (gdatatype === 'number') {
                    newvalue = Number(value);
                } else if (gdatatype === 'date') {
                    //assume format yyyy-MM-dd
                    newvalue = new Date(value.substr(0, 4),
                                        value.substr(5, 2),
                                        value.substr(8, 2));
                } else if (gdatatype === 'datetime') {
                    //assume format yyyy-MM-ddZHH:mm:ss
                    newvalue = new Date(value.substr(0, 4),
                                        value.substr(5, 2),
                                        value.substr(8, 2),
                                        value.substr(11, 2),
                                        value.substr(14, 2),
                                        value.substr(17, 2));
                } else if (gdatatype === 'timeofday') {
                    //assume format HH:mm:ss
                    newvalue = [value.substr(0, 2),
                                value.substr(3, 2),
                                value.substr(6, 2)];
                } else { // datatype === 'string' || datatype === 'boolean'
                    if (stype === 'uri') { // replace namespace with prefix
                        newvalue = namespace.prefixify(value);
                    }
                    newvalue = value;
                }
                return newvalue;
            };

        ///////////////////////////////////////////////////
        // PUBLICs

        return {

            /**
             * Converts a SPARQL XML result set into "Google JSON",
             * see
             * https://developers.google.com/chart/interactive/docs/reference#DataTable.
             * @method convertXML
             * @protected
             * @param {Object} sxml The SPARQL XML result set.
             * @return {Object} Object literal ready for
             * `google.visualization.DataTable` consumption.
             * @since 0.2.2
             **/
            convertXML: function (sxml) {
                var c, clen, // column index.
                    r, // row index.
                    gcols = [],
                    grows = [],
                    gdatatype = [], // for easy reference of datatypes.
                    sresults = $(sxml).find('sparql').find('results').find('result');

                // Build gcols: find column names and datatypes.
                c = 0;
                $(sxml).find('sparql').find('head').find('variable').each(function () {
                    var sdatatype = null,
                        name = $(this).attr('name'),
                        scell = null,
                        scells = $(sresults).find('binding[name="' + name + '"]');
                    if (scells.length) {
                        scell = $(scells).first().children().first()[0]; // uri, literal element
                        sdatatype = $(scell).attr('datatype');
                    }
                    gdatatype[c] = getGoogleJsonDatatype(sdatatype);
                    gcols[c] = { id: name, label: name, type: gdatatype[c] };
                    c += 1;
                });

                // Build grows: get results.
                r = 0;
                $(sresults).each(function () {
                    var gvalue,
                        scells,
                        scell,
                        stype,
                        svalue,
                        grow = [];
                    for (c = 0, clen = gcols.length; c < clen; c += 1) {
                        gvalue = null;
                        scells = $(this).find('binding[name="' + gcols[c].id + '"]');
                        if (scells.length &&
                                $(scells).first().children().first() &&
                                $(scells).first().children().first()[0]) {
                            scell = $(scells).first().children().first()[0]; // uri, literal element
                            stype = scell.nodeName;
                            svalue = $(scell).first().text();
                            gvalue = getGoogleJsonValue(svalue, gdatatype[c], stype);
                        }
                        grow[c] = { v: gvalue };
                    }
                    grows[r] = { c: grow };
                    r += 1;
                });

                return { cols: gcols, rows: grows };
            },

            /**
             * Converts a SPARQL JSON result set into "Google JSON",
             * see
             * https://developers.google.com/chart/interactive/docs/reference#DataTable.
             * @method convertJSON
             * @protected
             * @param {Object} stable The SPARQL JSON result set.
             * @return {Object} Object literal ready for
             * `google.visualization.DataTable` consumption.
             * @since 0.1
             **/
            convertJSON: function (stable) {
                var c, clen, // column index.
                    r, rlen, // row index.
                    srow,
                    grow,
                    gvalue,
                    sdatatype,
                    gcols = [],
                    grows = [],
                    gdatatype = [], // for easy reference of datatypes
                    scols = stable.head.vars,
                    srows = stable.results.bindings;

                // Build gcols: find column names and datatypes.
                for (c = 0, clen = scols.length; c < clen; c += 1) {
                    // Find a row where there is a value for this column
                    // in order to determine correct datatype.
                    r = 0;
                    while (r + 1 < srows.length && srows[r][scols[c]] === undefined) {
                        r += 1;
                    }
                    sdatatype = (srows[r] && (srows[r][scols[c]] && srows[r][scols[c]].datatype)) || null;
                    gdatatype[c] = getGoogleJsonDatatype(sdatatype);
                    gcols[c] = { id: scols[c], label: scols[c], type: gdatatype[c] };
                }

                // Build grows.
                // loop rows
                for (r = 0, rlen = srows.length; r < rlen; r += 1) {
                    srow = srows[r];
                    grow = [];
                    // loop cells
                    for (c = 0, clen = scols.length; c < clen; c += 1) {
                        gvalue = null;
                        if (srow[scols[c]] && srow[scols[c]].value) {
                            gvalue = getGoogleJsonValue(srow[scols[c]].value, gdatatype[c], srow[scols[c]].type);
                        }
                        grow[c] = { v: gvalue };
                    }
                    grows[r] = { c: grow };
                }

                return { cols: gcols, rows: grows };
            },

            /**
             * Returns number of results, SPARQL XML.
             * @method countXML
             * @protected
             * @param {Object} sxml The SPARQL XML result set.
             * @return {number} The number of result set rows.
             * @since 0.2.2
             */
            countXML: function (sxml) {
                return $(sxml).find('sparql').find('results').find('result').length;
            },

            /**
             * Returns number of results, SPARQL JSON.
             * @method countJSON
             * @protected
             * @param {Object} stable The SPARQL JSON result set.
             * @return {number} The number of result set rows.
             * @since 0.1
             */
            countJSON: function (stable) {
                return stable.results.bindings && stable.results.bindings.length;
            }
        };

    }());


    /**
     * Loads dependencies for external functions.
     * 
     * Dependencies:
     * 
     *   - sgvizler.util
     *   - sgvizler.logger
     *   - sgvizler.registry
     *   - jQuery
     *   - google.load
     * 
     * @class sgvizler.loader
     * @static
     */
    S.loader = (function () {

        /*global $ */

        // Module dependencies:
        var util = S.util,
            logger = S.logger,
            registry = S.registry,
            moduleGooVis = registry.GVIZ,
            moduleGooMap = registry.GMAP,

            /** 
             * Contains a list of dependency loaders: function
             * name--deferred pairs. Keeps track of dependencies which
             * have already been asked for (but possibly not been
             * loaded yet).
             * 
             * @property loaders
             * @type Object
             * @private
             * @since 0.6.0
             **/
            loaders = {},

            /**
             * @method loadGVizScript
             * @private
             * @param {Array} [packages] List of
             * `google.visualization` packages to load.
             * @param {boolean} [loadLib] True if
             * `google.visualization` should be loaded even if
             * `packages` array is empty. This is needed in order to
             * load the `DataTable` class, which belongs to no
             * package.
             * @return {jQuery.Promise} Promise object which resolves
             * the loading of the given packages/library.
             * @since 0.6.0
             **/
            loadGVizScript = function (packages, loadLib) {
                /*global google */
                var loader,
                    promise = {},
                    packs = util.removeDuplicates(packages).sort(),
                    options;

                if (packs.length || loadLib) {
                    loader = $.Deferred();
                    options = {
                        callback: function () {
                            loader.resolve();
                            loaders[moduleGooVis].resolve(); // Always resolve google visualization loader.
                            logger.log("loadGVizScript: packages LOADED: " + packs);
                        }
                    };

                    if (packs.length) {
                        options.packages = packs;
                    }
                    google.load('visualization', '1', options);
                    logger.log("loadGVizScript: loading packages: " + packs);

                    promise = loader.promise();
                }

                return promise;
            },

            /**
             * @method loadGMapScript
             * @private
             * @return {jQuery.Promise} Promise object which resolves
             * the loading of google.maps.
             * @since 0.6.0
             **/
            loadGMapScript = function () {
                /*global google */
                var loader = $.Deferred(),
                    options = {
                        other_params: "sensor=false",
                        callback: function () {
                            loader.resolve();
                            logger.log("loadGVizScript: google.maps. LOADED: ");
                        }
                    };
                google.load('maps', '3', options);
                logger.log("loadGMapScript: loading google.maps.");

                return loader.promise();
            },

            /**
             * Load the dependencies of all the given function
             * names---as specified in `sgvizler.registry`.
             * @method loadDependencies
             * @protected
             * @param {Array|string} functions A list of function
             * names (or just a single function name) to load
             * dependencies for.
             * @return {jQuery.Promise} A promise object which
             * resolves the loading of all function dependencies.
             * @example loadDependencies('google.visualization.Map');
             *     returns deferred which will load the dependencies
             *     for the `google.visualization.Map` function as
             *     specified by `sgvizler.registry`.
             * @since 0.6.0
             **/
            loadDependencies = function (functions) {
                var i, ilen,
                    func,
                    deferreds = [], // Collect an array of deferreds.
                    gVizPacks = [],    // List of google visualization packages to collect.
                    gLoader,
                    deps,
                    dep,
                    loadGLib;

                functions = util.removeDuplicates(util.toArray(functions));

                while (functions.length) {

                    func = functions.pop();
                    deps = registry.getDependencies(func);

                    for (dep in deps) {
                        if (deps.hasOwnProperty(dep)) {
                            // Dependency is already loaded/loading.
                            if (loaders[deps[dep]]) {
                                deferreds.push(loaders[deps[dep]]);
                            } else if (util.getObjectByPath(dep) === undefined) {
                                // If it is a googleViz function, then collect package in an array.
                                if (util.startsWith(dep, moduleGooVis)) {
                                    // Special handling of DataTable.
                                    if (dep === registry.DATATABLE) {
                                        loadGLib = true;
                                        loaders[deps[dep]] = $.Deferred();
                                    } else {
                                        gVizPacks.push(deps[dep]);
                                    }
                                } else if (util.startsWith(dep, moduleGooMap)) {
                                    loaders[deps[dep]] = loadGMapScript();
                                    deferreds.push(loaders[deps[dep]]);
                                    logger.log("loadDependencies: loading script: " + deps[dep]);
                                } else {
                                    // Assume dependency is a link to a javascript.
                                    loaders[deps[dep]] = $.getScript(deps[dep])
                                        .done(function () { logger.log("loadDependencies: loaded: " + deps[dep]); });
                                    deferreds.push(loaders[deps[dep]]);
                                    logger.log("loadDependencies: loading script: " + deps[dep]);
                                }
                            }
                        }
                    }
                }
                // If there are GViz packages, collect them to one deferred.
                if (gVizPacks.length || loadGLib) {
                    gLoader = loadGVizScript(gVizPacks, loadGLib);
                    deferreds.push(gLoader);

                    // Register this gLoader with all input function
                    // dependencies solved by this loader.
                    for (i = 0, ilen = gVizPacks.length; i < ilen; i += 1) {
                        loaders[gVizPacks[i]] = gLoader;
                    }
                }
                // Sending array of arguments to when(). See http://bugs.jquery.com/ticket/8256.
                return $.when.apply($, deferreds);
            };

        /////////////////////////////////////////////////
        // PUBLICs

        return {
            loadDependencies: loadDependencies
        };
    }());

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

    /**
     * Handles all UI business for the HTML form for writing, issuing
     * and drawing sgvizler queries.
     *
     * Dependencies:
     *
     *  - sgvizler.util
     *  - sgvizler.namespace
     *  - sgvizler.registry
     *  - sgvizler.Query
     *
     * @class sgvizler.form
     * @static
     **/
    S.form = (function () {

        /*global $ */

        // Module dependencies:
        var util = S.util,
            prefixesSPARQL = S.namespace.prefixesSPARQL,
            registry = S.registry,
            Query = S.Query,

            /**
             * Approx. 15 properties giving name to HTML elements
             * which appear in the form.
             * @property idXs
             * @type String
             * @private
             * @since 0.2
             **/
            idprefix  =         'sgvzlr_',
            idMainCon =         idprefix + 'mainCon',
            idFormCon =         idprefix + 'formCon',
            idChartCon =        idprefix + 'gchart',      // #id to the container to hold the chart
            idQueryForm =       idprefix + 'formQuery',   //
            idQueryTxt =        idprefix + 'cQuery',      // query text area.
            idFormQuery =       idprefix + 'strQuery',    // hidden query string. "trick" taken from snorql.
            idFormEndpointGrp = idprefix + 'strEndpointGrp', //
            idFormEndpoint =    idprefix + 'strEndpoint', //
            idFormFormatGrp =   idprefix + 'btnFormatGrp',   //
            idFormFormat =      idprefix + 'btnFormat',   //
            idFormSizeGrp =     idprefix + 'strSizeGrp',    //
            idFormWidth =       idprefix + 'strWidth',    //
            idFormHeight =      idprefix + 'strHeight',   //
            idFormChartGrp =    idprefix + 'optChartGrp',    //
            idFormChart =       idprefix + 'optChart',    //
            idFormButtonGrp =   idprefix + 'btnSendGrp',    //
            idPrefixCon =       idprefix + 'cPrefix',     // print prefixes
            idMessageCon =      idprefix + 'cMessage',    // print messages
            idLogo =            idprefix + 'logo',
            idFooter =          idprefix + 'footer',

            /**
             * Contains groups of elements which make out the
             * form. Described using the array syntax edible by
             * sgvizler.util.createHTMLElement.
             * @property html
             * @type Object
             * @private
             * @since 0.6.0
             **/
            html = (function () {
                // Difficult to get whitespace correct while keeping it readable:
                /*jslint white: true */
                return {

                    /**
                     * The heading for the form: "Sgvizler".
                     * @property html.heading
                     * @type Array
                     * @private
                     * @since 0.6.0
                     **/
                    heading: ['h1', null, ['Sgvizler']],

                    /**
                     * Logo pointing to homepage.
                     * @property html.logo
                     * @type Array
                     * @private
                     * @since 0.6.0
                     **/
                    logo: ['div', { id: idLogo },
                           [
                               ['a', { href: S.core.HOMEPAGE },
                                [
                                    ['img',
                                     {
                                         src: S.core.LOGOIMAGE,
                                         alt: "Mr. Sgvizler"
                                     }
                                    ]
                                ]
                               ],
                               'Mr. Sgvizler'
                           ]
                          ],

                    /**
                     * The form.
                     * @property html.main
                     * @type Array
                     * @private
                     * @since 0.6.0
                     **/
                    main:
                    ['div', { id: idFormCon },
                     [
                         // prefixes and namespaces.
                         ['pre', { id: idPrefixCon } ],
                         // textarea for writing query.
                         ['textarea', { id: idQueryTxt, rows: '10', cols: '80' } ],
                         ['form', { id: idQueryForm, method: 'get' },
                          [
                              ['p', null,
                               [
                                   // hidden query string
                                   ['input',
                                    {
                                        id: idFormQuery,
                                        type: 'hidden',
                                        name: 'query',
                                        value: ''
                                    }
                                   ],
                                   ['span', { 'id': idFormEndpointGrp }, [
                                        ['label', { 'for': idFormEndpoint }, ['Endpoint: '] ],
                                        ['input',
                                         {
                                             id: idFormEndpoint,
                                             type: 'text',
                                             name: 'endpoint',
                                             size: '30'
                                         }
                                        ]
                                    ]
                                   ],
                                   // format radio buttons
                                   ['span', { 'id': idFormFormatGrp }, [
                                        ['label', { 'for': idFormFormat }, ['Output format: '] ],
                                        ['input',
                                         {
                                             id: idFormFormat,
                                             type: 'radio',
                                             name: 'endpoint_output',
                                             value: 'xml'
                                         }
                                        ],
                                        "xml ",
                                        ['input',
                                         {
                                             id: idFormFormat,
                                             type: 'radio',
                                             name: 'endpoint_output',
                                             value: 'json'
                                         }
                                        ],
                                        "json ",
                                        ['input',
                                         {
                                             id: idFormFormat,
                                             type: 'radio',
                                             name: 'endpoint_output',
                                             value: 'jsonp'
                                         }
                                        ],
                                        "jsonp"
                                    ]
                                   ],

                                   // Chart type, dropdown.
                                   ['span', { 'id': idFormChartGrp }, [
                                        ['label', { 'for': idFormChart }, ['Chart type: '] ],
                                        ['select',
                                         {
                                             id: idFormChart,
                                             name: 'chart'
                                         }
                                        ]
                                    ]
                                   ],

                                   // Width, Height
                                   ['span', { 'id': idFormSizeGrp }, [
                                        ['label', { 'for': idFormWidth }, ['Width: '] ],
                                        ['input',
                                         {
                                             id: idFormWidth,
                                             name: 'width',
                                             type: 'text',
                                             size: '3'
                                         }
                                        ],
                                        ['label', { 'for': idFormHeight }, ['Height: '] ],
                                        ['input',
                                         {
                                             id: idFormHeight,
                                             name: 'height',
                                             type: 'text',
                                             size: '3'
                                         }
                                        ]
                                    ]
                                   ],

                                   // Buttons
                                   ['span', { 'id': idFormButtonGrp }, [
                                        ['input',
                                         {
                                             type: 'button',
                                             value: 'Reset',
                                             onclick: 'sgvizler.formReset()' // NB! must be the global function.
                                         }
                                        ],
                                        ['input',
                                         {
                                             type: 'button',
                                             value: 'Go',
                                             onclick: 'sgvizler.formSubmit()' // NB! must be the global function.
                                         }
                                        ]
                                    ]
                                   ]
                               ]
                              ]
                          ]
                         ],
                         // Logging container.
                         ['div', { id: idMessageCon } ]
                     ]
                    ],

                    /**
                     * Container for holding the chart.
                     * @property html.chart
                     * @type Array
                     * @private
                     * @since 0.6.0
                     **/
                    chart:
                        ['div',
                         {
                             id: idChartCon,
                             style: "width:800px; height:400px;"
                         }
                        ],

                    /**
                     * The footer
                     * @property html.footer
                     * @type Array
                     * @private
                     * @since 0.6.0
                     **/
                    footer:
                        ['div',
                         {
                             id: idFooter
                         },
                         [
                             ['p', null,
                              [
                                  ['a', { href: S.core.HOMEPAGE },  ['Sgvizler'] ],
                                  ' version ' + S.core.VERSION +
                                      ' (c) 2011&ndash;2013 Martin G. Skj&#230;veland.'
                              ]
                             ]
                         ]
                        ]
                };
            }()),

            /**
             * A list of permissible URL parameters. The parameter
             * name must be in this list to be read by the form.
             * @property permissible_urlparams
             * @type Array
             * @private
             * @since 0.3.1
             **/
            permissible_urlparams = [ 'query',
                                      'endpoint',
                                      'endpoint_output',
                                      'chart',
                                      'width',
                                      'height',
                                      'ui'],

            /**
             * Tests if there really is an element with the give
             * element id.
             * @method isElement
             * @private
             * @param {String} elementID The element Id
             * @return {boolean} Returns true iff the element with
             * this element id exists.
             * @since 0.5
             **/
            isElement = function (elementID) {
                return $('#' + elementID).length > 0;
            },

            /**
             * Set a value for a given element. Is used to set the
             * value of form input fields.  Uses `jQuery.val`.
             * @method setElementValue
             * @private
             * @param {String} elementID The element id of the element to set value for.
             * @param {Primitive} value The value to set.
             * @since 0.5
             **/
            setElementValue = function (elementID, value) {
                if (isElement(elementID)) {
                    $('#' + elementID).val(value);
                }
            },

            /**
             * Set the text for a given element. Is used to set the
             * text contents of containers.  Uses `jQuery.text`.
             * @method setElementText
             * @private
             * @param {String} elementID The element id of the element to set value for.
             * @param {String} text The value to set.
             * @since 0.5
             **/
            setElementText = function (elementID, text) {
                if (isElement(elementID)) {
                    $('#' + elementID).text(text);
                }
            },
            /* UNUSED
             * Set the html content for a given element. Uses `jQuery.html`.
             * @method setElementHTML
             * @private
             * @param {String} elementID The element id of the element to set value for.
             * @param {String} html The value to set.
             * @since 0.6.0
             * setElementHTML = function (elementID, html) {
                if (isElement(elementID)) {
                    $('#' + elementID).html(html);
                }
            },
             */

            /**
             * Displays the prefixes set in `sgvizler.namespace` as
             * SPARQL prefix declarations in the designated container.
             * @method displayPrefixes
             * @private
             * @since 0.1
             **/
            displayPrefixes = function () {
                setElementText(idPrefixCon, prefixesSPARQL());
            },

            /**
             * Displays query information in the form input fields,
             * e.g., the query string, query format, chart dimensions,
             * set in the input parameter.
             * @method displayUserInput
             * @param {sgvizler.Query} query
             * @private
             * @since 0.1
             **/
            displayUserInput = function (query) {
                setElementValue(idQueryTxt, query.query());
                setElementValue(idFormEndpoint, query.endpointURL());
                $('input:radio[id=' + idFormFormat + '][value=' + query.endpointOutputFormat() + ']').attr('checked', true);
                setElementValue(idFormChart, query.chartFunction());
                setElementValue(idFormWidth, query.chartWidth());
                setElementValue(idFormHeight, query.chartHeight());
            },

            /**
             * Populates the drop-down menu of available chart types
             * with the registered chart types found in the
             * `sgvizler.registry`, grouped by modules.
             * @method displayChartTypesMenu
             * @private
             * @since 0.2
             **/
            displayChartTypesMenu = function () {
                var i, j, ilen, jlen,
                    charts = registry.chartFunctions().sort(),
                    createOptGrp = function (name) {
                        return util.createHTMLElement('optgroup', { label: name + '.*' });
                    },
                    libs = registry.chartModules(),
                    group = {},
                    added = false;

                if (isElement(idFormChart)) {
                    // Create option groups for chart function modules.
                    for (j = 0, jlen = libs.length; j < jlen; j += 1) {
                        group[libs[j]] = createOptGrp(libs[j]);
                        $('#' + idFormChart).append(group[libs[j]]);
                    }

                    for (i = 0, ilen = charts.length; i < ilen; i += 1) {
                        added = false;
                        for (j = 0, jlen = libs.length; j < jlen; j += 1) {
                            if (util.startsWith(charts[i], libs[j])) {
                                $(group[libs[j]])
                                    .append($('<option/>')
                                            .val(charts[i])
                                            .html(charts[i].replace(libs[j] + '.', '')));
                                added = true;
                            }
                        }
                        if (!added) {
                            $('#' + idFormChart).
                                append($('<option/>')
                                       .val(charts[i])
                                       .html(charts[i]));
                        }
                    }
                }
            },

            /**
             * Draws an intitially empty form on page. If elementID is
             * provided only the form and container for chart is
             * drawn; otherwise, a complete page, with header, logo
             * and footer, is draw directly in the body element.
             * @method createPage
             * @private
             * @param {String} [elementID=body]
             * @param {String} UItype values: 'result', 'form' or 'page'.
             * @since 0.6.0
             **/
            createUI = function (elementID, UItype) {
                var
                    createHTMLElements = function (elementsArray) {
                        return util.createHTMLElement.apply(undefined, elementsArray);
                    },
                    setChartContainer = function (elementID) {
                        if (elementID) {
                            idChartCon = elementID;
                        } else {
                            $('body').append(createHTMLElements(html.chart));
                        }
                    },
                    setForm = function (elementID) {
                        var main;
                        if (elementID) {
                            main = $('#' + elementID);
                        } else { // add to body.
                            main = util.createHTMLElement('div', { id: idMainCon });
                            $('body').append(
                                createHTMLElements(html.logo),
                                createHTMLElements(html.heading),
                                main,
                                createHTMLElements(html.footer)
                            );
                        }
                        main.append(
                            createHTMLElements(html.main), // container for query business.
                            createHTMLElements(html.chart) // chart container.
                        );
                    };

                if (UItype === 'result') {
                    setChartContainer(elementID);
                } else {
                    setForm(elementID);
                }
            },

            /**
             * Displays prefix information, query information and
             * selections in the form, using other `displayX` methods.
             * @method displayUI
             * @private
             * @since 0.1
             **/
            displayUI = function (query) {
                displayPrefixes();
                displayChartTypesMenu();
                displayUserInput(query);
            },

            /**
             * Parses the current URL for parameters. Permissible
             * parameters are, if present, those listed in the input
             * of this method, or in the array
             * `permissible_urlparams`.
             * @method getUrlParams
             * @param {Array} [urlparams]
             * @private
             * @return {Object} A list of parameter--value pairs.
             * @since 0.1
             **/
            getUrlParams = function (urlparams) {
                /*jslint regexp: true */
                var urlParams = {},
                    e,
                    r = /([^&=]+)=?([^&]*)/g, // parameter, value pairs.
                    d = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); }, // replace '+' with space.
                    q = window.location.search.substring(1), // URL query string part.
                    params = urlparams || permissible_urlparams; // set defaults if necessary.

                while ((e = r.exec(q)) !== null) {
                    if (e[2].length > 0 && util.isInArray(e[1], params)) {
                        urlParams[d(e[1])] = d(e[2]);
                    }
                }
                return urlParams;
            },

            /**
             * "Button method" used to clear the form and load default
             * values. Does this by simply reloading the page without
             * any URL parameters.
             * @method formReset
             * @public
             * @for sgvizler
             * @since 0.1
             **/
            reset = function () {
                document.location = (window.location.href).replace(window.location.search, "");
            },

            /**
             * "Button method" used to submit the form.
             * @method formSubmit
             * @public
             * @for sgvizler
             * @since 0.1
             **/
            submit = function () {
                $('#' + idFormQuery).val($('#' + idQueryTxt).val());
                $('#' + idQueryForm).submit();
            },

            /**
             * Main method. Draws the form, gets possible URL
             * parameters, populates form with data, and, if
             * requested, sends a query and draws the chart in the
             * chart container.
             * @method formDraw
             * @param {String} [elementID=body]
             * @public
             * @for sgvizler
             * @since 0.1
             **/
            draw = function (elementID) {
                var params = getUrlParams(),
                    query = new Query(
                        {
                            query: params.query,
                            chart: params.chart,
                            endpoint: params.endpoint,
                            endpoint_output: params.endpoint_output
                        },
                        {
                            width: params.width,
                            height: params.height
                        }
                    );

                createUI(elementID, params.ui);
                displayUI(query);

                if (isElement(idChartCon) && params.query) {
                    query.logContainer(idMessageCon);
                    query.draw(idChartCon);
                }
            };


        /////////////////////////////////////////////////////////////////
        // PUBLICs

        return {
            draw: draw,

            reset: reset,
            submit: submit
        };

    }());
    /**
     * .visualization
     * @main sgvizler.visualization
     */
    S.visualization = (function () {

        // Module dependencies:
        var util = S.util,
            namespace = S.namespace,
            charts = S.charts,

            C = {}, // sgvizler.visualization

            modSC = "sgvizler.visualization";

        /** 
         * @class sgvizler.visualization.D3ForceGraph
         * @extends sgvizler.charts.Chart
         * @constructor
         * @param {Object} container The container element where the
         * chart will be drawn.
         * @beta
         */

        /** 
         * @method draw
         * @public
         * @param {google.visualization.DataTable} data
         * @param {Object} [chartOptions]
         * @since 0.5.0
         */
        /*global d3 */
        C.D3ForceGraph = charts.add(modSC, 'D3ForceGraph',
            function (data, chartOpt) {
                var r, noRows = data.getNumberOfRows(),
                    i, len,
                    noColumns = data.getNumberOfColumns(),

                    opt = $.extend({'maxnodesize': 15, 'minnodesize': 2 }, chartOpt), // set defaults
                    colors = d3.scale.category20(),
                    w = chartOpt.width,
                    h = chartOpt.height,
                    isNumber = function (n) {  return !isNaN(parseFloat(n)) && isFinite(n); },

                    // build arrays of nodes and links.
                    nodes = [],
                    edges = [],
                    t_color = {},
                    t_size = {},
                    t_maxnodesize = 0,

                    source,
                    target,

                    nodesizeratio,
                    color,
                    size,

                    vis,
                    force,
                    link,
                    node,
                    ticks;

                C.util.loadCSS();

                for (r = 0; r < noRows; r += 1) {
                    source = data.getValue(r, 0);
                    target = data.getValue(r, 1);
                    // nodes
                    if (source !== null && $.inArray(source, nodes) === -1) {
                        nodes.push(source);
                        t_size[source] = (noColumns > 2) ? Math.sqrt(data.getValue(r, 2)) : 0;
                        t_color[source] = (noColumns > 3) ? data.getValue(r, 3) : 0;
                        if (t_size[source] > t_maxnodesize) {
                            t_maxnodesize = t_size[source];
                        }
                    }
                    if (target !== null && $.inArray(target, nodes) === -1) {
                        nodes.push(target);
                    }
                    // edges
                    if (source !== null && target !== null) {
                        edges.push({'source': $.inArray(source, nodes),
                                    'target': $.inArray(target, nodes)
                                }
                            );
                    }
                }
                if (t_maxnodesize === 0) {
                    t_maxnodesize = 1;
                }
                nodesizeratio = opt.maxnodesize / t_maxnodesize;
                for (i = 0, len = nodes.length; i < len; i += 1) {
                    color = t_color[nodes[i]] !== undefined ?
                            t_color[nodes[i]] :
                            1;
                    size = isNumber(t_size[nodes[i]]) ?
                            opt.minnodesize + t_size[nodes[i]] * nodesizeratio :
                            opt.minnodesize;

                    nodes[i] = {'name': nodes[i], 'color': color, 'size': size };
                }

                $(this.container).empty();

                vis = d3.select(this.container)
                    .append("svg:svg")
                    .attr("width", w)
                    .attr("height", h)
                    .attr("pointer-events", "all")
                    .append('svg:g')
                    .call(d3.behavior.zoom().on("zoom", function () {
                        vis.attr("transform", "translate(" + d3.event.translate + ")" +
                             " scale(" + d3.event.scale + ")");
                    }))
                    .append('svg:g');

                vis.append('svg:rect')
                    .attr('width', w)
                    .attr('height', h)
                    .attr('fill', 'white');

                force = d3.layout.force()
                    .gravity(0.05)
                    .distance(100)
                    .charge(-100)
                    .nodes(nodes)
                    .links(edges)
                    .size([w, h])
                    .start();

                link = vis.selectAll("line.link")
                    .data(edges)
                    .enter().append("svg:line")
                    .attr("class", "link")
                    //.style("stroke-width", function (d) { return Math.sqrt(d.value); })
                    .attr("x1", function (d) { return d.source.x; })
                    .attr("y1", function (d) { return d.source.y; })
                    .attr("x2", function (d) { return d.target.x; })
                    .attr("y2", function (d) { return d.target.y; });

                node = vis.selectAll("g.node")
                    .data(nodes)
                    .enter().append("svg:g")
                    .attr("class", "node")
                    .call(force.drag);

                node.append("svg:circle")
                    .style("fill", function (d) { return colors(d.color); })
                    .attr("class", "node")
                    .attr("r", function (d) { return d.size; });

                node.append("svg:title")
                    .text(function (d) { return d.name; });

                node.append("svg:text")
                    .attr("class", "nodetext")
                    .attr("dx", 12)
                    .attr("dy", ".35em")
                    .text(function (d) { return d.name; });

                ticks = 0;
                force.on("tick", function () {
                    ticks += 1;
                    if (ticks > 250) {
                        force.stop();
                        force.charge(0)
                            .linkStrength(0)
                            .linkDistance(0)
                            .gravity(0)
                            .start();
                    }

                    link.attr("x1", function (d) { return d.source.x; })
                        .attr("y1", function (d) { return d.source.y; })
                        .attr("x2", function (d) { return d.target.x; })
                        .attr("y2", function (d) { return d.target.y; });

                    node.attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    });
                });

                this.fireListener('ready');
            },
            { d3: '//cdnjs.cloudflare.com/ajax/libs/d3/2.10.0/d3.v2.min.js' }
            );

        /** 
         * Make a html dt list.
         *
         * Format, 2--N columns:
         * 1. Term
         * 2--N. Definition
         * 
         * @class sgvizler.visualization.DefList
         * @extends sgvizler.charts.Chart
         * @constructor
         * @param {Object} container The container element where the
         * chart will be drawn.
         */

        /** 
         * Available options:
         * 
         *  - 'cellSep'   :  string (can be html) to separate cells in definition columns. (default: ' ')
         *  - 'termPrefix  :  string (can be html) to prefix each term with. (default: '')
         *  - 'termPostfix :  string (can be html) to postfix each term with. (default: ':')
         *  - 'definitionPrefix  :  string (can be html) to prefix each definition with. (default: '')
         *  - 'definitionPostfix :  string (can be html) to postfix each definition with. (default: '')
         * 
         * @method draw
         * @public
         * @param {google.visualization.DataTable} data
         * @param {Object} [chartOptions]
         * @since 0.3.0
         **/
        C.DefList = charts.add(modSC, 'DefList',
            function (data, chartOpt) {
                var r, noRows = data.getNumberOfRows(),
                    c, noColumns = data.getNumberOfColumns(),
                    opt = $.extend({ cellSep: ' ',
                                     termPrefix: '',
                                     termPostfix: ':',
                                     definitionPrefix: '',
                                     definitionPostfix: '' },
                                   chartOpt),
                    list = "",
                    term,
                    definition;

                for (r = 0; r < noRows; r += 1) {
                    term = '<dt>' +
                        opt.termPrefix +
                        C.util.linkify2String(data.getValue(r, 0)) +
                        opt.termPostfix +
                        '</dt>';
                    definition = '<dd>' +
                        opt.definitionPrefix;

                    for (c = 1; c < noColumns; c += 1) {
                        definition += C.util.linkify2String(data.getValue(r, c));
                        if (c + 1 !== noColumns) {
                            definition += opt.cellSep;
                        }
                    }
                    definition += opt.definitionPostfix +
                        '</dd>';
                    list += term + definition;
                }

                $(this.container)
                    .empty()
                    .html(list);

                this.fireListener('ready');
            }
            );

        /**
         * Draws a graph with clickable and movable nodes.
         *
         * Input format:
         *
         *  - 7 columns, last three are optional.
         *  - each row represents a source node, a target node and an edge from source to target.
         *  - the URIs are the id's for the nodes, and make the nodes clickable.
         *
         * Columns:
         *
         *  1. sourceURI
         *  2. sourceLabel
         *  3. targetURI
         *  4. targetLabel
         *  5. edgeLabel
         *  6. sourceColor
         *  7. targetColor
         *
         * @class sgvizler.visualization.DraculaGraph
         * @extends sgvizler.charts.Chart
         * @constructor
         * @param {Object} container The container element where the
         * chart will be drawn.
         * @beta
         * @author Magnus Stuhr, Martin G. Skjæveland
         */

        /**
         * @method draw
         * @public
         * @param {google.visualization.DataTable} data
         * @param {Object} [chartOptions]
         * @since 0.5.1
         */
        /*global Dracula */
        C.DraculaGraph = charts.add(modSC, "DraculaGraph",
            function (data, chartOpt) {

                var row, numberOfRows = data.getNumberOfRows(),
                    i, len,
                    numberOfColumns = data.getNumberOfColumns(),

                    // set defaults.
                    opt = $.extend({
                        noderadius: 0.5,
                        nodefontsize: "10px",
                        nodeheight: 20,
                        nodestrokewidth: "1px",
                        directed: false,
                        nodecornerradius: "1px",
                        nodepadding: 7,
                        nodecolor: "green",
                        edgestroke: "blue",
                        edgefill: "blue",
                        edgestrokewidth: 1,
                        edgefontsize: "10px",
                        edgeseparator: ", "
                    }, chartOpt),

                    graph = new Dracula.Graph(),
                    layouter,
                    renderer,
                    edge,
                    source,
                    target,
                    label,

                    // custom node rendering using Raphael.
                    nodeRenderer = function (color, URL) {
                        return function (r, n) {
                            return r.set()
                                // rectangle
                                .push(r.rect(n.point[0],
                                             n.point[1],
                                             n.label.length * opt.nodepadding,
                                             opt.nodeheight)
                                      .attr({fill: color,
                                             'stroke-width': opt.nodestrokewidth,
                                             r : opt.nodecornerradius}))
                                // label inside rectangle
                                .push(r.text(n.point[0] + n.label.length * opt.nodepadding / 2,
                                             n.point[1] + opt.nodeheight / 2,
                                             n.label)
                                      .attr({'font-size': opt.nodefontsize})
                                      .click(function () { if (URL) { window.open(namespace.unprefixify(URL)); } })
                                     );
                        };
                    },

                    // helper function.
                    addNode = function (URL, name, color) {
                        graph.addNode(URL, {label: name, render: nodeRenderer(color, URL)});
                        //console.log("add node - name: " + name + ", URL: " + URL);
                    },
                    edges = {},
                    keys_edges = [];

                for (row = 0; row < numberOfRows; row += 1) {
                    source = data.getValue(row, 0);
                    target = data.getValue(row, 2);

                    // add source node
                    // Note: does dracula take care of duplicates?
                    if (source) {
                        addNode(source,
                                data.getValue(row, 1) || source,
                                numberOfColumns > 5 ? data.getValue(row, 5) : opt.nodecolor);
                    }
                    // add target node
                    if (target) {
                        addNode(target,
                                data.getValue(row, 3) || target,
                                numberOfColumns > 6 ? data.getValue(row, 6) : opt.nodecolor);
                    }

                    // collect edge labels. Only one edge per pair of nodes,
                    // so we concatinate labels of multiple edges into one.
                    if (source && target) {
                        label = "";
                        // test if source--target pair is seen before:
                        if (edges[source + target] !== undefined) {
                            label = edges[source + target].label; // retrieve accumulated label.
                        } else {
                            keys_edges.push(source + target);
                        }

                        if (numberOfColumns > 4 && data.getValue(row, 4).length > 0) {
                            if (label.length > 0) {
                                label += opt.edgeseparator;
                            }
                            label += data.getValue(row, 4);
                        }

                        edges[source + target] = {
                            source: source,
                            target: target,
                            label: label
                        };
                    }
                }

                // add edges
                for (i = 0, len = keys_edges.length; i < len; i += 1) {
                    edge = edges[keys_edges[i]];
                    //console.log("add edge - source: " + edge.source + ", target " + edge.target);
                    graph.addEdge(edge.source, edge.target,
                                  { stroke: opt.edgestroke,
                                    directed: opt.directed,
                                    fill: opt.edgefill,
                                    label: edge.label,
                                    width: opt.edgestrokewidth,
                                    fontsize: opt.edgefontsize
                                  });
                }

                layouter = new Dracula.Graph.Layout.Spring(graph);
                layouter.layout();

                $(this.container).empty();
                renderer = new Dracula.Graph.Renderer.Raphael(
                    this.container,
                    graph,
                    opt.width,
                    opt.height,
                    { noderadius : opt.nodeheight * opt.noderadius}
                );
                renderer.draw();

                this.fireListener('ready');
            },
            { Dracula: 'http://www.data2000.no/sgvizler/lib/raphael-dracula.min.js' }
            );

        /**
         * Make a html list, either numbered (ol) or bullets
         * (ul). Each row becomes a list item.
         * 
         * Any number of columns in any format. Everything is
         * displayed as text.
         * 
         * @class sgvizler.visualization.List
         * @extends sgvizler.charts.Chart
         * @constructor
         * @param {Object} container The container element where the
         * chart will be drawn.
         * @since 0.3.0
         **/

        /** 
         * Available options:
         * 
         *  - 'list'      :  "ol" / "ul"  (default: "ul")
         *  - 'cellSep'   :  string (can be html) to separate cells in row. (default: ', ')
         *  - 'rowPrefix  :  string (can be html) to prefix each row with. (default: '')
         *  - 'rowPostfix :  string (can be html) to postfix each row with. (default: '')
         * 
         * @method draw
         * @public
         * @param {google.visualization.DataTable} data
         * @param {Object} [chartOptions]
         * @since 0.3.0
         **/
        C.List = charts.add(modSC, "List",
            function (data, chartOpt) {
                var c, noColumns = data.getNumberOfColumns(),
                    r, noRows = data.getNumberOfRows(),
                    opt = $.extend({ list: 'ul',
                                     cellSep: ', ',
                                     rowPrefix: '',
                                     rowPostfix: '' },
                                   chartOpt),
                    list = '<' + opt.list + '>';

                for (r = 0; r < noRows; r += 1) {
                    list += '<li>' + opt.rowPrefix;
                    for (c = 0; c < noColumns; c += 1) {
                        list += C.util.linkify2String(data.getValue(r, c));
                        if (c + 1 !== noColumns) { // Don't add after last element in a row.
                            list += opt.cellSep;
                        }
                    }
                    list += opt.rowPostfix + '</li>';
                }
                list += '</' + opt.list + '>';

                $(this.container)
                    .empty()
                    .html(list);

                this.fireListener('ready');
            }
            );



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

        /**
         * @class sgvizler.visualization.MapWKT
         * @extends sgvizler.charts.Chart
         * @constructor
         * @param {Object} container The container element where the
         * chart will be drawn.
         * @since 0.6.0
         **/

        /**
         * @method draw
         * @public
         * @param {google.visualization.DataTable} data
         * @param {Object} [chartOptions]
         * @since 0.6.0
         */
        C.MapWKT = charts.add(modSC, "MapWKT",
            function (data, chartOpt) {
                /*global google, OpenLayers */
                var //c,
                    noColumns = data.getNumberOfColumns(),
                    r, noRows = data.getNumberOfRows(),
                    //that = this,
                    opt = $.extend(
                        {
                            zoom: 5,
                            centerLat: 62,
                            centerLong: 2,
                            //mapTypeId: google.maps.MapTypeId.TERRAIN,
                            //douglasPeuckerKink: 5000,
                            geoDatumIn: "EPSG:4326",//"EPSG:4230",
                            geoDatumOut: "EPSG:4326"
                        },
                        chartOpt
                    ),

                    mapOptions = {
                        projection: opt.geoDatumOut,
                        layers: [
                            new OpenLayers.Layer.OSM(),
                            // new OpenLayers.Layer.WMS(
                            //     "OpenLayers WMS",
                            //     "http://vmap0.tiles.osgeo.org/wms/vmap0?", {layers: 'basic'}
                            // ),
                            new OpenLayers.Layer.Google(
                                "Google Physical",
                                {type: google.maps.MapTypeId.TERRAIN}
                            ),
                            new OpenLayers.Layer.Google(
                                "Google Streets",
                                {numZoomLevels: 20}
                            ),
                            new OpenLayers.Layer.Google(
                                "Google Hybrid",
                                {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20}
                            ),
                            new OpenLayers.Layer.Google(
                                "Google Satellite",
                                {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
                            )
                        ],
                        controls: [
                            new OpenLayers.Control.Navigation(),
                            new OpenLayers.Control.PanZoomBar(),
                            new OpenLayers.Control.LayerSwitcher({ ascending: false }),
                            new OpenLayers.Control.Permalink(),
                            new OpenLayers.Control.ScaleLine(),
                            new OpenLayers.Control.MousePosition(),
                            new OpenLayers.Control.OverviewMap(),
                            new OpenLayers.Control.KeyboardDefaults()
                        ],
                        center: new OpenLayers.LonLat(opt.centerLong, opt.centerLat),
                        zoom: 5
                    },
                    mapBounds,
                    map = new OpenLayers.Map(this.container, mapOptions),

                    formatterWKT = new OpenLayers.Format.WKT(
                        {
                            internalProjection: map.baseLayer.projection,
                            externalProjection: new OpenLayers.Projection(opt.geoDatumIn)
                        }
                    ),

                    resultLayer = new OpenLayers.Layer.Vector(
                        "Results",
                        {
                            styleMap: new OpenLayers.StyleMap(
                                {
                                    'default': new OpenLayers.Style(
                                        {
                                            fillColor: "#33CC00",
                                            fillOpacity: 0.2,
                                            strokeColor: "#000000",
                                            strokeWidth: 1
                                        }
                                    )
                                }
                            )
                        }
                    ),
                    labelLayer = new OpenLayers.Layer.Vector(
                        "Labels",
                        {
                            eventListeners: {
                                featureselected: function (evt) {
                                    var feature = evt.feature,
                                        popup = new OpenLayers.Popup.FramedCloud(
                                            "popup",
                                            OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
                                            null,
                                            "<div style='font-size:.8em'>"
                                                + "<b>" + feature.attributes.name + "</b><br/>"
                                                + C.util.linkify2String(feature.attributes.uri) + "<br/>"
                                                + feature.attributes.description
                                                + "</div>",
                                            null,
                                            true
                                        );
                                    feature.popup = popup;
                                    map.addPopup(popup);
                                },
                                featureunselected: function (evt) {
                                    var feature = evt.feature;
                                    map.removePopup(feature.popup);
                                    feature.popup.destroy();
                                    feature.popup = null;
                                }
                            },
                            styleMap: new OpenLayers.StyleMap(
                                {
                                    "default": new OpenLayers.Style(
                                        {
                                            strokeColor: "#FF0000",
                                            strokeOpacity: 1,
                                            strokeWidth: 5,
                                            fillColor: "#FF0000",
                                            fillOpacity: 0.5,
                                            pointRadius: 2,
                                            //pointerEvents: "visiblePainted",

                                            label : "${name}",
                                            fontSize: "10px",
                                            fontFamily: "Arial",
                                            labelAlign: "l",
                                            labelOutlineColor: "white",
                                            labelOutlineWidth: 1,
                                            labelXOffset : 7
                                        }
                                    )
                                }
                            )
                        }
                    ),

                    selector = new OpenLayers.Control.SelectFeature(
                        labelLayer,
                        {
                            click: true,
                            autoActivate: true
                        }
                    ),

                    wktFeature,
                    labelFeature,

                    addWKT = function (layer, valueWKT) {
                        var features = formatterWKT.read(valueWKT),
                            i;

                        if (features) {
                            if (!util.isArray(features.constructor)) {
                                features = [features];
                            }
                            for (i = 0; i < features.length; i += 1) {
                                if (!mapBounds) {
                                    mapBounds = features[i].geometry.getBounds();
                                } else {
                                    mapBounds.extend(features[i].geometry.getBounds());
                                }
                            }
                            layer.addFeatures(features);
                        }
                        return features;
                    };

                //Proj4js.defs["EPSG:4230"] = "+proj=longlat +ellps=intl +no_defs";

                //////////////////////////////////////////////////////////////////////

                for (r = 0; r < noRows; r += 1) {
                    // add WKT
                    wktFeature = addWKT(resultLayer, data.getValue(r, 0));

                    // add Label
                    labelFeature = new OpenLayers.Feature.Vector(wktFeature[0].geometry.getCentroid());

                    labelFeature.attributes.name =
                        (noColumns > 1 && data.getValue(r, 1)) ? data.getValue(r, 1) : "";
                    labelFeature.attributes.uri =
                        (noColumns > 2 && data.getValue(r, 2)) ? data.getValue(r, 2) : "";
                    labelFeature.attributes.description =
                        (noColumns > 3 && data.getValue(r, 3)) ? data.getValue(r, 3) : "";

                    labelLayer.addFeatures([labelFeature]);
                }

                map.addLayer(resultLayer);
                map.addLayer(labelLayer);

                map.addControl(selector);

                map.zoomToExtent(mapBounds);

                this.fireListener('ready');

            },
            // Dependencies. { function: what-to-load }
            {
                'google.maps.Map': 'google.maps.Map',
                'OpenLayers': '//cdnjs.cloudflare.com/ajax/libs/openlayers/2.12/OpenLayers.min.js'
                //'GDouglasPeucker': 'http://www.bdcc.co.uk/Gmaps/GDouglasPeuker.js',
                //'Proj4js': 'http://localhost/sgvizler/trunk/lib/proj4js-compressed.js'
            }
            );

        /** 
         * Make a standard simple html table.
         * 
         * @class sgvizler.visualization.Table
         * @extends sgvizler.charts.Chart
         * @constructor
         * @param {Object} container The container element where the
         * chart will be drawn.
         * @since 0.5.1
         **/

        /** 
         * Available options:
         *  - 'headings'   :  "true" / "false"  (default: "true")
         *
         * @method draw
         * @public
         * @param {google.visualization.DataTable} data
         * @param {Object} [chartOptions]
         * @since 0.5.1
         **/
        C.Table = charts.add(modSC, "Table",
            function (data, chartOpt) {
                var c, noColumns = data.getNumberOfColumns(),
                    r, noRows = data.getNumberOfRows(),
                    opt = $.extend({ headings: true }, chartOpt),
                    table,
                    rows = [],
                    cells = [];

                if (opt.headings) {
                    for (c = 0; c < noColumns; c += 1) {
                        cells.push(['th', null, data.getColumnLabel(c)]);
                    }
                    rows.push(['tr', null, cells]);
                }

                for (r = 0; r < noRows; r += 1) {
                    cells = [];
                    for (c = 0; c < noColumns; c += 1) {
                        cells.push(['td', null, [C.util.linkify2HTMLElementArray(data.getValue(r, c))]]);
                    }
                    rows.push(['tr', null, cells]);
                }

                table = util.createHTMLElement('table', null, rows);
                $(this.container).empty().html(table);

                this.fireListener('ready');
            }
            );
        /** 
         * Write text.
         *
         * Any number of columns. Everything is displayed as text.
         * 
         * @class sgvizler.visualization.Text
         * @extends sgvizler.charts.Chart
         * @constructor
         * @param {Object} container The container element where the
         * chart will be drawn.
         * @since 0.3.0
         **/

        /** 
         * Available options:
         * 
         *  - 'cellSep'       :  string (can be html) to separate cells in each column. (default: ', ')
         *  - 'cellPrefix     :  string (can be html) to prefix each cell with. (default: '')
         *  - 'cellPostfix    :  string (can be html) to postfix each cell  with. (default: '')
         *  - 'rowPrefix      :  string (can be html) to prefix each row with. (default: '<p>')
         *  - 'rowPostfix     :  string (can be html) to postfix each row with. (default: '</p>')
         *  - 'resultsPrefix  :  string (can be html) to prefix the results with. (default: '<div>')
         *  - 'resultsPostfix :  string (can be html) to postfix the results with. (default: '</div>')
         *
         * @method draw
         * @public
         * @param {google.visualization.DataTable} data
         * @param {Object} [chartOptions]
         * @since 0.3.0
         **/
        C.Text = charts.add(modSC, "Text",
            function (data, chartOpt) {
                var c, noColumns = data.getNumberOfColumns(),
                    r, noRows = data.getNumberOfRows(),
                    opt = $.extend({ cellSep: ', ',
                                     cellPrefix: '', cellPostfix: '',
                                     rowPrefix: '<p>', rowPostfix: '</p>',
                                     resultsPrefix: '<div>', resultsPostfix: '</div>' },
                                   chartOpt),
                    text = opt.resultsPrefix,
                    row;


                for (r = 0; r < noRows; r += 1) {
                    row = opt.rowPrefix;
                    for (c = 0; c < noColumns; c += 1) {
                        row += opt.cellPrefix + C.util.linkify2String(data.getValue(r, c)) + opt.cellPostfix;
                        if (c + 1 !== noColumns) { // Don't add for last element in row.
                            row += opt.cellSep;
                        }
                    }
                    text += row + opt.rowPostfix;
                }
                text += opt.resultsPostfix;

                $(this.container)
                    .empty()
                    .html(text);

                this.fireListener('ready');
            }
            );

        /**
         * Utility functions for chart functions.
         *
         * .visualization
         * @class sgvizler.visualization.util
         * @static
         */

        C.util = (function () {
            var

                /**
                 * Converts a url into a prefixified link.
                 * @method linkify
                 * @private
                 * @param {String} url The url to linkify.
                 * @param {boolean} arraySyntax Flag if results should
                 * be rendered in array syntax (true), or as an HTML
                 * string (false).
                 * @return {String}
                 */
                linkify = function (url, arraySyntax) {
                    var prefixed = namespace.prefixify(url),
                        base = namespace.getBaseURL,
                        href = url, // the hyperlink.
                        link,       // what to click.
                        result;

                    // Is it linkable, or something else?
                    if (prefixed !== url) {
                        link = prefixed;
                    } else if (S.util.isURL(url)) {
                        link = url;
                    }

                    // If it is linkable, then HTML encode it as one.
                    if (link) {
                        // Append base URL to front, if specified.
                        if (base) {
                            href = base + url;
                        }
                        // Returns a result according to the format used by
                        // sgvizler.util.createHTMLElement.
                        if (arraySyntax) {
                            result = ['a', { href: href }, link];
                        } else { // straight html
                            result = '<a href=' + href + '>' + link + '</a>';
                        }
                    } else { // If it is not a link, then just pass it through.
                        result = url;
                    }
                    return result;
                },
                cssloaded = false;

            return {

                /**
                 * Converts a url into a <a href=""> element with the
                 * link prefixified.
                 * @method linkify2String
                 * @protected
                 * @param {String} url The url to linkify.
                 * @return {String}
                 */
                linkify2String: function (url) {
                    return linkify(url, false);
                },
                /**
                 * Converts a url into a `<a href="url">link</a>` element with the
                 * link prefixified. Returns an array on the format
                 * described in `sgvizler.util.createHTMLElement`.
                 * @method linkify2String
                 * @protected
                 * @param {String} url The url to linkify.
                 * @return {Array}
                 */
                linkify2HTMLElementArray: function (url) {
                    return linkify(url, true);
                },

                /**
                 * Loads the css file `sgvizler.charts.css`.
                 * @method loadCSS
                 * @protected
                 * @injects
                 */
                loadCSS: function () {
                    if (!cssloaded) {
                        $('head').append('<link rel="stylesheet" href="' + S.core.CHARTSCSS + '" type="text/css" />');
                        cssloaded = true;
                    }
                }
            };
        }());

        return C;
    }());

    /** 
     * Contains functions for datatable manipulation.
     * 
     * @class sgvizler.datatable
     * @static
     */
    S.datatable = (function () {

        // Module dependencies:
        var namespace = S.namespace,
            datatables = S.datatables,

            DT = {}, // sgvizler.datatable

            modST = "sgvizler.datatable";
        /**
         * This function is a modified version of
         * http://jsfiddle.net/asgallant/HkjDe/ A discussion is here
         * https://groups.google.com/forum/?fromgroups=#!topic/google-visualization-api/jl_5JpODmw8
         *
         * pivot gets in input a Google DataTable. Table must have 3
         * columns.  Pivoting the table will swap all the rows of the
         * first colum as columns for the new table and all the rows
         * of the second column as the rows of the new table. The
         * aggregate function is the sum.  So, borrowing data form the
         * discussion above:
         *
         *     Equipment   Location  Count 
         *     e1          c1        6
         *     e2          c1        2
         *     e3          c1        1
         *     e4          c1        3
         *     e1          c2        7
         *     e2          c2        3
         *     e1          c3        8
         *     e2          c3        4
         *
         *         E1  E2  E3  E4
         *     C1  XX  xx  xx  xx
         *     C2  xx  xx   0  xx
         *     C3   0  xx  xx  xx
         *
         * @method pivot
         * @public
         * @param {google.visualization.DataTable} data
         * @return {google.visualization.DataTable}
         * @since 0.6.0
         */
        DT.pivot = datatables.add(modST, "pivot", function (dataTable) {

            var columns = dataTable.getDistinctValues(0), // Get elements which will become columns.
                dataView = new google.visualization.DataView(dataTable),

            // Manually pivot the data table. First, we have to separate
            // out the "equipment" values into their own columns using a
            // DataView with calculated columns.

                cary = columns.map(function (item) {
                    return {
                        type: 'number',
                        label: item,
                        calc: function (dt, row) {
                            // return values only for the rows where first element === item
                            return (dt.getValue(row, 0) === item) ? dt.getValue(row, 2) : null;
                        }
                    };
                }),

            // Next, we group the view on the location column, which gets
            // us the pivoted data.
                rary = columns.map(function (item, index) {
                    return {
                        column: index + 1,
                        type: 'number',
                        label: item,
                        aggregation: google.visualization.data.sum
                    };
                });

            // Put 1 in front of everything.
            cary.unshift(1);

            dataView.setColumns(cary);

            return google.visualization.data.group(dataView, [0], rary);
        });


        /** 
         * Walks through all cells of columns with datatype string and
         * runs prefixify, which replaces namespace with its prefix.
         *
         * @method prefixify
         * @public
         * @param {google.visualization.DataTable} data
         * @return {google.visualization.DataTable}
         * @since 0.6.0
         */
        DT.prefixify = datatables.add(modST, 'prefixify', function (dataTable) {
            var c, clen = dataTable.getNumberOfColumns(),
                r, rlen = dataTable.getNumberOfRows();

            for (c = 0; c < clen; c += 1) {
                if (dataTable.getColumnType(c) === 'string') {
                    for (r = 0; r < rlen; r += 1) {
                        dataTable.setValue(r, c,
                            namespace.prefixify(dataTable.getValue(r, c))
                            );
                    }
                }
            }
            return dataTable;
        });


        return DT;
    }());

    //// OTHER SOURCE FILES ARE CONCATENATED IN ABOVE
    //// STARTING WITH start.js.part

    // Set some variables used in return statement.
    globalGetSet = S.util.getset;
    globalDefaultsQuery = S.defaults.query;
    globalDefaultsChart = S.defaults.chart;


    // Test if a thing names sgvizler already exists.
    if (window.sgvizler) {
        throw new Error("Javascript module 'sgvizler' already exists.");
    }

    /**
     * The sgvizler javascript reveals properties (attributes) and methods
     * (functions) through the what in this documentation is known as the
     * class `sgvizler`. This is also why there is both a module and a
     * class called `sgvizler`. The other class which offers a public API
     * is the `sgvizler.Query` class. All other classes in the
     * documentation are private.
     *
     * Members which internally are "public", i.e., available to other
     * classes within the sgvizler package, are marked
     * `@protected`. Members which are only available within its class are
     * marked `@private`.
     *
     * @class sgvizler
     * @static
     **/
    window.sgvizler = {


        //////////////////////////////////
        // The following properties and methods are documented where
        // they are written.

        VERSION: S.core.VERSION,
        HOMEPAGE: S.core.HOMEPAGE,

        chartsAdd: S.charts.add,
        datatablesAdd: S.datatables.add,

        registryChartFunctions: S.registry.chartFunctions,

        namespacePrefixesSPARQL: S.namespace.prefixesSPARQL,
        namespacePrefixify: S.namespace.prefixify,
        namespaceUnprefixify: S.namespace.unprefixify,

        containerDraw: S.container.draw,
        containerDrawAll: S.container.drawAll,

        formDraw: S.form.draw,
        formSubmit: S.form.submit,
        formReset: S.form.reset,

        Query: S.Query,

        visualization: S.visualization, // TODO: hide util?
        datatable: S.datatable,


        // getters, setters. cascade pattern.

        /**
         * Get the namespace for a prefix.
         * @method prefix
         * @public
         * @param {string} prefix
         * @return {string} The namespace recorded for the given prefix.
         * @since 0.6.0
         **/
        /**
         * Set the prefix for a namespace.
         * @method prefix
         * @public
         * @param {string} prefix
         * @param {string} namespace
         * @chainable
         * @since 0.6.0
         **/
        prefix: function (prefix, namespace) {
            if (namespace !== undefined) {
                S.namespace.set(prefix, namespace);
            }
            return (namespace !== undefined) ? this : S.namespace.get(prefix);
        },

        /**
         * Get Base URL.
         * @method defaultBaseURL
         * @public
         * @return {string} Returns an empty string if base URL is not set.
         * @since 0.6.0
         **/
        /**
         * Set Base URL. 
         * @method defaultBaseURL
         * @public
         * @param {string} url
         * @chainable
         * @since 0.6.0
         **/
        baseURL: function (url) {
            if (url !== undefined) {
                S.namespace.setBaseURL(url);
            }
            return (url !== undefined) ? this : S.namespace.getBaseURL() || "";
        },

        /**
         * Get default query string.
         * @method defaultQuery
         * @public
         * @return {string}
         * @since 0.6.0
         **/
        /**
         * Set default query string.
         * @method defaultQuery
         * @public
         * @param {string} queryString
         * @chainable
         * @since 0.6.0
         **/
        defaultQuery: function (queryString) {
            return globalGetSet('query', queryString, globalDefaultsQuery, this);
        },

        /**
         * Get default list of FROMs set to be included in SPARQL query.
         * @method defaultFroms
         * @public
         * @return {Array} An array of strings.
         * @chainable
         * @since 0.6.0
         **/
        /**
         * Set default list of FROMs to be included in SPARQL query.
         * @method defaultFroms
         * @public
         * @param {Array} froms An array of strings.
         * @chainable
         * @since 0.6.0
         **/
        defaultFroms: function (froms) {
            var getset = globalGetSet('froms', froms, globalDefaultsQuery, this);
            if (getset !== this) {
                getset = getset.slice(0);
            }
            return getset;
        },

        /**
         * Get default endpoint URL.
         * @method defaultEndpointURL
         * @public
         * @return {string}
         * @since 0.6.0
         **/
        /**
         * Set default endpoint URL.
         * @method defaultEndpointURL
         * @public
         * @param {string} endpointURL
         * @chainable
         * @example
         *     sgvizler.defaultEndpointURL('http://sparql.dbpedia.org');
         *   sets the default endpoint to DBpedia's.
         * @since 0.6.0
         **/
        defaultEndpointURL: function (endpointURL) {
            return globalGetSet('endpoint', endpointURL, globalDefaultsQuery, this);
        },

        /**
         * Get default endpoint output format.
         * @method defaultEndpointOutputFormat
         * @public
         * @return {string}
         * @since 0.6.0
         **/
        /**
         * Set default endpoint output format. Legal values are `'xml'`, `'json'`, `'jsonp'`.
         * @method defaultEndpointOutputFormat
         * @public
         * @param {string} format
         * @chainable
         * @since 0.6.0
         **/
        defaultEndpointOutputFormat: function (format) {
            return globalGetSet('endpoint_output_format', format, globalDefaultsQuery, this);
        },

        // TODO
        defaultEndpointResultsURLPart: function (value) {
            return globalGetSet('endpoint_results_urlpart', value, globalDefaultsQuery, this);
        },

        /**
         * Get URL to online SPARQL query validator.
         * @method defaultValidatorURL
         * @public
         * @return {string}
         * @since 0.6.0
         **/
        /**
         * Set URL to online SPARQL query validator. Appending a
         * SPARQL query to the end of this URL should give a page
         * which validates the given query.
         * @method defaultValidatorURL
         * @public
         * @param {string} url
         * @chainable
         * @since 0.6.0
         **/
        defaultValidatorURL: function (url) {
            return globalGetSet('validator_url', url, globalDefaultsQuery, this);
        },

        // TODO
        defaultLogContainer: function (value) {
            return globalGetSet('logcontainer', value, globalDefaultsQuery, this);
        },
        // TODO

        /**
         * These are the java ones, taken from [the
         * javadocs](http://docs.oracle.com/javase/1.4.2/docs/api/java/util/logging/Level.html):
         *
         * Permissible values are:
         *
         *   - SEVERE (highest value)
         *   - WARNING
         *   - INFO
         *   - CONFIG
         *   - FINE
         *   - FINER
         *   - FINEST (lowest value)
         * @method defaultLoglevel
         */
        defaultLogLevel: function (value) {
            return globalGetSet('loglevel', value, globalDefaultsQuery, this);
        },

        /**
         * Get the name of the default datatable preprocessing
         * function.
         * @method defaultDatatableFunction
         * @public
         * @return {string}
         * @since 0.6.0
         **/
        /**
         * Set the name of the default datatable preprocessing function. The
         * function should be available in the global object, or
         * registered with dependencies in Sgvizler's registry;
         * see sgvizler.datatablesAdd()
         * @method defaultDatatableFunction
         * @public
         * @param {string} functionName
         * @chainable
         * @since 0.6.0
         **/
        defaultDatatableFunction: function (functionName) {
            return globalGetSet('datatable', functionName, globalDefaultsQuery, this);
        },

        /**
         * Get the name of the default chart function.
         * @method defaultChartFunction
         * @public
         * @return {string}
         * @since 0.6.0
         **/
        /**
         * Set the name of the default chart function. The
         * function should be availble in the global object, or
         * registered with dependencies in Sgvizler's registry;
         * see sgvizler.chartsAdd()
         * @method defaultChartFunction
         * @public
         * @param {string} functionName
         * @chainable
         * @since 0.6.0
         **/
        defaultChartFunction: function (functionName) {
            return globalGetSet('chart', functionName, globalDefaultsQuery, this);
        },

        /**
         * Get the default height of chart containers.
         * @method defaultChartHeight
         * @public
         * @return {string}
         * @since 0.6.0
         **/
        /**
         * Set the default height of chart containers.
         * @method defaultChartHeight
         * @public
         * @param {number} height
         * @chainable
         * @since 0.6.0
         **/
        defaultChartHeight: function (height) {
            return globalGetSet('height', height, globalDefaultsChart, this);
        },

        /**
         * Get the default width of chart containers.
         * @method defaultChartWidth
         * @public
         * @return {string}
         * @since 0.6.0
         **/
        /**
         * Set the default width of chart containers.
         * @method defaultChartWidth
         * @public
         * @param {number} width
         * @chainable
         * @since 0.6.0
         **/
        defaultChartWidth: function (width) {
            return globalGetSet('width', width, globalDefaultsChart, this);
        },

        /**
         * TODO
         * @method defaultChartSpecificOption
         * @public
         * @chainable
         * @since 0.6.0
         **/
        defaultChartSpecificOption: function (chart, option, value) {
            S.defaults.setChartSpecificOption(chart, option, value);
            return this;
        }
    };

    jQuery.ajaxSetup(
        {
            cache: true,
            accepts: {
                xml:   "application/sparql-results+xml",
                json:  "application/sparql-results+json",
                jsonp: "application/sparql-results+json"
            }
        }
    );

}(window));
