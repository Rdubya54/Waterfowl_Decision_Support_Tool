import {ElementRef, Injectable} from '@angular/core';
import { loadModules } from 'esri-loader';
import esri = __esri;

import { HttpClient } from '@angular/common/http';

@Injectable()
export class MapServiceexService {

  constructor(private http: HttpClient) { }

  private map;

  loadMap(basemap: String, center: Array<number>, zoom: Number, mapContainer: ElementRef) {

    const promise = new Promise((resolve, reject) => {
      loadModules([
        'esri/Map',
        'esri/views/MapView',
        'esri/layers/Layer'
      ])
        .then(([EsriMap, EsriMapView, Layer]) => {

          const map: esri.Map = new EsriMap({
            basemap: basemap
          });

          let mapView: esri.MapView = new EsriMapView({
            container: mapContainer.nativeElement,
            center: center,
            zoom: zoom,
            map: map
          });

          mapView.when(() => {
            // All the resources in the MapView and the map have loaded. Now execute additional processes
            resolve('true');
          }, err => {
            console.error(err);
            reject(err);
          });

          Layer.fromPortalItem({
            portalItem: { // autocasts as new PortalItem()
              id: "e9bfc0dcd15a41c18c79bd30bb6056cc"
            }
          }).then(addLayer)
          .catch(rejection);
     // Adds the layer to the map once it loads
     function addLayer(layer) {
      map.add(layer);
    }

    function rejection(error) {
      console.log("Layer failed to load: ", error);
    }

        })
        .catch(err => {
          console.error(err);
          reject(err);
        });
    });

    return promise;
    }


    gimmeJokes() {
      return this.http.get('https://api.chucknorris.io/jokes/random')
    }
}
