import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-delete-confirmation',
    templateUrl: './delete-confirmation.component.html',
    styleUrl: './delete-confirmation.component.scss',
    standalone: false
})
export class DeleteConfirmationComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteConfirmationComponent>
  ) { }

  cancel() {
    this.dialogRef.close(false);
  }

  delete() {
    this.dialogRef.close(true);
  }
}
