
        /**
         * @class sgvizler.visualization.MapWKT
         * @extends sgvizler.charts.Chart
         * @constructor
         * @param {Object} container The container element where the
         * chart will be drawn.
         * @since 0.6.0
         **/

        /**
         * @method draw
         * @public
         * @param {google.visualization.DataTable} data
         * @param {Object} [chartOptions]
         * @since 0.6.0
         */
        C.MapWKT = charts.add(modSC, "MapWKT",
            function (data, chartOpt) {
                /*global google, OpenLayers */
                var //c,
                    noColumns = data.getNumberOfColumns(),
                    r, noRows = data.getNumberOfRows(),
                    //that = this,
                    opt = $.extend(
                        {
                            zoom: 5,
                            centerLat: 62,
                            centerLong: 2,
                            //mapTypeId: google.maps.MapTypeId.TERRAIN,
                            //douglasPeuckerKink: 5000,
                            geoDatumIn: "EPSG:4326",//"EPSG:4230",
                            geoDatumOut: "EPSG:4326"
                        },
                        chartOpt
                    ),

                    mapOptions = {
                        projection: opt.geoDatumOut,
                        layers: [
                            new OpenLayers.Layer.OSM(),
                            // new OpenLayers.Layer.WMS(
                            //     "OpenLayers WMS",
                            //     "http://vmap0.tiles.osgeo.org/wms/vmap0?", {layers: 'basic'}
                            // ),
                            new OpenLayers.Layer.Google(
                                "Google Physical",
                                {type: google.maps.MapTypeId.TERRAIN}
                            ),
                            new OpenLayers.Layer.Google(
                                "Google Streets",
                                {numZoomLevels: 20}
                            ),
                            new OpenLayers.Layer.Google(
                                "Google Hybrid",
                                {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20}
                            ),
                            new OpenLayers.Layer.Google(
                                "Google Satellite",
                                {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
                            )
                        ],
                        controls: [
                            new OpenLayers.Control.Navigation(),
                            new OpenLayers.Control.PanZoomBar(),
                            new OpenLayers.Control.LayerSwitcher({ ascending: false }),
                            new OpenLayers.Control.Permalink(),
                            new OpenLayers.Control.ScaleLine(),
                            new OpenLayers.Control.MousePosition(),
                            new OpenLayers.Control.OverviewMap(),
                            new OpenLayers.Control.KeyboardDefaults()
                        ],
                        center: new OpenLayers.LonLat(opt.centerLong, opt.centerLat),
                        zoom: 5
                    },
                    mapBounds,
                    map = new OpenLayers.Map(this.container, mapOptions),

                    formatterWKT = new OpenLayers.Format.WKT(
                        {
                            internalProjection: map.baseLayer.projection,
                            externalProjection: new OpenLayers.Projection(opt.geoDatumIn)
                        }
                    ),

                    resultLayer = new OpenLayers.Layer.Vector(
                        "Results",
                        {
                            styleMap: new OpenLayers.StyleMap(
                                {
                                    'default': new OpenLayers.Style(
                                        {
                                            fillColor: "#33CC00",
                                            fillOpacity: 0.2,
                                            strokeColor: "#000000",
                                            strokeWidth: 1
                                        }
                                    )
                                }
                            )
                        }
                    ),
                    labelLayer = new OpenLayers.Layer.Vector(
                        "Labels",
                        {
                            eventListeners: {
                                featureselected: function (evt) {
                                    var feature = evt.feature,
                                        popup = new OpenLayers.Popup.FramedCloud(
                                            "popup",
                                            OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
                                            null,
                                            "<div style='font-size:.8em'>"
                                                + "<b>" + feature.attributes.name + "</b><br/>"
                                                + C.util.linkify2String(feature.attributes.uri) + "<br/>"
                                                + feature.attributes.description
                                                + "</div>",
                                            null,
                                            true
                                        );
                                    feature.popup = popup;
                                    map.addPopup(popup);
                                },
                                featureunselected: function (evt) {
                                    var feature = evt.feature;
                                    map.removePopup(feature.popup);
                                    feature.popup.destroy();
                                    feature.popup = null;
                                }
                            },
                            styleMap: new OpenLayers.StyleMap(
                                {
                                    "default": new OpenLayers.Style(
                                        {
                                            strokeColor: "#FF0000",
                                            strokeOpacity: 1,
                                            strokeWidth: 5,
                                            fillColor: "#FF0000",
                                            fillOpacity: 0.5,
                                            pointRadius: 2,
                                            //pointerEvents: "visiblePainted",

                                            label : "${name}",
                                            fontSize: "10px",
                                            fontFamily: "Arial",
                                            labelAlign: "l",
                                            labelOutlineColor: "white",
                                            labelOutlineWidth: 1,
                                            labelXOffset : 7
                                        }
                                    )
                                }
                            )
                        }
                    ),

                    selector = new OpenLayers.Control.SelectFeature(
                        labelLayer,
                        {
                            click: true,
                            autoActivate: true
                        }
                    ),

                    wktFeature,
                    labelFeature,

                    addWKT = function (layer, valueWKT) {
                        var features = formatterWKT.read(valueWKT),
                            i;

                        if (features) {
                            if (!util.isArray(features.constructor)) {
                                features = [features];
                            }
                            for (i = 0; i < features.length; i += 1) {
                                if (!mapBounds) {
                                    mapBounds = features[i].geometry.getBounds();
                                } else {
                                    mapBounds.extend(features[i].geometry.getBounds());
                                }
                            }
                            layer.addFeatures(features);
                        }
                        return features;
                    };

                //Proj4js.defs["EPSG:4230"] = "+proj=longlat +ellps=intl +no_defs";

                //////////////////////////////////////////////////////////////////////

                for (r = 0; r < noRows; r += 1) {
                    // add WKT
                    wktFeature = addWKT(resultLayer, data.getValue(r, 0));

                    // add Label
                    labelFeature = new OpenLayers.Feature.Vector(wktFeature[0].geometry.getCentroid());

                    labelFeature.attributes.name =
                        (noColumns > 1 && data.getValue(r, 1)) ? data.getValue(r, 1) : "";
                    labelFeature.attributes.uri =
                        (noColumns > 2 && data.getValue(r, 2)) ? data.getValue(r, 2) : "";
                    labelFeature.attributes.description =
                        (noColumns > 3 && data.getValue(r, 3)) ? data.getValue(r, 3) : "";

                    labelLayer.addFeatures([labelFeature]);
                }

                map.addLayer(resultLayer);
                map.addLayer(labelLayer);

                map.addControl(selector);

                map.zoomToExtent(mapBounds);

                this.fireListener('ready');

            },
            // Dependencies. { function: what-to-load }
            {
                'google.maps.Map': 'google.maps.Map',
                'OpenLayers': '//cdnjs.cloudflare.com/ajax/libs/openlayers/2.12/OpenLayers.min.js'
                //'GDouglasPeucker': 'http://www.bdcc.co.uk/Gmaps/GDouglasPeuker.js',
                //'Proj4js': 'http://localhost/sgvizler/trunk/lib/proj4js-compressed.js'
            }
            );
