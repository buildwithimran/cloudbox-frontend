import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MainComponent } from './main.component';
import { DashboardGuard } from '../guards/dashboard.guard';
import { DirectoryComponent } from './components/directory/directory.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [DashboardGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'directory/:directoryId', component: DirectoryComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
