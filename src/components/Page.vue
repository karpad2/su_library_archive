<template>
<div>
<div v-if="dataReady">
	
<md-toolbar class="md-primary">
	<md-button @click="back_to_home"><md-icon>reply</md-icon></md-button>

	<md-button @click="mpagechooser=true">{{gt("pages")}} {{this.page}} / {{this.book.page_number}}</md-button>
	<md-button v-if="page>1" @click="last_page"><md-icon>navigate_prev</md-icon></md-button>
	<md-button @click="zoom_out"><md-icon>zoom_out</md-icon></md-button>

	<md-button @click="zoom_in"><md-icon>zoom_in</md-icon></md-button>
	<md-button v-if="page<book.page_number" @click="next_page"><md-icon>navigate_next</md-icon></md-button>
	<md-button @click="settings"><md-icon>settings</md-icon></md-button>
</md-toolbar> 
<div class="section">
	<InnerImageZoom   :src="image" class="img" :alt="page"/>
	<link rel="preload" as="image" :href="preimage.url" :v-for="preimage in image_pre" :key="preimage.id"/>
</div>
<md-toolbar class="md-primary">
	<md-button @click="back_to_home"><md-icon>reply</md-icon></md-button>

	<md-button @click="mpagechooser=true">{{gt("pages")}} {{this.page}} / {{this.book.page_number}}</md-button>
	<md-button v-if="page>1" @click="last_page"><md-icon>navigate_prev</md-icon></md-button>
	<md-button @click="zoom_out"><md-icon>zoom_out</md-icon></md-button>

	<md-button @click="zoom_in"><md-icon>zoom_in</md-icon></md-button>
	<md-button v-if="page<book.page_number" @click="next_page"><md-icon>navigate_next</md-icon></md-button>
	<md-button @click="settings"><md-icon>settings</md-icon></md-button>
</md-toolbar> 
<md-dialog-prompt
      :md-active.sync="mpagechooser"
      v-model="choosed_pager"
      md-title="What's your name?"
      md-input-maxlength="30"
      md-input-placeholder="Type your name..."
      md-confirm-text="Done"
	  md-confirm="" />

</div>
<loading  v-else/>
</div>
</template>

<script>
import {signOut} from "firebase/auth";
import {FireDb,FirebaseAuth,change_Theme_Fb,storage,firestore} from "@/firebase";
import { getStorage, ref, listAll,get, getDownloadURL } from "firebase/storage";
import InnerImageZoom from 'vue-inner-image-zoom';
import {get_text,languages,get_defaultlanguage,title_page,replace_white} from "@/languages";
import {getDoc,doc, getDocFromCache} from "firebase/firestore";
import loading from "@/components/parts/loading";
import logo from "@/assets/logo";

	export default {
		components: {
		InnerImageZoom
		},
		
		name: 'Page',
		data () {
			return{
				book:{},
				mpagechooser :false,
				dataReady:false,
				image:"",
				book_id:"",
				page:"",
				image_pre:[],
				choosed_pager:0,
				preloading_page_number:3
			}
		},
		async mounted() {
			this.book_id= this.$route.params.bid;
			this.page = Number(this.$route.params.pid);
			 let image_ref = ref(storage, `/books/${this.book_id}/pages/${this.page}.jpg`);
			 this.image= await getDownloadURL(image_ref);
			 let book_ref=await getDocFromCache(doc(firestore,"books",this.book_id));
			 this.book=book_ref.data();
			for(let i=this.page;i<(this.page+this.preloading_page_number);i++)
			{
				if(i<=Number(this.book.page_number)) this.add_page_to_load(i);
			}
			
			/*if (this.page<=0 || this.page>Number(this.book.page_number))
			{
				console.log("Back to home in mounted");
				this.back_to_home();
			}	*/

			 this.dataReady=true;
		},
		methods: {
			async add_page_to_load(lo)
			{
				let prev= ref(storage, `/books/${this.book_id}/pages/${lo}.jpg`);
				if ( !( lo in this.image_pre ) ) {
    				this.image_pre[lo] = {
						id:lo,
						url: await getDownloadURL(prev)
					};
				}
			},
			next_page()
			{
				this.enter_read(this.page+1);	
			},
			last_page()
			{
			
			this.enter_read(this.book.page_number);
			},
			back_one_page()
			{
			if(this.page==1) return;
			this.enter_read(this.page-1);
			},
			back_to_home()
			{
				this.$router.push(`/book/${this.book_id}/${replace_white(this.book.book_name)}`);
				
			},
			zoom_in()
			{

			},
			zoom_out()
			{

			},
			go_to_page_modul()
			{
				this.enter_read(this.choosed_pager);
			},

			enter_read(i)
			{
				this.$router.push(`/book/${this.book_id}/${replace_white(this.book.book_name)}/page/${i}`);
			},
			settings()
			{

			}

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

<style lang="scss" scope>
.img{
	width: 1280px;
	height: 1808px;
	aspect-ratio: auto 1280 / 1808;
	text-align: center;
	max-width: 100%;
}
</style>
