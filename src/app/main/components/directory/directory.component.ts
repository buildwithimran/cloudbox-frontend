import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FolderService } from '../../services/folder.service';
import { FileService } from '../../services/file.service';
import { Folder } from '../../models/folder.model';
import { File } from '../../models/file.model';
import Swal from "sweetalert2";
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss']
})

export class DirectoryComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>
  folderId: string = '';
  folder!: Folder;
  files: File[] = [];

  progress: number = 0;
  isUploading: boolean = false;
  isDragOver: Boolean = false;


  constructor(
    private route: ActivatedRoute,
    private folderService: FolderService,
    private fileService: FileService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.folderId = this.route.snapshot.params['directoryId'];
    this.loadFiles();
  }

  loadFiles() {
    this.folderService.getFolderById(this.folderId).subscribe({
      next: (data: Folder) => {
        this.folder = data;
      },
      error: (error) => console.error("Error fetching files:", error)
    });
    this.fileService.getFilesInFolder(this.folderId).subscribe({
      next: (data: File[]) => {
        this.files = data;
      },
      error: (error) => console.error("Error fetching files:", error)
    });
  }

  // Delete a Loyalty Program
  deleteFile(fileId: string) {
    Swal.fire({
      title: "Confirmation",
      text: "Are you sure you want to delete this folder?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#3c4041",
      cancelButtonColor: "#abb9c4",
    }).then((result) => {
      if (result.isConfirmed) {
        this.fileService.deleteFile(fileId).subscribe({
          next: () => this.loadFiles(),
          error: (error) => console.error("Delete failed:", error)
        });
      }
    });
  }

  // Method to call the download service
  downloadFile(file: File): void {
    this.fileService.downloadFile(file._id).subscribe(
      (response) => {
        // File downloaded successfully
        const blob = new Blob([response], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = file.name;
        link.click();
      },
      (error) => {
        // Handle errors if any
        console.error('Error downloading file:', error);
      }
    );
  }

  // Handle click on Upload button
  triggerFileInput() {
    this.fileInput.nativeElement.click(); // Open file dialog
  }

  // Handle manual file selection
  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.uploadFiles(input.files);
    }
  }

  // Handle Drag Over
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  // Handle Drag Leave
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  // Handle Drop event
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.uploadFiles(event.dataTransfer.files);
    }
  }

  // Process uploaded files
  uploadFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Call API to upload
      this.uploadFileToServer(file);
    }
  }

  // Upload File to Server with Progress Bar
  uploadFileToServer(file: any) {
    if (!file) return;

    const formData = new FormData();
    if (!file) return;

    formData.append('file', file);
    formData.append('folderId', this.folderId);

    this.isUploading = true; // Show progress bar
    this.progress = 0; // Reset progress

    this.fileService.uploadFile(formData, true).subscribe({
      next: (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            if (event.total) {
              this.progress = Math.round((event.loaded / event.total) * 100);
            }
            break;
          case HttpEventType.Response:
            this.isUploading = false; // Hide progress bar when done
            this.loadFiles();
            break;
        }
      },
      error: (error) => {
        console.error("Upload failed:", error);
        this.isUploading = false; // Hide progress on error
      }
    });
  }

}
