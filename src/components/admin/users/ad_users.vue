<template>
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
                <md-input :placeholder="gt('search_by_name')" v-model="searching_text" @change="searching" />
                </md-field>
            </md-table-toolbar>

            <md-table-empty-state v-if="searching_text!=''"
                :md-label="gt('users_cant_found')"
                :md-description="`${gt('no_user_cant_be_found')} '${searching_text}'.`">
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

</template>
<script>
import {get_text} from "@/languages";
import {getAuth,signOut,auth,user_language} from "firebase/auth";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,user_email_verified} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit,  } from "firebase/firestore";
//import { initializeApp, applicationDefault } from 'firebase-admin/app';

export default {
    methods:
    { gt(a)
        {
            return get_text(a);
        },
        async searching()
			{
                
				this.dataReady=false;
				this.searchedusers=[];
				//if(!(String(this.seaching_text).length>0)) return [];
                if(this.seaching_text=='')
                {
                let q= await query(collection(firestore,"users"),limit(10));
				let c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id,data:element.data()});
				});
                }
                else 
                {
				let q= await query(collection(firestore,"users"),where("name","<=",[this.searching_text]),limit(10));
				let c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id,data:element.data()});
				});

				q= await query(collection(firestore,"users"),where("email","<=",this.searching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id,data:element.data()});
				});
                }

				
				this.dataReady=true;
				//console.log(this.searchedusers);
			},
            check_element_exist(b){
                console.log(b);
			 if(!this.users.includes(b)) this.users.push(b);
			 }
       
    },
    data()
    {
        return{
            users:[],
            searchedusers:[],
            searching_text:"",
            dataReady:false,
        }
    },
    
     async mounted(){

         let a=[];
         this.users=[];
            

             await this.searching();

             this.dataReady=true;
    },

    computed:{
    
        
    }
}
</script>