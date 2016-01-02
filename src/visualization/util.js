
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
