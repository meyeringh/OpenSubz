import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NextcloudPage } from './nextcloud.page';

const routes: Routes = [
    {
        path: '',
        component: NextcloudPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class NextcloudPageRoutingModule { }
