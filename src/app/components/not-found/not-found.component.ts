import { Component } from '@angular/core';
import { FileUploadService } from '../../services/file-upload.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  template: `<h1>404 - Page Not Found</h1>`,
  styles: [`h1 { color: red; text-align: center; }`]
})
export class NotFoundComponent {

  

}
