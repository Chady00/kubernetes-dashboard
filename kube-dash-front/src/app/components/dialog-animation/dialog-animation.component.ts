import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/*                                        Dialog Component                                  */
@Component({
  selector: './dialog-animation-component.css',
  templateUrl: './dialog-animation.component.html',
  imports: [MatButtonModule, MatDialogClose, MatDialogTitle, MatDialogContent, MatDialogActions],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAnimationComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogAnimationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) { }
  onNoClick() {
    return this.dialogRef.close(false);
  }
  onYesClick() {
    return this.dialogRef.close(true);
  }

}