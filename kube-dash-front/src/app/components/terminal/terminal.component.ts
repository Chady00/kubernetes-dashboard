import { AfterViewChecked, Component, computed, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';
import { Terminal, TerminalModule } from 'primeng/terminal';
import { TerminalService } from 'primeng/terminal';
import { TerminalServices } from '../../services/terminal.service';
import { CommonModule } from '@angular/common';
import { SwitchTabServiceService } from '../../services/switch-tab-service.service';
import { CurrentSessionService } from '../../services/current-session.service';
import { firstValueFrom } from 'rxjs';
import { TabType } from '../../models/tabs.model';

interface TerminalSession {
  responseType: string,
  history: string[],
  historyIndex: number,
  lastCommand: string,
  lastResponse: string,
  update: boolean
}
@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css'],
  imports: [TabsComponent, TerminalModule, CommonModule],
  providers: [
    TerminalService,
    SwitchTabServiceService
  ]
})
export class TerminalComponent implements AfterViewChecked, OnInit {
  TabType = TabType; // expose to html
  contents = ['terminal']
  clusterInfo!: string;   // prompt = clusterInfo
  sessions: TerminalSession[] = []  // All sessions are stored
  activeSession: number = 0;  // which session is currently active
  @ViewChildren('terminalRef') terminals!: QueryList<Terminal>;

  constructor(private apiService: TerminalServices,
    private terminalService: TerminalService, private currentSession: CurrentSessionService) {
    this.terminalService.commandHandler.subscribe(command => {
      this.sendCommand(command);

    })
  }
  ngOnInit() {
    this.currentSession.computedValue$.subscribe(value => {
      this.activeSession = value;
      this.updateLastCommand();
    });
    this.loadClusterInfo();
    this.createNewSession();
  }
  // on each change update last command to ensure it appears + scroll to bottom
  ngAfterViewChecked() {
    this.scrollTerminalToBottom();
  }
  loadClusterInfo() {
    this.apiService.getClusterInfo().subscribe({
      next: (data) => {
        this.clusterInfo = data;
      },
      error: (err) => {
        console.error('Error fetching cluster info', err);
      }
    });
  }
  // main-content selection menu press --> force command execution 
  executeCommand(command: string) {
    console.log(command);
    this.sendCommand(command, true);
  }

  onTabAdded(e: number) {
    this.createNewSession();
  }
  // create a new session
  createNewSession() {
    this.sessions.push({
      responseType: 'success',
      history: [],
      historyIndex: -1,
      lastResponse: '',
      lastCommand: '',
      update: false
    });
  }

  // send a command to terminal, receive response and display it
  async sendCommand(command: string, forced?: boolean) {
    const sessionIndex = this.activeSession;
    const session = this.sessions[sessionIndex];
    const terminal = this.terminals.get(sessionIndex); // Get the correct terminal

    if (!terminal) {
      console.warn('Terminal component not found');
      return;
    }

    try {
      // removed observable and added a promise
      const response = await firstValueFrom(this.apiService.sendCommand(command));
      console.log(response)
      // Only add new commands
      if (session.history[this.sessions.length - 1] !== command) {
        session.history.push(command);
      }
      // if it's a forced command 
      if (forced) {
        terminal.commands = [...terminal.commands, { text: command, response: response }]
      }
      session.historyIndex = session.history.length;
      session.lastResponse = response;
      session.lastCommand = command;
      session.update = true;

      this.terminalService.sendResponse(response);


      // fix bug 1 and 2
      this.updateLastCommand();
      this.scrollTerminalToBottom();
      this.forceFocusOnTerminal();

    } catch (err) {
      session.responseType = 'error';
      console.error('Error from API:', err);
    }
  }


  // force to update last command - fixed bug 2
  updateLastCommand() {
    // Check if terminals are available and active session index is valid
    if (!this.terminals || this.activeSession < 0 || this.activeSession >= this.sessions.length) {
      return;
    }
    const session = this.sessions[this.activeSession];
    const terminal = this.terminals.get(this.activeSession);

    // Ensure terminal exists and has a previous command to update
    if (!terminal ||
      !session.lastCommand ||
      !session.history.length ||
      !terminal.commands ||
      terminal.commands.length === 0
    ) {
      return;
    }


    // Safe update of last command in terminal
    const commands = terminal.commands[terminal.commands.length - 1]

    if (session.lastResponse != ' ' && session.lastCommand != ' ') {
      terminal.commands = [
        ...terminal.commands.slice(0, -1),
        { text: session.lastCommand, response: session.lastResponse }
      ];
    }
    else {
      terminal.commands[terminal.commands.length - 1].response = ''
    }

  }

  // handle session history : keyUp, keyDown
  onKeydown(event: KeyboardEvent) {
    const terminal = this.terminals.get(this.activeSession);
    if (!terminal) return;
    const session = this.sessions[this.activeSession];
    if (event.key === 'Enter') {
      if (!session.update) {
        const session = this.sessions[this.activeSession];
        session.lastResponse = ' ';
        session.lastCommand = ' ';
      }
      session.update = false;
    }
    if (event.key === 'ArrowUp') {
      if (session.historyIndex > 0) {
        session.historyIndex--;
        terminal.command = session.history[session.historyIndex];
      }
      event.preventDefault();
    }
    else if (event.key === 'ArrowDown') {
      if (session.historyIndex < session.history.length - 1) {
        session.historyIndex++;
        terminal.command = session.history[session.historyIndex];
      } else {
        session.historyIndex = session.history.length;
        terminal.command = '';
      }
      event.preventDefault();
    }
  }



  // Force focus on terminal - fixed bug 1
  forceFocusOnTerminal() {
    const activeIndex = this.activeSession;
    const inputElement = document.querySelector(`#terminal-window-${activeIndex} .p-terminal-prompt-value`) as HTMLInputElement | null;

    if (inputElement) {
      inputElement.focus();
      inputElement.click();
    } else {
      console.warn(`Could not find terminal input for session: ${activeIndex}`);
    }

  }
  // Force scroll to bottom
  scrollTerminalToBottom() {
    const terminalComponent = this.terminals.toArray()[this.activeSession];
    const terminalElement = terminalComponent.el.nativeElement as HTMLElement;


    if (!terminalElement) {
      console.warn(`Terminal element with ID ${this.activeSession} not found.`);
      return;
    }

    const terminalContainer = terminalElement.querySelector('.p-terminal');
    const commandList = terminalElement.querySelector('.p-terminal-command-list') as HTMLElement;

    if (terminalContainer) {
      terminalContainer.scrollTop = terminalContainer.scrollHeight;
    }
    if (commandList) {
      commandList.scrollTop = commandList.scrollHeight;
    } else {
      console.warn(`Command list not found inside terminal ${this.activeSession}`);
    }
  }
}