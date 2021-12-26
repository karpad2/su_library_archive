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
		 
		
		<div class="section">
			<bookcard v-for="book in searchedBooks" :key="book.id" :book_id="book.id"/>
		</div>
        <div class="section">
			<newspapercard v-for="newspaper in newspapers" :key="newspaper.id" :newspaper_id="newspaper.id"/>
		</div>
        <div class="section">
			<photoalbumscard v-for="photoalbum in photoalbums" :key="photoalbum.id" :photoalbum_id="photoalbum.id"/>
		</div>

        <div class="section">
			<notecard v-for="note in notes" :key="note.id" :note_id="note.id"/>
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
import photoalbumscard from "@/components/parts/photoalbumscard";
import notecard from "@/components/parts/notecard";
import newspapercard from "@/components/parts/newspapercard";

import logo from "@/assets/logo";

// {{gt("genres")}}
		
	export default {
		components: {
		bookcard,
        photoalbumscard,
        notecard,
        newspapercard

		},
		name: 'Search',
		metaInfo:{
			title:title_page("","Search"),
		},
		
		data: () => ({
			profile_picture_url:"",
			profile_name:"",
			seaching_text:"",
			showSidepanel:false,
			menuVisible: false,
			searchedBooks:[],
            photoalbums:[],
            notes:[],
            newspapers:[],
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
//notes
				q=query(collection(firestore,"notes"),where("note_name","<=",this.seaching_text),where("note_name",">=",this.seaching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_notes_exist({id:element.id});
				});

                q=query(collection(firestore,"notes"),where("keywords","array-contains",[this.seaching_text]),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_notes_exist({id:element.id});
				});
				 q=query(collection(firestore,"notes"),where("author_name","<=",this.seaching_text),where("author_name",">=",this.seaching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_notes_exist({id:element.id});
				});

				q=query(collection(firestore,"notes"),where("note_name","<=",this.seaching_text),where("note_name",">=",this.seaching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_notes_exist({id:element.id});
				});

//photoalbums
				q=query(collection(firestore,"photoalbums"),where("photoalbum_name","<=",this.seaching_text),where("photoalbum_name",">=",this.seaching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_photoalbums_exist({id:element.id});
				});

                q=query(collection(firestore,"photoalbums"),where("keywords","array-contains",[this.seaching_text]),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_photoalbums_exist({id:element.id});
				});
				 q=query(collection(firestore,"photoalbums"),where("author_name","<=",this.seaching_text),where("author_name",">=",this.seaching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_photoalbums_exist({id:element.id});
				});

				q=query(collection(firestore,"photoalbums"),where("photoalbum_name","<=",this.seaching_text),where("photoalbum_name",">=",this.seaching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_photoalbums_exist({id:element.id});
				});
                //newspapers
				q=query(collection(firestore,"newspapers"),where("newspaper_name","<=",this.seaching_text),where("newspaper_name",">=",this.seaching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_newspapers_exist({id:element.id});
				});

                q=query(collection(firestore,"newspapers"),where("keywords","array-contains",[this.seaching_text]),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_newspapers_exist({id:element.id});
				});
				 q=query(collection(firestore,"newspapers"),where("author_name","<=",this.seaching_text),where("author_name",">=",this.seaching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_newspapers_exist({id:element.id});
				});

				q=query(collection(firestore,"newspapers"),where("newspaper_name","<=",this.seaching_text),where("newspaper_name",">=",this.seaching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_newspapers_exist({id:element.id});
				});                 

				
				this.dataReady=true;
				console.log(this.searchedBooks);
			},
			gt(a){
					return get_text(a);
				},
			check_element_exist(b){
			 if(!this.searchedBooks.includes(b)) this.searchedBooks.push(b);
			 },
             check_element_notes_exist(b){
			 if(!this.notes.includes(b)) this.notes.push(b);
			 },
             check_element_photoalbums_exist(b){
			 if(!this.photoalbums.includes(b)) this.photoalbums.push(b);
			 },
             check_element_newspapers_exist(b){
			 if(!this.newspapers.includes(b)) this.newspapers.push(b);
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
