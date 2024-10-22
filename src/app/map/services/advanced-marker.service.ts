import { Injectable } from '@angular/core';
import { Companie } from '../interfaces/companies.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AdvancedMarkerService {

  map!: google.maps.Map;
  currentMarker!: google.maps.marker.AdvancedMarkerElement;

  public mapOptions: google.maps.MapOptions = {
    mapId: "4504f8b37365c3d0", // Si se activa se usa los estilos del Cloud
  };

  constructor() { }

  drawActiveMarkers(data:any) {
    for (const property of data) {

      const AdvancedMarkerElement = new google.maps.marker.AdvancedMarkerElement({
        map: this.map,
        content: this.buildCompaniesContent(property),
        // position: property.position,
        position: {lat:property.latitude, lng: property.longitude},
        title: property.description,
      });

      AdvancedMarkerElement.addListener("click", () => {
        this.toggleHighlight(AdvancedMarkerElement, property);
      });
    }
  }

  addMarker(location: google.maps.LatLng) {
    
    // Borrar marcador anterior.
    if (this.currentMarker) {
      this.currentMarker.map = null;
    }

    const markerContent = document.createElement('div');
    markerContent.className = 'custom-marker';
    markerContent.innerHTML = `
      <h2 style="background-color: white; border-radius: 15px; padding: 10px;">¡Hola desde mi marcador!</h2>
      <p class="p-2 bg-white text-xl rounded-md mt-2">Este es un contenido personalizado.</p>
    `;

    // Crea un nuevo marcador
    let marker = new google.maps.marker.AdvancedMarkerElement({
        content: markerContent,
      position: location,
      map: this.map,
    });

    // Asignar marcador actual.
    this.currentMarker = marker;
  }

  toggleHighlight(markerView:any, property: any) {
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


  buildContent(property: any) {
    const content = document.createElement("div");
  
    content.classList.add("property");
    content.innerHTML = `
      <div class="icon">
          <i aria-hidden="true" class="fa fa-icon fa-${property.type}" title="${property.type}"></i>
          <span class="fa-sr-only">${property.type}</span>
      </div>
      <div class="details">
          <div class="price">${property.price}</div>
          <div class="address">${property.address}</div>
          <div class="features">
          <div>
              <i aria-hidden="true" class="fa fa-bed fa-lg bed" title="bedroom"></i>
              <span class="fa-sr-only">bedroom</span>
              <span>${property.bed}</span>
          </div>
          <div>
              <i aria-hidden="true" class="fa fa-bath fa-lg bath" title="bathroom"></i>
              <span class="fa-sr-only">bathroom</span>
              <span>${property.bath}</span>
          </div>
          <div>
              <i aria-hidden="true" class="fa fa-ruler fa-lg size" title="size"></i>
              <span class="fa-sr-only">size</span>
              <span>${property.size} ft<sup>2</sup></span>
          </div>
          </div>
      </div>
      `;
    return content;
  }

  buildCompaniesContent(data: Companie) {
    const content = document.createElement("div");
  
    content.classList.add("property");
    content.innerHTML = `
      <div class="icon">
          <i aria-hidden="true" class="fa fa-icon fa-hotel" title="${data.company}"></i>
          <span class="fa-sr-only">${data.company}</span>
      </div>
      <div class="details">
          <div class="text-sm font-bold border-b-2 border-b-gray-200 py-1">${data.company}</div>
          <div class="p-2">
            <div class="flex items-center gap-2 p-1 text-xs">
                <i aria-hidden="true" class="fa fa-location-dot fa-lg text-red-500"></i>
                <span>${data.streetAddress}</span>
            </div>
            <div class="flex items-center gap-2 p-1 text-xs">
                <i aria-hidden="true" class="fa fa-phone fa-lg text-blue-500"></i>
                <span>${data.phone}</span>
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
