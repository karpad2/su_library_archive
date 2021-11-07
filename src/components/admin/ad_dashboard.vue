<template>
    <div>
    <md-card v-if="dataReady">
     
    <md-card-header>
      <h3>{{gt("dashboard")}}</h3>
    </md-card-header> 
    <md-card-content>
      <md-switch @change="change" v-model="properties.undermaintenance"><small>{{gt("under_construction")}}</small></md-switch>
     <md-switch @change="change" v-model="properties.promotion"> <small>{{gt("promotion")}}</small></md-switch>
    </md-card-content>
  
    </md-card>
    
    </div>
</template>
<script>
import {get_text} from "@/languages";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,user_email_verified} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit, updateDoc,  } from "firebase/firestore";
export default {
  async mounted()
  {
    let _properties= await getDoc(doc(firestore,"properties","global_flags"));
    this.properties= _properties.data();

    this.dataReady=true;
  },
  data()
  {
    return{
      properties:{},
      dataReady:false
    }
  },
  methods:
  {
    gt(a)
				{
					return get_text(a);
				},
    change()
    {
      updateDoc(doc(firestore,"properties","global_flags"),this.properties,{merge:true});
    }
  }
  

}
</script>