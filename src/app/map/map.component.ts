import { Component, inject, OnInit } from '@angular/core';
import { GoogleMapsModule, MapAdvancedMarker } from '@angular/google-maps';
import { MapService } from './services/map.service';
import propertiesData from './data/properties.json';
import markersData from './data/companies.json';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [ GoogleMapsModule, MapAdvancedMarker ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit{

  public zoom: number = 10;
  public center: google.maps.LatLngLiteral = { lat: 19.432608, lng: -99.133209 };
  public mapOptions: google.maps.MapOptions;
  
  map!: google.maps.Map;
  data = markersData;

  mapService = inject(MapService);

  constructor() {
    this.mapOptions = this.mapService.mapOptions;
  }

  initMap(map: google.maps.Map) {
    this.map = map;
    this.mapService.setMap(map);
    // this.mapService.onClickMap();
    
    // this.mapService.marker.drawActiveMarkers(this.data)

    this.mapService.loadGeoJsonPromise('./geodata/geodata.geojson')
      .then((geoData: google.maps.Data) => {
        // Cambiar estilos del mapa a invisible. 
        geoData.setStyle({
          strokeOpacity: 0,
          fillOpacity: 0,
        });
        // Generar marcadores aleatorios dentro de la geometria del geojson.
        this.generateRandomData(20)
      })
  }

  async ngOnInit() {

  } 

  generateRandomData(quantity: number = 0) {
      for (let index = 0; index < quantity; index++) {
        const coord = this.mapService.generateRandomCoordinatesInPolygon()
        if(coord) {
          const googleLatLng = new google.maps.LatLng(coord.lat, coord.lng);
          const data = {
            company: "Example Inc.",
            phone: "+00000000",
            streetAddress: "353",
            website: "example.com"
          }
          const marker = this.mapService.marker.drawMarker(googleLatLng, this.mapService.marker.buildCompaniesContent(data));
          
          marker.addListener("click", () => {
            this.mapService.marker.toggleHighlight(marker);
          });
        } 
      }
  }

}
