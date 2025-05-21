import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DropdownComponent } from '../dropdown/dropdown.component'
import { CommonModule } from '@angular/common';

import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Nodes } from '../../models/nodes.model';
import { dropdownItem } from '../../models/dropDownItem.model';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SwitchResourceViewService } from '../../services/switch-resource-view.service';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { CLUSTER_RESOURCES } from '../../models/nodes.model'

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  icon: string | undefined;
}

@Component({
  selector: 'app-sidebar',
  imports: [MatSelectModule, MatFormFieldModule, DropdownComponent, MatTreeModule,
    MatButtonModule, MatIconModule, CommonModule, ScrollingModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  /*                                         Tree Setup                                        */
  selectedNode: any = 'Pods'; // To store the selected node
  // dropdown setup 
  contents: dropdownItem[] = [
    { value: 'Home', viewValue: 'Home' },
  ];
  //firstParentNode: any = null;

  private _transformer = (node: Nodes, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      icon: node.icon,
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  /*                                          Constructor and ngOn                                         */
  constructor(private sharedService: SwitchResourceViewService) {
    this.dataSource.data = CLUSTER_RESOURCES;
    this.treeControl.expand(this.treeControl.dataNodes[0]);
    this.selectedNode = this.treeControl.dataNodes.find(c => c.name == 'Pods');
  }

  ngOnInit() {
    // this.firstParentNode = this.dataSource.find(node => node.children?.length);
  }
  /*                                          Helper Functions                                         */

  hasChild = (_: number, node: FlatNode) => node.expandable;

  // This function will be called when a node is clicked
  onNodeClick(node: any): void {
    this.selectedNode = node; // Store the clicked node
    this.sharedService.sendData(this.selectedNode.name.toLowerCase()); // update table data
  }
  // get node left-padding
  getPadding(nodelevel: number): number {
    return Math.pow(4, nodelevel);
  }
}

