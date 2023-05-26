import { Injectable } from '@nestjs/common';
import * as NodeGeocoder from 'node-geocoder';

interface ICoordinates {
  latitude: number;
  longitude: number;
}
@Injectable()
export class GeocoderService {
  private geocoder = NodeGeocoder({
    provider: 'openstreetmap',
  });

  async reverse(coordinates: ICoordinates) {
    // Вызываем функцию для поиска города по заданным координатам
    return await this.geocoder
      .reverse({
        lat: coordinates.latitude,
        lon: coordinates.longitude,
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  geocode(address: string) {
    return this.geocoder
      .geocode(address)
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .catch((err) => {
        return err;
      });
  }

  getDistanceFromLatLonInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) {
    const deg2rad = (deg) => {
      return deg * (Math.PI / 180);
    };

    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km

    return d;
  }
}
