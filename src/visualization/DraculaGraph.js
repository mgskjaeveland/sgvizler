
        /**
         * Draws a graph with clickable and movable nodes.
         *
         * Input format:
         *
         *  - 7 columns, last three are optional.
         *  - each row represents a source node, a target node and an edge from source to target.
         *  - the URIs are the id's for the nodes, and make the nodes clickable.
         *
         * Columns:
         *
         *  1. sourceURI
         *  2. sourceLabel
         *  3. targetURI
         *  4. targetLabel
         *  5. edgeLabel
         *  6. sourceColor
         *  7. targetColor
         *
         * @class sgvizler.visualization.DraculaGraph
         * @extends sgvizler.charts.Chart
         * @constructor
         * @param {Object} container The container element where the
         * chart will be drawn.
         * @beta
         * @author Magnus Stuhr, Martin G. Skjæveland
         */

        /**
         * @method draw
         * @public
         * @param {google.visualization.DataTable} data
         * @param {Object} [chartOptions]
         * @since 0.5.1
         */
        /*global Dracula */
        C.DraculaGraph = charts.add(modSC, "DraculaGraph",
            function (data, chartOpt) {

                var row, numberOfRows = data.getNumberOfRows(),
                    i, len,
                    numberOfColumns = data.getNumberOfColumns(),

                    // set defaults.
                    opt = $.extend({
                        noderadius: 0.5,
                        nodefontsize: "10px",
                        nodeheight: 20,
                        nodestrokewidth: "1px",
                        directed: false,
                        nodecornerradius: "1px",
                        nodepadding: 7,
                        nodecolor: "green",
                        edgestroke: "blue",
                        edgefill: "blue",
                        edgestrokewidth: 1,
                        edgefontsize: "10px",
                        edgeseparator: ", "
                    }, chartOpt),

                    graph = new Dracula.Graph(),
                    layouter,
                    renderer,
                    edge,
                    source,
                    target,
                    label,

                    // custom node rendering using Raphael.
                    nodeRenderer = function (color, URL) {
                        return function (r, n) {
                            return r.set()
                                // rectangle
                                .push(r.rect(n.point[0],
                                             n.point[1],
                                             n.label.length * opt.nodepadding,
                                             opt.nodeheight)
                                      .attr({fill: color,
                                             'stroke-width': opt.nodestrokewidth,
                                             r : opt.nodecornerradius}))
                                // label inside rectangle
                                .push(r.text(n.point[0] + n.label.length * opt.nodepadding / 2,
                                             n.point[1] + opt.nodeheight / 2,
                                             n.label)
                                      .attr({'font-size': opt.nodefontsize})
                                      .click(function () { if (URL) { window.open(namespace.unprefixify(URL)); } })
                                     );
                        };
                    },

                    // helper function.
                    addNode = function (URL, name, color) {
                        graph.addNode(URL, {label: name, render: nodeRenderer(color, URL)});
                        //console.log("add node - name: " + name + ", URL: " + URL);
                    },
                    edges = {},
                    keys_edges = [];

                for (row = 0; row < numberOfRows; row += 1) {
                    source = data.getValue(row, 0);
                    target = data.getValue(row, 2);

                    // add source node
                    // Note: does dracula take care of duplicates?
                    if (source) {
                        addNode(source,
                                data.getValue(row, 1) || source,
                                numberOfColumns > 5 ? data.getValue(row, 5) : opt.nodecolor);
                    }
                    // add target node
                    if (target) {
                        addNode(target,
                                data.getValue(row, 3) || target,
                                numberOfColumns > 6 ? data.getValue(row, 6) : opt.nodecolor);
                    }

                    // collect edge labels. Only one edge per pair of nodes,
                    // so we concatinate labels of multiple edges into one.
                    if (source && target) {
                        label = "";
                        // test if source--target pair is seen before:
                        if (edges[source + target] !== undefined) {
                            label = edges[source + target].label; // retrieve accumulated label.
                        } else {
                            keys_edges.push(source + target);
                        }

                        if (numberOfColumns > 4 && data.getValue(row, 4).length > 0) {
                            if (label.length > 0) {
                                label += opt.edgeseparator;
                            }
                            label += data.getValue(row, 4);
                        }

                        edges[source + target] = {
                            source: source,
                            target: target,
                            label: label
                        };
                    }
                }

                // add edges
                for (i = 0, len = keys_edges.length; i < len; i += 1) {
                    edge = edges[keys_edges[i]];
                    //console.log("add edge - source: " + edge.source + ", target " + edge.target);
                    graph.addEdge(edge.source, edge.target,
                                  { stroke: opt.edgestroke,
                                    directed: opt.directed,
                                    fill: opt.edgefill,
                                    label: edge.label,
                                    width: opt.edgestrokewidth,
                                    fontsize: opt.edgefontsize
                                  });
                }

                layouter = new Dracula.Graph.Layout.Spring(graph);
                layouter.layout();

                $(this.container).empty();
                renderer = new Dracula.Graph.Renderer.Raphael(
                    this.container,
                    graph,
                    opt.width,
                    opt.height,
                    { noderadius : opt.nodeheight * opt.noderadius}
                );
                renderer.draw();

                this.fireListener('ready');
            },
            { Dracula: 'http://www.data2000.no/sgvizler/lib/raphael-dracula.min.js' }
            );
