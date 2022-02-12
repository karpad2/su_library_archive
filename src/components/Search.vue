<template>
	<div>
	<md-card>	
		<md-card-header>
		{{gt("search")}}
		<md-field>
			<label>{{gt("search_by_name")}}</label>
			<md-input @change="searching" v-model="searching_text" >{{gt("search")}}</md-input>
		</md-field>
		<md-field>
			<label>{{gt("search_by_author")}}</label>
			<md-input @change="searching" v-model="searching_author" ></md-input>
		</md-field>
		<md-field>
        <label for="categories">{{gt("categories")}}</label>
        <md-select :md-selected="searching" v-model="selectedCategories" name="categories" id="categories" multiple>
          <md-option v-for="category in categories" :key="category.name" :value="category.name">{{gt(category.name)}}</md-option>
          
        </md-select>
      </md-field>
		<md-field>
			<label>{{gt("search_by_keywords")}}</label>
			<md-input @change="searching" v-model="seaching_keywords" ></md-input>
		</md-field>

		<md-datepicker  :md-closed="searching"  v-model="fromdate">
              <label>{{gt("from_date")}}</label>
        </md-datepicker>
		<md-datepicker  :md-closed="searching"  v-model="todate">
              <label>{{gt("to_date")}}</label>
        </md-datepicker>

		<md-datepicker  :md-closed="searching" v-model="upload_date">
              <label>{{gt("upload_date")}}</label>
        </md-datepicker>
		<md-button class="md-raised md-primary" @click="searching">{{gt(`search`)}}</md-button>
          


		
		</md-card-header>
		<md-card-content>
		 
		
		<div class="section">
			<div style="width:auto; height:auto; display:inline;"  v-for="p in  searched" :key="p.chapter">
				<card :profile="p.profile" v-if="p.chapter!=null"  :chapter="p.chapter" :id="p.id" />
				</div>
			
			<div style="width:auto; height:auto; display:inline;" :v-if="searched.length==0" v-for="p in  searchedcategories" :key="p.id">
				<card :profile="p.profile"   :id="p.id" /></div>
			</div>
        <div class="middle-center"> <md-button @click="loadmore">{{gt("load_more")}}</md-button></div>
		</md-card-content>
	</md-card>
	</div>
</template>

<script>
/* eslint-disable */
import {signOut} from "firebase/auth";
import {get_text,languages,get_defaultlanguage,title_page} from "@/languages";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,storage} from "@/firebase";
import acategories from "../firebase/categories";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit, orderBy  } from "firebase/firestore";
import { getStorage, ref, listAll,get } from "firebase/storage";
import loading from "@/components/parts/loading";
import card from "@/components/parts/card";

import logo from "@/assets/logo";

// {{gt("genres")}}
		
	export default {
		components: {
		card

		},
		name: 'Search',

		metaInfo(){
			return{
			title:title_page("","Search"),
			keywords:title_page("","Search"),
			content:title_page("","Search"),
			}
		},
		
		data: () => ({
			profile_picture_url:"",
			profile_name:"",
			loading_values:10,
			fromdate:"",
			todate:"",
			upload_date:"",
			searching_text:"",
			searching_author:"",
			showSidepanel:false,
			menuVisible: false,
			searched:[],
			searchedcategories:[],
            photoalbums:[],
			selectedCategories:[],
			seaching_keywords:[],
			categories:acategories.categories,
            notes:[],
            newspapers:[],
			userTheme: "default",
			loading_screen:false,
			dataReady:false
			
		}),
		async mounted() {
			
			if(this.$route.params.bsearch!=null)
			{
			this.seaching_text=this.$router.params.bsearch;
			await this.searching();
			}else 
			{
				await this.searching();
			}
			

			this.dataReady=true;
		},
		methods: {
			async searching()
			{
			this.searched=[];
			this.searchedcategories=[];
			this.dataReady=false;
			//console.log(this.selectedCategories);
			await acategories.categories.forEach(async (a)=>{
			if(this.selectedCategories.length>0)		
			if(this.selectedCategories.indexOf(a.name)<0) return;
			let c=collection(firestore,`${a.name}`);
			
			let e=await getDocs(c);
			e.forEach(async (bb)=>{
				let d=collection(firestore,`${a.name}/${bb.id}/chapters`);
				let queryv=d;
				if(this.searching_text!=""&& this.searching_text.length>3){
				queryv=await query(queryv,where("name",">=",this.searching_text),where("name","<=",this.searching_text+'\uf8ff'));
			}

			if(this.searching_author!="" && this.searching_author.length>3){
				queryv=await query(queryv,where("name","<=",this.searching_author+'\uf8ff'),where("name",">=",this.searching_author));
			}
			if(this.fromdate!="" && this.fromdate.length>3){
				queryv=await query(queryv,where("release_date",">=",Date(this.fromdate+'\uf8ff').toISOString().substring(0,10)));
			}

			if(this.todate!="" && this.todate.length>3){
				queryv=await query(queryv,where("release_date","<=", Date(this.todate+'\uf8ff').toISOString().substring(0,10)));
			}


			if(this.upload_date!="" && this.upload_date.length>3){
				queryv=await query(queryv,where("upload_date","==",Date(this.upload_date).toISOString().substring(0,10)));
			}

			queryv=await query(queryv,orderBy("name",'asc'),limit(this.loading_values));
			let k= await getDocs(queryv);
			k.forEach((b)=>{
				if(this.searched.indexOf({profile:a.name,id:bb.id,chapter:b.id})<0)
				this.searched.push({profile:a.name,id:bb.id,chapter:b.id})
			});

			
			{
				console.log("Search in main categories");
				let f;
				if(this.searching_text!="" && this.searching_text.length>3)
				{
					f= await query(c,where('name','<=',this.searching_text+'\uf8ff'));
				}

				let k= await getDocs(f);
				k.forEach((b)=>{
				if(this.searchedcategories.indexOf({profile:a.name,id:b.id})<0)
				{
				this.searchedcategories.push({profile:a.name,id:b.id})
				}
			});
			}
			});
			
			
			
			

			
			
			
			/*
			if(this.searching_author==""){
				queryv=await query(queryv,where("author","<=",this.searching_author));
			}*/


			

			
			});
				this.dataReady=true;
			},
			gt(a){
					return get_text(a);
				},
			async loadmore()
			{
				this.loading_values+=3;
				await this.searching();
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
