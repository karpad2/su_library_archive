<template>
	<div>
		<h1>{{book_title}}</h1>
		{{gt("author")}}

		<md-chips v-model="book_keywords" md-static></md-chips>
	</div>

</template>

<script>
import {signOut} from "firebase/auth";
import {FireDb,FirebaseAuth,change_Theme_Fb} from "@/firebase";
import {ref, set ,onValue,get, child} from "firebase/database";


	export default {
		components: {
	
		},
		name: 'Index',
		data: () => ({
			book_title:"",
			book_author:"",
			book_year:"",
			book_keywords:[],
			
		}),
		mounted() {
			
			this.$router.beforeEach((to,from,next)=>{
				
				this.loading_screen=true;
				next();
			});
			
			this.$router.afterEach(()=>{
				setTimeout(()=>{this.loading_screen=false},300);
			});
			
			try{
			//localStorage.user= FirebaseAuth._currentUser;
			
			this.profile_picture_url=FirebaseAuth.currentUser.photoURL;
			this.profile_name=FirebaseAuth.displayName;
			
			
			//console.log(FirebaseAuth.currentUser);
			get(child(FireDb.once, `users/${FirebaseAuth.currentUser.uid}/user_profile_color`)).then((snapshot) => {
        if (snapshot.exists()) {
            //this.rooms=snapshot;
			localStorage.userTheme=snapshot.val().user_profile_color;
		}
		else 
		{
			set(ref(FireDb,`users/${FirebaseAuth.currentUser.uid}/user_profile_color`),"light");
		}});

			console.log("Index");
			}
			catch (e)
			{
				console.warn(e);
			}
			if (localStorage.userTheme === "dark") {
				this.userTheme = "dark";
				}
			if (this.$route.fullPath === '/') {
				this.$router.replace('/home').catch(() => {
				});
			}
		},
		methods: {
			toggleMenu: function() {
				this.menuVisible = !this.menuVisible;
			},
			toggleSidepanel: function()
			{
				this.showSidepanel = !this.showSidepanel;
			},
			themeChanged: function () {
				if (localStorage.userTheme === "dark") this.userTheme = "dark";
				else this.userTheme = "default";
			},
			changeTheme: function () {
				console.log("Change theme");
				change_Theme_Fb("change");
				this.themeChanged();
				
			},
			logout: function () {
				this.loading = true;
				let _this = this;
				signOut(FirebaseAuth).then(() => {
					// Automatic redirect to login (onAuthStateChanged)
					localStorage.clear();
					_this.$noty.success("Logout confirmed", {
						killer: true,
						
						timeout: 1500,
					});
					this.$router.replace('/account/login').catch(() => {}); // User not logged
				}).catch((error) => {
					console.log("signOut()", error);
					_this.$noty.error("Logout error, please refresh the page.");
				});
			}
		}
	}
	/*
	{
					icon: 'person',
					title: 'Account',
					link: '/account',
					auth: true,
				},
	*/
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
