import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Places } from "./types";

document.addEventListener("DOMContentLoaded", () => {
  // ----------------------
  // 1️⃣ Aggiungi la licenza
  // ----------------------
  // am5.addLicense("CH-LIC-XXXX-XXXX-XXXX-XXXX");

  // ----------------------
  // 2️⃣ Evita duplicazioni del root
  // ----------------------
  if (am5.registry.rootElements.length > 0) {
    am5.registry.rootElements.forEach(r => r.dispose());
  }

  const root = am5.Root.new("chartdiv");
  root.setThemes([am5themes_Animated.new(root)]);

  // ----------------------
  // 3️⃣ Crea la mappa
  // ----------------------
  const chart = root.container.children.push(
    am5map.MapChart.new(root, {
      panX: "rotateX",
      panY: "translateY",
      projection: am5map.geoMercator(),
      homeGeoPoint: { latitude: 40, longitude: 0 },
      homeZoomLevel: 1.5,
    })
  );
  chart.set("zoomControl", am5map.ZoomControl.new(root, {}));

  // ----------------------
  // 4️⃣ Serie dei paesi
  // ----------------------
  const polygonSeries = chart.series.push(
    am5map.MapPolygonSeries.new(root, {
      geoJSON: am5geodata_worldLow,
      exclude: ["AQ"],
    })
  );

  polygonSeries.mapPolygons.template.setAll({
    interactive: true,
    fill: am5.color(0xdddddd),
    stroke: am5.color(0xffffff),
  });

  // ----------------------
  // 5️⃣ Serie dei marker con clustering
  // ----------------------
  const bubbleSeries = chart.series.push(
    am5map.ClusteredPointSeries.new(root, {
      latitudeField: "latitude",
      longitudeField: "longitude",
      valueField: "value",
      minDistance: 30, // distanza in pixel per aggregare
      scatterDistance: 10,
      scatterRadius: 10,
      calculateAggregates: true,
    })
  );

  // Template dei singoli marker
  bubbleSeries.bullets.push(() => {
    const container = am5.Container.new(root, {});

    let circle = am5.Circle.new(root, {
        radius: 10,
        fill: am5.color("#AE0B24"),
        fillOpacity: 0.5,
        tooltipText: "{name}: {value}",
      })

    circle.events.on("click", function(ev: any) {
      const id = ev.target.dataItem.dataContext.id;
      window.location.href = `https://alumni.unitn.it/directory/alumni?al_loc%5B%5D=${id}`;
    });

    let label = am5.Label.new(root, {
        centerX: am5.p50,
        centerY: am5.p50,
        text: "{value}",
        populateText: true,
        fill: am5.color(0xffffff),
        fontSize: 12,
      });

    container.children.pushAll([
      circle, label
    ]);

    const bullet = am5.Bullet.new(root, { sprite: container });

    return bullet;
  });

  // Template dei cluster
  bubbleSeries.set("clusteredBullet", (root) => {
    const container = am5.Container.new(root, {
      cursorOverStyle:"pointer",
    });

    let circle = am5.Circle.new(root, {
      radius: 15,
      fill: am5.color("#AE0B24"),
      fillOpacity: 0.7,
      tooltipText: "{value} markers",
    });

    let label = am5.Label.new(root, {
      centerX: am5.p50,
      centerY: am5.p50,
      text: "{value}", // mostra il numero totale dei punti nel cluster
      populateText: true,
      fill: am5.color(0xffffff),
      fontSize: 12,
    });

    container.children.pushAll([
      circle, label
    ]);

    container.events.on("click", function(e) {
      bubbleSeries.zoomToCluster(e.target.dataItem!);
    });

    return am5.Bullet.new(root, { sprite: container });
  });

  bubbleSeries.adapters.add("calculateAggregates", function (bullet, target) {
    console.log("adapter called", target);

    // calcolcare il totale dei count dei punti nel cluster
    target.clusteredDataItems.forEach((dataItem) => {
      const children = dataItem.get("children");
      if (children && children.length > 0) {
        let total = 0;
        children.forEach((childItem: any) => {
          console.log("child item:", childItem);
          const count = childItem.dataContext.count || 0;
          console.log("child count:", count);
          total += count;
        });
        // setta il valore totale nel dataContext del cluster
        const cluster = dataItem.get("bullet");
        if (cluster) {
          // aggiorna il testo dell'etichetta del cluster
          
        }          
      }
    });


    return bullet;
  });

  // ----------------------
  // 6️⃣ Funzione per settare i marker
  // ----------------------
  function setPlacesAmCharts(places: Places[]) {
    if (!root || !chart || !bubbleSeries || !places?.length) {
      console.log("No data for AmCharts");
      return;
    }

    const data = places.map((item) => ({
      id: item.id,
      latitude: item.lat,
      longitude: item.lng,
      name: item.name,
      value: item.count,
      count: item.count,
    }));

    bubbleSeries.data.setAll(data);
  }

  window.setPlacesAmCharts = setPlacesAmCharts;
});
