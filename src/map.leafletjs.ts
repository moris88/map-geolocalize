import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { Places } from "./types";

const map = L.map("map", {
  zoomControl: false,
  zoomSnap: 0.5,   // permette zoom frazionari
  zoomDelta: 0.5,  // riduce incremento/decremento di zoom
  minZoom: 2,
  maxZoom: 16,
  zoom: 6,
  scrollWheelZoom: true,
  wheelPxPerZoomLevel: 120,
  wheelDebounceTime: 100,
  zoomAnimation: true,
  fadeAnimation: true,
  inertia: true,
  inertiaDeceleration: 3000,
  inertiaMaxSpeed: 1500,
}).setView([0, 0], 3);

// aggiungo uno zoom control in basso a destra
L.control.zoom({ position: "bottomright" }).addTo(map);

// attribution in basso a destra
map.attributionControl.setPosition("bottomright");

L.tileLayer(
  "https://cartodb-basemaps-a.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}{r}.png",
  { noWrap: false }
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
    });

    const popup = L.popup({
      closeButton: false,
      autoClose: false,
      closeOnClick: false,
      className: "custom-popup"
    }).setContent(`
      <div style="font-weight:bold;color:#AE0B24;">
        <a style="color: inherit; text-decoration: none;" href="https://alumni.unitn.it/directory/alumni?al_loc%5B%5D=${p.id}" target="_blank">
          ${p.count}, ${p.name}
        </a>
      </div>
      <div>Latitudine: ${p.lat}</div>
      <div>Longitudine: ${p.lng}</div>
    `);

    // mostra il popup al hover
    marker.on("mouseover", () => marker.bindPopup(popup).openPopup());
    // chiudi il popup quando esce il mouse
    marker.on("mouseout", () => marker.closePopup());
    // gestisce il click sul marker per aprire il link
    marker.on("click", (e) => {
      const content = e.target.getPopup()?.getContent();
      let link: string | undefined;
      if (typeof content === "string") {
        const m = /href="([^"]+)"/.exec(content);
        link = m?.[1];
      } else if (content instanceof HTMLElement) {
        const a = content.querySelector("a");
        link = a?.getAttribute("href") ?? undefined;
      }
      if (link) window.open(link, "_blank");
    });

    (marker as any).options.customCount = p.count;
    markers.addLayer(marker);
  });

  map.addLayer(markers);
}

window.setPlaces = setPlaces;
