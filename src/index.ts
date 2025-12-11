import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./index.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

declare global {
  interface Window {
    PLACES: Array<{ lat: number; lng: number; label: string }>;
  }
}

const map = L.map("map").setView([0, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
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

if (window.PLACES) {
  // Aggiungi marker al gruppo
  window.PLACES.forEach((p: any) => {
    const marker = L.marker([p.lat, p.lng], {
      icon: myMarker
    })
    .bindPopup(`
      <div style="font-weight:bold;color:red;">${p.label}</div>
      <div>Latitudine: ${p.lat}</div>
      <div>Longitudine: ${p.lng}</div>
    `);
    markers.addLayer(marker);
  });

  // Aggiungi il gruppo alla mappa
  map.addLayer(markers);
}