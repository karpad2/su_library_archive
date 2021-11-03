<template>
	<div v-if="dataReady">
		<h1>{{book_title}}</h1>
		{{gt("author")}}
		<img src="" alt="book_cover"/>
		<md-chips v-model="book_keywords" md-static></md-chips>
		<div>
			{{book_description}}
		</div>
		<div>
			{{gt("information")}}

		</div>


		<md-field>
			<label for="">{{gt("page_number")}}</label>
			
		</md-field>
	<md-field>
		<md-datepicker v-model="upload_date" md-disabled/>
	</md-field>
	</div>

</template>

<script>
import {signOut} from "firebase/auth";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit  } from "firebase/firestore";
import {ref, set ,onValue,get, child} from "firebase/database";
import {get_text,languages,get_defaultlanguage} from "@/languages";


	export default {
		components: {
	
		},
		name: 'Index',
		data: () => ({
			book_title:"",
			book_author:"",
			book_year:"",
			upload_date:"",
			book_keywords:[],
			book_description:"",
			dataReady: false,
			
		}),
		async mounted() {
			const book_id=this.$route.params.book_id;
			let update_number=await getDoc(collection("books").doc(book_id).doc("popularity"))
			collection(firestore,"books").doc(book_id).update({popularity: update_number+1});

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
