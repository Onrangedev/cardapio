import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-nutrition-dialog',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatButton,
  ],
  templateUrl: './nutrition-dialog.component.html',
  styleUrl: './nutrition-dialog.component.css'
})
export class NutritionDialogComponent {
  readonly dialogRef = inject(MatDialogRef<NutritionDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface DialogData {
  snackCalories: number;
  snackLactose: boolean;
  louchCalories: number;
  louchLactose: boolean;
}