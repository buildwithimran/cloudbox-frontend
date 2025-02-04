import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Folder } from '../models/folder.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  private apiUrl: string = environment.baseurl;

  constructor(private http: HttpClient) { }

  // Get all folders
  getFolders(): Observable<Folder[]> {
    return this.http.get<Folder[]>(`${this.apiUrl}folder`);
  }

  // Get one folder
  getFolderById(folderId: string): Observable<Folder> {
    return this.http.get<Folder>(`${this.apiUrl}folder/${folderId}`);
  }

  // Create a new folder
  createFolder(folder: Folder): Observable<Folder> {
    return this.http.post<Folder>(`${this.apiUrl}folder`, folder);
  }

  // Delete folder by id
  deleteFolder(folderId: string) {
    return this.http.delete(`${this.apiUrl}folder/${folderId}`);
  }
}
