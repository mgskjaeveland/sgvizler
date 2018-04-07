
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
