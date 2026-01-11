import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabSettingsPage } from './tab-settings.page';

const routes: Routes = [
  {
    path: '',
    component: TabSettingsPage,
  },  {
    path: 'ui',
    loadChildren: () => import('./ui/ui.module').then( m => m.UiPageModule)
  },
  {
    path: 'region',
    loadChildren: () => import('./region/region.module').then( m => m.RegionPageModule)
  },
  {
    path: 'license',
    loadChildren: () => import('./license/license.module').then( m => m.LicensePageModule)
  },
  {
    path: 'data-management',
    loadChildren: () => import('./data-management/data-management.module').then( m => m.DataManagementPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'nextcloud',
    loadChildren: () => import('./nextcloud/nextcloud.module').then( m => m.NextcloudPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabSettingsPageRoutingModule {}
