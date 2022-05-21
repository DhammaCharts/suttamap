// import 'ol/ol.css';
// import Map from 'ol/Map';
// import Overlay from 'ol/Overlay';
// import TileLayer from 'ol/layer/Tile';
// import View from 'ol/View';
// import XYZ from 'ol/source/XYZ';
// import {toLonLat} from 'ol/proj';
// import {toStringHDMS} from 'ol/coordinate';
const width = 3550;
const height = 3550;

// then before tiling, PNG size needs to be a power of 2. If not, it is resized by vips and loose connection with coordinates.

const extent = [0, 0, width, height];
const projection = new ol.proj.Projection({
  code: 'pixels',
  units: 'pixels',
  extent: extent,
});

/**
 * Elements that make up the popup.
 */
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

/**
 * Create an overlay to anchor the popup to the map.
 */
const overlay = new ol.Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

const key = 'Get your own API key at https://www.maptiler.com/cloud/';
const attributions =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

/**
 * Create the map.
 */
const map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      extent: extent,
        source: new ol.source.TileImage({
          url: 'maptiles6/{z}/{y}/{x}.png'
        })
    })
  ],
  overlays: [overlay],
  target: 'map',
  view: new ol.View({
    projection: projection,
    center: ol.extent.getCenter(extent),
    center: [width/2 , height/2],
    zoom: 1,
    maxZoom: 6
  }),
});

/**
 * Add a click handler to the map to render the popup.
 */
map.on('singleclick', function (evt) {
  const coordinate = evt.coordinate;
  // const hdms = ol.coordinate(ol.proj(coordinate));

  content.innerHTML = '<p>You clicked here:</p><code>' + "test" + '</code>';
  overlay.setPosition(coordinate);
});
