
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
