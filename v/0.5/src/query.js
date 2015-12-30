

    /*global XDomainRequest */

    sgvizler.query = function (container) {
        this.container = container;

        //defaults
        this.query = "SELECT ?class (count(?instance) AS ?noOfInstances)\nWHERE{ ?instance a ?class }\nGROUP BY ?class\nORDER BY ?class";
        this.endpoint = "http://sws.ifi.uio.no/sparql/world";
        this.endpoint_output = 'json';  // xml, json, jsonp
        this.endpoint_query_url = "?output=text&amp;query=";
        this.validator_query_url = "http://www.sparql.org/query-validator?languageSyntax=SPARQL&amp;outputFormat=sparql&amp;linenumbers=true&amp;query=";
        this.chart = 'gLineChart';
        this.loglevel = 2;

        this.chartOptions = {
            'width':           '800',
            'height':          '400',
            'chartArea':       { left: '5%', top: '5%', width: '75%', height: '80%' },
            'gGeoMap': {
                'dataMode':           'markers'
            },
            'gMap': {
                'dataMode':           'markers'
            },
            'sMap': {
                'dataMode':           'markers',
                'showTip':            true,
                'useMapTypeControl':  true
            },
            'gSparkline': {
                'showAxisLines':      false
            }
        };
    };

    sgvizler.query.prototype.draw = function () {
        var that = this,
            chartFunc = sgvizler.charts.getChart(this.container, this.chart);
        this.setChartSpecificOptions();
        this.insertFrom();
        this.runQuery(function (data) {
            chartFunc.draw(new google.visualization.DataTable(that.processQueryResults(data)),
                           that.chartOptions);
        });
    };

    sgvizler.query.prototype.runQuery = function (callback) {
        var xdr,
            url,
            endpoint_output = this.endpoint_output;
        sgvizler.ui.displayFeedback(this, "LOADING");
        this.encodedQuery = encodeURIComponent(this.getPrefixes() + this.query);
        if (this.endpoint_output !== 'jsonp' && $.browser.msie && window.XDomainRequest) {
            xdr = new XDomainRequest();
            url = this.endpoint +
                "?query=" + this.encodedQuery +
                "&output=" + this.endpoint_output;
            xdr.open("GET", url);
            xdr.onload = function () {
                var data;
                if (endpoint_output === "xml") {
                    data = $.parseXML(xdr.responseText);
                } else {
                    data = $.parseJSON(xdr.responseText);
                }
                callback(data);
            };
            xdr.send();
        } else {
            $.get(this.endpoint,
                  { query: this.getPrefixes() + this.query,
                    output: (this.endpoint_output === 'jsonp') ? 'json' : this.endpoint_output },
                  function (data) { callback(data); },
                  this.endpoint_output)
                .error(function () {
                    sgvizler.ui.displayFeedback(this, "ERROR_ENDPOINT");
                });
        }
    };

    sgvizler.query.prototype.processQueryResults = function (data) {
        this.setResultRowCount(data);
        if (this.noRows === null) {
            sgvizler.ui.displayFeedback(this, "ERROR_UNKNOWN");
        } else if (this.noRows === 0) {
            sgvizler.ui.displayFeedback(this, "NO_RESULTS");
        } else {
            sgvizler.ui.displayFeedback(this, "DRAWING");
            return this.getGoogleJSON(data);
        }
    };

    sgvizler.query.prototype.setResultRowCount = function (data) {
        if (this.endpoint_output === 'xml') {
            this.noRows = sgvizler.parser.countRowsSparqlXML(data);
        } else {
            this.noRows = sgvizler.parser.countRowsSparqlJSON(data);
        }
    };

    sgvizler.query.prototype.getGoogleJSON = function (data) {
        if (this.endpoint_output === 'xml') {
            data = sgvizler.parser.SparqlXML2GoogleJSON(data);
        } else {
            data = sgvizler.parser.SparqlJSON2GoogleJSON(data);
        }
        return data;
    };

    sgvizler.query.prototype.insertFrom = function () {
        if (typeof this.rdf !== 'undefined') {
            var i,
                froms = this.rdf.split(sgvizler.ui.attr.valueSplit),
                from = "";
            for (i = 0; i < froms.length; i += 1) {
                from += 'FROM <' + froms[i] + '>\n';
            }
            this.query = this.query.replace(/(WHERE)?(\s)*\{/, '\n' + from + 'WHERE {');
        }
    };

    sgvizler.query.prototype.getPrefixes = function () {
        var prefix,
            prefixes = "";
        for (prefix in sgvizler.option.namespace) {
            if (sgvizler.option.namespace.hasOwnProperty(prefix)) {
                prefixes += "PREFIX " + prefix + ": <" + sgvizler.option.namespace[prefix] + ">\n";
            }
        }
        return prefixes;
    };

    sgvizler.query.prototype.setChartSpecificOptions = function () {
        var level1,
            level2;
        for (level1 in this.chartOptions) {
            if (this.chartOptions.hasOwnProperty(level1) &&
                    level1 === this.chart) {
                for (level2 in this.chartOptions[level1]) {
                    if (this.chartOptions[level1].hasOwnProperty(level2)) {
                        this.chartOptions[level2] = this.chartOptions[level1][level2];
                    }
                }
            }
        }
    };