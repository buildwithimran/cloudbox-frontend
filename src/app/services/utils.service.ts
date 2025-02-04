import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private modalService: NgbModal
  ) { }


  // Close All Modals
  closeAllModals() {
    this.modalService.dismissAll();
  }

  // Open Medium size modal
  openMDModal(content: any) {
    return this.modalService.open(content, {
      size: "md",
      centered: true,
      keyboard: false,
      backdrop: "static",
    });
  }

  // Open Large size modal
  openLGModal(content: any) {
    this.modalService.open(content, {
      size: "lg",
      centered: true,
      keyboard: false,
      backdrop: "static",
    });
  }


  message(title: string, status: string, time: number) {
    if (status == "error") {
      Swal.fire({
        position: "center",
        icon: "error",
        title: title,
        showConfirmButton: true,
        timer: time,
      });
    } else if (status == "success") {
      Swal.fire({
        position: "center",
        icon: "success",
        title: title,
        showConfirmButton: true,
        timer: time,
      });
    } else if (status == "warning") {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: title,
        showConfirmButton: true,
        timer: time,
      });
    }
  }
}

