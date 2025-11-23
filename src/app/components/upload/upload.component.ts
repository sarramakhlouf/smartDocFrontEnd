import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../../services/file-upload.service';
import { StatsService } from '../../services/stats.service';
import { CommonModule } from '@angular/common';
import * as Papa from 'papaparse'; //// Pour parser CSV

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
  csvStats: any;

  constructor(
    private fileService: FileUploadService,
    private statsService: StatsService
  ) {}

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
          this.analyzeCsv(this.selectedFile!); // Analyse stats après upload
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

  // ------------------- Analyse statistique CSV -------------------
  analyzeCsv(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const csvData = reader.result as string;
      const parsed: any[] = Papa.parse(csvData, { header: true }).data;

      // Exemple : prendre la première colonne numérique trouvée
      const firstNumericCol = Object.keys(parsed[0] || {}).find(key =>
        !isNaN(parseFloat(parsed[0][key]))
      );

      if (!firstNumericCol) {
        alert("Aucune colonne numérique trouvée pour les statistiques");
        return;
      }

      const numbers = parsed
        .map(row => parseFloat(row[firstNumericCol]))
        .filter(n => !isNaN(n));

      const payload = {
        numbers: numbers.map(n => Number(n)) // convertit tous en nombre
      };

      this.statsService.getStatsFromNumbers(numbers).subscribe({
        next: res => this.csvStats = res,
        error: err => console.error(err)
      });
    };
    reader.readAsText(file);
  }
}
