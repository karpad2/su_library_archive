<template>
	<div>
	<md-card>	
		<md-card-header>
		{{gt("search")}}
		<b-tabs content-class="mt-3">
			<b-tab :title="gt('simple_search')" active>
				<md-field>
				<label>{{gt("search_by_name")}}</label>
				<md-input @change="searching" v-model="searching_text"></md-input>  
				</md-field>
			</b-tab>
			 <b-tab :title="gt('adv_search')">
						<md-field>
						<label>{{gt("search_by_name")}}</label>
						<md-input @change="searching" v-model="searching_text"></md-input>  
					</md-field>
					<md-field>
						<label>{{gt("release_date")}}</label>
						<md-input @change="searching" v-model="from_date"></md-input>
					</md-field>
					
			 </b-tab>
			<b-tab v-if="false" :title="gt('ft_search')+' (alpha)'"  disabled>
				<md-field>
				<label>{{gt("search_by_text")}}</label>
				<md-input @change="searching" v-model="searching_text"></md-input>  
				</md-field>
			</b-tab>


		</b-tabs>
	
		<md-button class="md-raised md-primary" @click="searching">{{gt(`search`)}}</md-button>
		</md-card-header>
		<md-card-content>
		<div class="section">
			<div style="width:auto; height:auto; display:inline;"  v-for="p in  searched" :key="p.chapter_id">
				<card :profile="p.profile"  :chapter="p.chapter_id" :id="p.id" />
			</div>	
		</div>
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
import {getStorage, ref, listAll,get,getDownloadURL} from "firebase/storage";
import Fuse from 'fuse.js';
import axios from "axios";
import card from "@/components/parts/card";
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
			mode:false,
			loading_values:10,
			from_date:"",
			to_date:"",
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
			dataReady:false,
			maps:[],
			options :{
  // isCaseSensitive: false,
  // includeScore: false,
      shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  // minMatchCharLength: 1,
  // location: 0,
  // threshold: 0.6,
  // distance: 100,
   useExtendedSearch: true,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  // fieldNormWeight: 1,
		keys: [
				"chapter_name",
				"category_name",
				"category_description",
				"chapter_description",
				"chapter_release_date"
			]}	
		}),
		async mounted() {
			await this.getmodel();
			if(this.$route.params.bsearch!=null) {
				this.seaching_text=this.$router.params.bsearch;
				await this.searching();
			}
			else await this.searching();	
			this.dataReady=true;
		},
		methods: {
			async searching()
			{
			this.searched=[];
			this.searchedcategories=[];
			this.dataReady=false;
			console.log(this.selectedCategories);
			const fuse=new Fuse(this.maps,this.options);
			let k;
			if(!this.mode)
			k=fuse.search(this.searching_text);
			else 
			{
			
			k=fuse.search({$and:[this.searching_text!=''?{$or:[{chapter_name:this.searching_text},{category_name:this.searching_text}]}:{},this.from_date!=''?{chapter_release_date:this.from_date}:{},this.upload_date!=''?{chapter_upload_date:this.upload_date}:{}]});
			
			
			}
			k.forEach((g)=>{
				this.searched.push(g.item);
			});
				this.dataReady=true;
			},
			gt(a){return get_text(a);},
			async loadmore()
			{
				this.loading_values+=10;
				await this.searching();
			},
			async getmodel()
			{
				let ref_storage =ref(storage,`sitemap.json`);
				let down= await getDownloadURL(ref_storage);
				let text=await axios.get(down);
				this.maps=text.data;	
			}			
		}
	}	
</script>
<style lang="scss">
	.a
	{
		margin: 3px;
	}
</style>