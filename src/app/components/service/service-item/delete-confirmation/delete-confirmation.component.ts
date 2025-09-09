import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrl: './delete-confirmation.component.scss',
  standalone: false
})
export class DeleteConfirmationComponent {
  private dialogRef: MatDialogRef<DeleteConfirmationComponent> = inject(MatDialogRef<DeleteConfirmationComponent>);

  cancel(): void {
    this.dialogRef.close(false);
  }

  delete(): void {
    this.dialogRef.close(true);
  }
}
