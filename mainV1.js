// to resize
// vips dzsave tn_sutta12.png  maptiles6 --layout google --centre --suffix .png
// to make PNGtiles
// vips dzsave tn_sutta12.png  maptiles6 --layout google --centre --suffix .png
// padding problem https://stackoverflow.com/questions/56265393/libvips-and-padding-when-doing-image-pyramids
// To extend with white
// vips gravity sutta.png south-west 8192 8192 --extend white
// vips gravity sutta.png centre 8192 8192 --extend white
// Map views always need a projection.  Here we just want to map image
// coordinates directly to map coordinates, so we create a projection that uses
// the image extent in pixels.
// image : https://medium.com/attentive-ai/working-with-openlayers-4-part-3-setting-customised-markers-and-images-on-map-da3369a81941
// style marker https://developers.arcgis.com/openlayers/styles-and-data-visualization/style-a-feature-layer/
// https://openstreetmap.be/en/projects/howto/openlayers.html
// https://stackoverflow.com/questions/59772207/add-multiple-marker-to-a-vector-layer-efficiently
// http://harrywood.co.uk/maps/examples/openlayers/marker-popups.view.html

// detect device for marker size //

// const deviceType = () => {
//     const ua = navigator.userAgent;
//     if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
//         return "tablet";
//     }
//     else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
//         return "mobile";
//     }
//     return "desktop";
// };

// map

// create a SVG that is the same dimension as below first

const width = 3550;
const height = 3550;

// then before tiling, PNG size needs to be a power of 2. If not, it is resized by vips and loose connection with coordinates.

const extent = [0, 0, width, height];
const projection = new ol.proj.Projection({
  code: 'pixels',
  units: 'pixels',
  extent: extent,
});

// create map //

const map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      extent: extent,
        source: new ol.source.TileImage({
          url: 'maptiles6/{z}/{y}/{x}.png'
        })
    })
  ],
  target: 'map',
  view: new ol.View({
    projection: projection,
    center: ol.extent.getCenter(extent),
    center: [width/2 , height/2],
    zoom: 1,
    maxZoom: 6
  }),

  // use ctrl/cmd + drag for rotation //

  interactions: ol.interaction.defaults({altShiftDragRotate: false}).extend([
      new ol.interaction.DragRotate({condition: ol.events.condition.platformModifierKeyOnly})
   ])
});

// set data //

const data = bulletPosition;

// add marker layer //


const stroke = new ol.style.Stroke({color: 'black', width: 0.1});
const fill = new ol.style.Fill({color: "rgba(0, 0, 0, 0)"});

var vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: new ol.style.Style({
        image: new ol.style.Circle({
          fill: fill,
          // stroke: stroke, // for debug
          radius : 8
        })
    })
});
map.addLayer(vectorLayer);

// add marker to map //

for (let i = 0; i < data.length; i++) {
    vectorLayer.getSource().addFeature(new ol.Feature({
        geometry: new ol.geom.Point([data[i].x,data[i].y]),
        id : data[i].id,
        color : data[i].color,
        name : data[i].name,
        nameEn : data[i].nameEn
    }))
}

// popup behaviour //

var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});
map.addOverlay(overlay);

closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};

map.on("pointermove", function (e) {

    // pointer

    var hit = this.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
        return true;
    });
    if (hit) {
        this.getTargetElement().style.cursor = 'pointer';
        console.log(this.getFeaturesAtPixel());
        this.getTargetElement().style.fill = 'black';
    } else {
        this.getTargetElement().style.cursor = '';
        this.getTargetElement().style.fill = '';
    }
});

map.on('singleclick', function (event) {

    if (map.hasFeatureAtPixel(event.pixel) === true) {
        var coordinate = event.coordinate;
        const dataMap = map.getFeaturesAtPixel(event.pixel)[0].A;
        content.innerHTML = '<a style="font-family:sans-serif; text-decoration: none; color: '+dataMap.color+'" target="_blank" href="https://suttacentral.net/' + dataMap.id + '">' + dataMap.nameEn + '&emsp;</a>';
        // content.innerHTML = '<a target="_blank" href="https://suttacentral.net/' + dataMap.id + '">' + dataMap.nameEn + '</a> <br> id = '+ dataMap.id ;
        overlay.setPosition(coordinate);
    } else {
        overlay.setPosition(undefined);
        closer.blur();
    }
});
