import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { forkJoin, map, Observable } from 'rxjs';


export type RatesMap = {
  [key: string]: any
}

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  constructor(private http: HttpClient) {}

  getRates(): Observable<RatesMap> {
    return forkJoin([
     this.http.get<any>(`${environment.api}/uah.json`),
     this.http.get<any>(`${environment.api}/usd.json`),
     this.http.get<any>(`${environment.api}/eur.json`)
    ]).pipe(
     map((cur) => {
      const objectRateMap: RatesMap = {} as RatesMap
      cur.forEach(rate => {
       if (rate.eur) {
        objectRateMap['eur'] = rate.eur;
       }
       if (rate.usd) {
        objectRateMap['usd'] = rate.usd;
       }
       if (rate.uah) {
        objectRateMap['uah'] = rate.uah;
       }
      });

      return objectRateMap;

     })
    );
   }
}
