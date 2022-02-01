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
				<img  draggable="false"  class="newspaper_cover" alt="newspaper_cover" :src="newspaper_thumbnail" />
				</div>
		<div class="newspaper-info">
			<p> {{gt("publisher")}}: <md-chip @click="keyword_link(newspaper.publisher)" md-static>{{newspaper.publisher}}</md-chip></p>
			<p>{{gt("keywords")}}: <md-chip @click="keyword_link(keyword)" :key="keyword" :v-model="keyword" v-for="keyword in newspaper.keywords" md-static>{{keyword}}</md-chip> </p>
			<p>{{gt("language")}}: <md-chip @click="keyword_link(newspaper.language)" md-static><flag :flag="newspaper.language" /></md-chip> </p>
		<div>
		{{gt("information")}}:
		<div v-html="newspaper.description">
		</div>
		<div>
			<p>{{gt("upload_date")}}:{{newspaper.upload_date}}</p>
		</div>
		</div>
		<div>
			{{gt("released_numbers")}}: <md-chip>{{counted_chapters}}</md-chip>
			<div v-if="signed_in">
			<md-button v-if="is_favorite" style="background-color:#ed2553"  @click="add_favorite">❤️️ {{gt("favorite")}}</md-button>
			<md-button v-else @click="add_favorite" >❤️️ {{gt("favorite")}}</md-button>
			<md-button class="md-raised md-primary" v-if="admin" @click="movetoadmin">{{gt(profile)+" "+gt("edit")}}</md-button>
			</div>	
		</div>
		
		
		</div>
		
		</div>
        </md-card-content>
	</md-card>
	<md-card>
		<md-table v-model="chapters" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
            <md-table-toolbar>
                <div class="md-toolbar-section-start">
                <h1 class="md-title">{{gt("chapters")}}</h1>
                </div>
            </md-table-toolbar>

            <md-table-empty-state :md-label="gt(profile)+' '+gt('cant_found')"></md-table-empty-state>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
               
                <md-table-cell :md-label="gt(profile.split(0,profile.length-1))+' '+gt('name')" md-sort-by="newspapername">{{ item.data.chapter_name }}</md-table-cell>
                <md-table-cell :md-label="gt('publisher')" md-sort-by="publisher">{{ item.data.publishing_date }}</md-table-cell>
                <md-table-cell :md-label="gt('open_chapter')" md-sort-by="open_chapter"><md-button @click="$router.push(`/view/${profile}/${newspaper_id}/${gy(newspaper.name)}/chapter/${item.id}/page/1`)">{{gt("open")}}</md-button></md-table-cell>
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
			chapters:[],
			member:false,
			promotion:false,
			is_favorite:false,
			title_side:"",
			newspaper_id:"",
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
			this.newspaper_id=this.$route.params.nid;
			let newspaper_ref;
		if(this.$route.params.viewtype!=undefined)
			{
				this.profile=this.$route.params.viewtype;
			}
			try{
        newspaper_ref=await getDocFromCache(doc(firestore,`${this.profile}`,this.newspaper_id));
        this.newspaper=newspaper_ref.data();
		console.log( this.newspaper);
		
        }
        catch(e)
        {
           newspaper_ref=await getDoc(doc(firestore,`${this.profile}`,this.newspaper_id));
           this.newspaper=newspaper_ref.data(); 
        }
			this.newspaper=newspaper_ref.data();
			this.chapters=[];
		let chapters_refread=await getDocs(collection(firestore,`${this.profile}/${this.newspaper_id}/chapters`));
			
		chapters_refread.forEach(as=>{
			this.counted_chapters++;
					this.chapters.push({data:as.data(),id:as.id});
					});

			this.generated_keywords+=`${this.newspaper.name},${this.newspaper.author},`;
			this.newspaper.keywords.forEach(e=>
			{
				this.generated_keywords+=`${e},`;
			});
			setDoc(doc(firestore,`${this.profile}s`,this.newspaper_id),{popularity:this.newspaper.popularity+1},{merge:true});
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

			let ref_storage =ref(storage,`/${this.profile}/${this.newspaper_id}/thumbnail.jpg`);
			try{
			this.newspaper_thumbnail= await getDownloadURL(ref_storage);
			}
			catch
			{
				//
			}
			if(this.newspaper.hided) this.$router.push("/home");
			this.title_side=title_page(this.newspaper.name);
			if(this.signed_in)
				{
				let user_ref= await getDoc(doc(firestore,"users",getAuth().currentUser.uid));
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
			async add_favorite(){
			this.is_favorite=!this.is_favorite;
			//let k= await getDoc(doc(firestore,"users",getAuth().currentUser.uid));
			if(!this.signed_in) return;
			if(this.is_favorite) {
			await updateDoc(doc(firestore,"users",getAuth().currentUser.uid),{favorites:arrayUnion(this.newspaper_id)});
			let fav= (await getDoc(doc(firestore,`${this.profile}`,this.newspaper_id))).data().favorites;
			await updateDoc(doc(firestore,`${this.profile}`,this.newspaper_id),{favorites:this.newspaper.favorites+1},{merge:true}); 
			}
			else 
			{
			await updateDoc(doc(firestore,"users",getAuth().currentUser.uid),{favorites:arrayRemove(this.newspaper_id)});	
			let fav= (await getDoc(doc(firestore,`${this.profile}`,this.newspaper_id))).data().favorites;
			await updateDoc(doc(firestore,`${this.profile}`,this.newspaper_id),{favorites:this.newspaper.favorites-1},{merge:true}); 
				
			}
			
			},
			enter_read(i)
			{
				this.$router.push(`/view/${this.profile}/${this.newspaper_id}/${replace_white(this.newspaper.name)}/page/${i}`);
			},
			keyword_link(i)
			{
				this.$router.push(`${this.profile}/search/${i}`);
			},
			movetoadmin()
			{
				this.$router.push(`/admin/${this.profile}/${this.newspaper_id}`);
			},
		}
	}
	
</script>

<style lang="scss" >
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
	height:494px;
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
</style>
