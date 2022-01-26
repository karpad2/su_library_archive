<template>
	<div>
	<md-card>	
		<md-card-header>
		{{gt("search_for_posters")}}
		<md-field>
			<md-input @change="searching" v-model="seaching_text" >{{gt("search")}}</md-input>
		</md-field>
		</md-card-header>

		<md-card-content>
		 
		
		<div class="section">
			<postercard v-for="poster in searchedposters" :key="poster.id" :poster_id="poster.id"/>
		</div>
		</md-card-content>
	</md-card>
	</div>
</template>

<script>
import {signOut} from "firebase/auth";
import {get_text,languages,get_defaultlanguage,title_page} from "@/languages";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,storage} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit  } from "firebase/firestore";
import { getStorage, ref, listAll,get } from "firebase/storage";
import loading from "@/components/parts/loading";
import postercard from "@/components/parts/postercard";

import logo from "@/assets/logo";

// {{gt("genres")}}
		
	export default {
		components: {
		postercard

		},
		name: 'posters',
		metaInfo:{
			title:title_page("","posters"),
		},
		
		data: () => ({
			profile_picture_url:"",
			profile_name:"",
			seaching_text:"",
			showSidepanel:false,
			menuVisible: false,
			searchedposters:[],
			userTheme: "default",
			loading_screen:false,
			dataReady:false
			
		}),
		async mounted() {
			if(this.$route.params.bsearch!=undefined)
			{
			this.seaching_text=this.$route.params.bsearch;
			await this.searching();
			}
			else 
			{
				let q=query(collection(firestore,"posters"),limit(10));
				let c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id});
				});
			}

			this.dataReady=true;
		},
		methods: {
			async searching()
			{
				this.dataReady=false;
				this.searchedposters=[];
				if(!(String(this.seaching_text).length>0)) return [];
				let q=query(collection(firestore,"posters"),where("keywords","array-contains",[this.seaching_text]),limit(10));
				let c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id});
				});
				 q=query(collection(firestore,"posters"),where("author_name","<=",this.seaching_text),where("author_name",">=",this.seaching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id});
				});

				q=query(collection(firestore,"posters"),where("poster_name","<=",this.seaching_text),where("poster_name",">=",this.seaching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id});
				});

				
				this.dataReady=true;
				console.log(this.searchedposters);
			},
			gt(a){
					return get_text(a);
				},
			check_element_exist(b){
			 if(!this.searchedposters.includes(b)) this.searchedposters.push(b);
			 }
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
