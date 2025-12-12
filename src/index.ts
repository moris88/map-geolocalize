import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { Places } from "./types";

import "./index.scss";
import "./map.scss";

const map = L.map("map", {
  zoomControl: false,
  zoomSnap: 0.5,   // permette zoom frazionari
  zoomDelta: 0.5,  // riduce incremento/decremento di zoom
}).setView([0, 0], 2);

// aggiungo uno zoom control in basso a destra
L.control.zoom({ position: "bottomright" }).addTo(map);

// attribution in basso a destra
map.attributionControl.setPosition("bottomright");

L.tileLayer(
  "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png",
  { maxZoom: 20 }
).addTo(map);

const markers = L.markerClusterGroup({
  iconCreateFunction(cluster) {
    const total = cluster
      .getAllChildMarkers()
      .reduce((s, m: any) => s + (m.options.customCount || 0), 0);

    let cfg;
    if (total < 10) {
      cfg = { cls: "marker-tiny", size: 30 };
    } else if (total < 50) {
      cfg = { cls: "marker-small", size: 30 };
    } else if (total < 200) {
      cfg = { cls: "marker-medium", size: 35 };
    } else if (total < 500) {
      cfg = { cls: "marker-large", size: 40 };
    } else {
      cfg = { cls: "marker-giant", size: 45 };
    }

    return L.divIcon({
      html: `<div class="marker-group ${cfg.cls}">${total}</div>`,
      className: "marker-cluster-custom",
      iconSize: L.point(cfg.size, cfg.size, true),
    });
  },
});

function setPlaces(places: Places[]) {
  if (!places?.length) return;

  places.forEach((p) => {
    const marker = L.marker([p.lat, p.lng], {
      icon: L.divIcon({
        html: `<div class="marker-group marker-default">${p.count}</div>`,
        className: "marker-cluster-custom",
      }),
    }).bindPopup(`
      <div style="font-weight:bold;color:#AE0B24;">
        <a style="color: inherit; text-decoration: none;" href="https://alumni.unitn.it/directory/alumni?al_loc%5B%5D=${p.id}" target="_blank">
          ${p.count}, ${p.name}
        </a>
      </div>
      <div>Latitudine: ${p.lat}</div>
      <div>Longitudine: ${p.lng}</div>
    `);

    (marker as any).options.customCount = p.count;
    markers.addLayer(marker);
  });

  map.addLayer(markers);
}

window.setPlaces = setPlaces;
