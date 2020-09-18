import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabOverviewPage } from './tab-overview.page';

const routes: Routes = [
  {
    path: '',
    component: TabOverviewPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabOverviewPageRoutingModule {}
