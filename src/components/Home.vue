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
          <bookcard v-for="p in  popular_one" :key="p.id" :book_id="p.id" />

		  <photoalbumscard v-for="p in  popular_one_photoalbum" :key="p.id" :photoalbum_id="p.id" />
        </md-card-content>
	</md-card>	
</div>
<div class="section">
	<md-card>
		<md-card-header>
        <md-card-header-text>
          <div class="md-title"><md-icon class="md-icon icon-color">library_add</md-icon> {{gt("recent_uploads")}}</div>
		   </md-card-header-text>
		   </md-card-header>
		    <md-card-content>
          <bookcard v-for="p in  newest_one" :key="p.id" :book_id="p.id" />
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
import bookcard from "@/components/parts/bookcard";
import photoalbumscard from "@/components/parts/photoalbumscard";
import {get_text,languages,get_defaultlanguage,title_page} from "@/languages";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit,orderBy,getDocsFromCache  } from "firebase/firestore";


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
			loading_values:10,
			events:[],
			popular_one:[],
			popular_one_photoalbum:[],
			popular_ones_newspapers:[],
			newest_one:[],
			newest_ones_pas:[],
			newest_ones_nps:[],

			date: new Date(),
			
		}),
		metaInfo:{
			title:title_page("","Home"),
		},
		components:{
			bookcard,
			photoalbumscard
    		
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
			
			
			//this.get_name();
			//this.events=get_data_from_allroomdb("events");
			
			this.popular_one=await this.popular_ones();
			this.popular_ones_newspapers=await this.fpopular_ones_newspapers();
			this.popular_ones_photoalbums=await this.popular_ones_photoalbums();
			this.newest_one= await this.newest_books();
			this.newest_ones_nps= await this.newest_newspapers();
			this.newest_ones_pas= await this.newest_photoalbums();
			
				
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
			async popular_ones()
			{
				let a=[];
				
				let q=query(collection(firestore,"books"),orderBy("popularity"),limit(5));
				let c;
				try
				{
					c=await getDocsFromCache(q);
				}
				catch(e)
				{
					c= await getDocs(q);
				}
				if(c.empty)
				{
					c= await getDocs(q);	
				}
				c.forEach(element => {
				a.push({
					id:element.id
				})
				
				});
				return  a;
			},
			async popular_ones_photoalbums()
			{
				let a=[];
				
				let q=query(collection(firestore,"photoalbums"),orderBy("popularity"),limit(5));
				let c;
				try
				{
					c=await getDocsFromCache(q);
				}
				catch(e)
				{
					c= await getDocs(q);
				}
				if(c.empty)
				{
					c= await getDocs(q);	
				}
				c.forEach(element => {
				a.push({
					id:element.id
				})
				
				});
				return  a;
			},
			async fpopular_ones_newspapers()
			{
				let a=[];
				
				let q=query(collection(firestore,"photoalbums"),orderBy("popularity"),limit(5));
				let c;
				try
				{
					c=await getDocsFromCache(q);
				}
				catch(e)
				{
					c= await getDocs(q);
				}
				if(c.empty)
				{
					c= await getDocs(q);	
				}
				c.forEach(element => {
				a.push({
					id:element.id
				})
				
				});
				return  a;
			},
			async newest_books()
			{
				let a=[];
				let q=query(collection(firestore,"books"),orderBy("uploading_date"),limit(this.loading_values));
				let c;
				try
				{
					c=await getDocsFromCache(q);
				}
				catch(e)
				{
					c= await getDocs(q);
				}
				if(c.empty)
				{
					c= await getDocs(q);	
				}
				c.forEach(element => {
				a.push({
					id:element.id
				})
				
				});
				return  a;
			},
			async newest_photoalbums()
			{
				let a=[];
				let q=query(collection(firestore,"photoalbums"),orderBy("uploading_date"),limit(this.loading_values));
				let c;
				try
				{
					c=await getDocsFromCache(q);
				}
				catch(e)
				{
					c= await getDocs(q);
				}
				if(c.empty)
				{
					c= await getDocs(q);	
				}
				c.forEach(element => {
				a.push({
					id:element.id
				})
				
				});
				return  a;
			},
			async newest_newspapers()
			{
				let a=[];
				let q=query(collection(firestore,"newspapers"),orderBy("uploading_date"),limit(this.loading_values));
				let c;
				try
				{
					c=await getDocsFromCache(q);
				}
				catch(e)
				{
					c= await getDocs(q);
				}
				if(c.empty)
				{
					c= await getDocs(q);	
				}
				c.forEach(element => {
				a.push({
					id:element.id
				})
				
				});
				return  a;
			},
			async loadmore()
			{
				this.loading_values+=10;
				await this.newest_books();
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
	min-width: 320px;
	padding:5px;
}
</style>