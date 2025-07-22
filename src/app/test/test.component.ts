import { Component } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-test',
  standalone: false,
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {

  excelData: any[][] = [];
  fileData: any[] = [];

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    
    if (target.files.length !== 1) {
      console.error('Cannot use multiple files');
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      // Lecture du fichier
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      // Récupération de la première feuille
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      // Conversion en tableau de tableaux pour l'affichage
      this.excelData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
      
      // Conversion en tableau d'objets pour le traitement
      this.fileData = XLSX.utils.sheet_to_json(ws);
      
      console.log('Fichier chargé avec succès');
    };
    
    reader.onerror = (error) => {
      console.error('Erreur de lecture du fichier:', error);
    };
    
    reader.readAsBinaryString(target.files[0]);
  }

  logFileData() {
    if (this.fileData.length === 0) {
      console.warn('Aucune donnée à exporter');
      return;
    }
    console.log('Données du fichier:', this.fileData);
    this.exportToExcelWithEmptyColumns(this.fileData);
  }

  exportToExcelWithEmptyColumns(data: any[]): void {
    if (!data || data.length === 0) {
      console.error('Aucune donnée valide pour l\'export');
      return;
    }

    // 1. Préparer les nouveaux en-têtes
    const originalHeaders = Object.keys(data[0]);
    const newHeaders: string[] = [];
    
    originalHeaders.forEach(header => {
      newHeaders.push(header);
      // Ajouter 3 colonnes vides
      newHeaders.push('', '', ''); // Colonnes sans nom
    });

    // 2. Préparer les données modifiées
    const newData = data.map(row => {
      const newRow: any = {};
      let colIndex = 0;
      
      originalHeaders.forEach(header => {
        // Colonne originale
        newRow[newHeaders[colIndex++]] = row[header];
        
        // 3 colonnes vides
        newRow[newHeaders[colIndex++]] = '';
        newRow[newHeaders[colIndex++]] = '';
        newRow[newHeaders[colIndex++]] = '';
      });
      
      return newRow;
    });

    // 3. Créer le fichier Excel
    try {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(newData, { header: newHeaders });
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Données');
      
      // 4. Exporter avec la date dans le nom de fichier
      const dateStr = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(workbook, `Export_${dateStr}.xlsx`);
      console.log('Export réussi');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    }
  }

  // Version alternative utilisant excelData (tableau de tableaux)
  exportExcelFromArray(): void {
    if (this.excelData.length === 0) {
      console.warn('Aucune donnée tableau à exporter');
      return;
    }

    // Ajouter 3 colonnes vides après chaque colonne
    const newData = this.excelData.map(row => {
      const newRow: any[] = [];
      row.forEach(cell => {
        newRow.push(cell);
        // Ajouter 3 cellules vides
        newRow.push('', '', '');
      });
      return newRow;
    });

    try {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(newData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Données');
      
      const dateStr = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(workbook, `Export_Array_${dateStr}.xlsx`);
      console.log('Export tableau réussi');
    } catch (error) {
      console.error('Erreur export tableau:', error);
    }
  }
}
