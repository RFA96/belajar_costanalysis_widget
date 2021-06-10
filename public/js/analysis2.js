$(document).ready(function () {
    // console.log('Hello, World!');
    require(
        [
            "esri/config",
            "esri/Map",
            "esri/views/MapView",
            "esri/layers/FeatureLayer"
        ],
        (
            esriConfig,
            Map,
            MapView,
            FeatureLayer
        ) => {
            // esriConfig.apiKey = "AAPK943d49822ad3473593d8670692479bd3LafdfG9uyqB3fnsDSg6IeuLDy6lpejcriZF26GspbydsSa7cKxpuQJyk6iFu8Flw";
            const map = new Map({
                basemap: "topo"
            });

            const view = new MapView({
                container: "maps",
                map: map,
                zoom: 4,
                center: [117.153709, -0.502106],
            });

            const featureLayer = new FeatureLayer({
                url: "https://services7.arcgis.com/BRS1jOwmVPgFs2NE/arcgis/rest/services/Belajar_Web_Map_Pipa_Hidrokarbon_WFL1/FeatureServer/0",
                fields: [
                    {
                        name: "OBJECTID",
                        alias: "ObjectID",
                        type: "oid"
                    },
                    {
                        name: "NAMOBJ",
                        alias: "Nama Objek",
                        type: "string"
                    }]
            });
            map.add(featureLayer);

            let graphics;

            view.whenLayerView(featureLayer).then(function (layerView) {
                layerView.watch("updating", function (value) {
                    if(!value) {
                        layerView.queryFeatures({
                            geometry: view.extent,
                            returnGeometry: true,
                            orderByFields: ["OBJECTID"]
                        }).then(function (results) {
                            graphics = results.features;
                            graphics.forEach(function (result, index) {
                                const attributes = result.attributes;
                                const name = attributes.NAMOBJ;
                                console.log(attributes);
                            })
                        }).catch(function (error) {
                            console.log("Query failed: ", error);
                        });
                    }
                });
            });
        });
});
