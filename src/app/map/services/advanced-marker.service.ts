import { Injectable } from '@angular/core';
import { Hotel } from '../interfaces/hotel.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AdvancedMarkerService {

  map: google.maps.Map | null;
  mapOptions: google.maps.MapOptions = {
    mapId: "4504f8b37365c3d0", // Si se activa se usa los estilos del Cloud
  };
  
  currentMarker: google.maps.marker.AdvancedMarkerElement | null = null;
  activeMarkers: google.maps.marker.AdvancedMarkerElement[] = [];

  constructor() { 
    this.map = null;
  }

  addMarker(location: google.maps.LatLng) {
    // Borrar marcador anterior.
    if (this.currentMarker) {
      this.currentMarker.map = null;
    }
    // Crea un nuevo marcador
    let marker = new google.maps.marker.AdvancedMarkerElement({
      position: location,
      map: this.map,
    });
    // Asignar marcador actual.
    this.currentMarker = marker;
  }

  drawMarker(location: google.maps.LatLng, content: HTMLElement | null = null): google.maps.marker.AdvancedMarkerElement {
    let marker = new google.maps.marker.AdvancedMarkerElement({
      content: content,
      position: location,
      map: this.map,
    });
    
    return marker;
  }

  cleanMarkers() {
    this.activeMarkers.forEach(marker => marker.map = null);
  }

  toggleHighlight(markerView:any, property: any=null) {
    // Remove all 'highlight' classes from the content
    const highlightedElements = document.querySelectorAll('.highlight');
    highlightedElements.forEach((element: Element) => {
      element.classList.remove('highlight');
    });

    if(this.currentMarker) {
      this.currentMarker.zIndex = 0;
    }

    // Reset the zIndex
    markerView.zIndex = null;
    if (markerView.content.classList.contains("highlight")) {
      markerView.content.classList.remove("highlight");
      markerView.zIndex = null;
    } else {
      markerView.content.classList.add("highlight");
      markerView.zIndex = 1;
    }

    this.currentMarker = markerView;
  }

  createContentElement(data: Hotel) {
    const content = document.createElement("div");
  
    content.classList.add("property");
    content.innerHTML = `
      <div class="icon">
          <i aria-hidden="true" class="fa fa-icon fa-hotel" title="${data.name}"></i>
          <span class="fa-sr-only">${data.name}</span>
      </div>
      <div class="details">
          <div class="text-sm font-bold border-b-2 border-b-gray-200 py-1">${data.name}</div>
          <div class="p-2">
            <div class="flex items-center gap-2 p-1 text-xs">
                <i aria-hidden="true" class="fa fa-location-dot fa-lg text-red-500"></i>
                <span>${data.address}</span>
            </div>
            <div class="flex items-center gap-2 p-1 text-xs">
                <i aria-hidden="true" class="fa fa-phone fa-lg text-blue-500"></i>
                <span>${data.phone}</span>
            </div>
            <div class="flex items-center gap-2 p-1 text-xs">
                <i aria-hidden="true" class="fa fa-envelope fa-lg text-amber-500"></i>
                <span>${data.email}</span>
            </div>
            <div class="flex items-center gap-2 p-1 text-xs">
                <i aria-hidden="true" class="fa fa-globe fa-lg text-gray-500"></i>
                <span>${data.website}</span>
            </div>
          </div>
      </div>
      `;
    return content;
  }
}
