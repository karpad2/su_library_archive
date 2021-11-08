<template>
	<div v-if="dataReady">
		<h1>{{book.name}}</h1>
		{{gt("author")}}
		<img :src="book_thumbnail" alt="book_cover"/>
		<md-chips v-model="book.keywords" md-static></md-chips>
		<div>
			{{book.description}}
		</div>
		<div>
			{{gt("information")}}
			<p>{{gt("upload_date")}}:{{book.upload_date}}</p>
		</div>


		<div>
			{{gt("page_number")}}:{{book.page_number}}
			
		</div>
	<div v-if="signed_in">
		<Pages :bid="book_id"/>
	</div>
	</div>

</template>

<script>
import {signOut,getAuth} from "firebase/auth";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,storage} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit,updateDoc} from "firebase/firestore";
import {get_text,languages,get_defaultlanguage} from "@/languages";
import { getStorage, ref, listAll,get } from "firebase/storage";
import Pages from "@/components/parts/Pages";

	export default {
		components: {
		Pages
		},
		name: 'Index',
		data: () => ({
			book:{},
			dataReady: false,
			signed_in:false,
			book_thumbnail:""
			
		}),
		async mounted() {
			this.book_id=this.$route.params.book_id;
			this.book=await getDoc(doc(firestore,"books",this.book_id));
			updateDoc(doc(firestore,"books",this.book_id),{popularity:this.book.popularity+1});
			this.signed_in=!(await getAuth().currentUser==null);
			this.book_thumbnail=ref(storage,`books/${this.book_id}/thumbnail.png`);
			this.dataReady=true;
		},
		methods: {
			gt(a)
				{
					return get_text(a);
				},
		}
	}
	
</script>

<style lang="scss">
	@import "../../src/style/variables.scss";

	#vue-js-index-container {
		.md-app {
			height: 100vh;

			.router-link {
				display: flex;
				align-items: center;
			}


			.bar-logo {
				width: 35px !important;
				
			}

			.md-app-drawer {
				max-width: 300px !important;
			}
			.md-primary
			{
				height: 45pt;
			}
			.md-button
			{
				height: 30pt;
			}
			.md-list-item {

				&:hover {
					.md-icon {
						color: $accent;
						opacity: 0.8;
					}

					.md-list-item-text {
						color: $accent;
						transition: color .4s cubic-bezier(.4,0,.2,1);
						opacity: 0.8;
					}
				}

				&.active {
					.md-icon {
						color: $accent;
					}

					.md-list-item-text {
						color: $accent;
					}
				}

				.md-list-item-text {
					font-weight: bold;
				}
			}
		}
		 .md-drawer {
		width: 230px;
		max-width: calc(100vw - 125px);
 		 }
	}
</style>
