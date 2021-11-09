<template>
	<div id="pages" v-if="dataReady&&signed_in">
		<thumbnailpage :book_id="book_id" v-for="page in pages" :key="page" :page="page" />


	</div>
</template>

<script>
import {signOut,getAuth} from "firebase/auth";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,user_email_verified,storage} from "@/firebase";
import { getStorage, ref, listAll,get } from "firebase/storage";
import loading from "@/components/parts/loading";
import thumbnailpage from "@/components/parts/thumbnailpage";
import logo from "@/assets/logo";



	export default {
		components: {
		thumbnailpage

		},
		props:["bid"],
		name: 'Pages',
		data: () => ({
			signed_in:false,
			dataReady:false,
			book_id:"",
			pages:[]
		}),
		async mounted() {
			this.book_id=this.bid;
			this.signed_in= !(await getAuth().currentUser==null);
			const listRef = ref(storage, `books/${this.book_id}/pages`);

			// Find all the prefixes and items.
			listAll(listRef)
			.then((res) => {
				res.prefixes.forEach((folderRef) => {
				// All the prefixes under listRef.
				// You may call listAll() recursively on them.
				});
				res.items.forEach((itemRef) => {
				// All the items under listRef.
				});
			}).catch((error) => {
				// Uh-oh, an error occurred!
			});
		}
	}
</script>

<style lang="scss">

</style>
