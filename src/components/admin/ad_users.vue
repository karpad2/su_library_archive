<template>
     <div v-if="dataReady">
        <md-headline>{{gt("Users")}}</md-headline>
        <div>{{gt("settings_of_users")}}
        
        <div class="section" v-if="users.length>0">
        <md-table v-model="searched" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
            <md-table-toolbar>
                <div class="md-toolbar-section-start">
                <h1 class="md-title">{{gt("users")}}</h1>
                </div>

                <md-field md-clearable class="md-toolbar-section-end">
                <md-input :placeholder="gt('search_by_name')" v-model="search" @input="searchOnTable" />
                </md-field>
            </md-table-toolbar>

            <md-table-empty-state
                :md-label="gt('users_cant_found')"
                :md-description="`${gt('no_user_cant_be_found')} '${search}'.`">
                
            </md-table-empty-state>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>
                <md-table-cell :md-label="gt('username')" md-sort-by="name">{{ item.data.name }}</md-table-cell>
                <md-table-cell :md-label="gt('useremail')" md-sort-by="email">{{ item.data.email }}</md-table-cell>
                <md-table-cell :md-label="gt('edit')" ><md-button @click="$router.push(`/admin/user/${item.id}`)">{{gt("edituser")}}</md-button></md-table-cell>
            </md-table-row>
        </md-table>
        </div>
        </div>


    </div>

</template>
<script>
import {get_text} from "@/languages";
import {getAuth,signOut,auth,user_language} from "firebase/auth";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,user_email_verified} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit,  } from "firebase/firestore";
//import { initializeApp, applicationDefault } from 'firebase-admin/app';
const toLower = text => {
    return text.toString().toLowerCase()
  }
  const searchByName = (items, term) => {
    
    if (term) {
      return items.filter(item => toLower(item.data.name).includes(toLower(term)))
    }

    return items
  }
export default {
    methods:
    { gt(a)
        {
            return get_text(a);
        },
        searchOnTable () {
        this.searched = searchByName(this.users, this.search)
      }
    },
    data()
    {
        return{
            users:[],
            searched:[],
            search:"",
            dataReady:false,
        }
    },
     async mounted(){

         let a=[];
         this.users=[];
            

             let queryusers= await getDocs(collection(firestore,"users"));

                queryusers.forEach((a)=>
                {
                    this.users.push({data:a.data(),id:a.id});
                });

             this.dataReady=true;
    },

    computed:{
    
        
    }
}
</script>