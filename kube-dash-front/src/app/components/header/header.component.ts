import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { SwitchTabServiceService } from '../../services/switch-tab-service.service';
import { SharedSwitchTabService } from '../../injectors/shared-switch-tab.service';
@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatIconModule, MatBadgeModule, MatButtonModule],
  styleUrl: './header.component.css',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  hasNotification: boolean = true;

  notificationOff(): void {
    this.hasNotification = false;
  }
  constructor(private tab: SharedSwitchTabService) { }

  nextTab() {
    this.tab.nextTab();
  }
  prevTab() {
    this.tab.prevTab();
  }
  currentTab(): number {
    return this.tab.getTabIndex();
  }
  isLastTab(): boolean {
    return this.tab.isLastTab();
  }
}
