<template>
	<div v-if="dataReady">
		<md-card>
		<md-card-header>
        <md-card-header-text>
          <div class="md-title">{{displayname()}} ❤️ {{gt("favorites")}}</div>
		   </md-card-header-text>
		   </md-card-header>
		<md-card-content>
          <card :profile="fav.profile" :chapter="fav.chapter" v-for="fav in favorites" :key="fav.a" :id="fav.id" />
        </md-card-content>
	</md-card>		
		
	</div>

</template>

<script>
import {signOut,getAuth} from "firebase/auth";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,storage} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit,getDocsFromCache} from "firebase/firestore";
import {get_text,languages,get_defaultlanguage,title_page} from "@/languages";
import card from "@/components/parts/card";


	export default {
		components: {
			 card
		},
		metaInfo:{
			title:title_page("","favorites"),
		},
		name: 'Favorite',
		data: () => ({
			book_title:"",
			book_author:"",
			book_year:"",
			upload_date:"",
			book_keywords:[],
			dataReady: false,
			user:{},
			favorites:[]
			
		}),
		async mounted() {
			let bookmarks=collection(firestore,`users/${getAuth().currentUser.uid}/favorites`);
			let user_ref;
			
			user_ref= await getDocs(bookmarks);
		
    		
			user_ref.forEach(element =>
			{
				
					this.favorites.push({"profile":element.data().profile,"id":element.data().id,"chapter":element.data().chapter,a:element.id});
				
			});
			console.log(this.favorites);
			this.dataReady=true;
		},
		methods: {
			 
			remove_from_favorite()
			{

			},
			displayname()
			{
				return getAuth().currentUser.displayName;
			},
			gt(a)
				{
					return get_text(a);
				},
		}
	}
	
</script>

<style lang="scss">
	

	
</style>
