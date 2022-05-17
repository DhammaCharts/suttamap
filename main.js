// to make PNGtiles
// vips dzsave suttapitaka.png  mapdir --layout google --centre --suffix .png
// padding problem https://stackoverflow.com/questions/56265393/libvips-and-padding-when-doing-image-pyramids
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

const width = 3550;
const height = 3550;

const extent = [0, 0, width, height];
const projection = new ol.proj.Projection({
  code: 'pixels',
  units: 'pixels',
  extent: extent,
});


const map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      extent: extent,
        source: new ol.source.TileImage({
          url: 'maptiles5/{z}/{y}/{x}.png'
        })
    }),
    new ol.layer.Tile({
      extent: extent,

      source: new ol.source.TileDebug(),
    })
  ],
  target: 'map',
  view: new ol.View({
    projection: projection,
    center: ol.extent.getCenter(extent),
    center: [width/2 , height/2],
    zoom: 1,
    maxZoom: 6,
  }),
  interactions: ol.interaction.defaults({altShiftDragRotate: false}).extend([
      new ol.interaction.DragRotate({condition: ol.events.condition.platformModifierKeyOnly})
   ])
});

const data = bulletPosition;

var vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: new ol.style.Style({
        image: new ol.style.Icon({
          opacity: 1,
          scale: 1,
          src: "logo2.png"
        })
    })
});
map.addLayer(vectorLayer);

for (let i = 0; i < data.length; i++) {
    vectorLayer.getSource().addFeature(new ol.Feature({
        geometry: new ol.geom.Point([data[i].x,data[i].y]),
        id : data[i].id
    }))
}

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

map.on("pointermove", function (evt) {
    var hit = this.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
        return true;
    });
    if (hit) {
        this.getTargetElement().style.cursor = 'pointer';
    } else {
        this.getTargetElement().style.cursor = '';
    }
});

map.on('singleclick', function (event) {

    if (map.hasFeatureAtPixel(event.pixel) === true) {
        var coordinate = event.coordinate;
        const dataMap = map.getFeaturesAtPixel(event.pixel)[0].A;

        // fetch('https://suttacentral.net/api/suttas/'+dataMap.id+'.json')
        //   .then(response => response.json())
        //   .then(data => {
        //     content.innerHTML = '<a target="_blank" href="https://suttacentral.net/"' + dataMap.id + '>' + data + '</a>';
        //     overlay.setPosition(coordinate);
        //   });

        // window.open("https://suttacentral.net/"+data.id, '_blank');
        content.innerHTML = '<a target="_blank" href="https://suttacentral.net/' + dataMap.id + '">' + dataMap.id + '</a>';
        overlay.setPosition(coordinate);
    } else {
        overlay.setPosition(undefined);
        closer.blur();
    }
});
