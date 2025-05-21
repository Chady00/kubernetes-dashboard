import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  api = 'http://localhost:8080/resources/'; // for internal testing before deployment
  // inject http
  constructor(private http: HttpClient) { }
  getData(api: String): Observable<any> {
    return this.http.get(this.api + api);
  }
}
