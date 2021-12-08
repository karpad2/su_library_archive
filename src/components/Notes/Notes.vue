<template>
	<div>
	<md-card>	
		<md-card-header>
		{{gt("search_for_notes")}}
		<md-field>
			<md-input @change="searching" v-model="seaching_text" >{{gt("search")}}</md-input>
		</md-field>
		</md-card-header>

		<md-card-content>
		 
		
		<div class="section">
			<notecard v-for="note in searchednotes" :key="note.id" :note_id="note.id"/>
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
import notecard from "@/components/parts/notecard";

import logo from "@/assets/logo";

// {{gt("genres")}}
		
	export default {
		components: {
		notecard

		},
		name: 'notes',
		metaInfo:{
			title:title_page("","notes"),
		},
		
		data: () => ({
			profile_picture_url:"",
			profile_name:"",
			seaching_text:"",
			showSidepanel:false,
			menuVisible: false,
			searchednotes:[],
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
				let q=query(collection(firestore,"notes"),limit(10));
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
				this.searchednotes=[];
				if(!(String(this.seaching_text).length>0)) return [];
				let q=query(collection(firestore,"notes"),where("keywords","array-contains",[this.seaching_text]),limit(10));
				let c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id});
				});
				 q=query(collection(firestore,"notes"),where("author_name","<=",this.seaching_text),where("author_name",">=",this.seaching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id});
				});

				q=query(collection(firestore,"notes"),where("note_name","<=",this.seaching_text),where("note_name",">=",this.seaching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id});
				});

				
				this.dataReady=true;
				console.log(this.searchednotes);
			},
			gt(a){
					return get_text(a);
				},
			check_element_exist(b){
			 if(!this.searchednotes.includes(b)) this.searchednotes.push(b);
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
