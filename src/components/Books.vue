<template>
	<div>
	<md-card>	
		<md-card-header>
		{{gt("search_for_books")}}
		<md-autocomplete
					class="search a"
					v-model="seaching_text"
					:md-options="searchedBooks"
					@change="searching"
					md-layout="box"></md-autocomplete><md-button class="md-raised md-primary a" @click="searching">{{gt("search")}}</md-button>
		
		</md-card-header>

		<md-card-content>
		 
		{{gt("genres")}}
		
		<div v-if="dataReady">
		<bookcard v-for="book in  searchedBooks" :key="book.id" :book_id="book.id"/>
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
		props:["b_mode","b_search"],
		data: () => ({
			profile_picture_url:"",
			profile_name:"",
			seaching_text:"",

			showSidepanel:false,
			menuVisible: false,
			searchedBooks:[],
			userTheme: "default",
			loading_screen:false,
			dataReady:true
			
		}),
		mounted() {

		},
		methods: {
			async searching()
			{
				this.dataReady=false;
				let a=[];
				if(!(String(this.seaching_text).length>0)) return [];
				
				let q=query(collection(firestore,"books"),where("keywords","in",[this.seaching_text.toLowerCase()]),limit(10));
				let c=await getDocs(q);
				c.forEach(element => {
				a.push({
					id:element.id
				})
				
				});

				//let query=query(collection,)
				//return  a;
				console.log(a);
				this.searchedBooks=a;
				this.dataReady=true;
			},
			gt(a)
				{
					return get_text(a);
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
