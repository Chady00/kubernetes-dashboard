// switch-tab-service.service.ts
import { Injectable, Signal, signal } from '@angular/core';

@Injectable()
export class SwitchTabServiceService {
  activeTabIndex = signal(0);
  numTabs = 1;

  incrementTabs(): void {
    this.numTabs++;
  }

  setTab(n: number) {
    this.activeTabIndex.set(n);
  }

  nextTab() {
    if (this.numTabs > this.activeTabIndex() + 1) {
      this.activeTabIndex.set(this.activeTabIndex() + 1);
    }
  }

  prevTab() {
    if (this.activeTabIndex() > 0)
      this.activeTabIndex.set(this.activeTabIndex() - 1);
  }

  getTabIndex(): number {
    return this.activeTabIndex();
  }

  isLastTab(): boolean {
    return this.activeTabIndex() === this.numTabs - 1;
  }
  getNumTabs(): number {
    return this.numTabs;
  }

  constructor() { }
}