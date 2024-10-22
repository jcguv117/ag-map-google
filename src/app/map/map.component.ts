import { Component, inject, OnInit } from '@angular/core';
import { GoogleMapsModule, MapAdvancedMarker } from '@angular/google-maps';
import { MapService } from './services/map.service';
import markersData from './data/data.json';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [ GoogleMapsModule, MapAdvancedMarker ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit{

  map!: google.maps.Map;
  public zoom: number = 10;
  public center: google.maps.LatLngLiteral = { lat: 19.432608, lng: -99.133209 };
  public mapOptions: google.maps.MapOptions;
  mapService = inject(MapService);
  
  data      = markersData;
  totalData = 100;

  constructor() {
    this.mapOptions = this.mapService.mapOptions;
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
        this.generateRandomData(this.totalData)
      })
  }

  async ngOnInit() {

  } 

  generateRandomData(quantity: number = 0) {
      for (let index = 0; index < quantity; index++) {
        const coord = this.mapService.generateRandomCoordinatesInPolygon()
        if(coord) {
          const googleLatLng = new google.maps.LatLng(coord.lat, coord.lng);
          const data = this.data[index];
          const marker = this.mapService.marker.drawMarker(googleLatLng, this.mapService.marker.createContentElement(data));
          
          marker.addListener("click", () => {
            this.mapService.marker.toggleHighlight(marker);
          });
        } 
      }
  }

}
