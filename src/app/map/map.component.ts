import { Component, inject, OnInit, signal } from '@angular/core';
import { GoogleMapsModule, MapAdvancedMarker } from '@angular/google-maps';
import { MapService } from './services/map.service';
import markersData from './data/data.json';
import { MapPanelControlComponent } from './components/map-panel-control/map-panel-control.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule, MapAdvancedMarker, MapPanelControlComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit{

  public map: google.maps.Map | null = null;
  public mapOptions: google.maps.MapOptions;
  public zoom;
  public center;

  mapService = inject(MapService);
  mapMarker;
  
  data      = markersData;
  totalData = signal(50);

  constructor() {
    this.zoom = this.mapService.zoom;
    this.center = this.mapService.center;
    this.mapOptions = this.mapService.mapOptions;
    this.mapMarker = this.mapService.marker;
  }

  initMap(map: google.maps.Map) {
    this.map = map;
    this.mapService.setMap(map);
    // this.mapService.onClickMap();

    this.mapService.loadGeoJsonPromise('./geodata/geodata.geojson')
      .then((geoData: google.maps.Data) => {
        // Cambiar estilos del mapa a invisible. 
        geoData.setStyle({
          strokeOpacity: 0,
          fillOpacity: 0,
        });
        // Generar marcadores aleatorios dentro de la geometria del geojson.
        this.generateRandomData(this.totalData())
      })
  }

  async ngOnInit() {

  } 

  updRandomData(value: any) {
    this.mapService.marker.cleanMarkers();
    this.generateRandomData(value)
  }

  updPolygonStyle(value: any) {
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
    if(value) {
      this.map?.data.setStyle({
        strokeWeight: 2,
        strokeColor: primaryColor,
        fillOpacity: 0.1,
      });
    } else {
      this.map?.data.setStyle({
        strokeOpacity: 0,
        fillOpacity: 0,
      });
    }
  }

  generateRandomData(quantity: number = 0) {
      for (let index = 0; index < quantity; index++) {
        const coord = this.mapService.generateRandomCoordinatesInPolygon()
        if(coord) {
          const data = this.data[index];
          const googleLatLng = new google.maps.LatLng(coord.lat, coord.lng);
          const marker = this.mapMarker.drawMarker(googleLatLng, this.mapMarker.createContentElement(data));
          
          marker.addListener("click", () => {
            this.mapMarker.toggleHighlight(marker);
          });

          this.mapMarker.activeMarkers.push(marker);
        } 
      }
  }

}
