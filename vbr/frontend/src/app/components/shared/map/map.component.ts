import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine'; // Required for routing

// Fix for Leaflet default markers
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

export interface MapLocation {
  lat: number;
  lng: number;
  title?: string;
  description?: string;
  type?: 'user' | 'mechanic' | 'selected';
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  @Input() center: MapLocation = { lat: 28.6139, lng: 77.2090 }; // Default: Delhi
  @Input() zoom: number = 13;
  @Input() height: string = '400px';
  @Input() markers: MapLocation[] = [];
  @Input() showCurrentLocation: boolean = true;
  @Input() clickable: boolean = false;
  @Input() drawRoute: boolean = false; // <-- property name is fine
  @Input() routeFrom?: MapLocation;
  @Input() routeTo?: MapLocation;

  @Output() mapClick = new EventEmitter<MapLocation>();
  @Output() markerClick = new EventEmitter<MapLocation>();
  @Output() locationFound = new EventEmitter<MapLocation>();

  private map?: L.Map;
  private markersLayer = L.layerGroup();
  private routeControl?: L.Routing.Control;
  private currentLocationMarker?: L.Marker;

  public hasMarkerType(type: string): boolean {
  return this.markers.some(m => m.type === type);
}

  constructor() {}

  ngOnInit(): void {
    this.initializeMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initializeMap(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [this.center.lat, this.center.lng],
      zoom: this.zoom,
      zoomControl: true,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.markersLayer.addTo(this.map);

    if (this.clickable) {
      this.map.on('click', (e: L.LeafletMouseEvent) => {
        const location: MapLocation = {
          lat: e.latlng.lat,
          lng: e.latlng.lng
        };
        this.mapClick.emit(location);
      });
    }

    if (this.showCurrentLocation) {
      this.getCurrentLocation();
    }

    this.renderMarkers();

    if (this.drawRoute && this.routeFrom && this.routeTo) {
      this.drawRouteOnMap();
    }
  }

  public getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: MapLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            title: 'Your Location',
            type: 'user'
          };
          this.addCurrentLocationMarker(location);
          this.locationFound.emit(location);
        },
        (error) => {
          console.error('Error getting current location:', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
      );
    }
  }

  private addCurrentLocationMarker(location: MapLocation): void {
    if (this.map) {
      const currentLocationIcon = L.divIcon({
        html: `
          <div class="current-location-marker">
            <div class="location-dot"></div>
            <div class="location-pulse"></div>
          </div>
        `,
        className: 'current-location-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      this.currentLocationMarker = L.marker([location.lat, location.lng], {
        icon: currentLocationIcon
      }).addTo(this.markersLayer);

      this.currentLocationMarker.bindPopup(`
        <div class="custom-popup current-location">
          <h4>${location.title || 'Your Location'}</h4>
          <p>Current position</p>
        </div>
      `);
    }
  }

  private renderMarkers(): void {
    if (!this.map) return;

    this.markersLayer.clearLayers();

    if (this.currentLocationMarker) {
      this.currentLocationMarker.addTo(this.markersLayer);
    }

    this.markers.forEach(marker => {
      this.addMarker(marker);
    });
  }

  private addMarker(location: MapLocation): void {
    if (!this.map) return;

    let icon: L.DivIcon;

    switch (location.type) {
      case 'mechanic':
        icon = L.divIcon({
          html: `<div class="mechanic-marker"><i class="material-icons">build</i></div>`,
          className: 'mechanic-marker-icon',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });
        break;
      case 'selected':
        icon = L.divIcon({
          html: `<div class="selected-marker"><i class="material-icons">location_on</i></div>`,
          className: 'selected-marker-icon',
          iconSize: [35, 35],
          iconAnchor: [17, 17]
        });
        break;
      default:
        icon = L.divIcon({
          html: `<div class="user-marker"><i class="material-icons">person</i></div>`,
          className: 'user-marker-icon',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });
    }

    const marker = L.marker([location.lat, location.lng], { icon }).addTo(this.markersLayer);

    if (location.title || location.description) {
      const popupClass = location.type ? `${location.type}-popup` : 'default-popup';
      marker.bindPopup(`
        <div class="custom-popup ${popupClass}">
          ${location.title ? `<h4>${location.title}</h4>` : ''}
          ${location.description ? `<p>${location.description}</p>` : ''}
        </div>
      `);
    }

    marker.on('click', () => {
      this.markerClick.emit(location);
    });
  }

  private drawRouteOnMap(): void {
    if (!this.map || !this.routeFrom || !this.routeTo) return;

    if (this.routeControl) {
      this.map.removeControl(this.routeControl);
    }

    this.routeControl = L.Routing.control({
      waypoints: [
        L.latLng(this.routeFrom.lat, this.routeFrom.lng),
        L.latLng(this.routeTo.lat, this.routeTo.lng)
      ],
      routeWhileDragging: false,
      createMarker: () => null,
      lineOptions: {
        styles: [{ color: '#667eea', weight: 4, opacity: 0.8 }]
      }
    } as any).addTo(this.map);
  }

  // ✅ Public methods
  public updateCenter(location: MapLocation): void {
    if (this.map) {
      this.map.setView([location.lat, location.lng], this.zoom);
    }
  }

  public updateMarkers(markers: MapLocation[]): void {
    this.markers = markers;
    this.renderMarkers();
  }

  public addMarkerToMap(location: MapLocation): void {
    this.markers.push(location);
    this.addMarker(location);
  }

  public clearMarkers(): void {
    this.markers = [];
    this.markersLayer.clearLayers();
    if (this.currentLocationMarker) {
      this.currentLocationMarker.addTo(this.markersLayer);
    }
  }

  public fitBounds(): void {
    if (this.map && this.markers.length > 0) {
      const group = L.featureGroup(this.markersLayer.getLayers() as L.Layer[]);

      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  public drawRouteBetweenPoints(from: MapLocation, to: MapLocation): void {
    this.routeFrom = from;
    this.routeTo = to;
    this.drawRoute = true;
    this.drawRouteOnMap();
  }

  public clearRoute(): void {
    if (this.routeControl && this.map) {
      this.map.removeControl(this.routeControl);
      this.routeControl = undefined;
    }
  }
}
