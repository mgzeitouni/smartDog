import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { ChangeDetectorRef } from '@angular/core';
import { ScaleDataProvider } from '../../providers/scale-data/scale-data';
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
  weight=0;

  constructor(public navCtrl: NavController, 
            
              private ble: BLE,
              private cd: ChangeDetectorRef,
              private scaleDataProvider: ScaleDataProvider) { 
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

     // this.setStatus('');
     this.connected=true;
      this.peripheral = peripheral;

      this.scaleDataProvider.weight_values=[];

      var that = this;

      var serviceToUse = "AFC672E8-6CA4-4252-BE86-B6F20E3F7467";
     
      var chartoUse = "8204321F-D4bE-4556-9537-2EADB108D28E"
    
      this.ble.startNotification(this.peripheral.id, serviceToUse,chartoUse)
    .subscribe(buf=>{
      //let data = this.bytesToString(new Uint8Array(buf));
      let json=JSON.parse(JSON.stringify(new Uint8Array(buf)))
      let arr =Object.values(json)
    
      that.weight =  new Float32Array(new Uint8Array(arr).buffer)[0];

      that.scaleDataProvider.newWeight(that.weight);

     // console.log(that.weight)
     // console.log(this.weight)
      that.cd.detectChanges();

      })
   
  }
  onDeviceDisconnected(peripheral) {

    this.scaleDataProvider.catDetected=false;
    this.scaleDataProvider.urineDetected=false;
    this.scaleDataProvider.scoopDetected=false;


    this.ble.disconnect(this.peripheral.id).then(
      () => console.log('Disconnected ' + JSON.stringify(this.peripheral)),
      () => console.log('ERROR disconnecting ' + JSON.stringify(this.peripheral))
    )
    this.connected=false;


  }

  readData(){
    console.log('requested dataaaaaa');
    let that=this;
    this.ble.startNotification(this.peripheral.id, this.peripheral.services[0],this.peripheral.characteristics[0].characteristic)
    .subscribe(buf=>{
      //let data = this.bytesToString(new Uint8Array(buf));
      let json=JSON.parse(JSON.stringify(new Uint8Array(buf)))
      let arr =Object.values(json)
    
      that.weight =  new Float32Array(new Uint8Array(arr).buffer)[0];
      //console.log(that.weight)


      })

  }


  bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }


  onDeviceDiscovered(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    if (device.name !==undefined && device.name.toString().indexOf("Kitty")>-1){
    console.log("--------------------------FOUND-------------------") 
      this.device = device;
      this.discovered = true;
      this.cd.detectChanges();
    }
  }

  connectDevice(){
    this.weight=0;
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

  tare(){
    var value = this.str2ab("1")

    var serviceToUse = "AFC672E8-6CA4-4252-BE86-B6F20E3F7467";
    var charToUse = "1448ef56-f2dc-4593-9f17-32cd59fb7774";

    this.ble.write(this.peripheral.id,serviceToUse, charToUse,value).then(
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
