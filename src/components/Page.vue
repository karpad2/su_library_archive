<template>
<div v-if="dataReady">
	
<md-toolbar class="md-primary">
<md-button @click="back_to_home"><md-icon>reply</md-icon></md-button>

<md-button @click="last_page"><md-icon>navigate_prev</md-icon></md-button>
<md-button @click="zoom_out"><md-icon>zoom_out</md-icon></md-button>

<md-button @click="zoom_in"><md-icon>zoom_in</md-icon></md-button>
<md-button @click="next_page"><md-icon>navigate_next</md-icon></md-button>
</md-toolbar> 
<div class="section">
	<img  :src="image" :alt="page"/>
	<link rel="preload" as="image" :href="preimage.url" :v-for="preimage in image_pre" :key="preimage.id"/>
</div>

</div>
</template>

<script>
import {signOut} from "firebase/auth";
import {FireDb,FirebaseAuth,change_Theme_Fb,storage,firestore} from "@/firebase";
import { getStorage, ref, listAll,get } from "firebase/storage";
import {getDoc,doc} from "firebase/firestore";
import loading from "@/components/parts/loading";
import logo from "@/assets/logo";

	export default {
		components: {
		
		},
		props:["book_id","page"],
		name: 'Page',
		data () {
			return{
				book:{},
				dataReady:false,
				image:"",
				image_pre:[],
				preloading_page_number:3
			}
		},
		async mounted() {
			 this.image = ref(storage, `books/${this.book_id}/pages/${this.page}`);
			 this.book=await getDoc(doc(firestore,"books",this.book_id)).data();
			for(let i=this.page;i<this.page+this.preloading_page_number;i++)
			{
				this.add_page_to_load(i);
			}
			
			

			 this.dataReady=true;
		},
		methods: {
			add_page_to_load(lo)
			{
				if ( !( lo in this.image_pre ) ) {
    				this.image_pre[lo] = {
						id:lo,
						url:ref(storage, `/books/${this.book_id}/pages/${lo}`)
					};
				}
			},
			next_page()
			{
				this.$router.push(`/book/${this.book_id}/`)
			},
			last_page()
			{
			this.$router.push(`/book/${this.book_id}/${this.book.book_name}/page/${this.book.page_count}`);
			},
			back_one_page()
			{
			if(this.page==1) return;
			this.$router.push(`/book/${this.book_id}/${this.book.book_name}/page/${this.page-1}`);
			},
			back_to_home()
			{
				this.$router.push(`/book/${this.book_id}/${this.book.book_name}`);
				
			},
			zoom_in()
			{

			},
			zoom_out()
			{

			},

		}
	}
	/*
	{
					icon: 'person',
					title: 'Account',
					link: '/account',
					auth: true,
				},
	*/
</script>

<style lang="scss">
</style>
