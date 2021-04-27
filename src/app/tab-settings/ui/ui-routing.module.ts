import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UiPage } from './ui.page';

const routes: Routes = [
  {
    path: '',
    component: UiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UiPageRoutingModule {}
