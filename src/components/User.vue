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
      		<md-input id="useremail" v-model="user.email" disabled></md-input>
    	</md-field>

		<md-field>
		 <b-form-select @change="lang_change" v-model="language" :options="options"></b-form-select>
    	</md-field>
		


	
		<p>{{gt('joined')}} : {{joined}}</p>

		<p v-if="valid_until_flag">{{gt('valid_until')}} : {{valid_until}}</p>
      		 
    	
	
		</div>
		</div>
        </md-card-content>
	</md-card>
	</div>
		<h1></h1>

		
		

		
	</div>

</template>

<script>
import {signOut,getAuth} from "firebase/auth";
import moment from "moment";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit, updateDoc,getDocFromCache  } from "firebase/firestore";
import {get_text,languages,get_defaultlanguage,title_page} from "@/languages";


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
			options:[],
			users_data:{},
			user:{
				displayname:"",
				photoURL:"",
				email:""
			},
			dataReady: false,
			
		}),
		async mounted() {
			//this.langs=;
			this.user= await getAuth().currentUser;
			//let update_number=(await getDoc(collection(firestore,"books"),book_id)).data().favorites;
			//collection(firestore,"books").doc(book_id).update({popularity: update_number+1});
			this.language=get_defaultlanguage();

			//console.log(this.language);
			const lang=languages;
			lang.forEach((a)=>
			{
				this.options.push({value:a.code,text:a.name});
			});

			let valid_u;

			try{
        valid_u=await getDocFromCache( doc(firestore, "users", this.user.uid));
        this.users_data=valid_u.data();
        }
        catch(e)
        {
           valid_u=await getDoc(doc(firestore, "users", this.user.uid));
           this.users_data=valid_u.data(); 
        }
			this.language=this.users_data.language;
			let date=new Date(Number(0));
			this.valid_until= moment(date).format('MMMM Do YYYY, h:mm:ss a');
			this.dataReady=true;
		},
		computed:{
			joined()
			{
				let date=new Date(Number(this.user.metadata.createdAt));
				
				return moment(date).format('MMMM Do YYYY, h:mm:ss a');
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
				window.reload();
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
