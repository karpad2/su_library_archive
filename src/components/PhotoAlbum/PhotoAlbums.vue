<template>
	<div>
	<md-card>	
		<md-card-header>
		{{gt(profile)+" "+gt("search_for")}}
		<md-field>
			<md-input @change="searching" v-model="seaching_text" >{{gt("search")}}</md-input>
		</md-field>
		<md-button class="md-raised md-primary" v-if="admin" @click="movetoadmin">{{gt("admin")+" "+gt(profile)}}</md-button>
		</md-card-header>

		<md-card-content>
		<div class="section">
			<photoalbumscard v-for="photoalbums in searchedphotoalbums" :key="photoalbums.id" :photoalbums_id="photoalbums.id"/>
		</div>
		</md-card-content>
	</md-card>
	</div>
</template>

<script>
import {signOut} from "firebase/auth";
import {get_text,languages,get_defaultlanguage,title_page} from "@/languages";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,storage,getDocFromCache} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit  } from "firebase/firestore";
import { getStorage, ref, listAll,get } from "firebase/storage";
import loading from "@/components/parts/loading";
import photoalbumscard from "@/components/parts/photoalbumscard";

import logo from "@/assets/logo";

// {{gt("genres")}}
		
	export default {
		components: {
		photoalbumscard

		},
		name: 'photoalbums',
		metaInfo:{
			title:title_page("","photoalbums"),
		},
		
		data: () => ({
			profile_picture_url:"",
			profile_name:"",
			profile:"photoalbums",
			seaching_text:"",
			showSidepanel:false,
			menuVisible: false,
			searchedphotoalbums:[],
			userTheme: "default",
			loading_screen:false,
			dataReady:false,
			user:{},
			admin:false
			
		}),
		async mounted() {
			if(this.$route.params.bsearch!=undefined)
			{
			this.seaching_text=this.$route.params.bsearch;
			await this.searching();
			}
			else 
			{
				let q=query(collection(firestore,"photoalbums"),limit(10));
				let c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id});
				});
			}
			this.user=await FirebaseAuth.currentUser;
			let k;
			try{
				k=await getDocFromCache(doc(firestore,"users",this.user.uid));
				
				}
				catch(e)
				{
				k=await getDoc(doc(firestore,"users",this.user.uid)); 
				}


			this.admin=(k.data().admin==null?false:k.data().admin);

			this.dataReady=true;
		},
		methods: {
			async searching()
			{
				this.dataReady=false;
				this.searchedphotoalbums=[];
				if(this.seaching_text=="") {
					let q=query(collection(firestore,"photoalbums"),limit(10));
				let c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id});
				});
				}
				else {
				let q=query(collection(firestore,"photoalbums"),where("keywords","array-contains",[this.seaching_text]),limit(10));
				let c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id});
				});
				 q=query(collection(firestore,"photoalbums"),where("author","<=",this.seaching_text),where("author",">=",this.seaching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id});
				});

				q=query(collection(firestore,"photoalbums"),where("photoalbums_name","<=",this.seaching_text),where("photoalbums_name",">=",this.seaching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id});
				});
				}
				
				this.dataReady=true;
				console.log(this.searchedphotoalbums);
			},
			gt(a){
					return get_text(a);
				},
			check_element_exist(b){
			 if(!this.searchedphotoalbums.includes(b)) this.searchedphotoalbums.push(b);
			 },
			 movetoadmin()
			{
				this.$router.push("/admin/photoalbums");
			},
		},
		computed:
		{
			

		}
	}
			
</script>

<style lang="scss">
	.a
	{
		margin: 3px;
	}
</style>
