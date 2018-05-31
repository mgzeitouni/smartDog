import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as mqtt from 'mqtt';
/*
  Generated class for the MqttProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MqttProvider {

  constructor(public http: HttpClient) {
    //console.log('Hello MqttProvider Provider');
  }

  publishMessage(data){
    let client  = mqtt.connect('mqtt://lcx26z.messaging.internetofthings.ibmcloud.com',{
      clientId: 'a:lcx26z:myapp',
      username:'a-lcx26z-ke5cisfbb5',
      password:'DdWHEHn0z9Dci4qD!k'
  });
   client.on('connect', function () {
      client.publish('iot-2/type/smartdog/id/nodered/evt/eventtype/fmt/json', "{\"hey\":\""+ data + "\"}");
      client.end();
    });
   }
  

}
