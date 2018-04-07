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
                        base = namespace.getBaseURL(),
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


                /**
                 * Available options:
                 *
                 *  - 'dataFunction'           :  function applied to every cell value. (default: identify function)
                 *  - 'includeHeaders'         :  include column headings or not. (default: false)
                 *  - 'headingCellSep'         :  string to separate cells in each column. (default: '')
                 *  - 'headingCellPrefix'      :  string to prefix each cell with. (default: '')
                 *  - 'headingCellPostfix'     :  string to postfix each cell with. (default: '')
                 *  - 'headingRowPrefix'       :  string to prefix each row with. (default: '')
                 *  - 'headingRowPostfix'      :  string to postfix each row with. (default: '')
                 *  - 'cellSep'                :  string to separate cells in each column. (default: '')
                 *  - 'cellPrefix'             :  string to prefix each cell with. (default: '')
                 *  - 'cellPostfix'            :  string to postfix each cell with. (default: '')
                 *  - 'rowPrefix'              :  string to prefix each row with. (default: '')
                 *  - 'rowPostfix'             :  string to postfix each row with. (default: '')
                 *  - 'resultsPrefix'          :  string to prefix the results with. (default: '')
                 *  - 'resultsPostfix'         :  string to postfix the results with. (default: '')
                 *
                 * @method genericTextDraw
                 * @protected
                 * @param {google.visualization.DataTable} data
                 * @param {Object} [chartOptions]
                 * @return {String}
                 * @since 0.6.1
                 **/
                genericTextDraw = function (data, chartOptions) {
                    var c, noColumns = data.getNumberOfColumns(),
                        r, noRows = data.getNumberOfRows(),
                        opt = $.extend({ dataFunction: function (value) { return value; },
                                         includeHeaders: false,
                                         headingRowPrefix: '', headingRowPostfix: '',
                                         headingCellPrefix: '', headingCellPostfix: '',
                                         headingCellSep: '',
                                         cellSep: '',
                                         cellPrefix: '', cellPostfix: '',
                                         rowPrefix: '', rowPostfix: '',
                                         resultsPrefix: '', resultsPostfix: '' },
                                       chartOptions),
                        text = opt.resultsPrefix,
                        row;

                    if (opt.includeHeaders) {
                        row = opt.headingRowPrefix;
                        for (c = 0; c < noColumns; c += 1) {
                            row += opt['headingCellPrefixNo' + (c + 1)] || opt.headingCellPrefix;
                            row += opt.dataFunction(data.getColumnLabel(c));
                            row += opt['headingCellPostfixNo' + (c + 1)] || opt.headingCellPostfix;
                            if (c + 1 !== noColumns) { // Don't add for last element in row.
                                row += opt['headingCellSepNo' + (c + 1)] || opt.headingCellSep;
                            }
                        }
                        row += opt.headingRowPostfix;
                        text += row;
                    }

                    for (r = 0; r < noRows; r += 1) {
                        row = opt['rowPrefixNo' + (r + 1)] || opt.rowPrefix;
                        for (c = 0; c < noColumns; c += 1) {
                            row += opt['cellPrefixNo' + (c + 1)] || opt.cellPrefix;
                            row += opt.dataFunction(data.getValue(r, c));
                            row += opt['cellPostfixNo' + (c + 1)] || opt.cellPostfix;
                            if (c + 1 !== noColumns) { // Don't add for last element in row.
                                row += opt['cellSepNo' + (c + 1)] || opt.cellSep;
                            }
                        }
                        row += opt['rowPostfixNo' + (r + 1)] || opt.rowPostfix;
                        text += row;
                    }
                    text += opt.resultsPostfix;

                    return text;
                },

                cssloaded = false;

            return {

                genericTextDraw: genericTextDraw,

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
