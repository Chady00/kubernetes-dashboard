import { Component, EventEmitter, Input, model, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { dropdownItem } from '../../models/dropDownItem.model';



@Component({
  selector: 'app-dropdown',
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent {
  @Input() width: string = '95%';
  @Input() contents!: dropdownItem[];
  @Input() placeholder!: string;
  checked = model(false);
  items = new FormControl<dropdownItem[]>([], { nonNullable: true });
  @Output() selectedChange = new EventEmitter<string[]>();

  ngOnInit() {
    // Select all contents by default
    this.items.setValue([this.contents[0]]);

    // Emit the default selected values
    const itemsList: string[] = this.contents.map(a => a.value);
    this.selectedChange.emit(itemsList);
    this.items.valueChanges.subscribe(this.onSelectionChange.bind(this));  // subscribe to changes later on
  }

  onSelectionChange(selected: dropdownItem[]) {
    const itemsList: string[] = selected.map(a => a.value);
    this.selectedChange.emit(itemsList);
  }
}
