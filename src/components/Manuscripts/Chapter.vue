<template>
	<div>
	<div div v-if="dataReady">
<md-card>
		<md-card-header>
        <md-card-header-text>
          <div class="md-title"></div>
		   </md-card-header-text>
		   </md-card-header>
		    <md-card-content>
				<div class="manuscript-container">
				<div class="manuscriptavatar">
				<img  @click="enter_read(1)" class="manuscript_cover" alt="manuscript_cover" :src="manuscript_thumbnail" />
				</div>
		<div class="manuscript-info">
			<p> {{gt("author_name")}}: <md-chip @click="keyword_link(manuscript.author_name)" md-static>{{manuscript.author_name}}</md-chip></p>
			<p>{{gt("keywords")}}: <md-chip @click="keyword_link(keyword)" :key="keyword" :v-model="keyword" v-for="keyword in manuscript.keywords" md-static>{{keyword}}</md-chip> </p>
		<div>
		{{gt("information")}}:
		<div v-html="manuscript.description">
			</div>
			<div>
			
		<p>{{gt("upload_date")}}:{{manuscript.upload_date}}</p>
		</div>
		</div>
		<div>
			{{gt("page_number")}}: <md-chip>{{manuscript.page_number}}</md-chip>
			<div v-if="signed_in">
			<md-button v-if="is_favorite" style="background-color:#ed2553"  @click="add_favorite">❤️️ {{gt("favorite")}}</md-button>
			<md-button v-else @click="add_favorite" >❤️️ {{gt("favorite")}}</md-button>
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
import Pages from "@/components/parts/Pages";
import loading from "@/components/parts/loading";
import flag from "@/components/parts/flag";

	export default {
		components: {
		Pages,
		loading,
		flag
		},
		
		name: 'manuscript',
		data: () => ({
			manuscript:{},
			dataReady: false,
			signed_in:false,
			manuscript_thumbnail:"",
			admin:false,
			member:false,
			promotion:false,
			is_favorite:false,
			title_side:title_page(),
			manuscript_id:"",
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
			this.manuscript_id=this.$route.params.bid;
			let manuscript_ref;

			try{
        manuscript_ref=await getDocFromCache(doc(firestore,"manuscripts",this.manuscript_id));
        this.manuscript=manuscript_ref.data();
        }
        catch(e)
        {
           manuscript_ref=await getDoc(doc(firestore,"manuscripts",this.manuscript_id));
           this.manuscript=manuscript_ref.data(); 
        }
			this.manuscript=manuscript_ref.data();
			
			this.generated_keywords+=`${this.manuscript.manuscript_name},${this.manuscript.author_name},`;
			this.manuscript.keywords.forEach(e=>
			{
				this.generated_keywords+=`${e},`;
			});
			setDoc(doc(firestore,"manuscripts",this.manuscript_id),{popularity:this.manuscript.popularity+1},{merge:true});
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

			let ref_storage =ref(storage,`/manuscripts/${this.manuscript_id}/thumbnail.jpg`);
			this.manuscript_thumbnail= await getDownloadURL(ref_storage);
			if(this.manuscript.hided) this.$router.push("/home");
			this.title_side=title_page(this.manuscript.manuscript_name);
			if(this.signed_in)
				{
				let user_ref= await getDoc(doc(firestore,"users",getAuth().currentUser.uid));
				this.user=user_ref.data();
				if(this.user.favorites==null){
				setDoc(doc(firestore,"users",getAuth().currentUser.uid),{favorites:["test"]},{merge:true});
				}
				else
				{
					this.is_favorite=this.user.favorites.includes(this.manuscript_id);
				}
				//this.favorite=(this.user.favorites.indexOf(this.manuscript_id)>=0);
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
			await updateDoc(doc(firestore,"users",getAuth().currentUser.uid),{favorites:arrayUnion(this.manuscript_id)});
			let fav= (await getDoc(doc(firestore,"manuscripts",this.manuscript_id))).data().favorites;
			await updateDoc(doc(firestore,"manuscripts",this.manuscript_id),{favorites:this.manuscript.favorites+1},{merge:true}); 
			}
			else 
			{
			await updateDoc(doc(firestore,"users",getAuth().currentUser.uid),{favorites:arrayRemove(this.manuscript_id)});	
			let fav= (await getDoc(doc(firestore,"manuscripts",this.manuscript_id))).data().favorites;
			await updateDoc(doc(firestore,"manuscripts",this.manuscript_id),{favorites:this.manuscript.favorites-1},{merge:true}); 
				
			}
			
			},
			enter_read(i)
			{
				this.$router.push(`/manuscript/${this.manuscript_id}/${replace_white(this.manuscript.manuscript_name)}/page/${i}`);
			},
			keyword_link(i)
			{
				this.$router.push(`/manuscripts/search/${i}`);
			}
		}
	}
	
</script>

<style lang="scss" >
	.manuscript_cover{
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
		
.manuscriptavatar{
	float: left;
    margin: 2 em;

}
.manuscriptavatar img{
	width: 350px;
	height:494px;
	aspect-ratio: auto 350/494; 
    

}
.manuscript-info{
	float:left;
	 margin: 50px;
}
.manuscript-container
{
	overflow: auto;
	margin-bottom: 25px;
	padding: 30px 20px;
}
</style>
