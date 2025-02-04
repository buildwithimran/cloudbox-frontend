import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { File } from '../models/file.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private apiUrl: string = environment.baseurl;

  constructor(private http: HttpClient) { }

  // Upload a file
  uploadFile(formData: FormData, trackProgress: boolean = false) {
    return this.http.post(`${this.apiUrl}file/upload`, formData, {
      reportProgress: trackProgress,
      observe: 'events',
    });
  }

  // Get all files in a folder
  getFilesInFolder(folderId: string): Observable<File[]> {
    return this.http.get<File[]>(`${this.apiUrl}file/${folderId}`);
  }

  // Delete file by id
  deleteFile(fileId: string) {
    return this.http.delete(`${this.apiUrl}file/${fileId}`);
  }

  // Service method to download the file
  downloadFile(fileId: string): Observable<Blob> {
    const downloadUrl = `${this.apiUrl}file/download/${fileId}`;

    return this.http.get(downloadUrl, { responseType: 'blob' });
  }
}
