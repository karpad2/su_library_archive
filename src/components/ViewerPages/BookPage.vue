<template>
<div>
<div v-if="dataReady">
	
<md-toolbar class="md-primary">
	<md-button @click="back_to_home" class="small"><md-icon>reply</md-icon></md-button>
	<md-button v-if="page>1" @click="last_page"><md-icon>navigate_before</md-icon></md-button>
	<hide-at breakpoint="small"> 
		<md-button @click="mpagechooser=true" class="pages">{{gt("pages")}} {{this.page}} / {{this.book.page_number}}</md-button>
	</hide-at>
	<div class="md-toolbar-section-end">
	<hide-at breakpoint="small"> 
		<div>
		<md-button @click="zoom_out"><md-icon>zoom_out</md-icon></md-button>
		<md-button>{{zooming_percent}}%</md-button>
		<md-button @click="zoom_in"><md-icon>zoom_in</md-icon></md-button>
		</div>
	</hide-at>
	<md-button @click="fullscreen_toggle" class="small"><md-icon>fullscreen</md-icon></md-button>
	<md-button v-if="page<book.page_number" class="small" @click="next_page"><md-icon>navigate_next</md-icon></md-button>
	<hide-at breakpoint="small"> 
		<md-button @click="settings"><md-icon>settings</md-icon></md-button>
	</hide-at>
	</div>
</md-toolbar> 
<div class="section">
	<hide-at breakpoint="small">
	<inner-image-zoom  :width="1280*zoom_scale+'px'" :src="image" class="img" :zoomScale="zoom_scale" :alt="page"/>
	</hide-at>
	<hide-at breakpoint="mediumAndAbove">
		<img :src="image" class="img" />
	</hide-at>
	<link rel="preload" as="image" :href="preimage.url" v-for="preimage in image_pre" :key="preimage.id"/>
</div>
<md-toolbar class="md-primary">
	<md-button @click="back_to_home"><md-icon>reply</md-icon></md-button>
	<md-button v-if="page>1" @click="last_page"><md-icon>navigate_before</md-icon></md-button>
	<hide-at breakpoint="small"> 
	<md-button @click="mpagechooser=true" class="pages">{{gt("pages")}} {{this.page}} / {{this.book.page_number}}</md-button>
	</hide-at>
	<div class="md-toolbar-section-end">
	<hide-at breakpoint="small"> 
		<div>
		<md-button @click="zoom_out"><md-icon>zoom_out</md-icon></md-button>
		<md-button>{{zooming_percent}}%</md-button>
		<md-button @click="zoom_in"><md-icon>zoom_in</md-icon></md-button>
		</div>
	</hide-at>
	<md-button @click="fullscreen_toggle"><md-icon>fullscreen</md-icon></md-button>
	
	
	<md-button v-if="page<book.page_number" @click="next_page"><md-icon>navigate_next</md-icon></md-button>
	<hide-at breakpoint="small"> 
		<md-button @click="settings"><md-icon>settings</md-icon></md-button>
	</hide-at>
	</div>
</md-toolbar> 


<md-dialog-alert
      :md-active.sync="settings_dialog"
      :md-title="gt('keyboard_shortcuts')"
      :md-content="keyboard_shortcuts" />

</div>
<loading  v-else/>
</div>
</template>

