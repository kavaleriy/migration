/**
 * Инициализация карты
 */
function StartInitMap(div){
    map = new OpenLayers.Map(div);
    map.addLayer(new OpenLayers.Layer.OSM());
}
function SetGeoPositionStandart() {
    epsg4326 = new OpenLayers.Projection("EPSG:4326"); //WGS 1984 projection
    projectTo = map.getProjectionObject(); //The map projection (Spherical Mercator)
}

/**
 * Установка центра и масштаба карты
 */
function SetMapCenterZoom(x,y,z){
    var lonLat = new OpenLayers.LonLat(x,y); //.transform(epsg4326, projectTo);
    var zoom = z;
    map.setCenter(lonLat, zoom);
    EventAfterZoom(zoom);
}

/**
 * Маркер для областей
 * Данные вычитываются из глобальной GeoInfo
 */
function CreateMarkerForArea(){
    var sgeo, splace, alon, alat, name, house, work, azoom ;

    jQuery.each(GeoInfo, function(i, val) {
        sgeo = val.geo;
        splace = val.places;
        alon = sgeo.lon;
        alat = sgeo.lat;
        azoom = sgeo.zoom;
        name = val.oblast;
        house = splace.house;
        work = splace.work;

        var feature = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(alon, alat),
            {description: name + ' обл.: ' + house + ' до проживання / ' + 15 + ' робочих' + '<span class="more-maps-info" onclick="SetMapCenterZoom('+alon+', '+alat+','+azoom+' )"> Подробнее </span>'},
            {   externalGraphic: 'js/img/cloud-popup-relative.png',
                fillOpacity: 0.5,
                graphicHeight: 30,
                graphicWidth: 60,
                graphicXOffset: -5,
                graphicYOffset: -8,
                label: house + '/' + work,
                labelAlign: 'lt',
                fontColor: "red"
            }
        );
        LayerOblast.addFeatures(feature);
    });
    // Слои области на карту
    map.addLayer(LayerOblast);
}


/**
 * Выпадающие окошки для областей
 */
function createPopup(feature) {
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
}
function destroyPopup(feature) {
    feature.popup.destroy();
    feature.popup = null;
}

/**
 * Обработка при изменении масштаба
 */
function EventAfterZoom(zoom){
    if(zoom < 6 || zoom > 7) {
        LayerOblast.setVisibility(false);

    } else { LayerOblast.setVisibility(true); }
    if(zoom < 6){SetMapCenterZoom(3530470.0647431, 6243369.337484, 6);}

}


function arrayGEO() {

//    $geo = array(array('oblast' => 'Днепропетровская',
//        'geo' => array('lon' => 3963409.3928902, 'lat' => 6022007.7036011 , 'zoom' => 7),
//    'places' => array('house' => 25, 'work' => 50),),
//    array('oblast' => 'Запорожская',
//        'geo' => array('lon' => 3987869.241938, 'lat' => 5975533.9904101, 'zoom' => 8),
//    'places' => array('house' => 25, 'work' => 50),),
//    array('oblast' => 'Полтавская',
//        'geo' => array('lon' => 3754889.1797572, 'lat' => 6391351.4242235, 'zoom' => 8),
//    'places' => array('house' => 25, 'work' => 50),),
//    array('oblast' => 'Харьковская',
//        'geo' => array('lon' => 4070421.2324746, 'lat' => 6361999.6053661, 'zoom' => 8),
//    'places' => array('house' => 25, 'work' => 50),),
//    array('oblast' => 'Киевская',
//        'geo' => array('lon' => 3394106.4063015, 'lat' => 6511204.6845579, 'zoom' => 8),
//    'places' => array('house' => 25, 'work' => 50),),
//    array('oblast' => 'Одесская',
//        'geo' => array('lon' => 3354970.647825, 'lat' => 5857515.2187542, 'zoom' => 8),
//    'places' => array('house' => 25, 'work' => 50),),
//    array('oblast' => 'Луганская',
//        'geo' => array('lon' => 26, 'lat' => 46, 'zoom' => 7),
//    'places' => array('house' => 25, 'work' => 50),),
//    array('oblast' => 'Николаевская',
//        'geo' => array('lon' => 3546368.9666243, 'lat' => 5985929.4262553, 'zoom' => 8),
//    'places' => array('house' => 25, 'work' => 50),),
//    /*array('oblast' => 'Черкасская'),
//     array('oblast' => 'Львовская'),
//     array('oblast' => 'Автономная Республика Крым'),
//     array('oblast' => 'Сумская'),
//     array('oblast' => 'Кировоградская'),
//     array('oblast' => 'Черниговская'),
//     array('oblast' => 'Ивано-Франковская'),
//     array('oblast' => 'Волынская'),
//     array('oblast' => 'Ровненская'),*/
//    array('oblast' => 'Винницкая',
//        'geo' => array('lon' => 3192924.1478827, 'lat' => 6253153.2771031, 'zoom' => 8),
//    'places' => array('house' => 25, 'work' => 50),
//    'rayon' => array(
//        'Барский',
//        'Бершадский',
//        'Винницкий',
//        'Гайсинский',
//        'Жмеринский',
//        'Ильинецкий',
//        'Калиновский',
//        'Казатинский',
//        'Крыжопольский',
//        'Липовецкий',
//        'Литинский',
//        'Могилёв-Подольский ',
//        'Мурованокуриловецкий',
//        'Немировский',
//        'Оратовский',
//        'Песчанский',
//        'Погребищенский',
//        'Тепликский',
//        'Томашпольский',
//        'Тростянецкий',
//        'Тульчинский',
//        'Тывровский',
//        'Хмельникский',
//        'Черневецкий',
//        'Чечельницкий',
//        'Шаргородский',
//        'Ямпольский')
//),
//    /*array('oblast' => 'Херсонская'),
//     array('oblast' => 'Хмельницкая'),
//     array('oblast' => 'Житомирская'),
//     array('oblast' => 'Закарпатская'),
//     array('oblast' => 'Черновицкая'),
//     array('oblast' => 'Тернопольская')*/
//);
//    return json_encode($geo);
}
