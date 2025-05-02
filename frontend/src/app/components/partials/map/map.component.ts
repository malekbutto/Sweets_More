import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
// import {
//   icon,
//   LatLng,
//   LatLngExpression,
//   LatLngTuple,
//   LeafletMouseEvent,
//   map,
//   Map,
//   marker,
//   Marker,
//   tileLayer,
// } from 'leaflet';
import * as L from 'leaflet';

import { LocationService } from 'src/app/services/location.service';
import { Order } from 'src/app/shared/models/Order';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
// export class MapComponent implements OnChanges {
export class MapComponent implements AfterViewInit {
  @Input()
  order!: Order;
  @Input()
  readonly = false;
  private readonly MARKER_ZOOM_LEVEL = 18;
  private readonly MARKER_ICON = L.icon({
    iconUrl:
      'https://res.cloudinary.com/foodmine/image/upload/v1638842791/map/marker_kbua9q.png',
    iconSize: [42, 42],
    iconAnchor: [21, 42],
  });
  private readonly DEFAULT_LATLNG: L.LatLngTuple = [13.75, 21.62];

  @ViewChild('map', { static: true })
  mapRef!: ElementRef;
  map!: L.Map;
  currentMarker!: L.Marker;

  @Output() locationSelected = new EventEmitter<{ lat: number; lng: number }>();

  // private map: any;

  constructor(private locationService: LocationService) {}

  // ngOnChanges(): void {
  ngAfterViewInit(): void {
    if (!this.order) return;

    // this.initMap();
    this.initializeMap();

    if (this.readonly && this.addressLatLng) {
      this.showLocationOnReadonlyMode();
    } else {
      this.map.invalidateSize();
    }
  }

  showLocationOnReadonlyMode() {
    const m = this.map;
    this.setMarker(this.addressLatLng);
    m.setView(this.addressLatLng, this.MARKER_ZOOM_LEVEL);

    m.dragging.disable();
    m.touchZoom.disable();
    m.doubleClickZoom.disable();
    m.scrollWheelZoom.disable();
    m.boxZoom.disable();
    m.keyboard.disable();
    m.off('click');
    m.tap?.disable();
    this.currentMarker.dragging?.disable();
  }

  initializeMap() {
    if (this.map) return;

    const container = this.mapRef.nativeElement;
    if (container.clientHeight === 0 || container.clientWidth === 0) {
      setTimeout(() => this.initializeMap(), 100); // Retry later
      return;
    }

    this.map = L.map(this.mapRef.nativeElement, {
      attributionControl: false,
    }).setView(this.DEFAULT_LATLNG, 3);

    L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.setMarker(e.latlng);
      console.log(e.latlng);
    });
  }

  findMyLocation() {
    this.locationService.getCurrentLocation().subscribe({
      next: (latlng) => {
        this.map.setView(latlng, this.MARKER_ZOOM_LEVEL);
        this.setMarker(latlng);
      },
    });
  }

  setMarker(latlng: L.LatLngExpression) {
    this.addressLatLng = latlng as L.LatLng;
    if (this.currentMarker) {
      this.currentMarker.setLatLng(latlng);
    } else {
      this.currentMarker = L.marker(latlng, {
        draggable: true,
        icon: this.MARKER_ICON,
      }).addTo(this.map);

      this.currentMarker.on('dragend', () => {
        const newLatLng = this.currentMarker.getLatLng();
        this.addressLatLng = newLatLng;
      });
    }
    this.emitLocation(); // <-- Emit when location is selected
  }

  emitLocation() {
    const { lat, lng } = this.addressLatLng;
    this.locationSelected.emit({ lat, lng });
  }

  set addressLatLng(latlng: L.LatLng) {
    if (!latlng.lat.toFixed) return;

    latlng.lat = parseFloat(latlng.lat.toFixed(8));
    latlng.lng = parseFloat(latlng.lng.toFixed(8));
    this.order.addressLatLng = latlng;
    console.log(this.order.addressLatLng);
  }

  get addressLatLng() {
    return this.order.addressLatLng!;
  }
}
