<template>
	<div>
	<div div v-if="dataReady">
<md-card>
		<md-card-header>
        <md-card-header-text>
          <div class="md-title"> <h1>{{poster.poster_name}}</h1></div>
		   </md-card-header-text>
		   </md-card-header>
		    <md-card-content>
				<div class="poster-container">
				<div class="posteravatar">
				<img  draggable="false" @click="enter_read(1)" class="poster_cover" alt="poster_cover" :src="poster_thumbnail" />
				</div>
		<div class="poster-info">
			<p> {{gt("publisher")}}: <md-chip @click="keyword_link(poster.publisher)" md-static>{{poster.publisher}}</md-chip></p>
			<p>{{gt("keywords")}}: <md-chip @click="keyword_link(keyword)" :key="keyword" :v-model="keyword" v-for="keyword in poster.keywords" md-static>{{keyword}}</md-chip> </p>
			<p>{{gt("language")}}: <md-chip @click="keyword_link(poster.language)" md-static><flag :flag="poster.language" /></md-chip> </p>
		<div>
		{{gt("information")}}:
		<div v-html="poster.description">
		</div>
		<div>
			<p>{{gt("upload_date")}}:{{poster.upload_date}}</p>
		</div>
		</div>
		<div>
			{{gt("released_numbers")}}: <md-chip>{{counted_chapters}}</md-chip>
			<div v-if="signed_in">
			<md-button v-if="is_favorite" style="background-color:#ed2553"  @click="add_favorite">❤️️ {{gt("favorite")}}</md-button>
			<md-button v-else @click="add_favorite" >❤️️ {{gt("favorite")}}</md-button>
			</div>	
		</div>
		
		
		</div>
		
		</div>
        </md-card-content>
	</md-card>
	<md-card>
		<md-table v-model="sheets" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
            <md-table-toolbar>
                <div class="md-toolbar-section-start">
                <h1 class="md-title">{{gt("sheets")}}</h1>
                </div>
            </md-table-toolbar>

            <md-table-empty-state
                :md-label="gt('poster_cant_found')"
               >
              
            </md-table-empty-state>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
               
                <md-table-cell :md-label="gt('postername')" md-sort-by="postername">{{ item.data.chapter_name }}</md-table-cell>
                <md-table-cell :md-label="gt('publisher')" md-sort-by="publisher">{{ item.data.publishing_date }}</md-table-cell>
                <md-table-cell :md-label="gt('open_chapter')" md-sort-by="open_chapter"><md-button @click="$router.push(`/poster/${poster_id}/${gy(poster.poster_name)}/sheets/${item.id}/page/1`)">{{gt("readchapter")}}</md-button></md-table-cell>
            </md-table-row>
        </md-table>
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
import NPages from "@/components/parts/posterpages";
import loading from "@/components/parts/loading";
import flag from "@/components/parts/flag";

	export default {
		components: {
		
		loading,
		flag
		},
		
		name: 'poster',
		data: () => ({
			poster:{},
			dataReady: false,
			signed_in:false,
			poster_thumbnail:"",
			admin:false,
			sheets:[],
			member:false,
			promotion:false,
			is_favorite:false,
			title_side:title_page(),
			poster_id:"",
			generated_keywords:"",
			counted_chapters:0,
			user:{}
			
		}),
		metaInfo(){
			return{
			title:this.title_side,
			keywords:this.generated_keywords
			}
		},
		async mounted() {
			this.poster_id=this.$route.params.nid;
			let poster_ref;

			try{
        poster_ref=await getDocFromCache(doc(firestore,"posters",this.poster_id));
        this.poster=poster_ref.data();
		
        }
        catch(e)
        {
           poster_ref=await getDoc(doc(firestore,"posters",this.poster_id));
           this.poster=poster_ref.data(); 
        }
			this.poster=poster_ref.data();
			this.chapters=[];
		let sheets_refread=await getDocs(collection(firestore,`posters/${this.poster_id}/sheets`));
			
		sheets_refread.forEach(as=>{
			this.counted_chapters++;
					this.sheets.push({data:as.data(),id:as.id});
					});

			this.generated_keywords+=`${this.poster.poster_name},${this.poster.author_name},`;
			this.poster.keywords.forEach(e=>
			{
				this.generated_keywords+=`${e},`;
			});
			setDoc(doc(firestore,"posters",this.poster_id),{popularity:this.poster.popularity+1},{merge:true});
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

			let ref_storage =ref(storage,`/posters/${this.poster_id}/thumbnail.jpg`);
			this.poster_thumbnail= await getDownloadURL(ref_storage);
			if(this.poster.hided) this.$router.push("/home");
			this.title_side=title_page(this.poster.poster_name);
			if(this.signed_in)
				{
				let user_ref= await getDoc(doc(firestore,"users",getAuth().currentUser.uid));
				this.user=user_ref.data();
				if(this.user.favorites==null){
				setDoc(doc(firestore,"users",getAuth().currentUser.uid),{favorites:["test"]},{merge:true});

				

				}
				else
				{
					this.is_favorite=this.user.favorites.includes(this.poster_id);
				}
				//this.favorite=(this.user.favorites.indexOf(this.poster_id)>=0);
				}

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
			async add_favorite()
			{
			this.is_favorite=!this.is_favorite;
			//let k= await getDoc(doc(firestore,"users",getAuth().currentUser.uid));
			if(!this.signed_in) return;
			if(this.is_favorite) {
			await updateDoc(doc(firestore,"users",getAuth().currentUser.uid),{favorites:arrayUnion(this.poster_id)});
			let fav= (await getDoc(doc(firestore,"posters",this.poster_id))).data().favorites;
			await updateDoc(doc(firestore,"posters",this.poster_id),{favorites:this.poster.favorites+1},{merge:true}); 
			}
			else 
			{
			await updateDoc(doc(firestore,"users",getAuth().currentUser.uid),{favorites:arrayRemove(this.poster_id)});	
			let fav= (await getDoc(doc(firestore,"posters",this.poster_id))).data().favorites;
			await updateDoc(doc(firestore,"posters",this.poster_id),{favorites:this.poster.favorites-1},{merge:true}); 
				
			}
			},
			enter_read(i)
			{
				//this.$router.push(`/poster/${this.poster_id}/${replace_white(this.poster.poster_name)}/page/${i}`);
			},
			keyword_link(i)
			{
				this.$router.push(`/posters/search/${i}`);
			}
		}
	}
	
</script>

<style lang="scss" >
	.poster_cover{
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
		
.posteravatar{
	float: left;
    margin: 2 em;

}
.posteravatar img{
	width: 350px;
	height:494px;
	aspect-ratio: auto 350/494; 
    

}
.poster-info{
	float:left;
	 margin: 50px;
}
.poster-container
{
	overflow: auto;
	margin-bottom: 25px;
	padding: 30px 20px;
}
</style>
