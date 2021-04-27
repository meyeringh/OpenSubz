import { Component, OnInit } from '@angular/core';
import { licenseText } from './Helpers/mit-license-text';

@Component({
  selector: 'app-license',
  templateUrl: './license.page.html',
  styleUrls: ['./license.page.scss'],
})
export class LicensePage implements OnInit {
  licenseText = licenseText;

  constructor() { }

  ngOnInit() {
  }

}
