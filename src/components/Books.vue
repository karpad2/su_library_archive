<template>
	<div>

		{{gt("search_for_books")}}
		 <md-autocomplete
					class="search"
					v-model="seaching_text"
					:md-options="searchedBooks"
					@change="searching"
					md-layout="box">
					<label>{{gt("search")}}</label>
					</md-autocomplete>
					<md-button class="md-raised md-primary" @click="search">{{gt("search")}}</md-button>
		{{gt("genres")}}
		



	</div>
</template>

<script>
import {signOut} from "firebase/auth";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore} from "@/firebase";
import {ref, set ,onValue,get, child} from "firebase/database";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit  } from "firebase/firestore";
import loading from "@/components/parts/loading";
import logo from "@/assets/logo";

	export default {
		components: {
		
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
			
		}),
		mounted() {

		},
		methods: {
			async searching()
			{
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
			},
		},
		computed:
		{
			

		}
	}
			
</script>

<style lang="scss">
	
</style>
