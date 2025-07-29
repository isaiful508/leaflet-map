import L from 'leaflet';
import 'leaflet-routing-machine';

L.Routing.GraphHopper = L.Class.extend({
  options: {
    serviceUrl: 'https://graphhopper.com/api/1/route',
    timeout: 30 * 1000,
    vehicle: 'car',
    locale: 'en',
    elevation: false,
    instructions: true,
    pointsEncoding: true
  },

  initialize: function(apiKey, options) {
    L.Util.setOptions(this, options);
    this._apiKey = apiKey;
  },

  route: function(waypoints, callback, context, options) {
    const url = this.buildRouteUrl(waypoints);

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (!data.paths || data.paths.length === 0) {
          callback.call(context || callback, {
            status: -1,
            message: 'No route found'
          });
          return;
        }

        const path = data.paths[0];
        const coordinates = this.decodePolyline(path.points);
        const latlngs = coordinates.map((c) => L.latLng(c[0], c[1]));

        const result = {
          name: '',
          coordinates: latlngs,
          instructions: [],
          summary: {
            totalDistance: path.distance,
            totalTime: path.time
          }
        };

        callback.call(context || callback, null, [result]);
      })
      .catch((err) => {
        console.error(err);
        callback.call(context || callback, {
          status: -1,
          message: 'Request failed'
        });
      });
  },

  buildRouteUrl: function(waypoints) {
    const locs = waypoints.map((wp) => `point=${wp.latLng.lat},${wp.latLng.lng}`).join('&');
    const opts = [
      `vehicle=${this.options.vehicle}`,
      `locale=${this.options.locale}`,
      `key=${this._apiKey}`,
      `instructions=${this.options.instructions}`,
      `points_encoded=${this.options.pointsEncoding}`
    ];
    return `${this.options.serviceUrl}?${locs}&${opts.join('&')}`;
  },

  decodePolyline: function(encoded) {
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0, coordinates = [];

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
      lng += dlng;

      coordinates.push([lat / 1e5, lng / 1e5]);
    }

    return coordinates;
  }
});
