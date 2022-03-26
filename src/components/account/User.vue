<template>
	<div v-if="dataReady">
		<div class="section">
	<md-card>
		<md-card-header>
        <md-card-header-text>
          <div class="md-title"> {{gt("User")}}</div>
		   </md-card-header-text>
		   </md-card-header>
		    <md-card-content>
				<div class="user-container">
				<div class="bigavatar">
				<img  :src="user.photoURL" alt="Avatar">
				</div>
				<div class="user-info">
      	<h3>{{user.displayName}}</h3>
		<md-field>
		<label for="useremail">{{gt('user_email')}}</label>
      		<md-input id="useremail" v-if="!library_user" v-model="user.email" disabled></md-input>
    	</md-field>
		<md-field>
		  	<b-form-select @change="lang_change" size="sm" class="mt-3 language" v-model="language" :options="languages"></b-form-select>
    	</md-field>
		


	
		<p>{{gt('joined')}} : {{joined}}</p>

		<p v-if="admin">Administrator</p>
		

		
      		 
    	
	
		</div>
		<div v-if="admin">
		
		<div>
		
		</div>
		</div>
		</div>
        </md-card-content>
	</md-card>
	</div>
		

		
	</div>

</template>

<script>
import {signOut,getAuth} from "firebase/auth";
import PayPal from 'vue-paypal-checkout';
import moment from "moment";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit, updateDoc,getDocFromCache  } from "firebase/firestore";
import {get_text,languages,get_defaultlanguage,title_page} from "@/languages";
import langa from "../../languages/languages";


	export default {
		components: {
			
		},
		metaInfo:{
			title:title_page("","User"),
		},
		name: 'Index',
		data: () => ({
			langs:[],
			language:"",
			valid_until_flag:false,
			valid_until:"",
			admin:false,
			member:false,
			options:[],
			users_data:{},
			user:{
				displayname:"",
				photoURL:"",
				email:""
			},
			languages:langa.languages,
			dataReady: false,
			library_user:false,
			 credentials: {
				sandbox: '<sandbox client id>',
				production: '<production client id>'
			}
			
		}),
		async mounted() {
			//this.langs=;
			this.user= await getAuth().currentUser;
			//let update_number=(await getDoc(collection(firestore,"books"),book_id)).data().favorites;
			//collection(firestore,"books").doc(book_id).update({popularity: update_number+1});
			this.language=get_defaultlanguage();
			this.library_user=await getAuth().currentUser.email=="libraryuser@su-library-archive.web.app";
			//console.log(this.language);
			const lang=this.languages;
			
			
			langa.languages.forEach((a)=>
			{
				this.options.push({value:a.code,text:a.name});
			});

			let valid_u;
			let l= localStorage.getItem("language").substr(0,2);
			if(l=="rs") l="sr";
		    moment.locale(l);

			try{
        valid_u=await getDocFromCache( doc(firestore, "users", this.user.uid));
        this.users_data=valid_u.data();
        }
        catch(e)
        {
           valid_u=await getDoc(doc(firestore, "users", this.user.uid));
           this.users_data=valid_u.data(); 
        }
			this.admin=this.users_data.admin==null?false:this.users_data.admin;
			this.member=this.users_data.member==null?false:this.users_data.member;
			this.language=this.users_data.language;
			let date=new Date(Number(0));
			this.valid_until= moment(date).format('MMMM Do YYYY, h:mm:ss a');
			this.dataReady=true;
		},
		computed:{
			joined()
			{

				
				let date=new Date(Number(this.user.metadata.createdAt));
				
				return moment(date).fromNow();
			}
		},
		methods: {
			gt(a)
			{
				return get_text(a)
			},
			displayname()
			{
				return getAuth().currentUser.displayName;
			},
			async lang_change()
			{
				await  updateDoc(doc(firestore,"users",getAuth().currentUser.uid),{language:this.language},{merge:true});
				
				localStorage.setItem("language",this.language);
				window.location.reload();
				//getAuth().languageCode=this.language;
			},
		}
	}
	
</script>

<style lang="scss" scope>
	
.bigavatar{
	float: left;
    margin: 2 em;

}
.bigavatar img{
	width: 120px;
    height: 120px;

}
.user-info{
	float:left;
	 margin: 50px;
}
.user-container
{
	overflow: auto;
}
	
	/*

		<md-select @change="lang_change" id="language" name="language" v-model="language">
							<md-option v-for="la in languages" :key="la.code"  :value="la.code">{{la.name}}</md-option>
						</md-select>
	*/
</style>
