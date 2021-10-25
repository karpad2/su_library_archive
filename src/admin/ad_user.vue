<template>
<div >
<h2>Devices</h2>
<p>How to add device?</p>
<p>There is two method.</p>
<p>First you will need to add a device manually on the website.</p>
<p>Our method is using a "config.json" and flash this file to microcontroller, this file will contains the data for reaching server,
and network settings for it.</p>
<div class="section" v-if="devices.length>0">
    <md-table  md-card>
      <md-table-toolbar>
        <h1 class="md-title">Devices</h1>
      </md-table-toolbar>
      <md-table-row>
        <md-table-head md-numeric>#</md-table-head>
        <md-table-head>Device Name:</md-table-head>
        <md-table-head>Device Mode:</md-table-head>
        <md-table-head>Device is Online?</md-table-head>
        <md-table-head>Devices Edit:</md-table-head>
      </md-table-row>
      
      <md-table-row v-for="(row,index) in devices" :key="index">
        <md-table-cell md-numeric>{{index+1}}</md-table-cell>
        <md-table-cell>{{row.data.device_name}}</md-table-cell>
        <md-table-cell>{{row.data.mode}}</md-table-cell>
        <md-table-cell><activedevice :device_id="row.dev_id" :room_id="row.room_id"/></md-table-cell>
        <md-table-cell><md-button class="md-raised md-primary" @click="edit(`/room/${row.room_id}/device/${row.dev_id}`)">Edit Device</md-button></md-table-cell>
    </md-table-row>
      
      </md-table>
      <md-button class="md-raised md-primary" v-if="false" @click="showDDialog = true">Add Device </md-button>
  </div>
     <md-empty-state v-else
			md-icon="precision_manufacturing"
			md-label="You do not have devices"
			md-description="You do not have registered device. You can create device inside the Room. :/">
    </md-empty-state>

</div>
</template>
<script>
import Activedevice from "@/components/parts/Activedevice";
import ElapsedTime from "@/components/parts/ElapsedTime";
import router from "@/router";
import axios from "axios";
import {FireDb,FirebaseAuth,userId} from "@/firebase";
import {ref, set ,onValue,get, child,push,runTransaction } from "firebase/database";
import {get_data_from_allroomdb} from "@/mod_data/get_data";
export default {
    

    name: 'Devices',
    data: () => ({
      showDialog: false,
      scan:null,
      found_devices:[],
      showDDialog:false,
     
     
    }),
    components:{
      Activedevice
    },
    beforeMount()
    {        
       const userId = FirebaseAuth.currentUser.uid;
       
        /*
            még nincs implementálva a böngészőkben OwO
            this.scan = navigator.bluetooth.requestLEScan({"acceptAllAdvertisements":true});
            navigator.bluetooth.addEventListener('advertisementreceived',this.findADevice(event));
             //
        */
    },
    methods:
    {/*
        findADevice(event)
        {
            this.found_devices.push(
                {
                    name:event.device_name,
                    device_id:event.device.id
                }
            )
        },
        stopScan() {
            console.log('Stopping scan...');
            this.scan.stop();
            console.log('Stopped.  scan.active = ' + this.scan.active);
            },
        search_devices()
        {setTimeout(this.stopScan, 10000);},*/
edit(l)
{
  router.push(l);
},


        },
        mounted()
        {
          
        },
        computed:
        {
          devices()
          {
            
            return get_data_from_allroomdb("devices");
          }
        }
        
    
  }

/*
<h2>Searching for Devices</h2>
<md-list v-if="!found_devices || !found_devices.length">
    <md-list-item>
    </md-list-item>
</md-list>

<md-table  md-card>
      <md-table-toolbar>
        <h1 class="md-title">Searching for Devices</h1>
      </md-table-toolbar>
      <md-table-row>
        <md-table-head md-numeric>#</md-table-head>
        <md-table-head>Device Name:</md-table-head>
        <md-table-head>Device Mode:</md-table-head>
        <md-table-head>Device is Online?</md-table-head>
        <md-table-head>Devices Edit:</md-table-head>
      </md-table-row>
 <md-table-row v-for="(row,index) in found_devices" :key="index">
        <md-table-cell md-numeric>{{index+1}}</md-table-cell>
        <md-table-cell>{{row.device_name}}</md-table-cell>
        <md-table-cell>{{row.mode}}</md-table-cell>
        <md-table-cell><activedevice :lastonline="row.lastonline"/></md-table-cell>
        <md-table-cell><md-button class="md-raised md-primary" @click="showADDialog = true">Add Device </md-button></md-table-cell>
    </md-table-row>
 </md-table>

 <md-button class="md-raised md-primary">Add device</md-button>
*/
</script>
