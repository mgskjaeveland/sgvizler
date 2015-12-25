
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

