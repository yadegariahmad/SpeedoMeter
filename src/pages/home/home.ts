import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {
    // setInterval(() => {
    // 	diagnostic.isGpsLocationEnabled()
    // 		.then(status => {
    // 			this.status = status;
    // 		})
    // 		.catch(error => {
    // 			this.error = error;
    // 		});
    // }, 1000);

    // gps.watchPosition().subscribe(data => {
    // 	this.coords.push(new Date().getTime() + ' ' + new Date().getSeconds());
    // });
  }

  navigateToCalculationPage() {
    this.navCtrl.push('calculation-page');
  }

}
