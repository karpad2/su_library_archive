<template>
	<div>
	<div div v-if="dataReady">
<md-card>
		<md-card-header>
        <md-card-header-text>
          <div class="md-title"> <h1>{{newspaper.name}}</h1></div>
		   </md-card-header-text>
		   </md-card-header>
		    <md-card-content>
				<div class="newspaper-container">
				<div class="newspaperavatar">
				<img v-if="!loading_fail" draggable="false"  class="newspaper_cover" alt="newspaper_cover" :src="newspaper_thumbnail" />
				
				
				</div>
		<div class="newspaper-info">
			<p v-if="newspaper.author!=''&&newspaper.author!=null"><b> {{gt("author_name")}}:</b> <md-chip @click="keyword_link(newspaper.author)" md-static>{{newspaper.author}}</md-chip></p>
			<p v-if="newspaper.publisher!=''&&newspaper.publisher!=null"><b> {{gt("publisher")}}:</b> <md-chip @click="keyword_link(newspaper.publisher)" md-static>{{newspaper.publisher}}</md-chip></p>
			<p v-if="newspaper.keywords!=null"><b>{{gt("keywords")}}:</b> <md-chip @click="keyword_link(keyword)" :key="keyword" :v-model="keyword" v-for="keyword in newspaper.keywords" md-static>{{keyword}}</md-chip> </p>
			<p v-if="newspaper.language!=null"><b>{{gt("language")}}:</b> <md-chip @click="keyword_link(newspaper.language)" md-static><flag :flag="newspaper.language" /></md-chip> </p>
			<p v-if="newspaper.cobiss!=null"> <b>{{"Cobiss link"}}:</b> <md-chip @click="open_cobiss(newspaper.cobiss)" md-static>Cobiss</md-chip> </p>
		
		<div v-if="newspaper.description!=null">
		 <b>{{gt("information")}}: </b>
		<div v-html="newspaper.description">
		</div>
		<div>
			<p hidden>{{gt("upload_date")}}:{{newspaper.upload_date}}</p>
		</div>

		<div>
			
		</div>
		</div>
		<div>
			<b>{{gt("released_numbers")}}:</b> <md-chip>{{counted_chapters}}</md-chip>
			<div v-if="signed_in">
			<md-button  @click="bookmark_add">❤️️ {{gt("favorite")}}</md-button>
			
			</div>
			<md-button class="md-raised md-primary" v-if="admin" @click="movetoadmin">{{gt(`edit_${profile.split(0,profile.length-1)}`)}}</md-button>
				
		</div>
		
		</div>
		
		</div>
        </md-card-content>
	</md-card>
	<md-card>
		<b-table
		sticky-header
		striped
		hover
		:items="chapter_f"
		:fields="fields"
		
		>
		 <template #cell(#)="data">
        	{{ data.index + 1 }}
     	 </template>

		  <template #cell(chapter_nr)="data">
        	<span v-if="data.item.chapter_nr==''">-</span>
			<span v-else>{{data.item.chapter_nr}}</span>

     	 </template>

		  <template #cell(link)="data">
			  <b-button squared variant="outline-warning"  @click="$router.push(data.item.link)">{{gt("open")}}</b-button>
     	 </template>
		

		</b-table>

		<div>
			<md-button v-if="admin" class="md-primary md-raised" @click="$router.push(`/admin/content/${profile}/${newspaper_id}/chapter/new`)">{{gt('add_new_chapter')}}</md-button>
	 
		</div>
	</md-card>
	</div>
	 <loading v-else/>
	</div>

</template>

