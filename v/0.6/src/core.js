
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
            HOMEPAGE = "http://mgskjaeveland.github.io/sgvizler/",

            // global private constants
            LOGOIMAGE = "http://beta.data2000.no/sgvizler/misc/image/mr.sgvizler.png",
            CHARTSCSS = "http://mgskjaeveland.github.io/sgvizler/v/0.6/sgvizler.charts.css";

        return {
            VERSION: VERSION,
            HOMEPAGE: HOMEPAGE,
            LOGOIMAGE: LOGOIMAGE,
            CHARTSCSS: CHARTSCSS
        };
    }());
