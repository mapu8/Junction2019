
var map, heatLayer_1, datasourceHeat_1, n_people1,
heatLayer_2, datasourceHeat_2, n_people2,
heatLayer_3, datasourceHeat_3, n_people3,
heatLayer_4, datasourceHeat_4, n_people4,
datasource, datasourceBeacon, client, popup, searchInput, resultsPanel, searchInputLength, centerMapOnResults,   time, shapes;

    const Http = new XMLHttpRequest();
    var url='https://api.telegram.org/bot1030965882:AAEH9qqrIMB5T2Ja5J7FO6sjL-z93_xaC6Y/sendMessage?chat_id=150042785&text=TestingAPP';
        //The minimum number of characters needed in the search input before a search is performed.
        var minSearchInputLength = 3;
        //The number of ms between key strokes to wait before performing a search.
        var keyStrokeDelay = 150;
        function GetMap() {
            //Initialize a map instance.
            map = new atlas.Map('Map', {
                center: [24.95, 60.17],
                zoom: 15,
                view: 'Auto',
				//Add your Azure Maps subscription key to the map SDK. Get an Azure Maps key at https://azure.com/maps
                authOptions: {
                    authType: 'subscriptionKey',
                    subscriptionKey: 'aE3H52lYzpd415DDdksCt9__02-HvUGSNGyOEJOIj58'
                }
            });
            //Store a reference to the Search Info Panel.
            resultsPanel = document.getElementById("results-panel");
            //Add key up event to the search box. 
            searchInput = document.getElementById("search-input");
            searchInput.addEventListener("keyup", searchInputKeyup);
            //Create a popup which we can reuse for each result.
            popup = new atlas.Popup();
            //Wait until the map resources are ready.
            map.events.add('ready', function () {
                //Add the zoom control to the map.
                map.controls.add(new atlas.control.ZoomControl(), {
                    position: 'top-right'
                });
                //Create a data source and add it to the map.
                datasource = new atlas.source.DataSource();
                map.sources.add(datasource);
                //Add a layer for rendering the results.
                var searchLayer = new atlas.layer.SymbolLayer(datasource, null, {
                    iconOptions: {
                        image: 'pin-round-darkblue',
                        anchor: 'center',
                        allowOverlap: true
                    }
                });

                

                // datasourceHeat.importDataFromUrl('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson');
                // datasourceHeat.importDataFromUrl('./data/earthquakes.json');
                
                
                 map.layers.add(searchLayer);

                 datasourceBeacon = new atlas.source.DataSource();
                datasourceBeacon.importDataFromUrl('./data/people_summary.js');
                map.sources.add(datasourceBeacon);
                //Add a layer for rendering the results.
                var beaconLayer = new atlas.layer.SymbolLayer(datasourceBeacon, null, {
                    iconOptions: {
                        image: 'pin-round-darkblue',
                        anchor: 'center',
                        allowOverlap: true
                    }
                });

                 map.layers.add(beaconLayer);


                 datasourceHeat_1 = new atlas.source.DataSource(null, {
                    //Tell the data source to cluster point data.
                    cluster: true,
                    // //The radius in pixels to cluster points together.
                    clusterRadius: 5    
                });
                datasourceHeat_1 = new atlas.source.DataSource();
                map.sources.add(datasourceHeat_1);
                 datasourceHeat_1.importDataFromUrl('./data/people_1.js');
                  heatLayer_1 = new atlas.layer.HeatMapLayer(datasourceHeat_1, null, {
                    weight: ['get', 'point_count'],
                    radius: 15,
                    opacity: 0.8
                });
                map.layers.add(heatLayer_1,'labels1')

                datasourceHeat_2 = new atlas.source.DataSource(null, {
                    //Tell the data source to cluster point data.
                    cluster: true,
                    // //The radius in pixels to cluster points together.
                    clusterRadius: 5    
                });
                datasourceHeat_2 = new atlas.source.DataSource();
                map.sources.add(datasourceHeat_2);
                 datasourceHeat_2.importDataFromUrl('./data/people_2.js');
                  heatLayer_2 = new atlas.layer.HeatMapLayer(datasourceHeat_2, null, {
                    weight: ['get', 'point_count'],
                    radius: 15,
                    opacity: 0.8
                });
                map.layers.add(heatLayer_2,'labels2')

                
                datasourceHeat_3 = new atlas.source.DataSource(null, {
                    //Tell the data source to cluster point data.
                    cluster: true,
                    // //The radius in pixels to cluster points together.
                    clusterRadius: 5    
                });
                datasourceHeat_3 = new atlas.source.DataSource();
                map.sources.add(datasourceHeat_3);
                 datasourceHeat_3.importDataFromUrl('./data/people_3.js');
                  heatLayer_3 = new atlas.layer.HeatMapLayer(datasourceHeat_3, null, {
                    weight: ['get', 'point_count'],
                    radius: 15,
                    opacity: 0.8
                });
                map.layers.add(heatLayer_3,'labels3')


                datasourceHeat_4 = new atlas.source.DataSource(null, {
                    //Tell the data source to cluster point data.
                    cluster: true,
                    // //The radius in pixels to cluster points together.
                    clusterRadius: 5    
                });
                datasourceHeat_4 = new atlas.source.DataSource();
                map.sources.add(datasourceHeat_4);
                 datasourceHeat_4.importDataFromUrl('./data/people_4.js');
                  heatLayer_4 = new atlas.layer.HeatMapLayer(datasourceHeat_4, null, {
                    weight: ['get', 'point_count'],
                    radius: 15,
                    opacity: 0.8
                });
                map.layers.add(heatLayer_4,'labels4')
                 

                //Add a click event to the search layer and show a popup when a result is clicked.
                map.events.add("click", searchLayer, function (e) {
                    //Make sure the event occurred on a shape feature.
                    if (e.shapes && e.shapes.length > 0) {
                        showPopup(e.shapes[0]);
                    }
                });

                //Add a click event to the search layer and show a popup when a result is clicked.
                map.events.add("click", beaconLayer, function (e) {
                    //Make sure the event occurred on a shape feature.
                    if (e.shapes && e.shapes.length > 0) {
                        var properties = e.shapes[0].getProperties();
                        //Create the HTML content of the POI to show in the popup.
                        var html = ['<div class="poi-box">'];
                        //Add a title section for the popup.
                        html.push('<div class="poi-title-box"><b>');
                        html.push(properties.beacon_name);
                        html.push('</b></div>');
                        html.push('<div class="poi-content-box">');
            html.push('<div class="info location">', "free to use", '</div>');
            html.push('</div></div>');
            popup.setOptions({
                position: e.shapes[0].getCoordinates(),
                content: html.join('')
            });
            popup.open(map);
                    }
                });

                // map.events.add("dataadded",heatLayer, function (e) {
                //     console.log(e);
                //     }
                // );
            });
        }
        function searchInputKeyup(e) {
            centerMapOnResults = false;
            if (searchInput.value.length >= minSearchInputLength) {
                if (e.keyCode === 13) {
                    centerMapOnResults = true;
                }
                //Wait 100ms and see if the input length is unchanged before performing a search. 
                //This will reduce the number of queries being made on each character typed.
                setTimeout(function () {
                    if (searchInputLength == searchInput.value.length) {
                        search();
                    }
                }, keyStrokeDelay);
            } else {
                resultsPanel.innerHTML = '';
            }
            searchInputLength = searchInput.value.length;
        }
        function search() {
            //Remove any previous results from the map.
            datasource.clear();
            popup.close();
            resultsPanel.innerHTML = '';
            //Use SubscriptionKeyCredential with a subscription key
            var subscriptionKeyCredential = new atlas.service.SubscriptionKeyCredential(atlas.getSubscriptionKey());
            //Use subscriptionKeyCredential to create a pipeline
            var pipeline = atlas.service.MapsURL.newPipeline(subscriptionKeyCredential);
            //Construct the SearchURL object
            var searchURL = new atlas.service.SearchURL(pipeline);
            var query = document.getElementById("search-input").value;
            searchURL.searchPOI(atlas.service.Aborter.timeout(10000), query, {
                lon: map.getCamera().center[0],
                lat: map.getCamera().center[1],
                maxFuzzyLevel: 4,
                view: 'Auto'
            }).then((results) => {
                //Extract GeoJSON feature collection from the response and add it to the datasource
                var data = results.geojson.getFeatures();
                datasource.add(data);
                if (centerMapOnResults) {
                    map.setCamera({
                        bounds: data.bbox
                    });
                }
                console.log(data);
                //Create the HTML for the results list.
                var html = [];
                for (var i = 0; i < data.features.length; i++) {
                    var r = data.features[i];
                    html.push('<li onclick="itemClicked(\'', r.id, '\')" onmouseover="itemHovered(\'', r.id, '\')">')
                    html.push('<div class="title">');
                    if (r.properties.poi && r.properties.poi.name) {
                        html.push(r.properties.poi.name);
                    } else {
                        html.push(r.properties.address.freeformAddress);
                    }
                    html.push('</div><div class="info">', r.properties.type, ': ', r.properties.address.freeformAddress, '</div>');
                    if (r.properties.poi) {
                        if (r.properties.phone) {
                            html.push('<div class="info">phone: ', r.properties.poi.phone, '</div>');
                        }
                        if (r.properties.poi.url) {
                            html.push('<div class="info"><a href="http://', r.properties.poi.url, '">http://', r.properties.poi.url, '</a></div>');
                        }
                    }
                    html.push('</li>');
                    resultsPanel.innerHTML = html.join('');
                }
            });
        }
        function itemHovered(id) {
            //Show a popup when hovering an item in the result list.
            var shape = datasource.getShapeById(id);
            showPopup(shape);
        }
        function itemClicked(id) {
            //Center the map over the clicked item from the result list.
            var shape = datasource.getShapeById(id);
            map.setCamera({
                center: shape.getCoordinates(),
                zoom: 17
            });
        }
        function showPopup(shape) {
            var properties = shape.getProperties();
            //Create the HTML content of the POI to show in the popup.
            var html = ['<div class="poi-box">'];
            //Add a title section for the popup.
            html.push('<div class="poi-title-box"><b>');
            if (properties.poi && properties.poi.name) {
                html.push(properties.poi.name);
            } else {
                html.push(properties.address.freeformAddress);
            }
            html.push('</b></div>');
            //Create a container for the body of the content of the popup.
            html.push('<div class="poi-content-box">');
            html.push('<div class="info location">', properties.address.freeformAddress, '</div>');
            if (properties.poi) {
                if (properties.poi.phone) {
                    html.push('<div class="info phone">', properties.phone, '</div>');
                }
                if (properties.poi.url) {
                    html.push('<div><a class="info website" href="http://', properties.poi.url, '">http://', properties.poi.url, '</a></div>');
                }
            }
            html.push('</div></div>');
            popup.setOptions({
                position: shape.getCoordinates(),
                content: html.join('')
            });
            popup.open(map);
        }

        function slide(val) {
            // console.log(val)
            const layers = map.getLayers();
            // console.log(layers);
            if(datasourceHeat_1){
                // 22 beacons
                var pt = heatLayer_1.getOptions();
                console.log(pt.radius)
                 console.log(n_people1)
                 pt.radius = n_people1;

                heatLayer_1.setOptions(pt);
                
                // shapes = datasourceHeat_1.getShapes();
                n_people1 = parseInt(datasourceHeat_1.shapes[val].getProperties().n_people);

                // 22 beacons
                var pt2 = heatLayer_2.getOptions();
                console.log(pt2.radius)
                 console.log(n_people2)
                 pt2.radius = n_people2;

                heatLayer_2.setOptions(pt2);
                
                n_people2 = parseInt(datasourceHeat_2.shapes[val].getProperties().n_people);


                // 22 beacons
                var pt3 = heatLayer_3.getOptions();
                console.log(pt3.radius)
                 console.log(n_people3)
                 pt3.radius = n_people3;

                heatLayer_3.setOptions(pt3);
                
                n_people3 = parseInt(datasourceHeat_3.shapes[val].getProperties().n_people);



                // 22 beacons
                var pt4 = heatLayer_4.getOptions();
                console.log(pt4.radius)
                 console.log(n_people4)
                 pt4.radius = n_people4;

                heatLayer_4.setOptions(pt4);
                
                n_people4 = parseInt(datasourceHeat_4.shapes[val].getProperties().n_people);



                /////================/////
                time = (datasourceHeat_1.shapes[val].getProperties().time_interval);
                
                if(n_people1 > 40){
                    // Http.open("GET", url);
                    // Http.send();
                }
                //  console.log(n_people1)
                
            }
            else{
                map.sources.add(datasourceHeat_1);
                map.sources.add(datasourceHeat_2);
            }
            
            
            // datasourceHeat.setShapes(shapes);
            
            
            // console.log(time);

            output.innerHTML = time;

            // datasourceHeat.clear();
            // console.log(datasourceHeat);
           
            
            // datasourceHeat.shapes[0].getProperties()
            
        }
