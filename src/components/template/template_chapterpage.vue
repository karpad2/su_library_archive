<template>
<div>
<div v-if="dataReady">
	
<md-toolbar class="md-primary">
	<md-button @click="back_to_home" class="small"><md-icon>reply</md-icon></md-button>

	<hide-at breakpoint="small"> 
	</hide-at>
	<div class="md-toolbar-section-end">
	<hide-at breakpoint="small"> 
		<div>
		<md-button :id="idConfig.zoomOut" ><md-icon>zoom_out</md-icon></md-button>
		<md-button :id="idConfig.zoomIn"><md-icon>zoom_in</md-icon></md-button>
		<md-button v-if="inlibrary || admin" @click="print_local"><md-icon>print</md-icon></md-button>
		</div>
	</hide-at>
	<md-button @click="fullscreen_toggle" class="small"><md-icon>fullscreen</md-icon></md-button>
	<md-button @click="bookmark_add" class="small"><md-icon>bookmark_add</md-icon></md-button>
	
	<hide-at breakpoint="small"> 
		<md-button @click="settings"><md-icon>settings</md-icon></md-button>
	</hide-at>
	</div>
</md-toolbar> 
<div class="section">
	<vue-pdf-app :id-config="idConfig" style="width:auto; height: 80vh;" :page-number="page" :pdf="b64_file" ></vue-pdf-app>
