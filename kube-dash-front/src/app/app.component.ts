import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { TabsComponent } from './components/tabs/tabs.component';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { TabType } from './models/tabs.model';
@Component({
  selector: 'app-root',
  imports: [HeaderComponent, TabsComponent, DashboardLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  TabType = TabType;
}
