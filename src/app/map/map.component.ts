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
  public center!: google.maps.LatLngLiteral;
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
    
    this.mapService.marker.drawActiveMarkers(this.data)
  }

  async ngOnInit() {

  } 

}
