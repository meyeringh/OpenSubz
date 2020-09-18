import { Component } from '@angular/core';
import { NotificationService } from '../Services/notification.service';
import { ThemeService } from '../Services/theme.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    public notificationService: NotificationService,
    public themeService: ThemeService) {}

  ionViewWillEnter() {
    this.notificationService.scheduleNotifications();
    this.themeService.applyTheme();
  }

}
