
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
