import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./index.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

const map = L.map("map").setView([0, 0], 2);

L.tileLayer("https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png", {
  maxZoom: 20,
}).addTo(map);

const markers = L.markerClusterGroup({
  iconCreateFunction: function(cluster) {
    const count = cluster.getChildCount();
    return L.divIcon({
      html: `<div class="marker-group">${count}</div>`,
      className: 'marker-cluster-custom',
      iconSize: L.point(40, 40, true)
    });
  }
});

const myMarker = L.divIcon({className: 'marker'});

function setPlaces(places: {
    lat: number;
    lng: number;
    label: string;
    link: string;
    name: string;
}[]) {
  if (places && places.length > 0) {
    // Aggiungi marker al gruppo
    places.forEach((p) => {
      const marker = L.marker([p.lat, p.lng], {
        icon: L.divIcon({
          html: `<div class="marker-group">${p.name.split(' ').map(el => el.substring(0,1)).join('')}</div>`,
          className: 'marker-cluster-custom',
        })
      })
      .bindPopup(`
        <div style="font-weight:bold;color:red;"><a style="color: inherit; text-decoration: none;" href="${p.link}" target="_blank">${p.name}</a>, ${p.label}</div>
        <div>Latitudine: ${p.lat}</div>
        <div>Longitudine: ${p.lng}</div>
      `);
      markers.addLayer(marker);
    });

    // Aggiungi il gruppo alla mappa
    map.addLayer(markers);
  }
}

window.setPlaces = setPlaces;