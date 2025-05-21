import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TerminalServices {

  constructor(private http: HttpClient) { }
  getClusterInfo(): Observable<string> {
    return this.http.get('http://localhost:8080/terminal/cluster-info', { responseType: 'text' });
  }
  sendCommand(command: string): Observable<string> {
    return this.http.get('http://localhost:8080/terminal/command?command=' + encodeURIComponent(command), {
      responseType: 'text'
    });
  }
}
