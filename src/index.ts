import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./index.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { Places } from "./types";

const map = L.map("map").setView([0, 0], 2);

L.tileLayer("https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png", {
  maxZoom: 20,
}).addTo(map);

const markers = L.markerClusterGroup({
  iconCreateFunction: function(cluster) {
    // Recupera tutti i marker del cluster
    const markers = cluster.getAllChildMarkers();

    // Somma dei count
    const totalCount = markers.reduce((sum, m: any) => {
      // m.options.icon.options.html contiene il tuo div con count
      // però conviene allegare il dato direttamente al marker
      console.log(m);
      return sum + (m.options.customCount || 0);
    }, 0);

    return L.divIcon({
      html: `<div class="marker-group">${totalCount}</div>`,
      className: 'marker-cluster-custom',
      iconSize: L.point(40, 40, true)
    });
  }
});

const myMarker = L.divIcon({className: 'marker'});

function setPlaces(places: Places[]) {
  if (places && places.length > 0) {
    // Aggiungi marker al gruppo
    places.forEach((p) => {
      const marker = L.marker([p.lat, p.lng], {
        icon: L.divIcon({
          html: `<div class="marker-group">${p.count}</div>`,
          className: 'marker-cluster-custom',
        })
      })
      .bindPopup(`
        <div style="font-weight:bold;color:red;"><a style="color: inherit; text-decoration: none;" href="${p.link}${p.label.id}" target="_blank">${p.count}, ${p.label.name}</a></div>
        <div>Latitudine: ${p.lat}</div>
        <div>Longitudine: ${p.lng}</div>
      `);
      // AGGIUNGI QUESTA RIGA
      (marker as any).options.customCount = p.count;
      markers.addLayer(marker);
    });


    // Aggiungi il gruppo alla mappa
    map.addLayer(markers);
  }
}

window.setPlaces = setPlaces;