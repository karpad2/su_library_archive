<template>
	<div>
	<div div v-if="dataReady">
<md-card>
		<md-card-header>
        <md-card-header-text>
          <div class="md-title"><h1>{{chapter.name}}</h1></div>
		   </md-card-header-text>
		   </md-card-header>
		    <md-card-content>
		<div class="book-container">
				<img   @click="enter_read(1)" draggable="false" style="border-radius: 3px; width:250px; display:inline; float:left"  :alt="'page_'+1" :src="thumbnails[0].thumbnail"/> 		 
		<div class="book-info">
			<p> <b>{{gt("name")}}:</b> <md-chip @click="gotoparent(book.name)" md-static>{{book.name}}</md-chip></p>
			<p v-if="chapter.author!=''&&chapter.author!=null"><b> {{gt("author_name")}}:</b> <md-chip @click="keyword_link(chapter.author)" md-static>{{chapter.author}}</md-chip></p>
			
			<p> <b>{{gt("keywords")}}:</b><md-chip @click="keyword_link(keyword)" :key="keyword" :v-model="keyword" v-for="keyword in chapter.keywords" md-static>{{keyword}}</md-chip> </p>
		<div>
		 <b>{{gt("information")}}:</b>
		<div v-html="chapter.description"></div>
		<div>
			<p hidden><b>{{gt("upload_date")}}</b>:{{chapter.upload_date}}</p>
			<p><b>{{gt("release_date")}}</b>:{{chapter.release_date}}</p>
		</div>
		</div>
		<div>
			<b>{{gt("page_number")}}</b>: <md-chip>{{numPages}}</md-chip>
			<div v-if="signed_in && !libraryuser">
				<md-button  @click="bookmark_add">❤️️ {{gt("favorite")}}</md-button>
				<md-button class="md-raised md-primary" v-if="admin" @click="movetoadmin">{{gt(`edit_${profile.split(0,profile.length-1)}`)}}</md-button>
			</div>
			<md-button class="md-raised md-primary" v-if="false" @click="addtofulltextsearch">{{gt(`add_to_full_text_search`)}}</md-button>	
		</div>
		<div >
		</div>
		</div>
		</div>
        </md-card-content>
	
	</md-card>
	<md-card v-if="(signed_in &&member||admin)||(signed_in&&promotion)">
		<md-card-content>
			<hide-at breakpoint="mediumAndAbove">
			<div>
				
				 <img  style="max-width:14vw; min-width:250px; border-radius: 3px;  margin: 0 auto; display:block" @click="enter_read(page)" draggable="false" v-for="page in size" :key="page"  :alt="'page_'+page" :src="thumbnails[page-1].thumbnail"/> 
				
			 </div>
			</hide-at>
			<show-at breakpoint="mediumAndAbove">
			<div>
				
				 <img  style="max-width:14vw; min-width:250px; border-radius: 3px; margin: 3px " @click="enter_read(page)" draggable="false" v-for="page in size" :key="page"  :alt="'page_'+page" :src="thumbnails[page-1].thumbnail"/> 
				
			 </div>
			</show-at>
		</md-card-content>
		 
	</md-card>
	<md-card v-else>
		<md-card-content>
			
			<div>
				<h3>{{gt("require_login_to_view")}}</h3>
			 </div>
			 
		</md-card-content>	
	</md-card>
	</div>
	<div v-else>
	<div id="wrapper">
		<canvas  width="250" height="385" id="canvas"></canvas>
	</div>
	 <md-progress-bar  md-mode="buffer" :md-value="amount" :md-buffer="buffer"></md-progress-bar>
	</div>
	</div>
