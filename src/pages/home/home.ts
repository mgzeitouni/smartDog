import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

 // devices: any[] = [];
  // statusMessage: string;
  device: any = null;
  blinkSpeed=15;
  newBlinkSpeed=15;
  discovered:boolean=false;
  connected:boolean=false;
  peripheral;
  connectedPeripheral;

  constructor(public navCtrl: NavController, 
              private toastCtrl: ToastController,
              private ble: BLE,
              private ngZone: NgZone) { 
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
    this.scan();
  }

  scan() {
    //this.setStatus('Scanning for BLE Device...');
    //this.devices = [];  // clear list
    this.ble.scan([], 5).subscribe(
      device => this.onDeviceDiscovered(device), 
    //  error => this.scanError(error)
    );

  //  setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
  }

  onConnected(peripheral) {
    this.ngZone.run(() => {
     // this.setStatus('');
     this.connected=true;
      this.peripheral = peripheral;
      console.log(JSON.stringify(this.peripheral))
    });
  }
  onDeviceDisconnected(peripheral) {
    this.ble.disconnect(this.peripheral.id).then(
      () => console.log('Disconnected ' + JSON.stringify(this.peripheral)),
      () => console.log('ERROR disconnecting ' + JSON.stringify(this.peripheral))
    )
    this.connected=false;
  }



  onDeviceDiscovered(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    if (device.name && device.name.indexOf('Kitty')>-1){
      this.device = device;
      this.discovered = true;
    }
  }

  connectDevice(){
    this.ble.connect(this.device.id).subscribe(

      peripheral => this.onConnected(peripheral),
      peripheral => this.onDeviceDisconnected(peripheral)
    
    );

    this.connected=true;

  }



  str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  rangeChange(input){

    var sendBLE;
    if (this.newBlinkSpeed > this.blinkSpeed){
      sendBLE = 'a';
    }else if (this.newBlinkSpeed < this.blinkSpeed){
      sendBLE = 'aa';
    }

    this.blinkSpeed = this.newBlinkSpeed;
console.log(sendBLE)
    var value = this.str2ab(sendBLE)
    
    this.ble.write(this.peripheral.id, this.peripheral.services[0],this.peripheral.characteristics[0].characteristic,value).then(
      result=> {
      }).catch(error=> {
          alert(JSON.stringify(error));
      });

  }


  // If location permission is denied, you'll end up here
  // scanError(error) {
  //   this.setStatus('Error ' + error);
  //   let toast = this.toastCtrl.create({
  //     message: 'Error scanning for Bluetooth low energy devices',
  //     position: 'middle',
  //     duration: 5000
  //   });
  //   toast.present();
  // }



  // setStatus(message) {
  //   console.log(message);
  //   this.ngZone.run(() => {
  //     this.statusMessage = message;
  //   });
  // }

  // deviceSelected(device) {
  //   console.log(JSON.stringify(device) + ' selected');
  //   this.navCtrl.push(DetailPage, {
  //     device: device
  //   });
  // }


}
