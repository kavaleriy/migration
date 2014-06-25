var map;
var projection_wgs;
var projection_smp;
var position;
// == Functions Below =========================================================
var ol = {
    /*
     * ol.stretch_canvas:
     *   Many people experiance an issue where
     *   the container div (map) does not actually stretch to
     *   100%. This function sets the div to the height and width
     *   of the parent div. 100% fix.
     */
    stretch_canvas: function() {
        var oldiv_height = $('#map').parent().css('height');
        var oldiv_width  = $('#map').parent().css('width');
        $('#map').css('height', oldiv_height);
        $('#map').css('width', oldiv_width);

    },


    map: null,
    // Create custom layers
    LayerOblast: null, // Слой маркеров для областей
    LayerRayon: null, //Слой маркеров для районов
    LayerRayon: null, // Слой маркеров для городов
    projectTo: null, //The map projection (Spherical Mercator)

    /**
     * Маркер для областей
     */
    CreateMarkerOblast: function (x,y,name,house,work){
        var markers     = new OpenLayers.Layer.Markers("Markers");

        map.addLayer(markers);

        // Add a marker on defined position (put this anywhere below the code above)
        markers.addMarker(new OpenLayers.Marker(position));


        var feature = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(x, y).transform(projection_wgs, this.projectTo),
            {
                description: name + ' обл.: ' + house + ' до проживання / ' + 15 + ' робочих'
            },
            {
                externalGraphic: 'js/img/cloud-popup-relative.png',
                graphicHeight: 30,
                graphicWidth: 60,
                graphicXOffset: -5,
                graphicYOffset: -8,
                label: house + '/' + work,
                labelAlign: 'lt',
                fontColor: "red"
            }
        );
        this.LayerOblast.addFeatures(feature);
    },

    /**
     * Выпадающие окошки для областей
     */
    createPopup: function (feature) {
        feature.popup = new OpenLayers.Popup.FramedCloud("pop",
            feature.geometry.getBounds().getCenterLonLat(),
            null,
                '<div class="markerContent">' + feature.attributes.description + '</div>',
            null,
            true,
            function() {
                controls['selector'].unselectAll();
            }
        );
        //feature.popup.closeOnMove = true;
        map.addPopup(feature.popup);
    },
    destroyPopup: function (feature) {
        feature.popup.destroy();
        feature.popup = null;
    }
}


// ===========================================================================
