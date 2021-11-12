<template>
	<div>
	<md-card>	
		<md-card-header>
		{{gt("search_for_books")}}
		<md-field>
			<md-input @change="searching" v-model="seaching_text" >{{gt("search")}}</md-input>
		</md-field>
		</md-card-header>

		<md-card-content>
		 
		{{gt("genres")}}
		
		<div class="section">
			<bookcard v-for="book in searchedBooks" :key="book.id" :book_id="book.id"/>
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
import bookcard from "@/components/parts/bookcard";

import logo from "@/assets/logo";
import Bookcard from './parts/bookcard.vue';

	export default {
		components: {
		bookcard

		},
		name: 'Books',
		metaInfo:{
			title:title_page("","Books"),
		},
		
		data: () => ({
			profile_picture_url:"",
			profile_name:"",
			seaching_text:"",
			showSidepanel:false,
			menuVisible: false,
			searchedBooks:[],
			userTheme: "default",
			loading_screen:false,
			dataReady:false
			
		}),
		async mounted() {
			if(this.$route.params.b_search!=undefined)
			{
			this.seaching_text=this.$route.params.b_search;
			await this.searching();
			}
			else 
			{
				let q=query(collection(firestore,"books"),limit(10));
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
				this.searchedBooks=[];
				if(!(String(this.seaching_text).length>0)) return [];
				let q=query(collection(firestore,"books"),where("keywords","array-contains",[this.seaching_text]),limit(10));
				let c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id});
				});
				 q=query(collection(firestore,"books"),where("author_name","<=",this.seaching_text),where("author_name",">=",this.seaching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id});
				});

				q=query(collection(firestore,"books"),where("book_name","<=",this.seaching_text),where("book_name",">=",this.seaching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id});
				});

				
				this.dataReady=true;
				console.log(this.searchedBooks);
			},
			gt(a){
					return get_text(a);
				},
			check_element_exist(b){
			 if(!this.searchedBooks.includes(b)) this.searchedBooks.push(b);
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
