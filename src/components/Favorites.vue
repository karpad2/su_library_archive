<template>
	<div v-if="dataReady">
		<h3> </h3>

		<md-card>
		<md-card-header>
        <md-card-header-text>
          <div class="md-title">{{displayname()}} ❤️ {{gt("favorites")}}</div>
		   </md-card-header-text>
		   </md-card-header>
		    <md-card-content>
          <bookcard />
        </md-card-content>
	</md-card>
		
		
	</div>

</template>

<script>
import {signOut,getAuth} from "firebase/auth";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit  } from "firebase/firestore";
import {ref, set ,onValue,get, child} from "firebase/database";
import {get_text,languages,get_defaultlanguage} from "@/languages";


	export default {
		components: {
	
		},
		name: 'Favorite',
		data: () => ({
			book_title:"",
			book_author:"",
			book_year:"",
			upload_date:"",
			book_keywords:[],
			dataReady: false,
			
		}),
		mounted() {
			
			//let update_number=(await getDoc(collection(firestore,"books"),book_id)).data().favorites;
			//collection(firestore,"books").doc(book_id).update({popularity: update_number+1});
		

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
