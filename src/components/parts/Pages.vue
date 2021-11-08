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
