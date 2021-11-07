<template>
<div>
	
<md-toolbar class="md-primary">
<md-button @click="$router('/book/bid/b_name')"><md-icon>reply</md-icon></md-button>

<md-button @click="$router('/book/bid/b_name')"><md-icon>reply</md-icon></md-button>
<md-button @click="$router('/book/bid/b_name')"><md-icon>reply</md-icon></md-button>

<md-button @click="$router('/book/bid/b_name')"><md-icon>reply</md-icon></md-button>
<md-button @click="$router('/book/bid/b_name')"><md-icon>reply</md-icon></md-button>


</md-toolbar> 

</div>
</template>

<script>
import {signOut} from "firebase/auth";
import {FireDb,FirebaseAuth,change_Theme_Fb} from "@/firebase";
import {ref, set ,onValue,get, child} from "firebase/database";
import loading from "@/components/parts/loading";
import logo from "@/assets/logo";

	export default {
		components: {
		
		},
		name: 'Index',
		data: () => ({}),
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
			next_page()
			{

			},
			last_page()
			{

			},
			back_one_page()
			{

			},
			zoom_in()
			{

			},
			zoom_out()
			{

			},

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
</style>
