        /**
         * TODO: please explain input and output of the chart function.
         *  @class sgvizler.visualization.D3Seqlogo
         *  @extends sgvizler.charts.Chart
         *  @constructor
         *  @param {Object} container The container element where the
         *  chart will be drawn.
         *  @beta
         */

        /**
         * @method draw
         * @public
         * @param {google.visualization.DataTable} data
         * @param {Object} [chartOptions]
         * @since XXXX
         */

        C.D3Seqlogo = charts.add(
            modSC,
            'D3Seqlogo',
            function (data, chartOpt) {
                var colorSchemes = {
                        classic: { //based on WebLogo3 Classic Spec
                            G: "green", //polar
                            S: "green",
                            T: "green",
                            Y: "green",
                            C: "green",
                            Q: "purple", //neutral
                            N: "purple",
                            K: "blue", //basic
                            R: "blue",
                            H: "blue",
                            D: "red", //acidic
                            E: "red",
                            A: "black", //hydrophobic
                            V: "black",
                            L: "black",
                            I: "black",
                            P: "black",
                            W: "black",
                            F: "black",
                            M: "black"
                        }
                    },

                    sequences,
                    letter,
                    svgContainer,

                    getSequenceData = function (sequences) {

                        var i, j, k, p,

                            seqData = [],
                            aaList = [],

                            numAA = 20,
                            ssc = (1 / Math.log(2)) * ((numAA - 1) / (2 * sequences.length)), // small-sample correction
                            RseqC = (Math.log(numAA) / Math.log(2)) - ssc,
                            Rseq,

                            counts,
                            heights,
                            yValues,
                            sortedAA;

                        // for each position, list the amino acids aligned to it!
                        for (i = 0; i < sequences.length; i += 1) {
                            for (j = 0; j < sequences[0].length; j += 1) {
                                if (aaList[j] === undefined) {
                                    aaList[j] = [];
                                }
                                aaList[j].push(sequences[i][j]);
                            }
                        }


                        for (i = 0; i < aaList.length; i += 1) {
                            counts = {};
                            Rseq = RseqC;

                            aaList[i].forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });//python's counter

                            for (j in counts) {
                                if (counts.hasOwnProperty(j)) {
                                    p = counts[j] / Number(aaList[i].length);
                                    Rseq += p * Math.log(p) / Math.log(2);
                                }
                            }

                            heights = {};
                            for (j in counts) {
                                if (counts.hasOwnProperty(j)) {
                                    p = counts[j] / Number(aaList[i].length);
                                    heights[j] = Math.max(p * Rseq, 0);
                                }
                            }

                            // sorting keys by value
                            sortedAA = Object.keys(heights).sort(function (a, b) { return heights[a] - heights[b]; });

                            yValues = {};
                            for (j = 0; j < sortedAA.length; j += 1) {
                                yValues[sortedAA[j]] = 0.0;
                                for (k = 0; k < j; k += 1) {
                                    yValues[sortedAA[j]] += heights[sortedAA[k]];
                                }
                            }

                            for (j = 0; j < sortedAA.length; j += 1) {
                                seqData.push(
                                    {
                                        aa: sortedAA[j],
                                        pos: i,
                                        height: heights[sortedAA[j]],
                                        y: yValues[sortedAA[j]]
                                    }
                                );
                            }
                        }
                        return seqData;
                    };


                //----------------------------------------------------------

                // sequence data
                // TODO: get real data from sparql result, i.e., 'data' Google DataTable input parameter.
                sequences = ["ACGEDFGY",
                             "AFGEDFGR",
                             "AFLEDTHP",
                             "AFIEDTGQ",
                             "AFGEYFGW"];

                //----------------------------------------------------------

                // Create the SVG Viewport
                svgContainer = d3.select(this.container)
                    .append("svg")
                    .attr("width", chartOpt.width)
                    .attr("height", chartOpt.height);

                // Create an SVG "g" group container for each letter (transformable)
                letter = svgContainer.selectAll("g")
                    .data(getSequenceData(sequences))
                    .enter()
                    .append("g")
                    .attr("transform", function (d) {
                        var yVal = 50 - (20 * d.y);
                        return "translate(" + d.pos * 20 + "," + yVal + ") " + "scale(" + 1 + "," + d.height + ") ";
                    });

                // Add SVG Text Element Attributes to "g"
                // TODO: get/set values from chartOpt?
                letter.append("text")
                    .text(function (d) { return d.aa; })
                    .attr("font-family", "monospace")
                    .attr("font-size", "30px")
                    .attr("fill", function (d) { return colorSchemes.classic[d.aa]; });

                this.fireListener('ready');
            },
            { d3: '//cdnjs.cloudflare.com/ajax/libs/d3/2.10.0/d3.v2.min.js' }
        );
