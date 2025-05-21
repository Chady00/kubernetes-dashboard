import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CurrentSessionService {
  // BehaviorSubject holds the current value and emits it to new subscribers
  private computedValueSubject = new BehaviorSubject<number>(0);

  // Observable to be subscribed by components
  computedValue$ = this.computedValueSubject.asObservable();

  // Method to update the computed value
  updateComputedValue(value: number): void {
    this.computedValueSubject.next(value);
  }
}

