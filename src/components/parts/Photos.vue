<template>
	<div id="photos" v-if="dataReady&&signed_in">
		<md-card>
			<thumbnailpage :book_id="book_id" v-for="page in photos" :key="page" :page="page" />
			<div class="middle-center">
				<md-button @click="addmore">{{gt("load_more")}}</md-button>
			</div>
		</md-card>

	</div>
</template>

<script>
import {signOut,getAuth} from "firebase/auth";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,user_email_verified,storage} from "@/firebase";
import { getStorage, ref, listAll,get } from "firebase/storage";
import {get_text,languages,get_defaultlanguage,title_page,replace_white} from "@/languages";
import loading from "@/components/parts/loading";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit,updateDoc,getDocFromCache,arrayUnion,arrayRemove} from "firebase/firestore";
import thumbnailpage from "@/components/parts/thumbnailpage";
import logo from "@/assets/logo";



	export default {
		components: {
		thumbnailphoto
		},
		props:["bid"],
		name: 'photos',
		data: () => ({
			signed_in:false,
			dataReady:false,
			book_id:"",
			photos:[],
			page_count:10,
			load_more:0
		}),
		async mounted() {
			this.book_id=this.bid;
			this.signed_in= !(await getAuth().currentUser==null);
			let book_ref=await getDoc(doc(firestore,"books",this.book_id));
			this.book=book_ref.data();
			if(this.page_count>this.book.page_number) {this.page_count=this.book.page_number}
			for (var i=1;i<=Number(this.page_count);i++)
			{
				this.photos.push(i);
			}

			this.dataReady=true;
		},
		methods:
		{
			addmore()
			{
				this.page_count+=10;
				if(this.page_count>this.book.page_number) {this.page_count=this.book.page_number}
				this.photos=[];

				for (var i=1;i<=Number(this.page_count);i++)
				{
				this.photos.push(i);
				}

			},
			gt(a)
			{
				return get_text(a);
			}
		}
	}
</script>

<style lang="scss">

</style>
