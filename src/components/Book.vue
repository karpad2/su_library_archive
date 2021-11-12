<template>
	<div v-if="dataReady">
<md-card>
		<md-card-header>
        <md-card-header-text>
          <div class="md-title"> <h1>{{book.book_name}}</h1></div>
		   </md-card-header-text>
		   </md-card-header>
		    <md-card-content>
				<div class="user-container">
				<div class="bigavatar">
				<img  @click="enter_read(1)" alt="book_cover" :src="book_thumbnail" />
				</div>
		<div class="user-info">
			<p> {{gt("author_name")}}: <md-chip @click="keyword_link(book.author_name)" md-static>{{book.author_name}}</md-chip></p>
			<p>{{gt("keywords")}}: <md-chip @click="keyword_link(keyword)" :key="keyword" :v-model="keyword" v-for="keyword in book.keywords" md-static>{{keyword}}</md-chip> </p>
			<p>{{gt("language")}}: <md-chip @click="keyword_link(book.language)" md-static><flag :flag="book.language" /></md-chip> </p>
		<div v-html="book.description">
		</div>
		<div>
			{{gt("page_number")}}: <md-chip>{{book.page_number}}</md-chip>
			<div v-if="signed_in">
			<md-button v-if="favorite" style="background-color:#ed2553"  @click="add_favorite">❤️️ {{gt("favorite")}}</md-button>
			<md-button v-else >❤️️ {{gt("favorite")}}</md-button>
			</div>	
		</div>
		<div>
			{{gt("information")}}
			<p>{{gt("upload_date")}}:{{book.upload_date}}</p>
		</div>
		<div >
			
		</div>
		</div>
		</div>
        </md-card-content>
	</md-card>
	<md-card v-if="signed_in">
		 <md-card-content>
			 <Pages :bid="book_id"/>
		</md-card-content>	
	</md-card>	
	
	</div>

</template>

<script>
import {signOut,getAuth} from "firebase/auth";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,storage} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit,updateDoc,getDocFromCache} from "firebase/firestore";
import {get_text,languages,get_defaultlanguage,title_page} from "@/languages";
import { getStorage, ref, listAll,get } from "firebase/storage";
import Pages from "@/components/parts/Pages";
import flag from "@/components/parts/flag";

	export default {
		components: {
		Pages,
		flag
		},
		
		name: 'Book',
		data: () => ({
			book:{},
			dataReady: false,
			signed_in:false,
			book_thumbnail:"",
			favorite:false,
			title_side:"",
			book_id:"",
			user:{}
			
		}),
		/*metaInfo:{
			title:this.title_side
		},*/
		async mounted() {
			this.book_id=this.$route.params.bid;
			let book_ref=await getDoc(doc(firestore,"books",this.book_id));
			this.book=book_ref.data();
			setDoc(doc(firestore,"books",this.book_id),{popularity:this.book.popularity+1},{merge:true});
			this.signed_in=!(await getAuth().currentUser==null);
			this.book_thumbnail=ref(storage,`/books/${this.book_id}/thumbnail.jpg`);
			if(this.book.hided) this.$router.push("/home");
			this.title_side=title_page(this.book.book_name);
			if(this.signed_in)
				{
				let user_ref= await getDoc(doc(firestore,"users",getAuth().currentUser.uid));
				this.user=user_ref.data();
				if(this.user.favorites==null){
				setDoc(doc(firestore,"users",getAuth().currentUser.uid),{favorites:["test"]},{merge:true});
				}
				this.favorite=(this.user.favorites.indexOf(this.book_id)>=0);
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
			//let k= await getDoc(doc(firestore,"users",getAuth().currentUser.uid));

			if(this.is_favorite|| !this.signed_in) return;
      		this.user.favorites.push(this.book_id);
			setDoc(doc(firestore,"users",getAuth().currentUser.uid),{favorites:[ this.user.favorites]},{merge:true})
			let fav= (await getDoc(doc(firestore,"books",this.book_id))).data().favorites;
			updateDoc(doc(firestore,"books",this.book_id),{favorites:this.book.favorites+1},{merge:true}); 
			},
			enter_read(i)
			{
				this.$router.push(`/book/${this.book_id}/${this.book.book_name}/page/${i}`);
			}	,
			keyword_link(i)
			{
				this.$router.push(`/books/search/${i}`);
			}
		}
	}
	
</script>

<style lang="scss">
	.book_cover{
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
</style>
