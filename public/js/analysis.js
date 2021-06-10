function getValveType(valveCode) {
    if(valveCode === "BFV") {
        return "Butterfly Valve";
    } else if(valveCode === "BV") {
        return "Ball Valve";
    } else if(valveCode === "CV") {
        return "Check Valve";
    } else if(valveCode === "GLV") {
        return "Globe Valve";
    } else if(valveCode === "GV") {
        return "Gate Valve";
    } else if(valveCode === "KGV") {
        return "Knife Gate Valve";
    } else if(valveCode === "NV") {
        return "Needle Valve";
    } else if(valveCode === "PLV") {
        return "Plug Valve";
    } else {
        return "Pinch Valve";
    }
}
$(document).ready(function () {
    require([
        "esri/config",
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer"
    ], function (esriConfig, Map, MapView, FeatureLayer) {
        // generate from ArcGIS Developers Dashboard (using OAuth 2.0)
        esriConfig.apiKey = "Toju940sXiU54SakMmiRKmO7B6dxo4xdvPXSV9Nqer0r9bGezYrHqUxj_fM83ynQ3d3cwkTClsOHm98OqkbzFo9EnQma-exYb9OS5CFu1omJ1VIkCjRtvhCrR3SWCbpCbvWPaSlr7TGZQG_08JLXXw..";

        /*** Display each layer ***/
        const valve50kLayer = new FeatureLayer({
            url: 'https://services7.arcgis.com/BRS1jOwmVPgFs2NE/arcgis/rest/services/Pipa_Hidrokarbon_Gabungan_50K/FeatureServer/0',
            outFields: ["*"]
        });
        const pipaHidrokarbon50kLayer = new FeatureLayer({
            url: 'https://services7.arcgis.com/BRS1jOwmVPgFs2NE/arcgis/rest/services/Pipa_Hidrokarbon_Gabungan_50K/FeatureServer/1',
            outFields: ["*"]
        });
        const drillingSource50kLayer = new FeatureLayer({
            url: 'https://services7.arcgis.com/BRS1jOwmVPgFs2NE/arcgis/rest/services/Pipa_Hidrokarbon_Gabungan_50K/FeatureServer/2',
            outFields: ["*"]
        });

        let pipaHidrokarbonMap = new Map({
            basemap: 'arcgis-colored-pencil',
            layers: [valve50kLayer, pipaHidrokarbon50kLayer, drillingSource50kLayer]
        });

        let view = new MapView({
            map: pipaHidrokarbonMap,
            container: 'maps',
            zoom: 4,
            center: [117.153709, -0.502106]
        });

        /*** Initialize for storing graphics in each layer ***/
        let valve50kGraphics, pipaHidrokarbon50kGraphics;

        /*** valve50kLayer ***/
        view.whenLayerView(valve50kLayer).then(function (valve50kLayerView) {
            valve50kLayerView.watch("updating", function (valve50kValue) {
                if(!valve50kValue) {
                    valve50kLayerView.queryFeatures({
                        geometry: view.extent,
                        returnGeometry: true,
                        orderByFields: ["OBJECTID"]
                    }).then(function (valve50kResults) {
                        valve50kGraphics = valve50kResults.features;
                        $("#tbl_valve50k tbody").empty();
                        valve50kGraphics.forEach(function (res, idx) {
                            const attr = res.attributes;
                            const valveName = attr.Valve_Name;
                            const valveType = attr.Valve_Type;
                            let newRowValveContent = "<tr><td>"+valveName+"</td><td>"+getValveType(valveType)+"</td></tr>";
                            $("#tbl_valve50k tbody").append(newRowValveContent);
                        });
                    }).catch(function (err) {
                        console.error("Query failed: "+err);
                    });
                }
            });
        });

        /*** pipe50kLayer ***/
        view.whenLayerView(pipaHidrokarbon50kLayer).then(function (pipaHidrokarbon50kLayerView) {
            pipaHidrokarbon50kLayerView.watch("updating", function (pipaHidrokarbon50kValue) {
                if(!pipaHidrokarbon50kValue) {
                    pipaHidrokarbon50kLayerView.queryFeatures({
                        geometry: view.extent,
                        returnGeometry: true,
                        orderByFields: ["OBJECTID"]
                    }).then(function (pipaHidrokarbon50kResults) {
                        pipaHidrokarbon50kGraphics = pipaHidrokarbon50kResults.features;
                        $("#tbl_pipe50k tbody").empty();
                        pipaHidrokarbon50kGraphics.forEach(function (res, idx) {
                            const attr = res.attributes;
                            const pipeNamaObjek = attr.NAMOBJ;
                            const pipeDiameter = attr.DIMMTR;
                            let newRowPipeContent = "<tr><td>"+pipeNamaObjek+"</td><td>"+pipeDiameter+"</td></tr>";
                            $("#tbl_pipe50k tbody").append(newRowPipeContent);
                        });
                    }).catch(function (err) {
                        console.error("Query failed: "+err);
                    });
                }
            });
        });
    });
});