<script>
import {signOut,getAuth} from "firebase/auth";
import {FireDb,FirebaseAuth,change_Theme_Fb,storage,firestore} from "@/firebase";
import { getStorage, ref, listAll,get, getDownloadURL } from "firebase/storage";
import InnerImageZoom from 'vue-inner-image-zoom';
import 'vue-inner-image-zoom/lib/vue-inner-image-zoom.css';
import {get_text,languages,get_defaultlanguage,title_page,replace_white} from "@/languages";
import {getDoc,doc, getDocFromCache} from "firebase/firestore";
import loading from "@/components/parts/loading";
import {showAt, hideAt} from 'vue-breakpoints';
import logo from "@/assets/logo";

	export default {
		components: {
		'inner-image-zoom': InnerImageZoom,
		 hideAt,
		loading
		},
		metaInfo(){
			return{
			title:this.title_side
			}
		},
		
		name: 'Page',
		data () {
			return{
				book:{},
				mpagechooser :false,
				dataReady:false,
				image:"",
				book_id:"",
				zoom_scale:1,
				fullscreen:false,
				zooming:0,
				page:1,
				image_pre:[],
				title_side:"",
				admin:false,
				member:false,
				promotion:false,
				user:{},
				choosed_pager:0,
				preloading_page_number:3,
				settings_dialog:false
			}
		},
		async mounted() {
			this.book_id= this.$route.params.bid;
			this.page = Number(this.$route.params.pid);
			this.user= getAuth().currentUser;
			let k;
			try{
        k=await getDocFromCache(doc(firestore,"users",this.user.uid));
        
        }
        catch(e)
        {
           k=await getDoc(doc(firestore,"users",this.user.uid)); 
        }


			this.admin=(k.data().admin==null?false:k.data().admin);
			this.member=(k.data().member==null?false:k.data().member);
			
			let get_under; //= await getDoc(doc(firestore,"properties","global_flags"));
			
				try{
        get_under=await getDocFromCache(doc(firestore,"properties","global_flags"));
        
        }
        catch(e)
        {
           get_under=await getDoc(doc(firestore,"properties","global_flags"));
           
        }
			this.promotion=get_under.data().promotion;
			if(!(this.member||this.admin||this.promotion)) this.back_to_home();

			 let image_ref = ref(storage, `/books/${this.book_id}/pages/${this.page}.jpg`);
			 this.image= await getDownloadURL(image_ref);

			 //this.$emit('fullscreen',true);
			 let book_ref;
			 try{
			 book_ref=await getDocFromCache(doc(firestore,"books",this.book_id));
			 }
			 catch(e)
			 {
				 book_ref=await getDoc(doc(firestore,"books",this.book_id));
			 }

			 this.book=book_ref.data();

			 this.title_side=title_page(`${this.book.book_name} - ${this.gt("page")} ${this.page}`);

			

			for(let i=this.page;i<(this.page+this.preloading_page_number);i++)
			{
				if(i<=Number(this.book.page_number))  await this.add_page_to_load(i);
			}
			
			/*if (this.page<=0 || this.page>Number(this.book.page_number))
			{
				console.log("Back to home in mounted");
				this.back_to_home();
			}	*/
			
			 this.setup_shortcuts();
			 this.dataReady=true;
		},
		methods: {
			async add_page_to_load(lo)
			{
				let prev= ref(storage, `/books/${this.book_id}/pages/${lo}.jpg`);
				let l={
						id:lo,
						url: await getDownloadURL(prev)
					};
				if ( !this.image_pre.includes(l)) {
    				this.image_pre.push(l); 
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
				this.$router.push(`/book/${this.book_id}/${replace_white(this.$route.params.bname)}`);
				
			},
			zoom_in()
			{
				if(this.zooming>=10) return;
				this.zooming++;
				this.zoom_scale=1+this.zooming/10;
			},
			zoom_out()
			{
				if(this.zooming<=-8) return;
				this.zooming--;
				this.zoom_scale=1+this.zooming/10;
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
				this.settings_dialog=true;
			},
			gt(a)
			{
				return get_text(a);
			},
			kb_shc(codes=[],name)
			{
				return `<tr><td><code>${codes[0]}</code>,<code>${codes[1]}</code></td><td width="100">${this.gt(name)}</td></tr>`;
			},
			setup_shortcuts()
			{
				window.addEventListener("keydown",this.escapeListener);
			},
			escapeListener(event)
			{
				if(event.key=="d"||event.key=="ArrowRight")
				{
					this.next_page();
				}
				if(event.key=="a"||event.key=="ArrowLeft")
				{
					this.back_one_page();
				}
				if(event.key=="+")
				{
					this.zoom_in();
				}
				if(event.key=="-")
				{
					this.zoom_out();
				}
			},
			fullscreen_toggle()
			{
				this.fullscreen=!this.fullscreen;
				localStorage.setItem("fullscreen",this.fullscreen);

			}


		},
		computed:{
			zooming_percent()
			{
				return Number.parseInt(this.zoom_scale*100);
			},
			keyboard_shortcuts()
			{
				return `<table>
					${this.kb_shc(["A","←"],"next_page")}
					${this.kb_shc(["D","→"],"back_page")}
					${this.kb_shc(["+","-"],"Zoom")}

					
					</table>`;
					/*
					${this.kb_shc(["W","↑"],"scroll_up")}
					${this.kb_shc(["S","↓"],"scroll_down")}
						${this.kb_shc(["Left Shift","Right Shift"],"skip_page")}
					
					*/
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
.md-button .md-ripple
{
	
	padding:5px
}
@media screen  {
	
}
</style>
