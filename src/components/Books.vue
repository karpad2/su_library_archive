<template>
	<div>
	<div class="section">
		{{gt("search_for_books")}}
		
		<div class="center">
		 <md-autocomplete
					class="search float"
					v-model="seaching_text"
					:md-options="searchedBooks"
					@change="searching"
					md-layout="box">
					
					</md-autocomplete><md-button class="md-raised md-primary float" @click="search">{{gt("search")}}</md-button>
		</div>
		{{gt("genres")}}
		</div>
		<div class="section" v-if="dataReady">
		<bookcard />
		</div>

	</div>
</template>

<script>
import {signOut} from "firebase/auth";
import {get_text,languages,get_defaultlanguage} from "@/languages";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore} from "@/firebase";
import {ref, set ,onValue,get, child} from "firebase/database";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit  } from "firebase/firestore";
import loading from "@/components/parts/loading";
import bookcard from "@/components/parts/bookcard";

import logo from "@/assets/logo";
import Bookcard from './parts/bookcard.vue';

	export default {
		components: {
		bookcard

		},
		name: 'Index',
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
				if(!this.seaching_text.length>3) return [];
				let coll = collection(firestore,"books");
				let q=query(coll,where("keywords","array-contains-any",[this.seaching_text]),limit(10));
				let c=await getDocs(q);
				c.forEach(element => {
				a.push({
					book_name:element.book_name,
					author:element.author,
					photoURL:element.book_cover
				})
				
				});

				//let query=query(collection,)
				//return  a;
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
	.float
	{
		float: left;
	}
</style>
