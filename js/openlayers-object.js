/**
 * OpenLayers的封装
 */
(function() {
	var $OpenLayers = function(id) {
		this.id = id;
		this.map = null;
		this.draw = null;
		this.draw_vector = null;
		this.yq_offset_lon = 0.00012028477152;
		this.yq_offset_lat = 0.000119902254268;
		this.center_lon = 120.980874667;
		this.center_lat = 28.116662747;
		this.origin_lon = null;
		this.origin_lat = null;
		this.zoom = 13;
		this.current_zoom = 13;
		this.projection = null;
		this.tdt_emap_layer = null;	//天地图图层
		this.tdt_emap_poi_layer = null;
		this.zj_tdt_emap_layer = null;
		this.zj_tdt_emap_poi_layer = null;
		this.yq_tdt_emap_layer = null;
		this.yq_tdt_emap_poi_layer = null;
		this.tdt_img_layer = null;
		this.tdt_img_poi_layer = null;
		this.zj_tdt_img_layer = null;
		this.zj_tdt_img_poi_layer = null;
		this.yq_tdt_img_layer = null;
		this.yq_tdt_img_poi_layer = null;
	};
	
	$OpenLayers.prototype = {
        /**
         * 初始化OpenLayers
         */
        init: function () {
			var me = this;
        	me.initData();
            var map = new ol.Map({
                logo: false,
                target: me.id,
                view: new ol.View({
	                center: [me.center_lon, me.center_lat],
	                projection: me.projection,
	                zoom: me.zoom,
	                maxZoom: 20,
	                minZoom: 4
	            })
            });
            me.map = map;
            map.getControls().clear();
            
            map.addLayer(me.tdt_emap_layer);
            map.addLayer(me.tdt_emap_poi_layer);
            map.addLayer(me.zj_tdt_emap_layer);
            map.addLayer(me.zj_tdt_emap_poi_layer);
            map.addLayer(me.yq_tdt_emap_layer);
            map.addLayer(me.yq_tdt_emap_poi_layer);

            map.addLayer(me.tdt_img_layer);
            map.addLayer(me.tdt_img_poi_layer);
            map.addLayer(me.zj_tdt_img_layer);
            map.addLayer(me.zj_tdt_img_poi_layer);
            map.addLayer(me.yq_tdt_img_layer);
            map.addLayer(me.yq_tdt_img_poi_layer);

            me.tdt_img_layer.setVisible(false);
            me.tdt_img_poi_layer.setVisible(false);
            me.zj_tdt_img_layer.setVisible(false);
            me.zj_tdt_img_poi_layer.setVisible(false);
            me.yq_tdt_img_layer.setVisible(false);
            me.yq_tdt_img_poi_layer.setVisible(false);
            
            var view = map.getView();
            view.on("change:resolution", function(){
            	if(!(view.getZoom()%1 === 0)) return;
                var zoom = me.current_zoom;
                me.current_zoom = view.getZoom();
                var offset_lon = 0;
                var offset_lat = 0;
	         	if(me.current_zoom <= 17){//乐清图层 和浙江图层存在偏差
	         		if(zoom <= 17) return;
		         	offset_lon = me.yq_offset_lon;
		         	offset_lat = me.yq_offset_lat;
	            }else{
                    if(zoom >= 18) return;
                    offset_lon = -me.yq_offset_lon;
		         	offset_lat = -me.yq_offset_lat;
	            }
	         	//所有图层 平移
                map.getOverlays().forEach(function(overlay, i) {
                    var position = overlay.getPosition();
                    overlay.setPosition([position[0] + offset_lon, position[1] + offset_lat]);
                });
	         	
            	map.getLayers().forEach(function(layer, i) {
            		var source = layer.getSource();
            		if(source instanceof ol.source.Vector){
            			source.forEachFeature(function(feature) {
                            var geometry = feature.getGeometry();
                            if(geometry.getType() == 'Polygon'){
                                var coordinates = geometry.getCoordinates();
                                $.each(coordinates,function(i,cs){
                                    $.each(cs,function(j,c){
                                        c[0] = c[0] + offset_lon;
                                        c[1] = c[1] + offset_lat;
                                    });
                                });
                                geometry.setCoordinates(coordinates);
                            }
                        });
            		}
                })
            });
            
            $('#' + me.id + '_nav_c .nav-c a.my-origin').click(function(){
            	if(me.origin_lon && me.origin_lat){
        	        view.setCenter([me.origin_lon, me.origin_lat]);
            	}
            });
            
            $('#' + me.id + '_nav_c .slider_c a.zoomin').click(function(){
				view.setZoom(view.getZoom() + 1);
            });
            
            $('#' + me.id + '_nav_c .slider_c a.zoomout').click(function(){
				view.setZoom(view.getZoom() - 1);
            });

            
            $('#' + me.id + '_type_selection_c .map-type').click(function(){
            	$('#' + me.id + '_type_selection_c .map-type.map-type-selected').removeClass('map-type-selected');
				$(this).addClass('map-type-selected');
				var maptype = $(this).attr('map-type');
				if(maptype == 'img'){//图层影像切换
					me.tdt_emap_layer.setVisible(false);
					me.tdt_emap_poi_layer.setVisible(false);
					me.zj_tdt_emap_layer.setVisible(false);
					me.zj_tdt_emap_poi_layer.setVisible(false);
					me.yq_tdt_emap_layer.setVisible(false);
					me.yq_tdt_emap_poi_layer.setVisible(false);

					me.tdt_img_layer.setVisible(true);
					me.tdt_img_poi_layer.setVisible(true);
					me.zj_tdt_img_layer.setVisible(true);
					me.zj_tdt_img_poi_layer.setVisible(true);
					me.yq_tdt_img_layer.setVisible(true);
					me.yq_tdt_img_poi_layer.setVisible(true);
				}else{
					me.tdt_img_layer.setVisible(false);
					me.tdt_img_poi_layer.setVisible(false);
					me.zj_tdt_img_layer.setVisible(false);
					me.zj_tdt_img_poi_layer.setVisible(false);
					me.yq_tdt_img_layer.setVisible(false);
					me.yq_tdt_img_poi_layer.setVisible(false);

					me.tdt_emap_layer.setVisible(true);
					me.tdt_emap_poi_layer.setVisible(true);
					me.zj_tdt_emap_layer.setVisible(true);
					me.zj_tdt_emap_poi_layer.setVisible(true);
					me.yq_tdt_emap_layer.setVisible(true);
					me.yq_tdt_emap_poi_layer.setVisible(true);
				}
			});

            $('#' + me.id + '_type_selection_c .map-type .anno-switcher').click(function(event){
				event.stopPropagation();
				var maptype = $('#' + me.id + '_type_selection_c .map-type.map-type-selected:first').attr('map-type');
				var visible = false;
				if($(this).hasClass('im-on')){
					$(this).removeClass('im-on');
					visible = false;
				}else{
					$(this).addClass('im-on');
					visible = true;
				}

				if(maptype == 'img'){
					me.tdt_img_poi_layer.setVisible(visible);
					me.zj_tdt_img_poi_layer.setVisible(visible);
					me.yq_tdt_img_poi_layer.setVisible(visible);
				}else{
					me.tdt_emap_poi_layer.setVisible(visible);
					me.zj_tdt_emap_poi_layer.setVisible(visible);
					me.yq_tdt_emap_poi_layer.setVisible(visible);
				}

			});
        },
        
        initData: function () {
			var me = this;

        	$('#'+me.id).addClass('map-c');
        	$('#'+me.id).html('');

        	var mapnav = '<div id="' + me.id + '_nav_c" class="map-nav-c map-nav-min-model">';
        	mapnav += '<div class="nav-c"><a href="javascript:void(0);" class="my-origin"><div class="origin-icon"></div></a></div>';
        	mapnav += '<div class="slider_c">';
        	mapnav += '<a href="javascript:void(0);" class="zoomin"><div class="zoom-icon zoom-icon-zoomin"></div></a>';
        	mapnav += '<a href="javascript:void(0);" class="zoomout"><div class="zoom-icon zoom-icon-zoomout"></div></a>';
        	maptype += '</div></div>';
        	$('#'+me.id).append(mapnav);
        	
        	var maptype = '<div id="' + me.id + '_type_selection_c" class="map-type-selection-c">'
        	maptype += '<a class="map-type map-type-img" map-type="img"><div class="map-type-label">影像</div><div class="anno-switcher anno-switcher-img im-on"><span class="anno-switcher-onoff"></span>路网</div></a>';
        	maptype += '<a class="map-type map-type-emap map-type-selected" map-type="emap"><div class="map-type-label">地图</div><div class="anno-switcher anno-switcher-emap im-on"><span class="anno-switcher-onoff"></span>标注</div></a>';
        	maptype += '</div>';
        	$('#'+me.id).append(maptype);
        	
        	me.projection = ol.proj.get('EPSG:4326');
            var projectionExtent = me.projection.getExtent();
            var size = ol.extent.getWidth(projectionExtent) / 256; 
            var resolutions = new Array(20);
            var matrixIds = new Array(20);
            for (var z = 0; z <=20; ++z) {
                resolutions[z] = size / Math.pow(2, z);
                matrixIds[z] = z;   
            }

            me.tdt_emap_layer = new ol.layer.Tile({
                source: new ol.source.WMTS({
                    name: "中国矢量1-14级",
                    url: 'http://t{0-6}.tianditu.com/vec_c/wmts',
                    layer: 'vec',
                    format: 'tiles',
                    matrixSet:"c", 
                    style: 'default', 
                    tileGrid: new ol.tilegrid.WMTS({
                        origin: ol.extent.getTopLeft(projectionExtent),
                        resolutions: resolutions.slice(0, 15),
                        matrixIds: matrixIds.slice(0, 15)
                    })
                }),
                minResolution: resolutions[15],
                maxResolution: resolutions[0]
            });

            me.tdt_emap_poi_layer = new ol.layer.Tile({
                source: new ol.source.WMTS({
                    name: "中国矢量注记1-14级",
                    url: 'http://t{0-6}.tianditu.com/cva_c/wmts',
                    layer: 'cva',
                    style: 'default', 
                    format: 'tiles',
                    matrixSet:"c", 
                    tileGrid: new ol.tilegrid.WMTS({
                        origin: ol.extent.getTopLeft(projectionExtent),
                        resolutions: resolutions.slice(0, 15),
                        matrixIds: matrixIds.slice(0, 15)
                    })
                }),
                minResolution: resolutions[15],
                maxResolution: resolutions[0]
            });

            me.tdt_img_layer = new ol.layer.Tile({
                source: new ol.source.WMTS({
                    name: "中国影像1-14级",
                    url: 'http://t{0-6}.tianditu.com/img_c/wmts',
                    layer: 'img',
                    format: 'tiles',
                    matrixSet:"c", 
                    style: 'default', 
                    tileGrid: new ol.tilegrid.WMTS({
                        origin: ol.extent.getTopLeft(projectionExtent),
                        resolutions: resolutions.slice(0, 15),
                        matrixIds: matrixIds.slice(0, 15)
                    })
                }),
                minResolution: resolutions[15],
                maxResolution: resolutions[0]
            });

            me.tdt_img_poi_layer = new ol.layer.Tile({
                source: new ol.source.WMTS({
                    name: "中国影像注记1-14级",
                    url: 'http://t{0-6}.tianditu.com/cia_c/wmts',
                    layer: 'cia',
                    style: 'default', 
                    format: 'tiles',
                    matrixSet:"c", 
                    tileGrid: new ol.tilegrid.WMTS({
                        origin: ol.extent.getTopLeft(projectionExtent),
                        resolutions: resolutions.slice(0, 15),
                        matrixIds: matrixIds.slice(0, 15)
                    })
                }),
                minResolution: resolutions[15],
                maxResolution: resolutions[0]
            });

            me.zj_tdt_emap_layer = new ol.layer.Tile({
                source: new ol.source.WMTS({
                    name: "浙江矢量15-17级",
                    url: 'http://srv{0-6}.zjditu.cn/ZJEMAP_2D/wmts',
                    layer: 'TDT_ZJEMAP',
                    style: 'default',
                    matrixSet: 'TileMatrixSet0',
                    format: 'image/png',
                    wrapX: true,
                    tileGrid: new ol.tilegrid.WMTS({
                        origin: ol.extent.getTopLeft(projectionExtent),
                        resolutions: resolutions.slice(14, 18),
                        matrixIds: matrixIds.slice(14, 18)
                    })
                }),
                minResolution: resolutions[17],
                maxResolution: resolutions[14]
            });

            me.zj_tdt_emap_poi_layer = new ol.layer.Tile({
                source: new ol.source.WMTS({
                    name: "浙江矢量注记15-17级",
                    url: 'http://srv{0-6}.zjditu.cn/ZJEMAPANNO_2D/wmts',
                    layer: 'TDT_ZJEMAPANNO',
                    style: 'default',
                    matrixSet: 'TileMatrixSet0',
                    format: 'image/png',
                    wrapX: true,
                    tileGrid: new ol.tilegrid.WMTS({
                        origin: ol.extent.getTopLeft(projectionExtent),
                        resolutions: resolutions.slice(14, 18),
                        matrixIds: matrixIds.slice(14, 18)
                    })
                }),
                minResolution: resolutions[17],
                maxResolution: resolutions[14]
            });

            me.zj_tdt_img_layer = new ol.layer.Tile({
                source: new ol.source.WMTS({
                    name: "浙江影像15-17级",
                    url: 'http://srv{0-6}.zjditu.cn/ZJDOM_2D/wmts',
                    layer: 'TDT_ZJDOM',
                    style: 'default',
                    matrixSet: 'TileMatrixSet0',
                    format: 'image/png',
                    wrapX: true,
                    tileGrid: new ol.tilegrid.WMTS({
                        origin: ol.extent.getTopLeft(projectionExtent),
                        resolutions: resolutions.slice(14, 18),
                        matrixIds: matrixIds.slice(14, 18)
                    })
                }),
                minResolution: resolutions[17],
                maxResolution: resolutions[14]
            });

            me.zj_tdt_img_poi_layer = new ol.layer.Tile({
                source: new ol.source.WMTS({
                    name: "浙江影像注记15-17级",
                    url: 'http://srv{0-6}.zjditu.cn/ZJDOMANNO_2D/wmts',
                    layer: 'TDT_ZJDOMANNO',
                    style: 'default',
                    matrixSet: 'TileMatrixSet0',
                    format: 'image/png',
                    wrapX: true,
                    tileGrid: new ol.tilegrid.WMTS({
                        origin: ol.extent.getTopLeft(projectionExtent),
                        resolutions: resolutions.slice(14, 18),
                        matrixIds: matrixIds.slice(14, 18)
                    })
                }),
                minResolution: resolutions[17],
                maxResolution: resolutions[14]
            });

            me.yq_tdt_emap_layer = new ol.layer.Tile({
                source: new ol.source.WMTS({
                    name: "乐清矢量18-20级",
                    url: 'http://218.75.26.62/iserver/services/yqmap/wmts',
                    layer: 'yqmap',
                    style: 'default',
                    matrixSet: 'Custom_yqmap',
                    format: 'image/png',
                    wrapX: true,
                    tileGrid: new ol.tilegrid.WMTS({
                        origin: ol.extent.getTopLeft(projectionExtent),
                        resolutions: resolutions.slice(18),
                        matrixIds: matrixIds.slice(18)
                    })
                }),
                minResolution: resolutions[20],
                maxResolution: resolutions[17]
            });

            me.yq_tdt_emap_poi_layer = new ol.layer.Tile({
                source: new ol.source.WMTS({
                    name: "乐清矢量注记18-20级",
                    url: 'http://218.75.26.62/iserver/services/yqpoi/wmts',
                    layer: 'yqpoi',
                    style: 'default',
                    matrixSet: 'Custom_yqpoi',
                    format: 'image/png',
                    wrapX: true,
                    tileGrid: new ol.tilegrid.WMTS({
                        origin: ol.extent.getTopLeft(projectionExtent),
                        resolutions: resolutions.slice(18),
                        matrixIds: matrixIds.slice(18)
                    })
                }),
                minResolution: resolutions[20],
                maxResolution: resolutions[17]
            });

            me.yq_tdt_img_layer = new ol.layer.Tile({
                source: new ol.source.WMTS({
                    name: "乐清影像18-20级",
                    url: 'http://218.75.26.62/iserver/services/yqimg/wmts',
                    layer: 'yqimg',
                    style: 'default',
                    matrixSet: 'Custom_yqimg',
                    format: 'image/png',
                    wrapX: true,
                    tileGrid: new ol.tilegrid.WMTS({
                        origin: ol.extent.getTopLeft(projectionExtent),
                        resolutions: resolutions.slice(18),
                        matrixIds: matrixIds.slice(18)
                    })
                }),
                minResolution: resolutions[20],
                maxResolution: resolutions[17]
            });

            me.yq_tdt_img_poi_layer = new ol.layer.Tile({
                source: new ol.source.WMTS({
                    name: "乐清影像注记18-20级",
                    url: 'http://218.75.26.62/iserver/services/yqimgpoi/wmts',
                    layer: 'yqimgpoi',
                    style: 'default',
                    matrixSet: 'Custom_yqimgpoi',
                    format: 'image/png',
                    wrapX: true,
                    tileGrid: new ol.tilegrid.WMTS({
                        origin: ol.extent.getTopLeft(projectionExtent),
                        resolutions: resolutions.slice(18),
                        matrixIds: matrixIds.slice(18)
                    })
                }),
                minResolution: resolutions[20],
                maxResolution: resolutions[17]
            });
        },
        
        initDraw: function(){
        	var me = this;
			var map = me.map;
			
			var vector = new ol.layer.Vector({
				source: new ol.source.Vector(),
		        style: new ol.style.Style({
		        	fill: new ol.style.Fill({
		        		color: 'rgba(255, 0, 0, 0.2)'
		        	}),
		        	stroke: new ol.style.Stroke({
		        		color: '#ff0000',
		        		width: 2
		        	}),
		        	image: new ol.style.Circle({
		        		radius: 7,
		        		fill: new ol.style.Fill({
		        			color: '#ff0000'
		        		})
		        	})
		        })
			});
			
			var style = new ol.style.Style({
	        	fill: new ol.style.Fill({
	        		color: 'rgba(255, 0, 0, 0.2)'
	        	}),
	        	stroke: new ol.style.Stroke({
	        		color: '#ff0000',
	        		width: 1
	        	}),
	        	image: new ol.style.Circle({
	        		radius: 5,
	        		stroke: new ol.style.Stroke({
		        		color: '#ff0000',
		        		width: 1
		        	})
	        		/*
	        		fill: new ol.style.Fill({
	        			color: '#ff0000'
	        		})
	        		*/
	        	})
			});
            map.addLayer(vector);
			me.draw_vector = vector;
			
			var draw = {
                init: function() {
            	    map.addInteraction(this.Point);
            	    this.Point.setActive(false);
            	    map.addInteraction(this.LineString);
            	    this.LineString.setActive(false);
            	    map.addInteraction(this.Polygon);
            	    this.Polygon.setActive(false);
            	    map.addInteraction(this.Circle);
            	    this.Circle.setActive(false);
        	    },
        	    Point: new ol.interaction.Draw({
        	        source: vector.getSource(),
        	        style: style,
        	        type: /** @type {ol.geom.GeometryType} */ ('Point')
        	    }),
        	    LineString: new ol.interaction.Draw({
        	        source: vector.getSource(),
        	        style: style,
        	        type: /** @type {ol.geom.GeometryType} */ ('LineString')
        	    }),
        	    Polygon: new ol.interaction.Draw({
        	        source: vector.getSource(),
        	        style: style,
        	        type: /** @type {ol.geom.GeometryType} */ ('Polygon')
        	    }),
        	    Circle: new ol.interaction.Draw({
        	        source: vector.getSource(),
        	        style: style,
        	        type: /** @type {ol.geom.GeometryType} */ ('Circle')
        	    }),
        	    getActive: function() {
        	        return this.activeType ? this[this.activeType].getActive() : false;
        	    },
        	    setActive: function(active, type) {
        	        if (active) {
        	            this.activeType && this[this.activeType].setActive(false);
        	            this[type].setActive(true);
        	            this.activeType = type;
        	        } else {
        	            this.activeType && this[this.activeType].setActive(false);
        	            this.activeType = null;
        	        }
        	    }
        	};
			me.draw = draw;
        },
        
        addMarker: function (lon, lat, to_center) {
			var me = this;
			var map = me.map;
			var element = document.createElement("div");
			var marker = new ol.Overlay({
				position: [lon, lat],
				offset:[0, -15],
				positioning: 'center-center',
				element: element,
				stopEvent: false
			});
			map.addOverlay(marker);
			if(to_center){
				map.getView().setCenter(marker.getPosition());
			}
			$(element).addClass("map-marker");
			return marker;
        },
        
        addOriginMarker: function (lon, lat, to_center) {
			var me = this;
			var map = me.map;
			var element = document.createElement("div");
			var marker = new ol.Overlay({
				position: [lon, lat],
				offset:[0, 0],
				positioning: 'center-center',
				element: element,
				stopEvent: false
			});
			map.addOverlay(marker);
			if(to_center){
				map.getView().setCenter(marker.getPosition());
			}
			$(element).addClass("map-origin-marker");
			return marker;
        },
        
        addPopup: function (lon, lat) {
			var me = this;
			var map = me.map;
			
			var element = document.createElement("div");
			
			var popup = new ol.Overlay({
				position: [lon, lat],
				offset:[0, -30],
				positioning: 'center-center',
				element: element,
				stopEvent: false,
				autoPan: false,
				autoPanAnimation: {
					duration: 250
				}
			});
			map.addOverlay(popup);
			$(element).addClass("map-popup");
			$(element).html('<a href="javascript:void(0);" class="map-popup-closer"></a><div class="map-popup-content"></div>');
			$(element).find('a.map-popup-closer').click(function(){
				map.removeOverlay(popup);
			});
			return popup;
        },
        
        addGeometry: function (type, opt, to_center) {
    		var me = this;
    		var map = me.map;
    		var view = map.getView();
    		var geometry = null;
    		var center = null;
    		
    		if(type == 'Polygon'){
                var vector_source = me.draw_vector.getSource();
                var coordinates = Ext.decode(opt);
                geometry = new ol.geom.Polygon(coordinates);
                vector_source.addFeature(new ol.Feature({
                	geometry: geometry
                }));
                var extent = geometry.getExtent();
                var resolution = view.constrainResolution(view.getResolutionForExtent(extent, map.getSize()));
                center = [(extent[0] + extent[2])/2, (extent[1] + extent[3])/2];
                view.setResolution(resolution);
         	}
    		
    		if(center && to_center){
    	        view.setCenter(center);
    		}
    		return geometry;
        },
        addPolygon:function(coordinates,styles,id){
            if(typeof coordinates == "undefined"){
                return null;
            }
    		var me = this;
    		var map = me.map;
    		var view = map.getView();
    		var geometry = null;
    		var center = null;
        	var geometry = new ol.geom.Polygon(coordinates);

        	var vector = new ol.layer.Vector({
                source: new ol.source.Vector(),
                style: new ol.style.Style({
                  fill: new ol.style.Fill({
                    color: styles.fillcolor
                  }),
                  stroke: new ol.style.Stroke({
                    color: styles.color,
                    width: 1
                  }),
                  // text: new ol.style.Text({text:"文字设置"}) 
                })
              });
            var extent = geometry.getExtent();
            var view = map.getView();
            var resolution = view.constrainResolution(view.getResolutionForExtent(extent, map.getSize()));
            var center = [(extent[0] + extent[2])/2, (extent[1] + extent[3])/2];
            var feature = new ol.Feature({
            	geometry: geometry
            	});
            feature.setId(id);
            vector.getSource().addFeature(feature);

            view.setCenter(center);
            view.setZoom(styles.level);
            map.addLayer(vector);

            return vector;
        },
        addOverlay:function(id){
            if(typeof id == "undefined"){
                return;
            }
            var me = this;
            var map = me.map;
            var view = map.getView();
              var vienna = new ol.Overlay({
                position: view.getCenter(),
                element: document.getElementById(id)
              });
            map.addOverlay(vienna);        
        },
        removeOverlay: function(overlay){
    		var me = this;
    		var map = me.map;
            try{
        		if(typeof overlay == "undefined"){
        			
        		}else{
            		map.removeOverlay(overlay);
        		}
            }catch(err){
                console.log(err);
            }
    		
        },
        removeLayer:function(layer){
            var me = this;
            var map = me.map;
            try{
                if( typeof layer == "undefined"){
                }else{
                    map.removeLayer(layer);
                }
            }catch(err){
                console.log(err);
            }
        },
        getLevel:function(){
            var me = this;
            var map = me.map;
            return map.getView().getZoom();
        }
	};
	
	window.$OpenLayers = $OpenLayers;

}());