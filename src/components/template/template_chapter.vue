<template>
	<div>
	<div div v-if="dataReady">
<md-card>
		<md-card-header>
        <md-card-header-text>
          <div class="md-title"> <h1>{{chapter.name}}</h1></div>
		   </md-card-header-text>
		   </md-card-header>
		    <md-card-content>
				<div class="book-container">
					<md-card @click="enter_read(1)" style="width:250px; display:inline; float:left">
				<img  v-if="!loading_images" @click="enter_read(1)" draggable="false"  :alt="'page_'+1" :src="thumbnails[0].thumbnail"/> 
				 <md-card-media-cover v-else md-solid>
        <md-card-media md-ratio="1:1">
          <loading/>
        </md-card-media>
      </md-card-media-cover>
			</md-card>
			
		<div class="book-info">
			<p> {{gt("name")}}: <md-chip @click="gotoparent(book.name)" md-static>{{book.name}}</md-chip></p>
			<p>{{gt("keywords")}}: <md-chip @click="keyword_link(keyword)" :key="keyword" :v-model="keyword" v-for="keyword in book.keywords" md-static>{{keyword}}</md-chip> </p>
		<div>
		{{gt("information")}}:
		<div v-html="book.description">
			</div>
			<div>
			
		<p>{{gt("upload_date")}}:{{book.upload_date}}</p>
		<p>{{gt("release_date")}}:{{book.release_date}}</p>
		</div>
		</div>
		<div>
			{{gt("page_number")}}: <md-chip>{{numPages}}</md-chip>
			<div v-if="signed_in">
			<md-button v-if="is_favorite" style="background-color:#ed2553"  @click="add_favorite">❤️️ {{gt("favorite")}}</md-button>
			<md-button v-else @click="add_favorite" >❤️️ {{gt("favorite")}}</md-button>
			<md-button class="md-raised md-primary" v-if="admin" @click="movetoadmin">{{gt(`edit_${profile.split(0,profile.length-1)}`)}}</md-button>
		
			</div>	
		</div>
		
		<div >
			
		</div>
		</div>
		</div>
        </md-card-content>
	
	</md-card>
	<md-card v-if="(signed_in &&member||admin)||(signed_in&&promotion)">
		<md-card-content>
			<div>
			<md-card @click="enter_read(page)" style="width:250px; display:inline" v-for="page in pagenumbers" :key="page">
				<img  v-if="!loading_images" @click="enter_read(page)" draggable="false"  :alt="'page_'+page" :src="thumbnails[page-1].thumbnail"/> 
				 <md-card-media-cover v-else md-solid>
        <md-card-media md-ratio="1:1">
          <loading/>
        </md-card-media>
      </md-card-media-cover>
			</md-card>
			
		<div class="middle-center"> <md-button v-if="!hide" @click="loadmore">{{gt("load_more")}}</md-button></div>
			 </div>
			 
		</md-card-content>	
	</md-card>	
	</div>
	 <loading v-else/>
	</div>

</template>

