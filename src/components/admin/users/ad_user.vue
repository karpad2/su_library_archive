<template>
<div v-if="dataReady" >
<h2>{{gt("User")}}</h2>

<md-field>
      <label>{{gt('user_name')}}</label>
      <md-input v-model="user.name" md-counter="100"></md-input>
</md-field>
<md-field>
      <label>{{gt('user_email')}}</label>
      <md-input v-model="user.email" md-counter="100"></md-input>
</md-field>
<md-field>
      <label>{{gt('member_id')}}</label>
      <md-input v-model="user.member_id" md-counter="100"></md-input>
</md-field>


<md-switch @change="change" v-model="user.member">{{gt("member")}}</md-switch>
<md-switch @change="change" v-model="user.admin">{{gt("admin_user")}}</md-switch>
<md-switch @change="change" v-model="user.h4cker">{{gt("blocked_access")}}</md-switch>

</div>
</template>
<script>
import {get_text} from "@/languages";
import {getAuth,signOut,auth,user_language,getAdditionalUserInfo} from "firebase/auth";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,user_email_verified} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit,updateDoc,getDocFromCache  } from "firebase/firestore";
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
    getAdditionalUserInfo().profile

    this.cuuser= getAuth().currentUser;
			let k;
			try{
        k=await getDocFromCache(doc(firestore,"users",this.cuuser.uid));
        
        }
        catch(e)
        {
           k=await getDoc(doc(firestore,"users",this.cuuser.uid)); 
        }


			this.admin=(k.data().admin==null?false:k.data().admin);
			this.member=(k.data().member==null?false:k.data().member);

      if(!this.admin) this.$router.go("/home");
    this.dataReady=true;

  },
  data()
  {
    return{ cuuser:null,
      admin:false,
      member:false,
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