</div>



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
import VuePdfApp from "vue-pdf-app";
import {FireDb,FirebaseAuth,change_Theme_Fb,storage,firestore,libraryuser,Firebasecren} from "@/firebase";
import { getStorage, ref, listAll,get, getDownloadURL } from "firebase/storage";
import InnerImageZoom from 'vue-inner-image-zoom';
import 'vue-inner-image-zoom/lib/vue-inner-image-zoom.css';
import axios from "axios";
import bugreportwebhook from "../../firebase/credentials";
import {get_text,languages,get_defaultlanguage,title_page,replace_white} from "@/languages";
import {getDoc,doc, getDocFromCache, collection, query,where, getDocs, addDoc, documentId, deleteDoc} from "firebase/firestore";
import loading from "@/components/parts/loading";
import {generatePdfThumbnail} from 'pdf-thumbnails-generator-k2';
import {showAt, hideAt} from 'vue-breakpoints';
import firebaseCredentials from "../../firebase/credentials";
import logo from "@/assets/logo";

	export default {
		components: {
		
		 hideAt,
		 VuePdfApp,
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
				profile:"poster",
				chapter:{},
				libraryuser:false,
				mpagechooser :false,
				dataReady:false,
				image:"",
				config:{
       			 toolbar: false
      			},
				idConfig: { zoomIn: "zoomInId", zoomOut: "zoomOutId"},
				pdf_file_url:"",
				chapter_id:"",
				zoom_scale:1,
				fullscreen:false,
				zooming:0,
				page:1,
				image_pre:[],
				title_side:"",
				admin:false,
				b64_file:null,
				print_id:"",
				inlibrary:false,
				print_page:"",
				member:false,
				promotion:false,
				user:{},
				choosed_pager:0,
				preloading_page_number:3,
				settings_dialog:false,
				thumbnails:[]
			}
		},
		async mounted() {
			//if( await getAuth().currentUser==null) return;
			
			
			this.chapter_id= this.$route.params.cid;
			this.page = Number(this.$route.params.pid);
			if(this.$route.params.viewtype!=undefined)
			{
				this.profile=this.$route.params.viewtype;
			}
			/*try{
			this.user= getAuth().currentUser;
			}
			catch (ex)
			{
			 //this.$router.push("/");
			 	
			}*/
			let k;
			if(FirebaseAuth.currentUser==null) this.back_to_home();
		
           k=await getDoc(doc(firestore,"users",FirebaseAuth.currentUser.uid)); 
        


			this.admin=(k.data().admin==null?false:k.data().admin);
			this.member=(k.data().member==null?false:k.data().member);
			// if(!this.member||!this.admin)  this.$router.push("/");
			//this.libraryuser= await libraryuser();
			let get_under; //= await getDoc(doc(firestore,"properties","global_flags"));
			
			
			
           get_under=await getDoc(doc(firestore,"properties","global_flags"));
           
        
			this.promotion=get_under.data().promotion;


			if(((this.member||this.admin) || this.promotion))  console.log("login_okay");
			else this.back_to_home();

		//if(!(this.member||this.admin||this.promotion)) this.back_to_home();

			 let image_ref = ref(storage, `/${this.profile}/${this.$route.params.nid}/chapters/${this.$route.params.cid}/book.pdf`);// loading page from bucket
			 this.pdf_file_url= await getDownloadURL(image_ref);
			const newCache = await caches.open('su-library-archive');
			 let response= await newCache.match(this.pdf_file_url);
			 if(!response||!response.ok)
			 {
				 await newCache.add(this.pdf_file_url);
				 response= await newCache.match(this.pdf_file_url);
			 }

			 await response.blob().then((blob)=>{

			var objectURL = URL.createObjectURL(blob);
			this.b64_file=objectURL;
			});

			
			/*
			for(let i=0;i<_num;i++)
			{
			await localStorage.setItem(`${this.pdf_file_url}_${i}`,JSON.stringify(this.thumbnails[i]));
			}
			}
			else
			{

				for(let i=0;i<_num;i++)
			{*/
			// this.thumbnails[i]= await JSON.parse(localStorage.getItem(`${this.pdf_file_url}_${i}`));
			/*}
			}*/

			// this.pdf_file_url= await getDownloadURL(image_ref);
			 

			 //this.$emit('fullscreen',true);
			 let chapter_ref;
			 try{
			 chapter_ref=await getDocFromCache(doc(firestore,`/${this.profile}/${this.$route.params.nid}/chapters`,this.chapter_id));
			 }
			 catch(e)
			 {
				 chapter_ref=await getDoc(doc(firestore,`/${this.profile}/${this.$route.params.nid}/chapters`,this.chapter_id));
			 }

			 this.chapter=chapter_ref.data();

		
			
			/*if (this.page<=0 || this.page>Number(this.chapter.page_number))
			{
				console.log("Back to home in mounted");
				this.back_to_home();
			}	*/
			
			 this.setup_shortcuts();
			 this.dataReady=true;
			await this.checkin();
			  setInterval( async()=>{
			 this.title_side=title_page(`${this.chapter.name} - ${this.gt("page")} ${this.pn()}`);
			 
			 },500);
		},
		methods: {
			/*async add_page_to_load(lo)
			{
				let prev= ref(storage,`${this.profile}/${this.$route.params.nid}/chapters/${this.$route.params.cid}/pages/${lo}.jpg`);
				let l={
						id:lo,
						url: await getDownloadURL(prev)
					};
				if ( !this.image_pre.includes(l)) {
    				this.image_pre.push(l); 
				}
			},*/
			async bookmark_add()
			{
				let c=await collection(firestore,`/users/${await getAuth().currentUser.uid}/bookmarks`);
			
				 let q=await addDoc(c,{
					 "profile":this.profile,
					 "id":this.$route.params.nid,
					 "chapter":this.$route.params.cid,
					 "page":this.pn()
					});

					this.$noty.success(this.gt("bookmark_added"), {
						killer: true,
						timeout: 1500,
					});
				
			},

			next_page()
			{
				this.enter_read(this.page+1);	
			},
			async checkin()
			{
				axios.get("https://api.ipify.org?format=json")
				.then(resp => {
					if(resp.data.ip==firebaseCredentials.public_profile.ip||resp.data.ip==firebaseCredentials.public_profile.ip2)
					{
						this.inlibrary=true;
					}
        		//console.log(resp.data);
    			})
			},
			last_page()
			{
			
			this.enter_read(this.chapter.page_number);
			},
			back_one_page()
			{
			if(this.page==1) return;
			this.enter_read(this.page-1);
			},
			back_to_home()
			{
				this.$router.push(`/view/${this.profile}/${this.$route.params.nid}/${replace_white(this.$route.params.nname)}`);
				
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
				this.$router.push(`/view/${this.profile}/${this.$route.params.nid}/${replace_white(this.$route.params.nname)}/chapter/${this.chapter_id}/page/${this.idConfig.pageNumber}`);
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
				//window.addEventListener("keydown",this.escapeListener);
			},
			escapeListener(event)
			{
				if(this.$route.params.pid == undefined || this.$route.params.bid==undefined) return;
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

			},
			pn()
			{
				return document.getElementById("pageNumber").value;
			},
			async print_local()
			{
				if(!this.admin)
				{
				if(this.print_id!="")
				{
					this.$noty.success(this.gt("print_request_has_been_already_sended"), {
						killer: true,
						timeout: 1500,
					});
				}
				else {
				let c=collection(firestore,"printings");
				let save_pc=await addDoc(c,{name:this.$route.params.nname,url:window.location.href,status:"not-decided",page:this.pn()});
				this.print_id=save_pc.id;
				localStorage.setItem(`print-${save_pc.id}`,{name:this.$route.params.nname,url:window.location.href});
				this.print_page=this.pn();
				await axios.post(bugreportwebhook.printurl,{username:getAuth().currentUser.displayName,avatar_url:getAuth().currentUser.photoURL,content:`Print request: ${window.location.href}`});
				this.$noty.success(this.gt("sended_print_request"), {
						killer: true,
						timeout: 1500,
					});
				setInterval( async ()=>
				{
					
						let status= await getDoc(doc(firestore,`printings/${this.print_id}`));
						console.log(status.data().status);
						if(status.data().status!='not-decided')
						{
							if(status.data().status=="true")
							{		
								
								 //let thumbnails=await generatePdfThumbnails(this.pdf_file);

								 let images=(await generatePdfThumbnail(this.b64_file,this.print_page,1500))[0];
								 let image= images.thumbnail;
								 var _window=window.open("","PrintWindow","width=800,height=600");
								 await _window.document.write(`<img style="height:98vh" src="${image}" alt="${this.print_page}" />`);
								 _window.print();
								 _window.close();
								await deleteDoc(c,save_pc.id);
								this.print_id="";
								 //window.print();
							}
							else
							{
								await deleteDoc(c,save_pc.id);
							}	
							localStorage.setItem(`print-${save_pc.id}`,null);
						}

					
				},5000)
				}
			}
			else 
			{
				let k= parseInt(await this.pn());
				console.log(k);
				 let images=await generatePdfThumbnail(this.b64_file,k,1500);
								 let image= images[0].thumbnail;
								 var _window=window.open("","PrintWindow","width=800,height=600");
								 await _window.document.write(`<img style="height:98vh" src="${image}" alt="${k}" />`);
								 _window.print();
								 _window.close();
								//await deleteDoc(c,save_pc.id);
								this.print_id="";
			}
				
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

#download,#openFile,#secondaryToolbarToggle,#viewBookmark,#sidebarToggle,#print,#presentationMode
{
  display: none;
}
#thumbnailView{
	min-width: 170px;
}

</style>