</template>
<script>
import {signOut,getAuth} from "firebase/auth";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,storage,libraryuser} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit,updateDoc,getDocFromCache,arrayUnion,arrayRemove,addDoc, documentId} from "firebase/firestore";
import {get_text,languages,get_defaultlanguage,title_page,replace_white,replace_under} from "@/languages";
import { getStorage, ref, uploadBytes ,getDownloadURL, uploadString} from "firebase/storage";
import axios from "axios";
import {generatePdfPageNumber,generatePdfThumbnail,generatePdfText} from 'pdf-thumbnails-generator-k2';
import VuePdfApp from "vue-pdf-app";
import moment from "moment";
import loading from "@/components/parts/loading";
import flag from "@/components/parts/flag";
import {showAt, hideAt} from 'vue-breakpoints';



	export default {
		components: {
		hideAt,
		showAt
		},
		name: 'Book',
		data: () => ({
			book:{},
			chapter_id:"",
			logout:true,
			chapter_ref:"",
			loading_values:5,
			numPages:0,
			size:0,
			images:[],
			chapter:{},
			hide:false,
			libraryuser:false,
			loading_images:true,
			dataReady: false,
			signed_in:false,
			book_thumbnail:"",
			book_thumbnail_jpg:true,
			book_thumbnail_pdf:"",
			admin:false,
			member:false,
			thumbnails:[],
			promotion:false,
			is_favorite:false,
			title_side:title_page(),
			book_id:"",
			b64_file:null,
			generated_keywords:"",
			user:{},
			amount:10,
			buffer:20,
			aimage:null,
			ctx:null,
			canvas:null,
			config:{
				toolbar: false},
				idConfig: { zoomIn: "zoomInId", zoomOut: "zoomOutId",numPages: "vuePdfAppNumPages",pageNumber: "vuePdfAppPageNumber", print: "vuePdfAppPrint" },
			
		}),
		
		metaInfo(){
			return{
			title:title_page(this.chapter.name),
			meta:[
			{ name: 'keywords',content:this.book.keywords},
			{ name: 'description',content:this.book.description},
			{ name: 'og:image',content:this.thumbnails[0].thumbnail},
			]
			}
		},
		async mounted() {
			
			this.book_id=this.$route.params.nid;
			this.chapter_id=this.$route.params.cid;
			this.libraryuser=libraryuser();
			if(this.$route.params.viewtype!=undefined)
			{
				this.profile=this.$route.params.viewtype;
			}

			let get_under; //= await getDoc(doc(firestore,"properties","global_flags"));
           	get_under=await getDoc(doc(firestore,"properties","global_flags"));
			this.promotion=get_under.data().promotion;
			console.log(this.promotion);

			let book_ref;

		 book_ref=await getDoc(doc(firestore,`${this.profile}`,this.book_id));
		 this.book=book_ref.data();
		
           this.chapter_ref=await getDoc(doc(firestore,`${this.profile}/${this.book_id}/chapters`,this.chapter_id));
           this.chapter=this.chapter_ref.data(); 
        

			this.book=book_ref.data();
			this.buffer=40;
			let image_ref = ref(storage, `/${this.profile}/${this.$route.params.nid}/chapters/${this.$route.params.cid}/book.pdf`);// loading page from bucket
			 try
			 {
			 this.pdf_file_url= await getDownloadURL(image_ref);
			 }
			 catch{
				 //
			 }
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
				this.buffer=100;
				});
				if(this.chapter.page_number==null)
				{
					await this.gen_number();
					try{
					setDoc(doc(firestore,`${this.profile}/${this.book_id}/chapters/${this.chapter_id}`,),{page_number:this.numPages},{merge:true});
					}
					catch{
						//
					}
				}
				else
				{
					this.numPages=this.chapter.page_number;
				}
			
			 
			 this.progress=50;
			//this.pdf_file=response.blob();
			 
			await this.render();
			this.progress=80;
			

			this.generated_keywords+=`${this.book.name},${this.book.author},`;
			this.book.keywords.forEach(e=>
			{
				this.generated_keywords+=`${e},`;
			});
			try{
			setDoc(doc(firestore,`${this.profile}`,this.book_id),{popularity:this.book.popularity+1},{merge:true});
			}
			catch
			{
				//
			}
			this.signed_in=(await getAuth().currentUser!=null);
			
			if(this.chapter.name==null)
			{
				await setDoc(doc(firestore,`${this.profile}/${this.book_id}/chapters/${this.chapter_id}`,),{name:this.chapter.chapter_name},{merge:true});
			}
			if(this.signed_in)
			{
			this.user= getAuth().currentUser;
			let k;
			try{
       		  k=await getDoc(doc(firestore,"users",FirebaseAuth.currentUser.uid)); 
        
        }
        catch(e)
        {
         console.warn(e); 
        }


			this.admin=(k.data().admin==null?false:k.data().admin);
			this.member=(k.data().member==null?false:k.data().member);
			} 
			

			if(this.book.hided) this.$router.push("/home");
			this.title_side=title_page(this.book.name);
			if(this.signed_in)
				{
				let user_ref= await getDoc(doc(firestore,"users",getAuth().currentUser.uid));
				this.user=user_ref.data();
				}

			console.log(this.chapter.keywords)
			this.dataReady=true;
		},
		methods: {
			gt(a)
				{
					return get_text(a);
				},
			 async add_favorite()
    {
      let c=collection(firestore,`users/${getAuth().currentUser.uid}/favorites`);
      let _query=null;
     
      
        _query= query(c,where("profile","==",this.profile),where("id","==",this.book_id),where("chapter","==",this.chapter_id));
      
      let l=await getDoc(_query);
      if(!l.exists())
      {
     
      
       let q= await addDoc(c,{"profile":this.profile,"id":this.book_id,"chapter":this.chapter_id});
      
      }
    },
			enter_read(i)
			{
				if(((this.member||this.admin) || this.promotion) && (FirebaseAuth.currentUser!=null))  
				this.$router.push(`/view/${this.profile}/${this.book_id}/${replace_white(this.book.name)}/chapter/${this.chapter_id}/page/${i}`);
				else return;
			},
			keyword_link(i)
			{
				this.$router.push(`/search/${i}`);
			},
			movetoadmin()
			{
				this.$router.push(`/admin/content/${this.profile}/${this.book_id}/chapter/${this.chapter_id}`);
			},
			pagesRendered()
			{
			
			},
			loadmore()
			{
				this.loading_values+=10;
				this.render();
			},
			async bookmark_add()
			{
				let c=await collection(firestore,`/users/${await FirebaseAuth.currentUser.uid}/favorites`);
				 let q=await addDoc(c,{
					 "profile":this.profile,
					 "id":this.$route.params.nid,
					 "chapter":this.$route.params.cid,
					});

					this.$noty.success(this.gt("favorite_added"), {
						killer: true,
						timeout: 1500,
					});
				
			},
			async render()
			{
			let rendered_numbers_max=0;
			this.thumbnails=[];
			if(this.loading_values>this.numPages) {
				rendered_numbers_max=this.numPages;
				this.hide=true;
			 }
			else rendered_numbers_max=this.loading_values;
			if(FirebaseAuth.currentUser==null) rendered_numbers_max=1;
			this.size=rendered_numbers_max;
			const newCache = await caches.open('su-library-archive');
			 let response= await newCache.match(this.pdf_file_url);
			 if(!response||!response.ok)
			 {
				 await newCache.add(this.pdf_file_url);
				 response= await newCache.match(this.pdf_file_url);
			 	
			 }
			for(let i=1;i<=rendered_numbers_max;i++){
			 await this.generateThumnail(i);
			}
			setInterval(()=>{
			if(
			this.thumbnails.length+1==rendered_numbers_max) this.loading_images=false;
			},100);	 
			},
			gotoparent()
			{
			
				this.$router.push(`/view/${this.profile}/${this.book_id}/${replace_white(this.book.name)}`);
			
			},
			to_date_format(a)
			{
				return	moment(Date(a)).format("YYYY-MM-DD");
			},
			async gen_number()
			{
				this.numPages=await generatePdfPageNumber(this.b64_file);
			},
			async addtofulltextsearch()
			{

				let text=await generatePdfText(this.b64_file,1);
				console.log(text);
				/*for(let i=1;i<=this.numPages;i++)
				{
				let pagetext="";
			  	await axios.post(`https://cdn.subiblioteka.rs`,{"password":"4wgfnJzHukhMM4Pq","profiles":this.profiles,"id":this.$route.params.nid,"chapter_id":this.$route.params.cid,"page":i,"pagetext":pagetext});
				}*/
			},
			async generateThumnail(i){ 
			
			let image_ref = ref(storage, `/${this.profile}/${this.$route.params.nid}/chapters/${this.$route.params.cid}/pages/${i}.png`);// loading page from bucket
			 try {
			 let b= await getDownloadURL(image_ref);
			 const newCache = await caches.open('su-library-archive');
			 let response= await newCache.match(b);
			 if(!response||!response.ok)
			 {
				 await newCache.add(b);
				 response= await newCache.match(b);
			 }

				await response.blob().then((blob)=>{
				var objectURL = URL.createObjectURL(blob);
				this.thumbnails.push({"thumbnail":objectURL});
				});
			 }
			 catch 
			 {
			  let canvas=await document.getElementById("canvas");
			  //let ctx= await canvas.getContext('2d');	
			//ctx.clear(); 
			//await ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			await this.thumbnails.push(await (await generatePdfThumbnail(this.b64_file,i,250))[0]);
			 let image=new Image();
			 //let cv=new Canvas
			 //console.log(this.thumbnails);
 			//await canvas.toDataURL("image/webp",0.5);
			image.src= await this.thumbnails[i-1].thumbnail;
			image.alt=`image-${i}.webp`;
			this.aimage= await image;
		    
			window.requestAnimationFrame( await this.draw);
	        await setTimeout( async()=>{
			 await canvas.toBlob(async (blob)=>{
				 try{
				 console.log(blob);
				 await uploadBytes(image_ref,blob);
				 }
				 catch(e)
				 {
					 console.error(e);
				 }
			 });
			 },300);
			 }
			
			this.progress+=5;
			},
			async draw()
			{
			  let canvas=await document.getElementById("canvas");
			  let ctx= await canvas.getContext('2d');
			  canvas.toDataURL("image/webp",0.5);	
			  await ctx.drawImage(this.aimage,0,0);
			}
		},
		computed:{
			pagenumbers(){
				let l=[];
				for(let i=0;i<this.loading_values;i++)
				{
					if(i<this.numPages) l.push(i+1);
				}
				return l;
			}
		}
	}
</script>
<style lang="scss" >
	.book_cover{
		width: 350px;
		aspect-ratio: auto 350/494;
	}
	 .md-progress-bar {
    	margin: 24px;
  	}
	.big_container
	{
		display: inline-block;
		width: 48%;
		vertical-align: top;
	}	
.bookavatar{
	float: left;
    margin: 2 em;

}
.bookavatar img{
	width: 350px;
	aspect-ratio: auto 350/494; 
}
.book-info{
	float:left;
	margin: 50px;
}
.book-container
{
	overflow: auto;
	margin-bottom: 25px;
	padding: 30px 20px;
}
</style>
