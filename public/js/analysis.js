let tableValve = $("#tbl_valve50k tbody");
let tablePipe = $("#tbl_pipe50k tbody");

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

function countValvePrice(valveCode) {
    let price;
    $.ajax({
        type: "GET",
        url: "../fe_controllers/get_harga.php?item=valve",
        dataType: "json",
        async: false,
        success: function (res_valve) {
            let valvePrice = res_valve.valve_price;
            for(let i = 0; i < valvePrice.length; i++) {
                if(valvePrice[i].valve_type === valveCode) {
                    price = valvePrice[i].price;
                }
            }
        }
    });
    return price;
}

function countPipePrice(pipeDiameter) {
    let price;
    $.ajax({
        type: "GET",
        url: "../fe_controllers/get_harga.php?item=pipe",
        dataType: "json",
        async: false,
        success: function (res_valve) {
            let pipePrice = res_valve.pipe_price;
            for(let i = 0; i < pipePrice.length; i++) {
                if(parseInt(pipePrice[i].pipe_size_inch) === pipeDiameter) {
                    price = pipePrice[i].price;
                }
            }
        }
    });
    return price
}

function calculateTotalValvePrice() {
    let totalValvePrice = 0;
    tableValve.find('tr').each(function (i) {
        let tds = $(this).find('td'),
            priceValveTd = tds.eq(3).text();
        totalValvePrice+=parseInt(priceValveTd)
    });
    $("#sumValvePrice").text(totalValvePrice);
}

function calculateTotalPipePrice() {
    let totalValvePrice = 0;
    tablePipe.find('tr').each(function (i) {
        let tds = $(this).find('td'),
            pricePipeTd = tds.eq(2).text();
        totalValvePrice+=parseInt(pricePipeTd);
    });

    $("#sumPipePrice").text(totalValvePrice);
}

$(document).ready(function () {
    require([
        "esri/config",
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/widgets/Editor",
        "esri/WebMap"
    ], function (esriConfig, Map, MapView, FeatureLayer, Editor, WebMap) {
        // generate from ArcGIS Developers Dashboard (using OAuth 2.0)
        esriConfig.apiKey = "8VCijKH9S5gpp2CEWWI2YhmWX8pwEu3gxtwjkzHoOWJ4RbGB4nyUcdIceXJ--DSKtXf7gECxXWj_CwPFRP4PB0hIeepJFY3QWXNCZJ7-Ejt7tQax-roUZm36rI9e_IW7r-s5NbgVSqDylr3bD_HfNQ..";

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

        const webMapPipaHidrokarbon50k = new WebMap({
            portalItem: {
                id: "365946eff1e04267b89c1ee1049ac48f"
            }
        });

        let pipaHidrokarbonMap = new Map({
            basemap: 'arcgis-colored-pencil',
            layers: [valve50kLayer, pipaHidrokarbon50kLayer, drillingSource50kLayer]
        });

        let view = new MapView({
            map: pipaHidrokarbonMap,
            // map: webMapPipaHidrokarbon50k,
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
                            let newRowValveContent;
                            const attr = res.attributes;
                            const valveName = attr.Valve_Name;
                            const valveType = attr.Valve_Type;
                            const valvePrice = countValvePrice(valveType);

                            newRowValveContent = "<tr><td>"+valveName+"</td><td>"+getValveType(valveType)+"</td><td>"+valveType+"</td><td>"+valvePrice+"</td></tr>";
                            $("#tbl_valve50k tbody").append(newRowValveContent);
                        });
                        calculateTotalValvePrice();
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
                            const pipeEachPrice = countPipePrice(pipeDiameter);
                            console.log(pipeDiameter);
                            let newRowPipeContent = "<tr><td>"+pipeNamaObjek+"</td><td>"+pipeDiameter+"</td><td>"+pipeEachPrice+"</td></tr>";
                            $("#tbl_pipe50k tbody").append(newRowPipeContent);
                            calculateTotalPipePrice();
                        });
                    }).catch(function (err) {
                        console.error("Query failed: "+err);
                    });
                }
            });
        });

        /*** Initiate Editor widget ***/
        const editorWidget = new Editor({
            view: view,
            layerInfos: [
                {
                    layer: valve50kLayer,
                    fieldConfig: [
                        {name: "Valve_Name", label: "Valve Name"},
                        {name: "Valve_Type", label: "Valve Type"}
                    ]
                },
                {
                    layer: pipaHidrokarbon50kLayer,
                    fieldConfig: [
                        {name: "NAMOBJ", label: "Nama Objek"},
                        {name: "DIMMTR", label: "Diameter"},
                        {name: "REMARK", label: "Remarks"}
                    ]
                }
            ]
        });
        view.ui.add(editorWidget, "top-right");
    });
});
