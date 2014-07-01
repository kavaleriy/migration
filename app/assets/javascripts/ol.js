/**
 * Инициализация карты
 */
function StartInitMap(div) {
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
function SetMapCenterZoom(x, y, z) {
    var lonLat = new OpenLayers.LonLat(x, y); //.transform(epsg4326, projectTo);
    var zoom = z;
    map.setCenter(lonLat, zoom);
    EventAfterZoom(zoom);
}

/**
 * Маркер для областей
 * Данные вычитываются из глобальной GeoInfo
 */
function CreateMarkerForArea() {
    var sgeo, splace, alon, alat, name, house, work, azoom;

    jQuery.each(GeoInfo, function (i, val) {
        val = val.area
        splace = val.places;
        sgeo = val.geo.split(',');
        alon = sgeo[0];
        alat = sgeo[1];
        azoom = sgeo[2];
        name = val.namearea;
        house = val.house;
        work = "1" // splace.work;

        var feature = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(alon, alat),
            {description: name + ' обл., місць для проживання - ' + (house || '0')+ ' <i class="fa fa-home"></i><span class="more-maps-info" onclick="SetMapCenterZoom(' + alon + ', ' + alat + ',' + azoom + ' )"> детальніше... </span>'},
            {
                externalGraphic: '/assets/cloud-popup-relative.png',
                fillOpacity: 0.7,
                graphicHeight: 30,
                graphicWidth: 40,
                graphicXOffset: -5,
                graphicYOffset: -8,
//                label: 'Місць: ' + house,
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
        function () {
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
function EventAfterZoom(zoom) {
    if (zoom < 6 || zoom > 7) {
        LayerOblast.setVisibility(false);

    } else {
        LayerOblast.setVisibility(true);
    }
    if (zoom < 6) {
        SetMapCenterZoom(3530470.0647431, 6243369.337484, 6);
    }

}


function arrayGEO() {
    geo =
    [
            {
                "area": {
                "namearea": "Вінницька",
                "codearea": "05",
                "geo": "3210657.5384425,6261102.7280436,8",
                "img": "obl_vinytca_biblos.gif",
                "regions": {
                    "region": {
                        "nameregion": "Барський",
                        "coderegion": "05202",
                        "geo": "3071771.4580674,6267141.2532773,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Бершадський",
                        "coderegion": "05204",
                        "geo": "3295669.8458261,6200822.5766205,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Вінницький",
                        "coderegion": "05206",
                        "geo": "3160529.1798367,6329236.7841217,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Гайсинський",
                        "coderegion": "05208",
                        "geo": "3256686.9614062,6255686.835323,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Жмеринський",
                        "coderegion": "05210",
                        "geo": "3115737.081268,6289030.9072492,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Іллінецький",
                        "coderegion": "05212",
                        "geo": "3269069.7599867,6278635.4714039,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Калинівський",
                        "coderegion": "05216",
                        "geo": "3175496.5054362,6364292.7162145,9 ",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Козятинський",
                        "coderegion": "05214",
                        "geo": "3190019.5408085,6381720.3586611,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Крижопільський",
                        "coderegion": "05219",
                        "geo": "3193382.7700525,6166779.4351532,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Липовецький",
                        "coderegion": "05222",
                        "geo": "3215090.8860825,6322099.4766071,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Літинський",
                        "coderegion": "05224",
                        "geo": "3129481.414415,6327602.9426428,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Могилів-Подільський",
                        "coderegion": "05226",
                        "geo": "3091725.1517108,6195679.8903678,10",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Мурованокуриловецький",
                        "coderegion": "05228",
                        "geo": "3068637.5399086,6225635.9469248,10",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Немирівський",
                        "coderegion": "05230",
                        "geo": "3224110.4554192,6254529.1436124,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Оратівський",
                        "coderegion": "05231",
                        "geo": "3274253.1459674,6317819.0030238,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Піщанський",
                        "coderegion": "05232",
                        "geo": "3211269.0346692,6160970.2210045,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Погребищенський",
                        "coderegion": "05234",
                        "geo": "3260953.1030476,6356801.8874438,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Теплицький",
                        "coderegion": "05237",
                        "geo": "3293973.8992621,6220132.4808889,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Тиврівський",
                        "coderegion": "05245",
                        "geo": "3172439.0243056,6278912.5556321,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Томашпільський",
                        "coderegion": "05239",
                        "geo": "3180999.9714724,6194526.076417,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Тростянецький",
                        "coderegion": "05241",
                        "geo": "3256366.8813511,6191162.847173,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Тульчинський",
                        "coderegion": "05243",
                        "geo": "3219677.1077793,6218374.4292386,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Хмільницький",
                        "coderegion": "05248",
                        "geo": "3143272.5555431,6367032.9642809,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Чернівецький",
                        "coderegion": "05249",
                        "geo": "3135902.1247905,6194831.8245301,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Чечельницький",
                        "coderegion": "05250",
                        "geo": "3280826.730399,6143466.1415296,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Шаргородський",
                        "coderegion": "05253",
                        "geo": "3153941.2634633,6231214.8218513,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Ямпільський",
                        "coderegion": "05256",
                        "geo": "3165789.0028458,6169234.3122324,9",
                        "cities": {
                            "city": ""
                        }
                    }
                }
            },


            },

        { "area": {
                "namearea": "Волинська",
                "codearea": "07",
                "geo": "2767322.7744501,6646956.8467735,8",
                "img": "obl_volyn_biblos",
                "regions": {
                    "region": {
                        "nameregion": "Володимир-Волинський",
                        "coderegion": "07205",
                        "geo": "2719702.5058356,6592610.1196708,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Горохівський",
                        "coderegion": "07208",
                        "geo": "2765564.7228003,6532683.4895036,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Іваничівський",
                        "coderegion": "07211",
                        "geo": "2719702.5058356,6556837.5904383,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Камінь-Каширський",
                        "coderegion": "07214",
                        "geo": "2788801.5793957,6734782.9922614,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Ківерцівський",
                        "coderegion": "07218",
                        "geo": "2858206.4010689,6593221.6158971,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Ковельський",
                        "coderegion": "07221",
                        "geo": "2768927.9520443,6662014.9413442,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Локачинський",
                        "coderegion": "07224",
                        "geo": "2766481.9671395,6574265.232885,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Луцький",
                        "coderegion": "07228",
                        "geo": "2808980.9548602,6577628.4621291,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Любешівський",
                        "coderegion": "07231",
                        "geo": "2804700.4812767,6739674.9620712,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Любомльський",
                        "coderegion": "07233",
                        "geo": "2686528.8355642,6668588.525776,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Маневицький",
                        "coderegion": "07236",
                        "geo": "2846435.0987146,6668894.2738891,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Ратнівський",
                        "coderegion": "07242",
                        "geo": "2735754.281773,6738910.5917886,9 ",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Рожищенський",
                        "coderegion": "07245",
                        "geo": "2798356.2079298,6614082.1297669,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Старовижівський",
                        "coderegion": "07250",
                        "geo": "2724365.16456,6694882.8635027,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Турійський",
                        "coderegion": "07255",
                        "geo": "2732008.8673874,6625478.0418294,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Шацький", "coderegion": "07257",
                        "geo": "2667190.2674106,6705018.5037865,9",
                        "cities": {
                            "city": ""
                        }
                    },
                }
            },


            },{ "area": {
                "namearea": "Дніпропетровська",
                "codearea": "12",
                "geo": "3902565.5183834,6162957.5837393,8",
                "img": "obl_dnipropetrovsk_biblos",
                "regions": {
                    "region": {
                        "nameregion": "Апостолівський",
                        "coderegion": "12203",
                        "geo": "3753207.5651352,6052200.3297703,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Васильківський",
                        "coderegion": "12207",
                        "geo": "4016710.7308755,6132104.0027896,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Верхньодніпровський",
                        "coderegion": "12210",
                        "geo": "3818026.165112,6207826.1193374,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Дніпропетровський",
                        "coderegion": "12214",
                        "geo": "3901495.3999878,6190092.7287777,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Криворізький",
                        "coderegion": "12218",
                        "geo": "3722021.2575992,6086749.8665505,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Криничанський", "coderegion": "12220",
                        "geo": "3819325.5945929,6168231.7386912,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Магдалинівський",
                        "coderegion": "12223",
                        "geo": "3888424.6681531,6252618.2179063,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Межівський",
                        "coderegion": "12226",
                        "geo": "4092358.6595896,6148969.607566,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Нікопольський",
                        "coderegion": "12229",
                        "geo": "3830033.3011778,6065194.6245771,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Новомосковський",
                        "coderegion": "12232",
                        "geo": "3947128.3058678,6240957.8256801,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Павлоградський",
                        "coderegion": "12235",
                        "geo": "4000787.0997165,6206756.0009417,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Петриківський",
                        "coderegion": "12237",
                        "geo": "3862588.9525962,6225253.7617842,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Петропавлівський",
                        "coderegion": "12238",
                        "geo": "4053987.2713956,6173888.0787838,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Покровський",
                        "coderegion": "12242",
                        "geo": "4042063.0949849,6109069.478807,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "П'ятихатський",
                        "coderegion": "12245",
                        "geo": "3773921.9997977,6172970.8344446,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Синельниківський",
                        "coderegion": "12248",
                        "geo": "3962262.8374662,6159212.1693551,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Солонянський",
                        "coderegion": "12250",
                        "geo": "3866257.9299533,6145147.7561526,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Софіївський",
                        "coderegion": "12252",
                        "geo": "3769641.5262143,6113044.2042775,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Томаківський",
                        "coderegion": "12254",
                        "geo": "3878182.1063642,6066570.4910866,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Царичанський",
                        "coderegion": "12256",
                        "geo": "3850970.5242984,6246656.1297015,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Широківський",
                        "coderegion": "12258",
                        "geo": "3720136.5231096,6055962.4927602,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Юр'ївський",
                        "coderegion": "12259",
                        "geo": "4023718.2081989,6234731.9532906,9",
                        "cities": {
                            "city": ""
                        }
                    },
                }
            },


            },{ "area": {
                "namearea": "Донецька",
                "codearea": "14",
                "geo": "4205867.6465768,6101807.9611197,8",
                "img": "obl_doneck_biblos",
                "regions": {
                    "region": {
                        "nameregion": "Амвросіївський",
                        "coderegion": "14206",
                        "geo": "4290024.8147074,6075437.1863663,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Артемівський",
                        "coderegion": "14209",
                        "geo": "4237130.3911415,6220362.8201123,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Великоновосілківський",
                        "coderegion": "14212",
                        "geo": "4114831.1459023,6077271.675045,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Волноваський",
                        "coderegion": "14215",
                        "geo": "4176898.0128612,6036607.176003,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Володарський",
                        "coderegion": "14217",
                        "geo": "4148463.438343,5978820.7826275,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Добропільський",
                        "coderegion": "14220",
                        "geo": "4140208.2392894,6175722.5674626,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Костянтинівський",
                        "coderegion": "14224",
                        "geo": "4205944.0836055,6189175.484439,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Красноармійський",
                        "coderegion": "14227",
                        "geo": "4149380.6826824,6154320.1995458,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Краснолиманський",
                        "coderegion": "14230",
                        "geo": "4209612.6481652,6277537.1019218,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Мар'їнський",
                        "coderegion": "14233",
                        "geo": "4176286.516635,6093782.0731523,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Новоазовський",
                        "coderegion": "14236",
                        "geo": "4231932.6732188,5972094.3241393,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Олександрівський",
                        "coderegion": "14203",
                        "geo": "4115748.3902414,6221890.5325405,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Першотравневий",
                        "coderegion": "14239",
                        "geo": "4056739.0044136,6176945.559915,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Слов'янський",
                        "coderegion": "14242",
                        "geo": "4176439.3906915,6251853.8476242,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Старобешівський",
                        "coderegion": "14245",
                        "geo": "4221690.1114301,6059232.5363724,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Тельманівський",
                        "coderegion": "14248",
                        "geo": "4219549.8746384,6004197.8760148,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Шахтарський",
                        "coderegion": "14252",
                        "geo": "4290636.3109337,6104024.6349411,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Ясинуватський",
                        "coderegion": "14255",
                        "geo": "4214810.7788854,6124509.7585188,9",
                        "cities": {
                            "city": ""
                        }
                    },
                }
            },


            },{ "area": {
                "namearea": "Житомирська",
                "codearea": "18",
                "geo": "3171216.0318527,6550646.1911478,8",
                "img": "obl_zhytomir_biblos",
                "regions": {
                    "region": {
                        "nameregion": "Андрушівський",
                        "coderegion": "18203",
                        "geo": "3218011.7414851,6466871.2081588,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Баранівський",
                        "coderegion": "18206",
                        "geo": "3081631.834715,6522058.7425729,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Бердичівський",
                        "coderegion": "18208",
                        "geo": "3182222.9639243,6432474.5454351,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Брусилівський",
                        "coderegion": "18209",
                        "geo": "3282816.9213036,6484757.4727749,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Володарсько-Волинський",
                        "coderegion": "18211",
                        "geo": "3175190.757323,6552327.8057696,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Ємільчинський",
                        "coderegion": "18217",
                        "geo": "3099365.2252747,6597884.2746212,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Житомирський",
                        "coderegion": "18220",
                        "geo": "3175496.5054361,6472527.548251,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Коростенський",
                        "coderegion": "18223",
                        "geo": "3172744.7724182,6607668.2142404,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Коростишівський",
                        "coderegion": "18225",
                        "geo": "3239092.1129605,6495458.6567334,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Лугинський",
                        "coderegion": "18228",
                        "geo": "3140029.7243167,6647415.4689431,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Любарський",
                        "coderegion": "18231",
                        "geo": "3098753.7290484,6433086.0416614,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Малинський",
                        "coderegion": "18234",
                        "geo": "3249640.4228623,6600636.0076391,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Народицький",
                        "coderegion": "18237",
                        "geo": "3238327.7426776,6648332.7132823,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Новоград-Волинський",
                        "coderegion": "18240",
                        "geo": "3072306.5172653,6544072.6067158,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Овруцький",
                        "coderegion": "18242",
                        "geo": "3197051.7474094,6671263.8217646,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Олевський",
                        "coderegion": "18244",
                        "geo": "3097066.9653665,6672178.491574,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Попільнянський",
                        "coderegion": "18247",
                        "geo": "3275934.7605888,6437060.7671315,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Радомишльський",
                        "coderegion": "18250",
                        "geo": "3256978.3775766,6534288.6670968,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Романівський",
                        "coderegion": "18214",
                        "geo": "3109913.5351765,6464883.8454234,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Ружинський",
                        "coderegion": "18252",
                        "geo": "3246277.1936182,6400370.9935597,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Червоноармійський",
                        "coderegion": "18254",
                        "geo": "3143240.0795043,6529702.4454003,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Черняхівський",
                        "coderegion": "18256",
                        "geo": "3190325.2889214,6523281.7350252,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Чуднівський",
                        "coderegion": "18258",
                        "geo": "3132844.6436589,6432474.545435,9",
                        "cities": {
                            "city": ""
                        }
                    },
                }
            },


            },{ "area": {
                "namearea": "Закарпатська",
                "codearea": "21",
                "geo": "2591211.8613055,6179162.2337335,8",
                "img": "obl_zakarpata_biblos",
                "regions": {
                    "region": {
                        "nameregion": "Берегівський",
                        "coderegion": "21204",
                        "geo": "2528074.8759506,6139873.6012002,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Великоберезнянський",
                        "coderegion": "21208",
                        "geo": "2522877.158028,6255752.1360644,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Виноградівський",
                        "coderegion": "21212",
                        "geo": "2556662.3245253,6132812.6119733,10",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Воловецький",
                        "coderegion": "21215",
                        "geo": "2570420.9896148,6235419.8865434,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Іршавський",
                        "coderegion": "21219",
                        "geo": "2580204.9292339,6170601.2865666,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Міжгірський",
                        "coderegion": "21224",
                        "geo": "2621939.5466719,6199188.7351412,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Мукачівський",
                        "coderegion": "21227",
                        "geo": "2538164.5636829,6178092.1153374,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Перечинський",
                        "coderegion": "21232",
                        "geo": "2505755.2636945,6225483.0728676,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Рахівський",
                        "coderegion": "21236",
                        "geo": "2701204.7449925,6131847.7132312,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Свалявський",
                        "coderegion": "21240",
                        "geo": "2562700.8497591,6204615.7641485,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Тячівський",
                        "coderegion": "21244",
                        "geo": "2662756.9197704,6158371.3620421,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Ужгородський",
                        "coderegion": "21248",
                        "geo": "2498875.9311498,6188946.173352,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Хустський",
                        "coderegion": "21253",
                        "geo": "2604528.581395,6145988.5634616,9",
                        "cities": {
                            "city": ""
                        }
                    },
                }
            },


            },{ "area": {
                "namearea": "Запорізька",
                "codearea": "23",
                "geo": "3987869.2419378,5975533.9904102,8",
                "img": "obl_zaporiga_biblos",
                "regions": {
                    "region": {
                        "nameregion": "Бердянський",
                        "coderegion": "23206",
                        "geo": "4087848.8749207,5941748.8239122,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Василівський",
                        "coderegion": "23209",
                        "geo": "3911432.2136631,6019714.5927521,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Великобілозерський",
                        "coderegion": "23211",
                        "geo": "3854257.3165138,5992503.0106863,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Веселівський",
                        "coderegion": "23212",
                        "geo": "3889265.4754636,5950156.8970221,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Вільнянський",
                        "coderegion": "23215",
                        "geo": "3937267.9292199,6081017.0894281,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Гуляйпільський",
                        "coderegion": "23218",
                        "geo": "4038164.8065423,6042187.0790647,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Запорізький",
                        "coderegion": "23221",
                        "geo": "3918923.042434,6062060.7064161,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Кам'янсько-Дніпровський",
                        "coderegion": "23224",
                        "geo": "3846460.7396297,6011301.8300518,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Куйбишевський",
                        "coderegion": "23227",
                        "geo": "4082017.0354114,5981648.9526712,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Мелітопольський",
                        "coderegion": "23230",
                        "geo": "3938490.9216722,5906129.168736,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Михайлівський",
                        "coderegion": "23233",
                        "geo": "3926872.4933745,5979202.9677664,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Новомиколаївський",
                        "coderegion": "23236",
                        "geo": "4001169.2848572,6081781.4597109,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Оріхівський",
                        "coderegion": "23239",
                        "geo": "3973651.9546783,6053041.1370796,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Пологівський",
                        "coderegion": "23242",
                        "geo": "4046420.0055957,6014211.1267162,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Приазовський",
                        "coderegion": "23245",
                        "geo": "3970288.7254343,5903530.3097746,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Приморський",
                        "coderegion": "23248",
                        "geo": "4042751.0282386,5918817.7154295,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Розівський",
                        "coderegion": "23249",
                        "geo": "4096562.6961439,6015128.3710555,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Токмацький",
                        "coderegion": "23252",
                        "geo": "3972733.9572763,5973237.8673093,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Чернігівський",
                        "coderegion": "23255",
                        "geo": "4032967.0886195,5971712.1389956,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Якимівський",
                        "coderegion": "23203",
                        "geo": "3921674.7754518,5879070.460727,9",
                        "cities": {
                            "city": ""
                        }
                    },
                }
            },


            },{ "area": {
                "namearea": "Івано-Франківська",
                "codearea": "26",
                "geo": "2733078.9857831,6226247.4431506,8",
                "img": "obl_ivanofrankivsk_biblos",
                "regions": {
                    "region": {
                        "nameregion": "Богородчанський",
                        "coderegion": "26204",
                        "geo": "2707549.018339,6213023.8372583,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Верховинський",
                        "coderegion": "26208",
                        "geo": "2758854.9513617,6114326.9467054,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Галицький",
                        "coderegion": "26212",
                        "geo": "2745767.5324763,6305665.5155271,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Городенківський",
                        "coderegion": "26216",
                        "geo": "2824039.0494295,6217915.8070679,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Долинський",
                        "coderegion": "26220",
                        "geo": "2647775.2622284,6259803.2985624,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Калуський",
                        "coderegion": "26228",
                        "geo": "2718080.0333957,6272636.0718898,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Коломийський",
                        "coderegion": "26232",
                        "geo": "2793005.61595,6205991.6306571,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Косівський",
                        "coderegion": "26236",
                        "geo": "2797897.5857596,6163186.8948234,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Надвірнянський",
                        "coderegion": "26240",
                        "geo": "2728187.0159732,6186729.4995319,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Рогатинський",
                        "coderegion": "26244",
                        "geo": "2738888.1999317,6344189.7777774,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Рожнятівський",
                        "coderegion": "26248",
                        "geo": "2682019.0508954,6241764.1598895,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Снятинський",
                        "coderegion": "26252",
                        "geo": "2822204.5607509,6205533.0084874,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Тисменицький",
                        "coderegion": "26258",
                        "geo": "2747602.021155,6253229.7141308,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Тлумацький",
                        "coderegion": "26256",
                        "geo": "2793464.2381198,6224183.6433865,9",
                        "cities": {
                            "city": ""
                        }
                    },
                }
            },


            },{ "area": {
                "namearea": "Київська",
                "codearea": "32",
                "geo": "3381264.9855512,6500197.7524867,8",
                "img": "obl_kyiv_biblos",
                "regions": {
                    "region": {
                        "nameregion": "Баришівський",
                        "coderegion": "32202",
                        "geo": "3486595.2105133,6505777.6555499,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Білоцерківський",
                        "coderegion": "32204",
                        "geo": "3357263.7586728,6402740.5414358,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Богуславський",
                        "coderegion": "32206",
                        "geo": "3436146.7718522,6374611.7150308,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Бориспільський",
                        "coderegion": "32208",
                        "geo": "3449905.4369414,6484681.0357463,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Бородянський",
                        "coderegion": "32210",
                        "geo": "3329440.6803808,6545830.6583659,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Броварський",
                        "coderegion": "32212",
                        "geo": "3453574.4142986,6562341.0564732,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Васильківський",
                        "coderegion": "12207",
                        "geo": "3360321.2398037,6452577.483871,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Вишгородський",
                        "coderegion": "32218",
                        "geo": "3365671.8317828,6596737.7191967,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Володарський",
                        "coderegion": "14217",
                        "geo": "3323478.5921752,6351833.4806051,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Згурівський",
                        "coderegion": "32219",
                        "geo": "3539031.0119094,6520606.4390352,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Іванківський",
                        "coderegion": "32220",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Кагарлицький",
                        "coderegion": "32222",
                        "geo": "3431713.424212,6409008.3777544,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Києво-Святошинський",
                        "coderegion": "32224",
                        "geo": "3347021.1968839,6515102.9729995,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Макарівський",
                        "coderegion": "32227",
                        "geo": "3295349.7657703,6499204.0711184,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Миронівський",
                        "coderegion": "32229",
                        "geo": "3439357.1270395,6401674.8702854,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Обухівський",
                        "coderegion": "32231",
                        "geo": "3411228.3006343,6481776.4286718,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Переяслав-Хмельницький",
                        "coderegion": "32233",
                        "geo": "3488888.3213612,6439277.4409512,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Поліський",
                        "coderegion": "32235",
                        "geo": "3289553.119511,6645625.997568,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Рокитнянський",
                        "coderegion": "32237",
                        "geo": "3388906.6674975,6399071.5640789,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Сквирський",
                        "coderegion": "32240",
                        "geo": "3305133.7053892,6394791.0904956,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Ставищенський",
                        "coderegion": "32242",
                        "geo": "3356805.1365027,6329360.9942925,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Таращанський",
                        "coderegion": "32244",
                        "geo": "3388602.9402649,6359668.1074621,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Тетіївський",
                        "coderegion": "32246",
                        "geo": "3306050.9497284,6324774.772596,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Фастівський",
                        "coderegion": "32249",
                        "geo": "3330871.7213735,6453188.9800972,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Яготинський",
                        "coderegion": "32255",
                        "geo": "3529552.8204031,6478396.7654667,9",
                        "cities": {
                            "city": ""
                        }
                    },
                }
            },


            },{ "area": {
                "namearea": "Кіровоградська",
                "codearea": "35",
                "geo": "3567771.3345412,6173047.2714716,8",
                "img": "obl_kirovograd_biblos",
                "regions": {
                    "region": {
                        "nameregion": "Бобринецький",
                        "coderegion": "35208",
                        "geo": "3574803.5411416,6109833.8490878,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Вільшанський",
                        "coderegion": "35243",
                        "geo": "3436299.645908,6126955.7434214,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Гайворонський",
                        "coderegion": "35211",
                        "geo": "3330791.2818856,6157325.8666324,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Голованівський",
                        "coderegion": "35214",
                        "geo": "3378207.5044194,6156613.3103918,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Добровеличківський",
                        "coderegion": "35217",
                        "geo": "3477881.3892894,6149886.8519037,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Долинський",
                        "coderegion": "26220",
                        "geo": "3650934.821303,6111668.3377663,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Знам'янський",
                        "coderegion": "35222",
                        "geo": "3631061.1939516,6216845.6886721,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Кіровоградський",
                        "coderegion": "35225",
                        "geo": "3591008.1911358,6187493.8698147,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Компаніївський",
                        "coderegion": "35228",
                        "geo": "3584893.2288738,6135516.690588,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Маловисківський",
                        "coderegion": "35231",
                        "geo": "3520991.8732363,6207367.4971661,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Новгородківський",
                        "coderegion": "35234",
                        "geo": "3636717.5340439,6159212.1693532,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Новоархангельський",
                        "coderegion": "35236",
                        "geo": "3429114.5652502,6202016.9051869,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Новомиргородський",
                        "coderegion": "35238",
                        "geo": "3525119.472763,6228005.4948002,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Новоукраїнський",
                        "coderegion": "35240",
                        "geo": "3518087.2661618,6159823.6655794,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Олександрівський",
                        "coderegion": "14203",
                        "geo": "3588715.0802874,6254911.3287527,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Олександрійський",
                        "coderegion": "35203",
                        "geo": "3681051.0104431,6213941.0815976,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Онуфріївський",
                        "coderegion": "35246",
                        "geo": "3722632.7538244,6246961.8778122,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Петрівський",
                        "coderegion": "35249",
                        "geo": "3702147.6302468,6156154.6882221,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Світловодський",
                        "coderegion": "35252",
                        "geo": "3698404.5969086,6269281.4900684,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Ульяновський",
                        "coderegion": "35255",
                        "geo": "3361238.4841426,6161658.1542577,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Устинівський",
                        "coderegion": "35258",
                        "geo": "3621735.8765022,6095310.8137154,9",
                        "cities": {
                            "city": ""
                        }
                    },
                }
            },


            },{ "area": {
                "namearea": "Крим Автономна республіка",
                "codearea": "01",
                "geo": "3839887.1551985,5642880.0433594,8",
                "img": "obl_krym_biblos",
                "regions": {
                    "region": {
                        "nameregion": "", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                }
            },


            },{ "area": {
                "namearea": "Луганська",
                "codearea": "44",
                "geo": "4322969.1738936,6311852.5324286,8",
                "img": "obl_lugansk_biblos",
                "regions": {
                    "region": {
                        "nameregion": "Антрацитівський",
                        "coderegion": "44203",
                        "geo": "4338868.0757738,6139491.416058,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Біловодський",
                        "coderegion": "44206",
                        "geo": "4407049.9049947,6294811.4575118,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Білокуракинський",
                        "coderegion": "44209",
                        "geo": "4313490.9823867,6353821.7605841,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Краснодонський",
                        "coderegion": "44214",
                        "geo": "4417445.34084,6141020.1566236,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Кремінський",
                        "coderegion": "44216",
                        "geo": "4255093.0927849,6271915.4336256,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Лутугинський",
                        "coderegion": "44222",
                        "geo": "4351250.8743543,6165480.0056713,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Марківський",
                        "coderegion": "44225",
                        "geo": "4391303.8771703,6353820.8433397,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Міловський",
                        "coderegion": "44228",
                        "geo": "4433038.4946082,6328596.624009,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Новоайдарський",
                        "coderegion": "44231",
                        "geo": "4347124.9564423,6264695.2683716,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Новопсковський",
                        "coderegion": "44233",
                        "geo": "4352322.674365,6369872.6192774,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Перевальський",
                        "coderegion": "44236",
                        "geo": "4304014.4724955,6183060.5221744,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Попаснянський",
                        "coderegion": "44238",
                        "geo": "4277261.5125994,6222043.4065944,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Сватівський",
                        "coderegion": "44240",
                        "geo": "4257082.137135,6341526.2079404,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Свердловський",
                        "coderegion": "44242",
                        "geo": "4407357.3347227,6122063.7736112,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Слов'яносербський",
                        "coderegion": "44245",
                        "geo": "4352016.9262518,6224117.8303126,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Станично-Луганський",
                        "coderegion": "44248",
                        "geo": "4380145.7526569,6250783.7292256,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Старобільський",
                        "coderegion": "44251",
                        "geo": "4328474.3215433,6324774.7725953,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Троїцький",
                        "coderegion": "44254",
                        "geo": "4278637.3791082,6408855.5036973,9",
                        "cities": {
                            "city": ""
                        }
                    },
                }
            },

            },{ "area": {
                "namearea": "Львівська",
                "codearea": "46",
                "geo": "2678655.8216517,6405415.8374262,8",
                "img": "obl_lviv_biblos",
                "house": "119",
                "regions": {
                    "region": {
                        "nameregion": "Бродівський",
                        "coderegion": "46203",
                        "geo": "2790867.0607727,6457163.7055668,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Буський",
                        "coderegion": "46206",
                        "geo": "2739501.3777722,6447991.2621739,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Городоцький",
                        "coderegion": "46209",
                        "geo": "2641351.8765571,6404269.2820008,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Дрогобицький",
                        "coderegion": "46212",
                        "geo": "2620565.361777,6329360.9942918,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Жидачівський",
                        "coderegion": "46215",
                        "geo": "2705869.0853315,6346482.8886253,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Жовківський",
                        "coderegion": "46227",
                        "geo": "2673399.2472167,6462667.1716026,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Золочівський",
                        "coderegion": "46218",
                        "geo": "2778942.9473335,6417110.702751,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Кам'янка-Бузький",
                        "coderegion": "46221",
                        "geo": "2717181.7655161,6460832.6829241,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Миколаївський",
                        "coderegion": "46230",
                        "geo": "2668565.7931481,6369416.0194932,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Мостиський",
                        "coderegion": "46224",
                        "geo": "2581429.6033006,6388370.3801198,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Перемишлянський",
                        "coderegion": "46233",
                        "geo": "2739501.3777724,6384701.4027626,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Пустомитівський",
                        "coderegion": "46236",
                        "geo": "2663675.8457239,6395708.3348342,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Радехівський",
                        "coderegion": "46239",
                        "geo": "2752954.2947486,6502108.6781923,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Самбірський",
                        "coderegion": "46242",
                        "geo": "2580207.8920783,6362993.2867327,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Сколівський",
                        "coderegion": "46245",
                        "geo": "2609558.4297055,6261177.3086004,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Сокальський",
                        "coderegion": "46248",
                        "geo": "2695779.3975992,6501191.433853,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Старосамбірський",
                        "coderegion": "46251",
                        "geo": "2560638.7316098,6332724.223536,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Стрийський",
                        "coderegion": "46253",
                        "geo": "2660341.8536432,6318659.8103336,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Турківський",
                        "coderegion": "46255",
                        "geo": "2560944.4797228,6279524.051857,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Яворівський",
                        "coderegion": "46258",
                        "geo": "2605889.4523483,6450742.995192,9",
                        "cities": {
                            "city": ""
                        }
                    },
                }
            },


            },{ "area": {
                "namearea": "Миколаївська",
                "codearea": "48",
                "geo": "3540254.0043623,5988986.9073863,8",
                "img": "obl_mykolaiv_biblos",
                "regions": {
                    "region": {
                        "nameregion": "Арбузинський",
                        "coderegion": "48203",
                        "geo": "3484609.5293924,6092406.2066408,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Баштанський",
                        "coderegion": "48206",
                        "geo": "3599570.8199174,6004656.4981816,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Березанський",
                        "coderegion": "48209",
                        "geo": "3491947.4841068,5916906.7897223,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Березнегуватський",
                        "coderegion": "48211",
                        "geo": "3661331.9387632,5997624.2915802,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Братський",
                        "coderegion": "48214",
                        "geo": "3512432.6076845,6084456.7557,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Веселинівський",
                        "coderegion": "48217",
                        "geo": "3479106.0633568,6010159.9642172,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Вознесенський",
                        "coderegion": "48220",
                        "geo": "3494699.2171248,6039817.5311877,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Врадіївський",
                        "coderegion": "48223",
                        "geo": "3411841.4784751,6096686.6802239,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Доманівський",
                        "coderegion": "48227",
                        "geo": "3454646.2143089,6054187.6925033,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Єланецький",
                        "coderegion": "48230",
                        "geo": "3552179.8623871,6061219.8991046,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Жовтневий",
                        "coderegion": "48233",
                        "geo": "3585735.7177996,5946793.6677776,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Казанківський",
                        "coderegion": "48236",
                        "geo": "3651471.5621157,6062672.2026419,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Кривоозерський",
                        "coderegion": "48239",
                        "geo": "3386068.9558331,6103795.3238535,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Миколаївський",
                        "coderegion": "48242",
                        "geo": "3534522.9088555,5957189.1036228,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Новобузький",
                        "coderegion": "48245",
                        "geo": "3618603.6399575,6059308.9733977,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Новоодеський",
                        "coderegion": "48248",
                        "geo": "3546752.8333794,6000911.0837959,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Очаківський",
                        "coderegion": "48251",
                        "geo": "3521681.4881053,5910715.390432,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Первомайський",
                        "coderegion": "48254",
                        "geo": "3443104.2230391,6102419.4573444,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Снігурівський",
                        "coderegion": "48257",
                        "geo": "3641839.852298,5955354.6149442,9",
                        "cities": {
                            "city": ""
                        }
                    },
                }
            },


            },{ "area": {
                "namearea": "Одеська",
                "codearea": "51",
                "geo": "3341517.7308485,5885032.548933,8",
                "img": "obl_odesa_biblos",
                "regions": {
                    "region": {
                        "nameregion": "Ананьївський",
                        "coderegion": "51202",
                        "geo": "3338232.6202464,6052888.2630225,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Арцизький",
                        "coderegion": "51204",
                        "geo": "3265158.821216,5777409.213121,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Балтський",
                        "coderegion": "51206",
                        "geo": "3298404.9620533,6093552.7620645,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Березівський",
                        "coderegion": "51212",
                        "geo": "3426593.8249316,5975839.7385216,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Білгород-Дністровський",
                        "coderegion": "51208",
                        "geo": "3344347.5825083,5825411.6668773,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Біляївський",
                        "coderegion": "51210",
                        "geo": "3381495.9782498,5882892.3121398,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Болградський",
                        "coderegion": "51214",
                        "geo": "3199270.1028434,5741220.4842695,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Великомихайлівський",
                        "coderegion": "51216",
                        "geo": "3325849.821666,5960246.5847537,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Іванівський",
                        "coderegion": "51218",
                        "geo": "3392502.9103214,5948016.6602297,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Ізмаїльський",
                        "coderegion": "51220",
                        "geo": "3217309.2415162,5692411.2376798,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Кілійський",
                        "coderegion": "51223",
                        "geo": "3263782.9547071,5715342.4091335,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Кодимський",
                        "coderegion": "51225",
                        "geo": "3243909.3273557,6110980.4045111,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Комінтернівський",
                        "coderegion": "51227",
                        "geo": "3440199.6159647,5918970.5894854,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Котовський",
                        "coderegion": "51229",
                        "geo": "3287631.3075288,6071233.1498084,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Красноокнянський",
                        "coderegion": "51231",
                        "geo": "3289771.5443205,6032097.3913318,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Любашівський",
                        "coderegion": "51233",
                        "geo": "3370489.0461784,6084991.8148978,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Миколаївський",
                        "coderegion": "51235",
                        "geo": "3434696.149929,6040658.3384986,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Овідіопольський",
                        "coderegion": "51237",
                        "geo": "3378432.2871863,5838568.1506396,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Ренійський",
                        "coderegion": "51241",
                        "geo": "3165943.5585158,5711367.6206919,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Роздільнянський",
                        "coderegion": "51239",
                        "geo": "3348475.1820352,5916218.8564676,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Савранський",
                        "coderegion": "51243",
                        "geo": "3351927.0697391,6121375.8403565,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Саратський",
                        "coderegion": "51245",
                        "geo": "3307199.1867669,5797588.5885854,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Тарутинський",
                        "coderegion": "51247",
                        "geo": "3256444.9999926,5828163.3998953,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Татарбунарський",
                        "coderegion": "51250",
                        "geo": "3301695.7207311,5769765.5102935,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Фрунзівський",
                        "coderegion": "51252",
                        "geo": "3315913.0079902,5995101.8696468,10",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Ширяївський",
                        "coderegion": "51254",
                        "geo": "3357341.877315,6011306.519641,9",
                        "cities": {
                            "city": ""
                        }
                    },
                }
            },


            },{ "area": {
                "namearea": "Полтавська",
                "codearea": "53",
                "geo": "3727371.8495783,6402358.3562951,8",
                "img": "obl_poltava_biblos",
                "regions": {
                    "region": {
                        "nameregion": "Великобагачанський",
                        "coderegion": "53202",
                        "geo": "3755126.5816813,6402976.2617452,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Гадяцький",
                        "coderegion": "53204",
                        "geo": "3785694.9837656,6519154.135497,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Глобинський",
                        "coderegion": "53206",
                        "geo": "3693359.0536099,6350075.4289538,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Гребінківський",
                        "coderegion": "53208",
                        "geo": "3612794.4258085,6469928.6892881,10",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Диканський",
                        "coderegion": "53210",
                        "geo": "3847150.3544982,6428958.442133,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Зіньківський",
                        "coderegion": "53213",
                        "geo": "3826665.2309206,6474209.1628717,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Карлівський",
                        "coderegion": "53216",
                        "geo": "3914720.6874929,6358024.8798943,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Кобеляцький",
                        "coderegion": "53218",
                        "geo": "3805874.3592301,6298403.9978402,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Козельщинський",
                        "coderegion": "53220",
                        "geo": "3768576.4635809,6327755.8166976,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Котелевський",
                        "coderegion": "53222",
                        "geo": "3864272.2488319,6458616.0091037,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Кременчуцький",
                        "coderegion": "53224",
                        "geo": "3735858.0413308,6295958.0129355,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Лохвицький",
                        "coderegion": "53226",
                        "geo": "3707423.4668127,6502032.2411637,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Лубенський",
                        "coderegion": "53228",
                        "geo": "3677154.4036161,6447914.8251453,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Машівський",
                        "coderegion": "53230",
                        "geo": "3878948.1582608,6358006.2957265,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Миргородський",
                        "coderegion": "53232",
                        "geo": "3748087.9658548,6449443.5657106,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Новосанжарський",
                        "coderegion": "53234",
                        "geo": "3824219.2460163,6332647.7865072,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Оржицький",
                        "coderegion": "53236",
                        "geo": "3641993.3706098,6422231.9836449,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Пирятинський",
                        "coderegion": "53238",
                        "geo": "3620591.002693,6493471.2939967,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Полтавський",
                        "coderegion": "53240",
                        "geo": "3847451.7375078,6378217.3506704,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Решетилівський",
                        "coderegion": "53242",
                        "geo": "3797619.1601767,6378815.7515849,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Семенівський",
                        "coderegion": "53245",
                        "geo": "3697028.0309675,6383401.9732814,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Хорольський",
                        "coderegion": "53248",
                        "geo": "3707576.3408695,6413671.0364781,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Чорнухинський",
                        "coderegion": "53251",
                        "geo": "3668048.0018157,6501726.4930503,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Чутівський",
                        "coderegion": "53254",
                        "geo": "3917319.5464549,6406944.5779899,9",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Шишацький",
                        "coderegion": "53257",
                        "geo": "3787682.3465013,6432627.4194902,9",
                        "cities": {
                            "city": ""
                        }
                    },
                }
            },


            },{ "area": {
                "namearea": "Рівненська",
                "codearea": "56",
                "geo": "2976454.4838092,6637172.9071545,8",
                "img": "obl_rivne_biblos",
                "regions": {
                    "region": {
                        "nameregion": "Березнівський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Володимирецький", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Гощанський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Демидівський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Дубенський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Дубровицький", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Зарічненський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Здолбунівський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Корецький", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Костопільський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Млинівський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Острозький", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Радивилівський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Рівненський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Рокитнівський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Сарненський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                }
            },


            },{ "area": {
                "namearea": "Сумська",
                "codearea": "59",
                "geo": "3808700.8476623,6611490.0656543,8",
                "img": "obl_sumska_biblos",
                "regions": {
                    "region": {
                        "nameregion": "Білопільський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Буринський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Великописарівський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Глухівський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Конотопський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Краснопільський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Кролевецький", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Лебединський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Липоводолинський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Недригайлівський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Охтирський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Путивльський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Роменський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Середино-Будський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Сумський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Тростянецький", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Шосткинський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Ямпільський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                }
            },


            },{ "area": {
                "namearea": "Тернопільська",
                "codearea": "61",
                "geo": "2859658.7046055,6350992.6732948,8",
                "img": "obl_ternopil_biblos",
                "regions": {
                    "region": {
                        "nameregion": "Бережанський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Борщівський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Бучацький", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Великоборківський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Гусятинський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Заліщицький", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Збаразький", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Зборівський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Козівський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Кременецький", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Лановецький", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Монастириський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Підволочиський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Підгаєцький", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Теребовлянський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Тернопільський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Чортківський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Шумський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                }
            },


            },{ "area": {
                "namearea": "Харківська",
                "codearea": "63",
                "geo": "4063694.773986,6365668.5827234,8",
                "img": "obl_harkiv_biblos",
                "regions": {
                    "region": {
                        "nameregion": "Балаклійський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Барвінківський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Близнюківський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Богодухівський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Борівський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Валківський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Великобурлуцький",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Вовчанський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Дергачівський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Дворічанський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Зачепилівський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Зміївський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Золочівський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Ізюмський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Кегичівський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Коломацький",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Красноградський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Краснокутський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Куп'янський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Лозівський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Нововодолазький",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Первомайський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Печенізький",
                        "coderegion": "63246",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Сахновщинський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Харківський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Чугуївський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Шевченківський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                }
            },


            },{ "area": {
                "namearea": "Херсонська",
                "codearea": "65",
                "geo": "3720645.3910898,5873414.1206354,8",
                "img": "obl_herson_biblos",
                "regions": {
                    "region": {
                        "nameregion": "Бериславський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Білозерський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Великолепетиський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Великоолександрівський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Верхньорогачицький",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Високопільський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Генічеський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Голопристанський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Горностаївський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Іванівський", "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Каланчацький",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Каховський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Нижньосірогозький",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Нововоронцовський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Новотроїцький",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Скадовський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Цюрупинський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Чаплинський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                }
            },


            },{ "area": {
                "namearea": "Хмельницька",
                "codearea": "68",
                "geo": "2989907.4007853,6347935.1921638,8",
                "img": "obl_hmelnickiy_biblos",
                "regions": {
                    "region": {
                        "nameregion": "Білогірський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Віньковецький",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Волочиський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Городоцький",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Деражнянський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Дунаєвецький",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Ізяславський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Кам'янець-Подільський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Красилівський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Летичівський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Новоушицький",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Полонський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Славутський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Старокостянтинівський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Старосинявський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Теофіпольський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Хмельницький",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Чемеровецький",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Шепетівський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Ярмолинецький",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                }
            },


            },{ "area": {
                "namearea": "Черкаська",
                "codearea": "71",
                "geo": "3433547.9128906,6279447.6148297,8",
                "img": "obl_cherkasi_biblos",
                "regions": {
                    "region": {
                        "nameregion": "Городищенський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Драбівський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Жашківський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Звенигородський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Золотоніський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Кам'янський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Канівський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Катеринопільський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Корсунь-Шевченківський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Лисянський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Маньківський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Монастирищенський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Смілянський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Тальнівський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Уманський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Христинівський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Черкаський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Чигиринський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Чорнобаївський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Шполянський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                }
            }


            },{ "area": {
                "namearea": "Чернівецька",
                "codearea": "73",
                "geo": "2878615.0876175,6156536.8733642,8",
                "img": "obl_chernivci_biblos",
                "regions": {
                    "region": {
                        "nameregion": "Вижницький",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Герцаївський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Глибоцький",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Заставнівський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Кельменецький",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Кіцманський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Новоселицький",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Путильський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Сокирянський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Сторожинецький",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                    "region": {
                        "nameregion": "Хотинський",
                        "coderegion": "",
                        "geo": "",
                        "cities": {
                            "city": ""
                        }
                    },
                }
            },

            },
        { "area": {
            "namearea": "Чернігівська",
            "codearea": "74",
            "geo": "3539031.0119095,6682423.627893,8",
            "img": "obl_chernigiv_biblos",
            "regions": {
                "region": {
                    "nameregion": "Бахмацький",
                    "coderegion": "",
                    "geo": "",
                    "cities": {
                        "city": ""
                    }
                },
                "region": {
                    "nameregion": "Бобровицький",
                    "coderegion": "",
                    "geo": "",
                    "cities": {
                        "city": ""
                    }
                },
                "region": {
                    "nameregion": "Борзнянський",
                    "coderegion": "",
                    "geo": "",
                    "cities": {
                        "city": ""
                    }
                },
                "region": {
                    "nameregion": "Варвинський",
                    "coderegion": "",
                    "geo": "",
                    "cities": {
                        "city": ""
                    }
                },
                "region": {
                    "nameregion": "Городнянський",
                    "coderegion": "",
                    "geo": "",
                    "cities": {
                        "city": ""
                    }
                },
                "region": {
                    "nameregion": "Ічнянський",
                    "coderegion": "",
                    "geo": "",
                    "cities": {
                        "city": ""
                    }
                },
                "region": {
                    "nameregion": "Козелецький",
                    "coderegion": "",
                    "geo": "",
                    "cities": {
                        "city": ""
                    }
                },
                "region": {
                    "nameregion": "Коропський",
                    "coderegion": "",
                    "geo": "",
                    "cities": {
                        "city": ""
                    }
                },
                "region": {
                    "nameregion": "Корюківський",
                    "coderegion": "",
                    "geo": "",
                    "cities": {
                        "city": ""
                    }
                },
                "region": {
                    "nameregion": "Куликівський",
                    "coderegion": "",
                    "geo": "",
                    "cities": {
                        "city": ""
                    }
                },
                "region": {
                    "nameregion": "Менський",
                    "coderegion": "",
                    "geo": "",
                    "cities": {
                        "city": ""
                    }
                },
                "region": {
                    "nameregion": "Ніжинський",
                    "coderegion": "",
                    "geo": "",
                    "cities": {
                        "city": ""
                    }
                },
                "region": {
                    "nameregion": "Новгород-Сіверський",
                    "coderegion": "",
                    "geo": "",
                    "cities": {
                        "city": ""
                    }
                },
                "region": {
                    "nameregion": "Носівський",
                    "coderegion": "",
                    "geo": "",
                    "cities": {
                        "city": ""
                    }
                },
                "region": {
                    "nameregion": "Прилуцький",
                    "coderegion": "",
                    "geo": "",
                    "cities": {
                        "city": ""
                    }
                },
                "region": {
                    "nameregion": "Ріпкинський",
                    "coderegion": "",
                    "geo": "",
                    "cities": {
                        "city": ""
                    }
                },
                "region": {
                    "nameregion": "Семенівський",
                    "coderegion": "",
                    "geo": "",
                    "cities": {
                        "city": ""
                    }
                },
                "region": {
                    "nameregion": "Сосницький",
                    "coderegion": "74249",
                    "geo": "",
                    "cities": {
                        "city": ""
                    }
                },
                "region": {
                    "nameregion": "Срібнянський",
                    "coderegion": "",
                    "geo": "",
                    "cities": {
                        "city": ""
                    }
                },
                "region": {
                    "nameregion": "Талалаївський",
                    "coderegion": "",
                    "geo": "",
                    "cities": {
                        "city": ""
                    }
                },
                "region": {
                    "nameregion": "Чернігівський",
                    "coderegion": "",
                    "geo": "",
                    "cities": {
                        "city": ""
                    }
                },
                "region": {
                    "nameregion": "Щорський",
                    "coderegion": "",
                    "geo": "",
                    "cities": {
                        "city": ""
                    }
                }
            }
        }
        }
    ]
    return geo
}
