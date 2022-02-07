<template>
	<div v-if="dataReady">
		<md-card>
		<md-card-header>
        <md-card-header-text>
          <div class="md-title">{{displayname()}} ❤️ {{gt("favorites")}}</div>
		   </md-card-header-text>
		   </md-card-header>
		<md-card-content>
          <card profile="books" v-for="fav in favorites" :key="fav" :id="fav" />
        </md-card-content>
	</md-card>		
		
	</div>

</template>

<script>
import {signOut,getAuth} from "firebase/auth";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,storage} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit,getDocFromCache} from "firebase/firestore";
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

			let user_ref;
			try{
			user_ref= await getDocFromCache(doc(firestore,"users",getAuth().currentUser.uid));
			}
			catch(e)
			{
				user_ref= await getDoc(doc(firestore,"users",getAuth().currentUser.uid));
			}
    		this.user=user_ref.data();
			this.user.favorites.forEach(element =>
			{
				if(element!="test")
				{
					this.favorites.push(element);
				}
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
