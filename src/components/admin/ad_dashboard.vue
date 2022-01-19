<template>
    <div>
    <md-card v-if="dataReady">
     
    <md-card-header>
      <h3>{{gt("dashboard")}}</h3>
    </md-card-header> 
    <md-card-content>
      <md-switch @change="change" v-model="properties.undermaintenance"><small>{{gt("under_construction")}}</small></md-switch>
     <md-switch @change="change" v-model="properties.promotion"> <small>{{gt("promotion")}}</small></md-switch>
     <md-switch @change="change" v-model="properties.promotion_hide"> <small>{{gt("promotion_hide")}}</small></md-switch>
    </md-card-content>
  
    </md-card>
    <div v-if="dataReady">
        <md-card>
            <md-card-header>
        <md-card-header-text>
          <div class="md-title"> {{gt("settings_of_users")}}</div>
		   </md-card-header-text>
		   </md-card-header>
       

        <md-card-content>
        <div class="section">
        <md-table  v-model="users" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
            <md-table-toolbar>
                <div class="md-toolbar-section-start">
                <h1 class="md-title">{{gt("users")}}</h1>
                </div>

                <md-field md-clearable class="md-toolbar-section-end">
                <md-input :placeholder="gt('search_by_name')" v-model="searching_user_text" @change="searchinguser" />
                </md-field>
            </md-table-toolbar>

            <md-table-empty-state v-if="searching_user_text!=''"
                :md-label="gt('users_cant_found')"
                :md-description="`${gt('no_user_cant_be_found')} '${searching_user_text}'.`">
            </md-table-empty-state>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>
                <md-table-cell :md-label="gt('username')" md-sort-by="name">{{ item.data.name }}</md-table-cell>
                <md-table-cell :md-label="gt('useremail')" md-sort-by="email">{{ item.data.email }}</md-table-cell>
                <md-table-cell :md-label="gt('edit')" ><md-button @click="$router.push(`/admin/user/${item.id}`)">{{gt("edituser")}}</md-button></md-table-cell>
            </md-table-row>
        </md-table>
        </div>
        
        </md-card-content>
        </md-card>
    </div>
    
    
    </div>
</template>
<script>
import {get_text,title_page} from "@/languages";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,user_email_verified} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit, updateDoc,  } from "firebase/firestore";
export default {
  async mounted()
  {
    let _properties= await getDoc(doc(firestore,"properties","global_flags"));
    this.properties= _properties.data();

    this.dataReady=true;
  },
  metaInfo:{
			title:title_page("","dashboard"),
		},
  data()
  {
    return{
      properties:{},
      searching_user_text:"",
      searchedusers:[],
      users:[],
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
    },
     async searchinguser()
			{
                
				this.dataReady=false;
				this.searchedusers=[];
				//if(!(String(this.seaching_text).length>0)) return [];
                if(this.seaching_text=='')
                {
                let q= await query(collection(firestore,"users"),limit(10));
				let c=await getDocs(q);
				c.forEach(element => {
				this.check_element_user_exist({id:element.id,data:element.data()});
				});
                }
                else 
                {
				let q= await query(collection(firestore,"users"),where("name","<=",[this.searching_user_text]),limit(10));
				let c=await getDocs(q);
				c.forEach(element => {
				this.check_element_user_exist({id:element.id,data:element.data()});
				});

				q= await query(collection(firestore,"users"),where("email","<=",this.searching_user_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_user_exist({id:element.id,data:element.data()});
				});
                }

				
				this.dataReady=true;
				//console.log(this.searchedusers);
			},
      check_element_user_exist(b){
                console.log(b);
			 if(!this.users.includes(b)) this.users.push(b);
			 }
  }
  

}
</script>