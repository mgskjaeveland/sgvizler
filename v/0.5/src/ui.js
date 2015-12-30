
    sgvizler.ui = {

        //// #id's to html elements:
        id: {
            script:       'sgvzlr_script',       // #id to the script tag for this file
            chartCon:     'sgvzlr_gchart',       // #id to the container to hold the chart
            queryForm:    'sgvzlr_formQuery',    //
            queryTxt:     'sgvzlr_cQuery',       // query text area.
            formQuery:    'sgvzlr_strQuery',     // hidden query string. "trick" taken from snorql.
            formEndpoint: 'sgvzlr_strEndpoint',  // hidden query string. "trick" taken from snorql.
            formWidth:    'sgvzlr_strWidth',     //
            formHeight:   'sgvzlr_strHeight',    //
            formChart:    'sgvzlr_optChart',     //
            prefixCon:    'sgvzlr_cPrefix',      // print prefixes
            messageCon:   'sgvzlr_cMessage'      // print messages
        },

        attr: {
            prefix:      'data-sgvizler-',
            prefixChart: 'data-sgvizler-chart-options',

            valueAssign: '=',
            valueSplit:  '|'
        },

        params: [ 'query', 'endpoint', 'chart', 'width', 'height' ], // permissible URL parameters.

        displayUI: function (queryOpt) {
            this.displayPrefixes();
            this.displayChartTypesMenu();
            this.displayUserInput(queryOpt);
        },
        displayPrefixes: function () {
            this.setElementText(this.id.prefixCon, sgvizler.query.prototype.getPrefixes());
        },
        displayUserInput: function (queryOpt) {
            this.setElementValue(this.id.queryTxt, queryOpt.query);
            this.setElementValue(this.id.formEndpoint, queryOpt.endpoint);
            this.setElementValue(this.id.formChart, queryOpt.chart);
            this.setElementValue(this.id.formWidth, queryOpt.chartOptions.width);
            this.setElementValue(this.id.formHeight, queryOpt.chartOptions.height);
        },
        displayChartTypesMenu: function () {
            var chart,
                i;
            if (this.isElement(this.id.formChart)) {
                chart = sgvizler.charts.all;
                for (i = 0; i < chart.length; i += 1) {
                    $('#' + this.id.formChart)
                        .append($('<option/>')
                                .val(chart[i].id)
                                .html(chart[i].id));
                }
            }
        },

        displayFeedback: function (queryOpt, messageName) {
            var message,
                container = queryOpt.container;
            if (queryOpt.container === this.id.chartCon && this.isElement(this.id.messageCon)) {
                container = this.id.messageCon;
            }

            if (queryOpt.loglevel === 0) {
                message = "";
            } else if (queryOpt.loglevel === 1) {
                if (messageName === "LOADING") {
                    message = "Loading...";
                } else if (messageName === "ERROR_ENDPOINT" || messageName === "ERROR_UNKNOWN") {
                    message = "Error.";
                }
            } else {
                if (messageName === "LOADING") {
                    message = "Sending query...";
                } else if (messageName === "ERROR_ENDPOINT") {
                    message = "Error querying endpoint. Possible errors:" +
                        this.html.ul(
                            this.html.a(queryOpt.endpoint, "SPARQL endpoint") + " down? " +
                                this.html.a(queryOpt.endpoint + queryOpt.endpoint_query_url + queryOpt.encodedQuery,
                                            "Check if query runs at the endpoint") + ".",
                            "Malformed SPARQL query? " +
                                this.html.a(queryOpt.validator_query_url + queryOpt.encodedQuery, "Check if it validates") + ".",
                            "CORS supported and enabled?",
                            "Is your browser support ed?",
                            "Hmm.. it might be a bug! Please file a report to Sgvizler's development site."
                        );
                } else if (messageName === "ERROR_UNKNOWN") {
                    message = "Unknown error.";
                } else if (messageName === "NO_RESULTS") {
                    message = "Query returned no results.";
                } else if (messageName === "DRAWING") {
                    message = "Received " + queryOpt.noRows + " rows. Drawing chart...<br/>" +
                        this.html.a(queryOpt.endpoint + queryOpt.endpoint_query_url + queryOpt.encodedQuery,
                                    "View query results", "target='_blank'") + " (in new window).";
                }
            }
            this.setElementHTML(container, this.html.tag("p", message));
        },

        setElementValue: function (elementID, value) {
            if (this.isElement(elementID)) {
                $('#' + elementID).val(value);
            }
        },
        setElementText: function (elementID, value) {
            if (this.isElement(elementID)) {
                $('#' + elementID).text(value);
            }
        },
        setElementHTML: function (elementID, value) {
            if (this.isElement(elementID)) {
                $('#' + elementID).html(value);
            }
        },
        isElement: function (elementID) {
            return $('#' + elementID).length > 0;
        },

        getQueryOptionAttr: function (element) {
            var i,
                queryOpt = {container: $(element).attr('id')},
                attr = element.attributes;
            for (i = 0; i < attr.length; i += 1) {
                if (attr[i].name.lastIndexOf(this.attr.prefix, 0) === 0) { // starts-with attr.prefix.
                    queryOpt[attr[i].name.substring(this.attr.prefix.length)] = attr[i].value;
                }
            }
            return queryOpt;
        },
        getChartOptionAttr: function (element) {
            var i,
                options,
                assignment,
                path,
                o,
                j,
                chartOpt = {},
                attrValue = $(element).attr(sgvizler.ui.attr.prefixChart);
            if (typeof attrValue !== 'undefined') {
                options = attrValue.split(this.attr.valueSplit);
                for (i = 0; i < options.length; i += 1) {
                    assignment = options[i].split(this.attr.valueAssign);
                    path = assignment[0].split(".");
                    o = chartOpt;
                    for (j = 0; j < path.length - 1; j += 1) {
                        if (typeof o[path[j]] === 'undefined') {
                            o[path[j]] = {};
                        }
                        o = o[path[j]];
                    }
                    o[path[j]] = assignment[1];
                }
            }
            // get width and heigth from css. take only numbers.
            chartOpt.width = /(\d+)/.exec($(element).css('width'))[1];
            chartOpt.height = /(\d+)/.exec($(element).css('height'))[1];
            return chartOpt;
        },

        getUrlParams: function () {
            /*jslint regexp: true */
            var urlParams = {},
                e,
                r = /([^&=]+)=?([^&]*)/g, // parameter, value pairs.
                d = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); }, // replace '+' with space.
                q = window.location.search.substring(1); // URL query string part.

            while ((e = r.exec(q))) {
                if (e[2].length > 0 && this.params.indexOf(e[1]) !== -1) {
                    urlParams[d(e[1])] = d(e[2]);
                }
            }
            return urlParams;
        },

        resetPage: function () {
            document.location = sgvizler.option.home;
        },
        submitQuery: function () {
            $('#' + this.id.formQuery).val($('#' + this.id.queryTxt).val());
            $('#' + this.id.queryForm).submit();
        },

        html: {
            a: function (href, link, attr) {
                if (typeof attr === 'undefined') { attr = ""; }
                if (typeof href !== 'undefined' && typeof link !== 'undefined') {
                    return "<a " + attr + " href='" + href + "'>" + link + "</a>";
                }
            },
            ul: function () {
                var i,
                    txt;
                if (arguments.length) {
                    txt = "<ul>";
                    for (i = 0; i < arguments.length; i += 1) {
                        txt += "<li>" + arguments[i] + "</li>";
                    }
                    return txt + "</ul>";
                }
            },
            tag: function (tag, content) {
                return "<" + tag + ">" + content + "</" + tag + ">";
            }
        }
    };