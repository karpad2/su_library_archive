<template>
	<div>
	<div div v-if="dataReady">
<md-card>
		<md-card-header>
        <md-card-header-text>
          <div class="md-title"> <h1>{{blogs.blog_name}}</h1></div>
		   </md-card-header-text>
		   </md-card-header>
		    <md-card-content>
				<div class="book-container">
				<div class="bookavatar">
				<img class="book_cover" alt="book_cover" :src="blog_thumbnail" />
				</div>
		<div class="book-info">
			<div>
			{{gt("information")}}
			<p>{{gt("upload_date")}}:{{blogs.upload_date}}</p>
		</div>
		<div v-html="book.description">
		</div>
	
			
		</div>
		
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
import {get_text,languages,get_defaultlanguage,title_page,replace_white} from "@/languages";
import { getStorage, ref, uploadBytes ,getDownloadURL} from "firebase/storage";

import loading from "@/components/parts/loading";
import flag from "@/components/parts/flag";

	export default {
		components: {
			loading,
		},
		
		name: 'Blog',
		data: () => ({
			blog:{},
			dataReady: false,
			signed_in:false,
			blog_thumbnail:"",
			is_favorite:false,
			title_side:"",
			blog_id:"",
			user:{}
			
		}),
		/*metaInfo:{
			title:this.title_side
		},*/
		async mounted() {
			this.book_id=this.$route.params.bid;
			let book_ref=await getDoc(doc(firestore,"blogs",this.book_id));
			this.book=book_ref.data();
			setDoc(doc(firestore,"books",this.book_id),{popularity:this.blog.popularity+1},{merge:true});
			this.signed_in=!(await getAuth().currentUser==null);
			let ref_storage =ref(storage,`/books/${this.book_id}/thumbnail.jpg`);
			this.blog_thumbnail= await getDownloadURL(ref_storage);
			if(this.book.hided) this.$router.push("/home");
			this.title_side=title_page(this.book.book_name);
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
			let fav= (await getDoc(doc(firestore,"books",this.book_id))).data().favorites;
			await updateDoc(doc(firestore,"books",this.book_id),{favorites:this.book.favorites+1},{merge:true}); 
			}
			else 
			{
			await updateDoc(doc(firestore,"users",getAuth().currentUser.uid),{favorites:arrayRemove(this.book_id)});	
			let fav= (await getDoc(doc(firestore,"books",this.book_id))).data().favorites;
			await updateDoc(doc(firestore,"books",this.book_id),{favorites:this.book.favorites-1},{merge:true}); 
				
			}
			
			},
			enter_read(i)
			{
				this.$router.push(`/book/${this.book_id}/${replace_white(this.book.book_name)}/page/${i}`);
			},
			keyword_link(i)
			{
				this.$router.push(`/books/search/${i}`);
			}
		}
	}
	
</script>

<style lang="scss" >
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
		
.bookavatar{
	float: left;
    margin: 2 em;

}
.bookavatar img{
	width: 320px;
    

}
.book-info{
	float:left;
	 margin: 50px;
}
.book-container
{
	overflow: auto;
}
</style>
