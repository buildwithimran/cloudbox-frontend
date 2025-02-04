import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { UtilsService } from 'src/app/services/utils.service';
import { Folder } from '../../models/folder.model';
import { FolderService } from '../../services/folder.service';
import { FileService } from '../../services/file.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import Swal from "sweetalert2";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>
  folderForm!: FormGroup;
  folders: Folder[] = [];
  loading: Boolean = true;
  isSubmitted: Boolean = false;
  isDragOver: Boolean = false;
  progress: number = 0;  // Variable to track upload progress
  isUploading: boolean = false; // Variable to show/hide progress bar

  constructor(
    private fb: FormBuilder,
    private modal: NgbActiveModal,
    private utilsService: UtilsService,
    private folderService: FolderService,
    private fileService: FileService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.folderForm = this.fb.group({
      name: ['', Validators.required],
    });
    this.loadFolders();
  }

  loadFolders(): void {
    this.folderService.getFolders().subscribe((data) => {
      this.folders = data;
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      console.log('error', error);
    });
  }


  // Submit the form
  onSubmit() {
    this.isSubmitted = true;
    if (this.folderForm.valid) {
      this.folderService.createFolder(this.folderForm.value).subscribe((folder) => {
        this.loadFolders();
        this.isSubmitted = false;
        this.utilsService.closeAllModals();
        this.utilsService.message("Folder created successfully", "success", 1500);
      }, (error: any) => {
        this.isSubmitted = false;
        console.log('error', error);
        this.toastr.error(error?.error?.message);
      });
    }
  }

  // Delete a Loyalty Program
  deleteFolder(id: string) {
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
        this.folderService.deleteFolder(id).subscribe(
          () => {
            this.loadFolders();
            this.utilsService.message("Folder deleted successfully", "success", 1500);
          },
          (error: any) => {
            this.toastr.error(error?.error?.message);
          }
        );
      }
    });
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
  uploadFileToServer(file: File) {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.isUploading = true;
    this.progress = 0;

    this.fileService.uploadFile(formData, true).subscribe({
      next: (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            if (event.total) {
              this.progress = Math.round((event.loaded / event.total) * 100);
            }
            break;
          case HttpEventType.Response:
            this.isUploading = false;
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Uploaded successfully",
              showConfirmButton: true,
              timer: 4000,
            });
            this.loadFolders();
            break;
        }
      },
      error: (error) => {
        console.error('Upload failed:', error);
        this.isUploading = false;
      }
    });
  }

  // Close the modal
  cancel() {
    this.modal.dismiss();
  }

  // Open the modal
  openDirectoryPopup(context: any) {
    this.utilsService.openMDModal(context);
  }

  navigateToFiles(folderId: string) {
    this.router.navigate(['/directory', folderId]);
  }

}
