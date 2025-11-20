import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../../services/file-upload.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  selectedFile?: File;
  files: string[] = [];

  constructor(private fileService: FileUploadService) {}

  ngOnInit() {
    this.loadFiles();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  upload() {
    if (!this.selectedFile) {
      alert("Veuillez sélectionner un fichier");
      return;
    }

    const ext = this.selectedFile.name.split('.').pop()?.toLowerCase();

    if (ext === 'pdf') {
      this.fileService.uploadPDF(this.selectedFile).subscribe({
        next: (res) => {
          alert(res);
          this.loadFiles();
        },
        error: (err) => alert("Erreur lors de l'upload : " + err.message)
      });
    } else if (ext === 'csv') {
      this.fileService.uploadCSV(this.selectedFile).subscribe({
        next: (res) => {
          alert(res);
          this.loadFiles();
        },
        error: (err) => alert("Erreur lors de l'upload : " + err.message)
      });
    } else {
      alert("Seuls les fichiers PDF et CSV sont supportés");
    }
  }

  loadFiles() {
    this.fileService.listFiles().subscribe({
      next: (files) => this.files = files,
      error: (err) => console.error(err)
    });
  }

  downloadFile(filename: string) {
    this.fileService.downloadFile(filename).subscribe(blob => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    });
  }

  deleteFile(filename: string) {
    if (!confirm(`Voulez-vous vraiment supprimer le fichier "${filename}" ?`)) return;

    this.fileService.deleteFile(filename).subscribe({
      next: (res) => {
        alert(res);
        this.loadFiles(); // recharge la liste après suppression
      },
      error: (err) => alert("Erreur lors de la suppression : " + err.message)
    });
  }

}
