<template>
	<div>
	<md-card>	
		<md-card-header>
		{{profile!=""?gt(`search_for_${profile}`):""}}
		<md-field>
			<md-input @change="searching" v-model="seaching_text" >{{gt("search")}}</md-input>
		</md-field>
			<md-button class="md-raised md-primary" v-if="admin" @click="movetoadmin">{{gt(`admin_${profile}`)}}</md-button>
		</md-card-header>
		<md-card-content>
		<div class="section">
			<card :profile="profile" v-for="newspaper in searchednewspapers" :key="newspaper.id" :id="newspaper.id"/>
		</div>
		<div class="middle-center"> <md-button @click="loadmore">{{gt("load_more")}}</md-button></div>
		</md-card-content>
	</md-card>
	</div>
</template>

<script>
import {signOut} from "firebase/auth";
import {get_text,languages,get_defaultlanguage,title_page,get_text_by_language} from "@/languages";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,storage} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit,getDocFromCache  } from "firebase/firestore";
import { getStorage, ref, listAll,get } from "firebase/storage";
import loading from "@/components/parts/loading";
import card from "@/components/parts/card";

import logo from "@/assets/logo";

// {{gt("genres")}}
		
	export default {
		components: {
		card
		},
		name: "template_views",
	
		metaInfo(){
			return{
			title:title_page("",this.profile),
			
			meta:[
			{ name: 'keywords',content:title_page("",this.profile)},
			{ name: 'description',content:title_page("",this.profile)},
			{ name: 'og:description',content:title_page("",this.profile)},
			{ name: 'og:image',content:`https://cdn.statically.io/screenshot/${window.location.href.replace('https://','')}`},
			]
			}
		},
		
		data: () => ({
			profile:"",
			title_cucc:"",
			profile_picture_url:"",
			profile_name:"",
			seaching_text:"",
			showSidepanel:false,
			menuVisible: false,
			searchednewspapers:[],
			loading_values:100,
			userTheme: "default",
			loading_screen:false,
			dataReady:false,
			user:{},
			admin:false
			
		}),
		async mounted() {
			{
				this.profile=this.$route.params.viewtype;
			}
			if(this.$route.params.bsearch!=undefined)
			{
			this.seaching_text=this.$route.params.bsearch;
			if(this.$route.params.viewtype!=undefined)
			
			await this.searching();
			}
			else 
			{
				await this.load_basic();
			}
			if(this.$route.params.viewtype!=undefined)
			{
				this.profile=this.$route.params.viewtype;
			}
			
			this.title_cucc=title_page("",this.$route.params.viewtype);
			let k;
			if(FirebaseAuth.currentUser!=null)
			{
			try{
				k=await getDocFromCache(doc(firestore,"users",FirebaseAuth.currentUser.uid));
				
				}
				catch(e)
				{
				k=await getDoc(doc(firestore,"users",FirebaseAuth.currentUser.uid)); 
				}


			this.admin=(k.data().admin==null?false:k.data().admin);
			}	
			this.dataReady=true;
		},
		methods: {
			async searching()
			{
				this.dataReady=false;
				this.searchednewspapers=[];
				if(!(String(this.seaching_text).length>0)){
					this.load_basic();
				}
				let q=query(collection(firestore,`/${this.profile}`),where("keywords","array-contains",[this.seaching_text]),limit(10));
				let c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id});
				});
				 q=query(collection(firestore,`/${this.profile}`),where("author","<=",this.seaching_text),where("author",">=",this.seaching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id});
				});

				q=query(collection(firestore,`/${this.profile}`),where("name","<=",this.seaching_text),where("name",">=",this.seaching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id});
				});

				
				this.dataReady=true;
				console.log(this.searchednewspapers);
			},
			async load_basic()
			{
				let q=query(collection(firestore,`/${this.profile}`),limit(this.loading_values));
				let c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id});
				});
			},
			gt(a,b=null){
				if(b==null)return get_text(a);
				else return get_text_by_language(a,b);
				},
			async loadmore()
			{
				this.loading_values+=3;
				await this.searching();
			},
			check_element_exist(b){
			 if(!this.searchednewspapers.includes(b)) this.searchednewspapers.push(b);
			 },
			  movetoadmin()
			{
				this.$router.push("/admin/content/"+this.profile);
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
