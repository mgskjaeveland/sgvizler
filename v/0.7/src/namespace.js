
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
