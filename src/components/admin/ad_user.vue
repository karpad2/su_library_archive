<template>
<div v-if="dataReady" >
<h2>{{gt("user")}}</h2>

<md-field>
      <label>{{gt('user_name')}}</label>
      <md-input v-model="user.name" md-counter="100"></md-input>
</md-field>
<md-field>
      <label>{{gt('user_email')}}</label>
      <md-input v-model="user.email" md-counter="100"></md-input>
</md-field>



<md-switch @change="change" v-model="user.member">{{gt("member")}}</md-switch>
<md-switch @change="change" v-model="user.admin">{{gt("admin_user")}}</md-switch>

</div>
</template>
<script>
import {get_text} from "@/languages";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,user_email_verified} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit,updateDoc  } from "firebase/firestore";
export default {
  methods:{
    gt(a)
    {
      return get_text(a);
    },
    change()
    {
      updateDoc(doc(firestore,"users",this.$route.params.uid),this.user,{merge:true});
    }
  },
  async mounted()
  {
    let _user= await getDoc(doc(firestore,"users",this.$route.params.uid));
    this.user=_user.data();
    this.dataReady=true;

  },
  data()
  {
    return{
      user:{},
      user_name:"",
      user_email:"",
      dataReady:false
    }
  }
}

/*
<md-field>
      <label>{{gt('user_expired')}}</label>
      <md-input v-model="user_expired" md-counter="100"></md-input>
</md-field>

*/
</script>

