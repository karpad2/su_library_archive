<template>
	<div>
<div class="section">
	<md-card>
		<md-card-header>
        <md-card-header-text>
          <div class="md-title"><md-icon class="md-icon icon-color">local_fire_department</md-icon> {{gt("popular_ones")}}</div>
		   </md-card-header-text>
		   </md-card-header>
		    <md-card-content>
          <bookcard />
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
          <bookcard />
        </md-card-content>
	</md-card>
	</div>
	</div>
	
</template>

<script>
import {FireDb,FirebaseAuth,userId,firestore} from "@/firebase";
import bookcard from "@/components/parts/bookcard";
import {get_text,languages,get_defaultlanguage} from "@/languages";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit  } from "firebase/firestore";
import {get_data_from_allroomdb,get_rooms,get_data_fromroomdb} from "@/mod_data/get_data";
import { orderByValue } from '@firebase/database';

	export default {
		name: "Home_Page",
		data: () => ({
			selectedMovies: [],
			selectedDate: null,
			boolean: false,
			profilexpire:"",
			active:0,
			inactive:0,
			devices:{},
			events:[],
			date: new Date(),
			
		}),
		components:{
			bookcard
    		
		},
		computed: {
			firstDayOfAWeek: {
				get() {
					return this.$material.locale.firstDayOfAWeek;
				},
				set(val) {
					this.$material.locale.firstDayOfAWeek = val;
				},
				popular_ones()
			{
				let a=[];
				let coll = collection(firestore,"books");
				let q=query(coll,orderByValue("popularity"),limit(5));
				let c=getDocs(q);
				c.forEach(element => {
				a.push({
					book_name:element.book_name,
					author:element.author,
					photoURL:element.book_cover
				})
				
				});
				return  a;
			},
			newest_books()
			{
				let a=[];
				let coll = collection(firestore,"books");
				let q=query(coll,orderByValue("uploading_date"),limit(10));
				let c=getDocs(q);
				c.forEach(element => {
				a.push({
					book_name:element.book_name,
					author:element.author,
					photoURL:element.book_cover
				})
				
				});
				return  a;
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
		mounted()
		{
			console.log(FirebaseAuth.currentUser);
			//this.get_name();
			//this.events=get_data_from_allroomdb("events");
			//console.log(this.$route)
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
			}
		},
		
	}
</script>

<style lang="scss">
.icon-color
{
	color:#ed2553;
}
</style>