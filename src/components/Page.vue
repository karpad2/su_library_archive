<template>
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
</template>

<script>
import {signOut} from "firebase/auth";
import {FireDb,FirebaseAuth,change_Theme_Fb,storage,firestore} from "@/firebase";
import { getStorage, ref, listAll,get } from "firebase/storage";
import InnerImageZoom from 'vue-inner-image-zoom';
import {getDoc,doc} from "firebase/firestore";
import loading from "@/components/parts/loading";
import logo from "@/assets/logo";

	export default {
		components: {
		InnerImageZoom
		},
		props:["book_id","page"],
		name: 'Page',
		data () {
			return{
				book:{},
				mpagechooser :false,
				dataReady:false,
				image:"",
				image_pre:[],
				choosed_pager:0,
				preloading_page_number:3
			}
		},
		async mounted() {
			 this.image = ref(storage, `books/${this.book_id}/pages/${this.page}.jpg`);
			 this.book=await getDoc(doc(firestore,"books",this.book_id)).data();
			for(let i=this.page;i<this.page+this.preloading_page_number;i++)
			{
				this.add_page_to_load(i);
			}
			
			if (this.page<=0 || this.page>this.page_count)
				this.back_to_home();
			

			 this.dataReady=true;
		},
		methods: {
			add_page_to_load(lo)
			{
				if ( !( lo in this.image_pre ) ) {
    				this.image_pre[lo] = {
						id:lo,
						url:ref(storage, `/books/${this.book_id}/pages/${lo}.jpg`)
					};
				}
			},
			next_page()
			{
				this.enter_read(this.page+1);	
			},
			last_page()
			{
			
			this.enter_read(this.book.page_count);
			},
			back_one_page()
			{
			if(this.page==1) return;
			this.enter_read(this.page-1);
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
			go_to_page_modul()
			{
				this.enter_read(this.choosed_pager);
			},

			enter_read(i)
			{
				this.$router.push(`/book/${this.book_id}/${this.book.book_name}/page/${i}`);
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

<style lang="scss">
.img{
	width: 1280px;
	height: 1808px;
	aspect-ratio: auto 1280 / 1808;
	text-align: center;
	max-width: 100%;
}
</style>
