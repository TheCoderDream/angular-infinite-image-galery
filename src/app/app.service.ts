import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  ACCESS_KEY = '2J5p-V98wBnLNnbi0P5U_noLosW515GU8qoS7pvQd-Q';
  

  constructor(private http: HttpClient) {}

  getPhotos(page: number = 1, query?: string): Observable<any> {
    let apiUrl = 'https://api.unsplash.com/photos?';
    if (query?.trim())  apiUrl = `https://api.unsplash.com/search/photos?query=${query}`;
    apiUrl += `&page=${page}`;
    apiUrl += `&client_id=${this.ACCESS_KEY}`;

    return this.http.get(
      apiUrl
    ); 
  }

}