<script>
import {signOut,getAuth} from "firebase/auth";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,storage} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit,updateDoc,getDocFromCache,arrayUnion,arrayRemove} from "firebase/firestore";
import {get_text,languages,get_defaultlanguage,title_page,replace_white,replace_under} from "@/languages";
import { getStorage, ref, uploadBytes ,getDownloadURL} from "firebase/storage";
import {generatePdfPageNumber,generatePdfThumbnails} from 'pdf-thumbnails-generator-k2';
import VuePdfApp from "vue-pdf-app";
import moment from "moment";
import loading from "@/components/parts/loading";
import flag from "@/components/parts/flag";



	export default {
		components: {
		
		loading,
		
		
		
		},
		
		name: 'Book',
		data: () => ({
			book:{},
			chapter_id:"",
			chapter_ref:"",
			loading_values:10,
			numPages:0,
			chapter:{},
			hide:false,
			loading_images:true,
			dataReady: false,
			signed_in:false,
			book_thumbnail:"",
			book_thumbnail_jpg:true,
			book_thumbnail_pdf:"",
			admin:false,
			member:false,
			promotion:false,
			is_favorite:false,
			title_side:title_page(),
			book_id:"",
			generated_keywords:"",
			user:{},
			config:{
				toolbar: false},
		
				idConfig: { zoomIn: "zoomInId", zoomOut: "zoomOutId",numPages: "vuePdfAppNumPages",pageNumber: "vuePdfAppPageNumber", print: "vuePdfAppPrint" },
				
			
		}),
		metaInfo(){
			return{
			title:this.title_side,
			keywords:this.generated_keywords
			}
		},
		async mounted() {
			this.book_id=this.$route.params.nid;
			this.chapter_id=this.$route.params.cid;
			if(this.$route.params.viewtype!=undefined)
			{
				this.profile=this.$route.params.viewtype;
			}
			let book_ref;

			try{
        book_ref=await getDocFromCache(doc(firestore,`${this.profile}`,this.book_id));
        this.book=book_ref.data();
        }
        catch(e)
        {
           book_ref=await getDoc(doc(firestore,`${this.profile}`,this.book_id));
           this.book=book_ref.data(); 
        }

		try{
        this.chapter_ref=await getDocFromCache(doc(firestore,`${this.profile}/${this.book_id}/chapters`,this.chapter_id));
        this.chapter=this.chapter_ref.data();
        }
        catch(e)
        {
           this.chapter_ref=await getDoc(doc(firestore,`${this.profile}/${this.book_id}/chapters`,this.chapter_id));
           this.chapter=this.chapter_ref.data(); 
        }
			this.book=book_ref.data();

			let image_ref = ref(storage, `/${this.profile}/${this.$route.params.nid}/chapters/${this.$route.params.cid}/book.pdf`);// loading page from bucket
			 this.pdf_file_url= await getDownloadURL(image_ref);
			 const newCache = await caches.open('su-library-archive');
			 let response= await newCache.match(this.pdf_file_url);
			 if(!response||!response.ok)
			 {
				 await newCache.add(this.pdf_file_url);
				 response= await newCache.match(this.pdf_file_url);
			 }
			//this.pdf_file=response.blob();
			 
			 this.render();
			 
			

			this.generated_keywords+=`${this.book.name},${this.book.author},`;
			this.book.keywords.forEach(e=>
			{
				this.generated_keywords+=`${e},`;
			});
			setDoc(doc(firestore,`${this.profile}`,this.book_id),{popularity:this.book.popularity+1},{merge:true});
			this.signed_in=!(await getAuth().currentUser==null);
			
			if(this.chapter.name==null)
			{
				setDoc(doc(firestore,`${this.profile}/${this.book_id}/chapters/${this.chapter_id}`,),{name:this.chapter.chapter_name},{merge:true});
			}
			if(this.signed_in)
			{
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
			} 
			let get_under; //= await getDoc(doc(firestore,"properties","global_flags"));
			
				try{
        get_under=await getDocFromCache(doc(firestore,"properties","global_flags"));
        
        }
        catch(e)
        {
           get_under=await getDoc(doc(firestore,"properties","global_flags"));
           
        }
			this.promotion=get_under.data().promotion;
try{
			let ref_storage =ref(storage,`${this.profile}/${this.book_id}/chapters/${this.chapter_id}/thumbnail.jpg`);
			this.book_thumbnail= await getDownloadURL(ref_storage);
}
catch(ex)
{
	console.error(ex);
	this.book_thumbnail_jpg=false;
}
			if(this.book.hided) this.$router.push("/home");
			this.title_side=title_page(this.book.name);
			if(this.signed_in)
				{
				let user_ref= await getDoc(doc(firestore,"users",getAuth().currentUser.uid));
				this.user=user_ref.data();
				if(this.user.favorites==null){
				setDoc(doc(firestore,"users",getAuth().currentUser.uid),{favorites:["test"]},{merge:true});
				}
				else
				{
					this.is_favorite=this.user.favorites.includes(this.book_id);
				}
				//this.favorite=(this.user.favorites.indexOf(this.book_id)>=0);
				}

			this.dataReady=true;
		},
		methods: {
			gt(a)
				{
					return get_text(a);
				},
			async add_favorite()
			{
			this.is_favorite=!this.is_favorite;
			//let k= await getDoc(doc(firestore,"users",getAuth().currentUser.uid));
			if(!this.signed_in) return;
			if(this.is_favorite) {
			await updateDoc(doc(firestore,"users",getAuth().currentUser.uid),{favorites:arrayUnion(this.book_id)});
			let fav= (await getDoc(doc(firestore,`/${this.profile}`,this.book_id))).data().favorites;
			await updateDoc(doc(firestore,`/${this.profile}`,this.book_id),{favorites:this.book.favorites+1},{merge:true}); 
			}
			else 
			{
			await updateDoc(doc(firestore,"users",getAuth().currentUser.uid),{favorites:arrayRemove(this.book_id)});	
			let fav= (await getDoc(doc(firestore,`/${this.profile}`,this.book_id))).data().favorites;
			await updateDoc(doc(firestore,`/${this.profile}`,this.book_id),{favorites:this.book.favorites-1},{merge:true}); 
				
			}
			
			},
			enter_read(i)
			{
				this.$router.push(`/view/${this.profile}/${this.book_id}/${replace_white(this.book.name)}/chapter/${this.chapter_id}/page/${i}`);
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
				console.log(document.getElementById("canvas"));


			},
			loadmore()
			{
				this.loading_values+=10;
			},
			async render()
			{
			 this.numPages=await generatePdfPageNumber(this.pdf_file_url);
			 this.thumbnails=await generatePdfThumbnails(this.pdf_file_url,300);
			 this.book_thumbnail_pdf=this.thumbnails[0].thumbnail;
			 this.loading_images=false;
			},

			gotoparent()
			{
			
				this.$router.push(`/view/${this.profile}/${this.book_id}/${replace_white(this.book.name)}`);
			
			},
			to_date_format(a)
			{
				return	moment(Date(a)).format("YYYY-MM-DD");
			}
		},
		computed:{
			pagenumbers()
			{
				let l=[];
				for(let i=0;i<this.loading_values;i++)
				{
					if(i<this.numPages) l.push(i+1);
					//else {this.hide=true;}
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