<script>
import {signOut,getAuth} from "firebase/auth";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,storage,libraryuser} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit,updateDoc,getDocFromCache,arrayUnion,arrayRemove, orderBy,addDoc} from "firebase/firestore";
import {get_text,languages,get_defaultlanguage,title_page,replace_white,replace_under} from "@/languages";
import { getStorage, ref, uploadBytes ,getDownloadURL} from "firebase/storage";
import moment from "moment";
import loading from "@/components/parts/loading";
import flag from "@/components/parts/flag";


	export default {
		components: {
		loading,
		flag
		},
		
		name: 'category_viewer',
		data: () => ({
			newspaper:{},
			profile:"newspaper",
			dataReady: false,
			signed_in:false,
			newspaper_thumbnail:"",
			admin:false,
			loading_fail:false,
			chapters:[],
			member:false,
			libraryuser:false,
			promotion:false,
			is_favorite:false,
			title_side:"",
			newspaper_id:"",
			generated_keywords:"",
			counted_chapters:0,
			loading_values:10,
			chapter_f:[],
			user:{},
			fields:[
				"#",
				 { key: "name", label: get_text("name"),sortable: true },
				 { key: "release_date", label: get_text("release_date"),sortable: true },
				
				
			]

			
			
		}),
		metaInfo(){
			return{
			title:title_page(this.newspaper.name),
			/*meta:[
			{ name: 'keywords',content:this.newspaper.keywords},
			{ name: 'description',content:this.newspaper.description},
			{ name: 'og:description',content:this.newspaper.description},
			{ name: 'og:image',content:`https://cdn.statically.io/screenshot/${window.location.href.replace('https://','')}`},
			]*/
			}
		},
		async mounted() {
			this.newspaper_id=this.$route.params.nid;
			let newspaper_ref;

			/*let get_under; //= await getDoc(doc(firestore,"properties","global_flags"));
           	get_under=await getDoc(doc(firestore,"properties","global_flags"));
			this.promotion=get_under.data().promotion;
			console.log(this.promotion);*/
			//this.libraryuser=libraryuser();
			
		if(this.$route.params.viewtype!=undefined)
			{
				this.profile=this.$route.params.viewtype;
			}
			if(this.profile=="newspapers")
			{
				this.fields=[
				"#",
				 { key: "name", label: get_text("name"),sortable: true },
				 { key: "chapter_nr", label: get_text("chapter_nr"),sortable: true },
				 { key: "release_date", label: get_text("release_date"),sortable: true },
				
				
			];
			}
			/*try{
       // newspaper_ref=await getDocFromCache(doc(firestore,this.profile,this.newspaper_id));
        //this.newspaper=newspaper_ref.data();
		//console.log( this.newspaper);
		
        }
        catch(e)
        {
           newspaper_ref=await getDoc(doc(firestore,`/${this.profile}`,this.newspaper_id));
           //this.newspaper=newspaper_ref.data(); 
        }*/
		newspaper_ref=await getDoc(doc(firestore,`/${this.profile}`,this.newspaper_id));
		this.newspaper=newspaper_ref.data();
			
			await this.load_chapters();
			let querya=query(collection(firestore,`/${this.profile}/${this.newspaper_id}/chapters`))
			let chapters_refread=await getDocs(querya);
			this.counted_chapters=chapters_refread.size;

			this.generated_keywords+=`${this.newspaper.name},${this.newspaper.author},`;
			this.newspaper.keywords.forEach(e=>
			{
				this.generated_keywords+=`${e},`;
			});
			 if(isNaN(Number(this.newspaper.popularity)))
			 {
				 setDoc(doc(firestore,`/${this.profile}`,this.newspaper_id),{popularity:1},{merge:true});
			 }
			 else
			 setDoc(doc(firestore,`/${this.profile}`,this.newspaper_id),{popularity:Number(this.newspaper.popularity)+1},{merge:true});
			
			if(FirebaseAuth.currentUser!=null)
			{
				this.signed_in=true;

				
				this.fields.push({ key:"link", label: ""});
			}
			else
			this.signed_in=false;
			
			if(this.signed_in)
			{
			this.user= FirebaseAuth.currentUser;
			this.title_side=title_page(this.newspaper.name);
			let k;
			try{
				k=await getDocFromCache(doc(firestore,"users",FirebaseAuth.currentUser.uid)); 
				
				}
				catch(e)
				{
				k=await getDoc(doc(firestore,"users",FirebaseAuth.currentUser.uid)); 
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

			let ref_storage =ref(storage,`/${this.profile}/${this.newspaper_id}/thumbnail.jpg`);
			try{
			this.newspaper_thumbnail= await getDownloadURL(ref_storage);
			}
			catch
			{
				//
				this.loading_fail=true;
				try{
				ref_storage =ref(storage,`/${this.profile}/${this.newspaper_id}/chapters/${this.chapters[0]}/book.pdf`);
				this.newspaper_thumbnail=await getDownloadURL(ref_storage);
				
				}catch(ex)
			{
				console.error(ex);
			}
			}
		//	if(this.newspaper.hided) this.$router.push("/home");
			//
		/*	if(this.signed_in)
				{
				let user_ref= await getDoc(doc(firestore,"users",FirebaseAuth.currentUser.uid));
				this.user=user_ref.data();
				if(this.user.favorites==null){
				setDoc(doc(firestore,"users",getAuth().currentUser.uid),{favorites:["test"]},{merge:true});
				}
				else
				{
					this.is_favorite=this.user.favorites.includes(this.newspaper_id);
				}
				//this.favorite=(this.user.favorites.indexOf(this.newspaper_id)>=0);
				}
*/
				const newCache = await caches.open('su-library-archive');
			 let response= await newCache.match(this.newspaper_thumbnail);
			 if(!response||!response.ok)
			 {
				 await newCache.add(this.newspaper_thumbnail);
				 response= await newCache.match(this.newspaper_thumbnail);
			 }
        await response.blob().then((blob)=>{

			var objectURL = URL.createObjectURL(blob);
			this.newspaper_thumbnail=objectURL;
			});
			console.log(this.newspaper.keywords)
			this.dataReady=true;
		},
		methods: {
			gt(a)
				{
					return get_text(a);
				},
			gy(a)
			{
				return replace_white(a);
			},	
			async bookmark_add()
			{
				let c=await collection(firestore,`/users/${await getAuth().currentUser.uid}/favorites`);
			
				 let q=await addDoc(c,{
					 "profile":this.profile,
					 "id":this.$route.params.nid
					});

					this.$noty.success(this.gt("favorite_added"), {
						killer: true,
						timeout: 1500,
					});
				
			},
			
			async load_chapters()
			{
			this.chapters=[];
			this.chapter_f=[];
			let querya=query(collection(firestore,`/${this.profile}/${this.newspaper_id}/chapters`),orderBy("name","desc"))
			let chapters_refread=await getDocs(querya);
				chapters_refread.forEach(as=>{
					this.chapters.push({data:as.data(),id:as.id,name:as.data().name,release_date:as.data().release_date});
					});
			if(this.profile=="newspapers")
			{
			this.chapters.forEach((a)=>{
				this.chapter_f.push({
				link:`/view/${this.profile}/${this.newspaper_id}/${this.gy(this.newspaper.name)}/chapter/${a.id}/page/1`,
				name:a.data.name,
				chapter_nr:a.data.chapter_nr==null?'':a.data.chapter_nr,
				release_date:a.release_date
				});
			});		
			//console.log(this.chapters);	
			}
			else 
			{
				this.chapters.forEach((a)=>{
				this.chapter_f.push({
				link:`/view/${this.profile}/${this.newspaper_id}/${this.gy(this.newspaper.name)}/chapter/${a.id}/page/1`,
				name:a.data.name,
				release_date:a.release_date
				});
			});		
			}	
			},
			/*async add_favorite(){
			this.is_favorite=!this.is_favorite;
			//let k= await getDoc(doc(firestore,"users",getAuth().currentUser.uid));
			if(!this.signed_in) return;
			if(this.is_favorite) {
			await updateDoc(doc(firestore,"users",getAuth().currentUser.uid),{favorites:arrayUnion(this.newspaper_id)});
			let fav= (await getDoc(doc(firestore,`/${this.profile}`,this.newspaper_id))).data().favorites;
			await updateDoc(doc(firestore,`/${this.profile}`,this.newspaper_id),{favorites:this.newspaper.favorites+1},{merge:true}); 
			}
			else 
			{
			await updateDoc(doc(firestore,"users",getAuth().currentUser.uid),{favorites:arrayRemove(this.newspaper_id)});	
			let fav= (await getDoc(doc(firestore,`/${this.profile}`,this.newspaper_id))).data().favorites;
			await updateDoc(doc(firestore,`/${this.profile}`,this.newspaper_id),{favorites:this.newspaper.favorites-1},{merge:true}); 
				
			}
			
			},*/
			enter_read(i)
			{
				this.$router.push(`/view/${this.profile}/${this.newspaper_id}/${replace_white(this.newspaper.name)}/page/${i}`);
			},
			keyword_link(i)
			{
				this.$router.push(`/search/${this.profile}/${i}`);
			},
			open_cobiss(i){
				window.open(i,"_blank");
			},
			movetoadmin()
			{
				this.$router.push(`/admin/content/${this.profile}/${this.newspaper_id}`);
			},
			async loadmore()
			{
			this.loading_values+=10;
			await  this.load_chapters();
			},

			 async add_favorite()
    {
      let c=await collection(firestore,`/users/${ await getAuth().currentUser.uid}/favorites`);
      let _query=null;
     
       _query= query(c,where("profile","==",this.profile),where("id","==",this.newspaper_id));
      
      let l=await getDoc(_query);
      /*if(!l.exists())
      {
    	 let q= await addDoc(c,{profile:this.profile,id:this.newspaper_id});
      }*/
    },
			to_date_format(a)
			{
				console.log(Date(a));
				return	moment(Date(a)).format("YYYY-MM-DD");
			}
		}
	}
	
</script>

<style lang="scss" >
@import "../../../src/style/variables.scss";
	.newspaper_cover{
		width: 350px;
		
	}
	.big_container
	{
		display: inline-block;
		width: 48%;
		vertical-align: top;
	}
		
.newspaperavatar{
	float: left;
    margin: 2 em;

}
.newspaperavatar img{
	width: 350px;
	
	aspect-ratio: auto 350/494; 
    

}
.newspaper-info{
	float:left;
	 margin: 50px;
}
.newspaper-container
{
	overflow: auto;
	margin-bottom: 25px;
	padding: 30px 20px;
}
.open_button
{
	color: $accent;
}
</style>
