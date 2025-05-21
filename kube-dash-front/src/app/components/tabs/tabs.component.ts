import { Component, EventEmitter, Input, Output, computed, inject } from '@angular/core'
import { SwitchTabServiceService } from '../../services/switch-tab-service.service';
import { SharedSwitchTabService } from '../../injectors/shared-switch-tab.service';

import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CurrentSessionService } from '../../services/current-session.service';
import { TabType, TerminalEditorType } from '../../models/tabs.model';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [MatTabsModule, MatIconModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
  providers: [
    {
      provide: SwitchTabServiceService,
      useClass: SwitchTabServiceService
    }
  ]
})
export class TabsComponent {
  @Input({ required: true }) type: TabType = TabType.MAIN_CONTENT;
  @Input({ required: true }) contents!: string[];
  @Output() tabAdded = new EventEmitter<number>();
  // expose tab to html
  TabType = TabType;
  terminalEditorType: TerminalEditorType = 'terminal';
  constructor(
    private localTabService: SwitchTabServiceService,
    private sharedTabService: SharedSwitchTabService,
    private currentSession: CurrentSessionService
  ) { }

  private get tab(): any {
    return this.type === TabType.MAIN_CONTENT ? this.sharedTabService : this.localTabService;
  }
  activeTab = computed(() => this.tab.activeTabIndex());

  addTab(): void {
    this.contents.push(this.contents[0] + ' (' + (this.contents.length + 1) + ')');
    this.tab.setTab(this.contents.length - 1);
    this.tab.incrementTabs();
    this.tabAdded.emit(1);
  }

  onTabChanged(event: MatTabChangeEvent): void {
    this.tab.setTab(event.index);
    if (this.type === TabType.TERMINAL_EDITOR) {
      this.currentSession.updateComputedValue(this.activeTab())
    }
  }
  getIconForTab(): string {
    switch (this.type) {
      case TabType.MAIN_CONTENT:
        return 'rocket_launch'
      case TabType.TERMINAL_EDITOR:
        {
          if (this.terminalEditorType == 'terminal') {
            return 'terminal_icon'
          }
          else
            return 'editor_icon'
        }
      default:
        console.log(this.type)
        return ''
    }
  }
}
