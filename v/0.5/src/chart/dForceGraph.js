

    /*global d3 */
    /** dForceGraph **


        D3 force directed graph. Under development.
    */
    sgvizler.chart.dForceGraph = function (container) { this.container = container; };
    sgvizler.chart.dForceGraph.prototype = {
        id:   "dForceGraph",
        draw: function (data, chartOpt) {
            var noColumns = data.getNumberOfColumns(),
                noRows = data.getNumberOfRows(),
                opt = $.extend({'maxnodesize': 15, 'minnodesize': 2 }, chartOpt), // set defaults
                colors = d3.scale.category20(),
                w = chartOpt.width,
                h = chartOpt.height,
                isNumber = function (n) {  return !isNaN(parseFloat(n)) && isFinite(n); },

                // build arrays of nodes and links.
                nodes = [],
                edges = [],
                t_color = {},
                t_size = {},
                t_maxnodesize = 0,

                r,
                source,
                target,

                nodesizeratio,
                i,
                color,
                size,

                vis,
                force,
                link,
                node,
                ticks;

            for (r = 0; r < noRows; r += 1) {
                source = data.getValue(r, 0);
                target = data.getValue(r, 1);
                // nodes
                if (source !== null && $.inArray(source, nodes) === -1) {
                    nodes.push(source);
                    t_size[source] = (noColumns > 2) ? Math.sqrt(data.getValue(r, 2)) : 0;
                    t_color[source] = (noColumns > 3) ? data.getValue(r, 3) : 0;
                    if (t_size[source] > t_maxnodesize) {
                        t_maxnodesize = t_size[source];
                    }
                }
                if (target !== null && $.inArray(target, nodes) === -1) {
                    nodes.push(target);
                }
                // edges
                if (source !== null && target !== null) {
                    edges.push({'source': $.inArray(source, nodes),
                                'target': $.inArray(target, nodes)
                            }
                        );
                }
            }
            if (t_maxnodesize === 0) {
                t_maxnodesize = 1;
            }
            nodesizeratio = opt.maxnodesize / t_maxnodesize;
            for (i = 0; i < nodes.length; i += 1) {
                color = typeof t_color[nodes[i]] !== 'undefined' ?
                        t_color[nodes[i]] :
                        1;
                size = isNumber(t_size[nodes[i]]) ?
                        opt.minnodesize + t_size[nodes[i]] * nodesizeratio :
                        opt.minnodesize;

                nodes[i] = {'name': nodes[i], 'color': color, 'size': size };
            }

            $(this.container).empty();

            vis = d3.select(this.container)
                .append("svg:svg")
                .attr("width", w)
                .attr("height", h)
                .attr("pointer-events", "all")
                .append('svg:g')
                .call(d3.behavior.zoom().on("zoom", function () {
                    vis.attr("transform", "translate(" + d3.event.translate + ")" +
                         " scale(" + d3.event.scale + ")");
                }))
                .append('svg:g');

            vis.append('svg:rect')
                .attr('width', w)
                .attr('height', h)
                .attr('fill', 'white');

            force = d3.layout.force()
                .gravity(0.05)
                .distance(100)
                .charge(-100)
                .nodes(nodes)
                .links(edges)
                .size([w, h])
                .start();

            link = vis.selectAll("line.link")
                .data(edges)
                .enter().append("svg:line")
                .attr("class", "link")
                //.style("stroke-width", function (d) { return Math.sqrt(d.value); })
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            node = vis.selectAll("g.node")
                .data(nodes)
                .enter().append("svg:g")
                .attr("class", "node")
                .call(force.drag);

            node.append("svg:circle")
                .style("fill", function (d) { return colors(d.color); })
                .attr("class", "node")
                .attr("r", function (d) { return d.size; });

            node.append("svg:title")
                .text(function (d) { return d.name; });

            node.append("svg:text")
                .attr("class", "nodetext")
                .attr("dx", 12)
                .attr("dy", ".35em")
                .text(function (d) { return d.name; });

            ticks = 0;
            force.on("tick", function () {
                ticks += 1;
                if (ticks > 250) {
                    force.stop();
                    force.charge(0)
                        .linkStrength(0)
                        .linkDistance(0)
                        .gravity(0)
                        .start();
                }

                link.attr("x1", function (d) { return d.source.x; })
                    .attr("y1", function (d) { return d.source.y; })
                    .attr("x2", function (d) { return d.target.x; })
                    .attr("y2", function (d) { return d.target.y; });

                node.attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });
            });
        }
    };
