import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LatLngLiteral } from 'leaflet';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient) {}

  // getCurrentLocation(): Observable<{ lat: number; lng: number }> {
  //   return new Observable((observer) => {
  //     if (!navigator.geolocation) {
  //       observer.error('Geolocation not available');
  //       return;
  //     }

  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         observer.next({
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         });
  //         observer.complete();
  //       },
  //       (error) => {
  //         observer.error(error);
  //       }
  //     );
  //   });
  // }

  getCurrentLocation(): Observable<LatLngLiteral> {
    return new Observable((observer) => {
      if (!navigator.geolocation) {
        observer.error('Geolocation not available');
      } else {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            observer.next({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
      }
    });
  }

  // Optional: Reverse geocoding if needed
  //   getAddressFromCoordinates(lat: number, lon: number) {
  //     const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
  //     const headers = {
  //       Accept: 'application/json',
  //       'User-Agent': 'Malek Butto (malekbutto@gmail.com)', // replace with real info
  //     };
  //     return this.http.get<any>(url, { headers });
  //   }
  // }

  getAddressFromCoordinates(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    const headers = {
      Accept: 'application/json',
      'User-Agent': 'Sweets & More (malekbutto@gmail.com)',
    };
    return this.http.get<any>(url, { headers });
  }
}
