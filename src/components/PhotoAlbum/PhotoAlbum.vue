<template>
	<div>
	<div div v-if="dataReady">
<md-card>
		<md-card-header>
        <md-card-header-text>
          <div class="md-title"> <h1>{{photoalbum.photoalbum_name}}</h1></div>
		   </md-card-header-text>
		   </md-card-header>
		    <md-card-content>
				<div class="photoalbum-container">
				<div class="photoalbumavatar">
				<img  @click="enter_read(1)" class="photoalbum_cover" alt="photoalbum_cover" :src="photoalbum_thumbnail" />
				</div>
		<div class="photoalbum-info">
			<p> {{gt("author_name")}}: <md-chip @click="keyword_link(photoalbum.author_name)" md-static>{{photoalbum.author_name}}</md-chip></p>
			<p>{{gt("keywords")}}: <md-chip @click="keyword_link(keyword)" :key="keyword" :v-model="keyword" v-for="keyword in photoalbum.keywords" md-static>{{keyword}}</md-chip> </p>
		<div>
		{{gt("information")}}:
		<div v-html="photoalbum.description">
			</div>
			<div>
			
		<p>{{gt("upload_date")}}:{{photoalbum.upload_date}}</p>
		</div>
		</div>
		<div>
			
		</div>
		
		<div >
			
		</div>
		</div>
		</div>
        </md-card-content>
	</md-card>
	<md-card >
		 <md-card-content>
			 <thumbnailphoto :bid="photoalbum_id"/>
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
import thumbnailphoto from "@/components/parts/thumbnailphoto";
import loading from "@/components/parts/loading";
import flag from "@/components/parts/flag";

	export default {
		components: {
		thumbnailphoto,
		loading
		},
		
		name: 'photoalbum',
		data: () => ({
			photoalbum:{},
			dataReady: false,
			signed_in:false,
			photoalbum_thumbnail:"",
			admin:false,
			member:false,
			promotion:false,
			is_favorite:false,
			title_side:title_page(),
			photoalbum_id:"",
			generated_keywords:"",
			user:{}
			
		}),
		metaInfo(){
			return{
			title:this.title_side,
			keywords:this.generated_keywords
			}
		},
		async mounted() {
			this.photoalbum_id=this.$route.params.bid;
			let photoalbum_ref;

			try{
        photoalbum_ref=await getDocFromCache(doc(firestore,"photoalbums",this.photoalbum_id));
        this.photoalbum=photoalbum_ref.data();
        }
        catch(e)
        {
           photoalbum_ref=await getDoc(doc(firestore,"photoalbums",this.photoalbum_id));
           this.photoalbum=photoalbum_ref.data(); 
        }
			this.photoalbum=photoalbum_ref.data();
			

			this.generated_keywords+=`${this.photoalbum.photoalbum_name},${this.photoalbum.author_name},`;
			this.photoalbum.keywords.forEach(e=>
			{
				this.generated_keywords+=`${e},`;
			});
			setDoc(doc(firestore,"photoalbums",this.photoalbum_id),{popularity:this.photoalbum.popularity+1},{merge:true});
			this.signed_in=!(await getAuth().currentUser==null);
			
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

			let ref_storage =ref(storage,`/photoalbums/${this.photoalbum_id}/thumbnail.jpg`);
			this.photoalbum_thumbnail= await getDownloadURL(ref_storage);
			if(this.photoalbum.hided) this.$router.push("/home");
			this.title_side=title_page(this.photoalbum.photoalbum_name);
			if(this.signed_in)
				{
				let user_ref= await getDoc(doc(firestore,"users",getAuth().currentUser.uid));
				this.user=user_ref.data();
				if(this.user.favorites==null){
				setDoc(doc(firestore,"users",getAuth().currentUser.uid),{favorites:["test"]},{merge:true});
				}
				else
				{
					this.is_favorite=this.user.favorites.includes(this.photoalbum_id);
				}
				//this.favorite=(this.user.favorites.indexOf(this.photoalbum_id)>=0);
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
			await updateDoc(doc(firestore,"users",getAuth().currentUser.uid),{favorites:arrayUnion(this.photoalbum_id)});
			let fav= (await getDoc(doc(firestore,"photoalbums",this.photoalbum_id))).data().favorites;
			await updateDoc(doc(firestore,"photoalbums",this.photoalbum_id),{favorites:this.photoalbum.favorites+1},{merge:true}); 
			}
			else 
			{
			await updateDoc(doc(firestore,"users",getAuth().currentUser.uid),{favorites:arrayRemove(this.photoalbum_id)});	
			let fav= (await getDoc(doc(firestore,"photoalbums",this.photoalbum_id))).data().favorites;
			await updateDoc(doc(firestore,"photoalbums",this.photoalbum_id),{favorites:this.photoalbum.favorites-1},{merge:true}); 
				
			}
			
			},
			enter_read(i)
			{
				this.$router.push(`/photoalbum/${this.photoalbum_id}/${replace_white(this.photoalbum.photoalbum_name)}/page/${i}`);
			},
			keyword_link(i)
			{
				this.$router.push(`/photoalbums/search/${i}`);
			}
		}
	}
	
</script>

<style lang="scss" >
	.photoalbum_cover{
		width: 350px;
		height: 494px;
		aspect-ratio: auto 350/494;
	}
	.big_container
	{
		display: inline-block;
		width: 48%;
		vertical-align: top;
	}
		
.photoalbumavatar{
	float: left;
    margin: 2 em;

}
.photoalbumavatar img{
	width: 350px;
	height:494px;
	aspect-ratio: auto 350/494; 
    

}
.photoalbum-info{
	float:left;
	 margin: 50px;
}
.photoalbum-container
{
	overflow: auto;
	margin-bottom: 25px;
	padding: 30px 20px;
}
</style>
