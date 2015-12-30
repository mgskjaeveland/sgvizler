

    sgvizler.parser = {

        // variable notation: xtable, xcol(s), xrow(s) -- x is 's'(parql) or 'g'(oogle).

        defaultGDatatype: 'string',

        countRowsSparqlXML: function (sxml) {
            return $(sxml).find('sparql').find('results').find('result').length;
        },

        countRowsSparqlJSON: function (stable) {
            if (typeof stable.results.bindings !== 'undefined') {
                return stable.results.bindings.length;
            }
        },

        SparqlXML2GoogleJSON: function (sxml) {
            var c,
                r,
                gcols = [],
                grows = [],
                gdatatype = [], // for easy reference of datatypes
                sresults = $(sxml).find('sparql').find('results').find('result');

            // gcols
            c = 0;
            $(sxml).find('sparql').find('head').find('variable').each(function () {
                var stype = null,
                    sdatatype = null,
                    name = $(this).attr('name'),
                    scell = null,
                    scells = $(sresults).find('binding[name="' + name + '"]');
                if (scells.length) {
                    scell = $(scells).first().children().first()[0]; // uri, literal element
                    stype = scell.nodeName;
                    sdatatype = $(scell).attr('datatype');
                }
                gdatatype[c] = sgvizler.parser.getGoogleJsonDatatype(stype, sdatatype);
                gcols[c] = {'id': name, 'label': name, 'type': gdatatype[c]};
                c += 1;
            });

            // grows
            r = 0;
            $(sresults).each(function () {
                var gvalue,
                    scells,
                    scell,
                    stype,
                    svalue,
                    grow = [];
                for (c = 0; c < gcols.length; c += 1) {
                    gvalue = null;
                    scells = $(this).find('binding[name="' + gcols[c].id + '"]');
                    if (scells.length &&
                            typeof $(scells).first().children().first() !== 'undefined' &&
                            $(scells).first().children().first().firstChild !== null) {
                        scell = $(scells).first().children().first()[0]; // uri, literal element
                        stype = scell.nodeName;
                        svalue = $(scell).first().text();
                        gvalue = sgvizler.parser.getGoogleJsonValue(svalue, gdatatype[c], stype);
                    }
                    grow[c] = {'v': gvalue};
                }
                grows[r] = {'c': grow};
                r += 1;
            });
            return {'cols': gcols, 'rows': grows};
        },

        SparqlJSON2GoogleJSON: function (stable) {
            var c,
                r,
                srow,
                grow,
                gvalue,
                stype,
                sdatatype,
                gcols = [],
                grows = [],
                gdatatype = [], // for easy reference of datatypes
                scols = stable.head.vars,
                srows = stable.results.bindings;

            for (c = 0; c < scols.length; c += 1) {
                r = 0;
                stype = null;
                sdatatype = null;
                // find a row where there is a value for this column
                while (typeof srows[r][scols[c]] === 'undefined' && r + 1 < srows.length) { r += 1; }
                if (typeof srows[r][scols[c]] !== 'undefined') {
                    stype = srows[r][scols[c]].type;
                    sdatatype = srows[r][scols[c]].datatype;
                }
                gdatatype[c] = this.getGoogleJsonDatatype(stype, sdatatype);
                gcols[c] = {'id': scols[c], 'label': scols[c], 'type': gdatatype[c]};
            }

            // loop rows
            for (r = 0; r < srows.length; r += 1) {
                srow = srows[r];
                grow = [];
                // loop cells
                for (c = 0; c < scols.length; c += 1) {
                    gvalue = null;
                    if (typeof srow[scols[c]] !== 'undefined' &&
                            typeof srow[scols[c]].value !== 'undefined') {
                        gvalue = this.getGoogleJsonValue(srow[scols[c]].value, gdatatype[c], srow[scols[c]].type);
                    }
                    grow[c] = { 'v': gvalue };
                }
                grows[r] = {'c': grow};
            }
            return {'cols': gcols, 'rows': grows};
        },

        getGoogleJsonValue: function (value, gdatatype, stype) {
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
                    newvalue = this.prefixify(value);
                }
                newvalue = value;
            }
            return newvalue;
        },

        getGoogleJsonDatatype: function (stype, sdatatype) {
            var gdatatype = this.defaultGDatatype,
                xsdns = sgvizler.option.namespace.xsd;
            if (typeof stype !== 'undefined' && (stype === 'typed-literal' || stype === 'literal')) {
                if (sdatatype === xsdns + "float"   ||
                        sdatatype === xsdns + "double"  ||
                        sdatatype === xsdns + "decimal" ||
                        sdatatype === xsdns + "int"     ||
                        sdatatype === xsdns + "long"    ||
                        sdatatype === xsdns + "integer") {
                    gdatatype =  'number';
                } else if (sdatatype === xsdns + "boolean") {
                    gdatatype =  'boolean';
                } else if (sdatatype === xsdns + "date") {
                    gdatatype =  'date';
                } else if (sdatatype === xsdns + "dateTime") {
                    gdatatype =  'datetime';
                } else if (sdatatype === xsdns + "time") {
                    gdatatype =  'timeofday';
                }
            }
            return gdatatype;
        },

        prefixify: function (url) {
            var ns;
            for (ns in sgvizler.option.namespace) {
                if (sgvizler.option.namespace.hasOwnProperty(ns) &&
                        url.lastIndexOf(sgvizler.option.namespace[ns], 0) === 0) {
                    return url.replace(sgvizler.option.namespace[ns], ns + ":");
                }
            }
            return url;
        },
        unprefixify: function (qname) {
            var ns;
            for (ns in sgvizler.option.namespace) {
                if (sgvizler.option.namespace.hasOwnProperty(ns) &&
                        qname.lastIndexOf(ns + ":", 0) === 0) {
                    return qname.replace(ns + ":", sgvizler.option.namespace[ns]);
                }
            }
            return qname;
        }
    };
