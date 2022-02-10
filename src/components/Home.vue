<template>
	<div v-if="dataReady">
<div class="section">
	<md-card>
		<md-card-header>
        <md-card-header-text>
          <div class="md-title"><md-icon class="md-icon icon-color">local_fire_department</md-icon> {{gt("popular_ones")}}</div>
		   </md-card-header-text>
		   </md-card-header>
		    <md-card-content>
         	<card :profile="p.profile" v-for="p in  popular_ones" :key="p.id" :id="p.id" />
		 
        </md-card-content>
	</md-card>	
</div>
<div class="section">
	<md-card class="bookcards">
		<md-card-header>
        <md-card-header-text>
          <div class="md-title"><md-icon class="md-icon icon-color">library_add</md-icon> {{gt("recent_uploads")}}</div>
		   </md-card-header-text>
		   </md-card-header>
		    <md-card-content>
          
		  <card :profile="p.profile" v-for="p in  newest_ones" :key="p.id" :id="p.id" />
		  <div class="section">
		  <div class="middle-center"> <md-button @click="loadmore">{{gt("load_more")}}</md-button></div>
		  </div>
		</md-card-content>
	</md-card>
	</div>
	</div>
	
</template>

<script>
import {FireDb,FirebaseAuth,userId,firestore} from "@/firebase";
import cat from "../firebase/categories";
import {get_text,languages,get_defaultlanguage,title_page} from "@/languages";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit,orderBy,getDocsFromCache,OrderByDirection  } from "firebase/firestore";
import card from "@/components/parts/card";

	export default {
		name: "Home_Page",
		data: () => ({
			selectedMovies: [],
			selectedDate: null,
			boolean: false,
			dataReady:false,
			profilexpire:"",
			active:0,
			inactive:0,
			devices:{},
			loading_values:3,
			events:[],
			popular_ones:[],
			newest_ones:[],
		
			date: new Date(),
			
		}),
		metaInfo:{
			title:title_page("","Home"),
		},
		components:{
			card
    		
		},
		computed: {
			firstDayOfAWeek: {
				get() {
					return this.$material.locale.firstDayOfAWeek;
				},
				set(val) {
					this.$material.locale.firstDayOfAWeek = val;
				},
			
				
			},
			dateFormat: {
				get() {
					return this.$material.locale.dateFormat;
				},
				set(val) {
					this.$material.locale.dateFormat = val;
				}
			},
			profilename()
			{
				return FirebaseAuth.currentUser.displayName;
			},
			attributes() {
				return this.events.map(t => ({
					key: `events.${t.id}`,
					dot: {
					backgroundColor: "red",
					},
					dates: t.contact_date,
					customData: t.contact_name,
      }));
			}
			
		},
		async mounted()
		{
			await cat.categories.forEach(async (a)=>{
			let c=collection(firestore,`${a.name}`);
			let queryv=await query(c,orderBy("popularity","desc"),limit(1));
			let k= await getDocs(queryv);
			k.forEach(b=>{
				this.popular_ones.push({profile:a.name,id:b.id})
			});
			});
			
			await this.newest_refresh_ones();
			
			
				
			this.dataReady=true;	
		},
		methods: {
			gt(a)
			{
				return get_text(a);
			},
			showSuccess: function () {
				this.$noty.success("Success!");
			},
			showError: function () {
				this.$noty.error("Error :(", {
					killer: true,
					timeout: 1500,
				});
			},
			async newest_refresh_ones()
			{
				this.newest_ones=[];
			await cat.categories.forEach(async (a)=>{
			let c=collection(firestore,`${a.name}`);
			let queryv=await query(c,orderBy("upload_date","desc"),limit(this.loading_values));
			let k= await getDocs(queryv);
			k.forEach(b=>{
				this.newest_ones.push({profile:a.name,id:b.id})
			});
			});
			},
		
			async loadmore()
			{
				this.loading_values+=3;
				await this.newest_refresh_ones();
			}
		},
		
	}
</script>

<style lang="scss">
.icon-color
{
	color:#ed2553;
}
.md-card{
	min-width: 290px;
	padding:5px;
}
.bookcards{
	min-width: 250px;
}
</style>