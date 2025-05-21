import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SwitchResourceViewService {

  constructor() { }
  private dataSubject = new BehaviorSubject<any>({ name: 'Pods' });
  data$ = this.dataSubject.asObservable();

  sendData(data: any) {
    this.dataSubject.next(data);
  }
}
