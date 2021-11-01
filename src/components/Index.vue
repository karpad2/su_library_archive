<template>
	<div v-if="dataReady" id="vue-js-index-container">
		<md-app md-waterfall md-mode="fixed" :md-theme="userTheme">
			<md-app-toolbar class="md-primary" md-elevation="5">
				<md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
					<md-icon>menu</md-icon>
				</md-button>
				<router-link class="router-link" to="/home">
					<logo class="bar-logo" />
					<span class="md-title">  {{gt("app-title")}}</span>
				</router-link>

				 <md-autocomplete
					class="search"
					v-model="seaching_text"
					:md-options="searchedBooks"
					@change="searching"
					md-layout="box">
					<label>{{gt("search")}}</label>
					</md-autocomplete>

				<div class="md-toolbar-section-end">
        			<md-field v-if="false">
						<md-icon>notranslate</md-icon>
						<label for="lang">{{gt("language")}}</label>
						<md-select @change="lang_change" v-model="language">
							<md-option v-for="la in languages" :key="la.code"  :value="la.code">{{la.name}}</md-option>
						</md-select>
					</md-field>
					
					<md-avatar v-if="signedin()" @click="toggleSidepanel" style="z-index:999" >
						<img  :src="profile_picture_url" alt="Avatar">
					</md-avatar>
					
						<router-link v-else  class="router-link" to="/account/login">
							<md-icon class="md-icon">login</md-icon>
							<span class="md-title">{{gt("login")}}</span>
						</router-link>
					

     		 	</div>
				</md-app-toolbar>
	

			<md-app-drawer :md-active.sync="menuVisible" md-persistent="mini">
				<md-toolbar class="md-transparent" md-elevation="3">
					<span>Navigation</span>
					<div class="md-toolbar-section-end">
						<md-button class="md-icon-button md-dense" @click="toggleMenu">
							<md-icon>keyboard_arrow_left</md-icon>
						</md-button>
					</div>
				</md-toolbar>

				<md-list>
					<div v-for="tab in menuTab" :key="tab.title">
						<router-link :to="tab.link">
							<md-list-item v-if="tab.auth" :class="{'active': $route.fullPath.includes(tab.link)}">
								<md-icon class="md-icon">{{tab.icon}}</md-icon>
								<span class="md-list-item-text">{{tab.title}}</span>
							</md-list-item>
							
						</router-link>
					</div>
					<md-list-item v-if="signedin()" v-on:click="changeTheme()">
								<md-icon class="md-icon">settings_brightness</md-icon>
								<span class="md-list-item-text">{{gt("ctheme")}}</span>
					</md-list-item>
					<md-list-item v-if="signedin()" v-on:click="logout()">
								<md-icon class="md-icon">logout</md-icon>
								<span class="md-list-item-text">{{gt("logout")}}</span>
					</md-list-item>
					<md-divider></md-divider>
					
				</md-list>
			</md-app-drawer>

	<md-drawer class="md-right" :md-active.sync="showSidepanel">
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="md-title">{{gt("account")}}</span>
      </md-toolbar>

      <md-list>
        <md-list-item>
          <span class="md-list-item-text">Abbey Christansen</span>

          <md-button class="md-icon-button md-list-action">
            <md-icon class="md-primary">chat_bubble</md-icon>
          </md-button>
        </md-list-item>

        <md-list-item>
          <span class="md-list-item-text">Alex Nelson</span>

          <md-button class="md-icon-button md-list-action">
            <md-icon class="md-primary">chat_bubble</md-icon>
          </md-button>
        </md-list-item>

        <md-list-item>
          <span class="md-list-item-text">Mary Johnson</span>

          <md-button class="md-icon-button md-list-action">
            <md-icon>chat_bubble</md-icon>
          </md-button>
        </md-list-item>
      </md-list>
    </md-drawer>

			<md-app-content>
				    <b-alert v-if="signedin() && email_verified" variant="success" show>{{gt("not_verified_user")}} <a href="#" @click="send_email">{{gt("send_email")}}</a></b-alert>

					 <md-dialog-confirm
						:md-active.sync="terms"
						:md-title="terms_text.title"
						:md-content="terms_text.text"
						md-confirm-text="Agree"
						md-cancel-text="Disagree"
						@md-cancel="logout"
						@md-confirm="accept_terms" />


				<router-view  v-if="!loading_screen"/>
				<loading v-else />
			</md-app-content>

			
		</md-app>
	</div>
</template>

<script>
import {getAuth,signOut,auth,user_language} from "firebase/auth";
import {get_text,languages,get_defaultlanguage} from "@/languages";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,user_email_verified} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit,  } from "firebase/firestore";
import loading from "@/components/parts/loading";
import logo from "@/assets/logo";


	export default {
		components: {
		logo,
		loading
		},
		name: 'Index',
		title:"",
		selectedBooks: null,
		data: () => ({
			profile_picture_url:"",
			profile_name:"",
			admin:true,
			dateFormat:"",
			seaching_text:"",
			terms_text:{
				title:"",
				text:""
			},
			languages:languages,
			searchedBooks:[],
			language:get_defaultlanguage(),
			dataReady: false,
			email_verified:true,
			showSidepanel:false,
			terms:true,
			menuVisible: false,
			userTheme: "default",
			loading_screen:false,
			menuTab:[{
					icon: 'event',
					title: 'Calendar',
					link: '/events',
					auth: true,
				}]
		}),
		async mounted() {
			
			this.$router.beforeEach((to,from,next)=>{
				
				this.loading_screen=true;
				next();
			});
			
			this.$router.afterEach(()=>{
				setTimeout(()=>{this.loading_screen=false},300);
			});
			
			try{
			//localStorage.user= FirebaseAuth._currentUser;
			console.log()
			this.profile_picture_url=await FirebaseAuth.currentUser.photoURL;
			this.profile_name=await FirebaseAuth.displayName;
			this.email_verified=await getAuth().currentUser.emailVerified;
			this.language=localStorage.getItem("language");
			this.admin=await this.is_admin();
			//this.language=await getAuth().languageCode;
			let theme="light";
			/*await getDoc(firestore,"users",FirebaseAuth.uid)
			.then((a)=>
			{	
				if(a.exists())
				{
				theme=a.data().theme;
				this.admin=a.data().admin;
				localStorage.userTheme=theme;
				}
				else
				{
					console.log("err")
				}
			});*/
/*
			getDoc(doc(firestore,"users",FirebaseAuth.currentUser.uid,"admin"))
			.then((a)=>
			{
				
				this.admin=a.exists();
				//console.log(`Admin ${this.admin?"true":"false"}`)

			});*/
			
			//console.log(FirebaseAuth.currentUser);
			
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

			this.menuTab= [
				{
					icon: 'home',
					title: this.gt("Home"),
					link: '/home',
					auth: true,
				},
				{
					icon: 'auto_stories',
					title: this.gt("Books"),
					link: '/books',
					auth: true,
				},
				
				{
					icon: 'contact_support',
					title: this.gt("support"),
					link: '/support',
					auth: true,
				},
				
				
			
			];
			if(this.admin && this.signedin())
			{
				this.menuTab.push({
						
					icon: 'people',
					title: this.gt("users"),
					link: '/admin/users',
					auth: true,
					admin:true
				
					});
			}
			this.dataReady=true;
		},
		computed:{
			
			popular_ones()
			{
				let a=[];
				let coll = collection(firestore,"books");
				let q=query(coll,where("keywords","array-contains-any",this.seaching_text),limit(10));
				let c=getDocs(q);
				c.forEach(element => {
				a.push({
					book_name:element.book_name,
					author:element.author,
					photoURL:element.book_cover
				})
				
				});
				return  a;
			},
			newest_uploads()
			{
				let a=[];
				let coll = collection(firestore,"books");
				//let query=query(collection,)
				return  a;
			},
			
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
			send_email()
			{
				
			},
			async searching()
			{
				let a=[];
				if(!this.seaching_text.length>3) return [];
				let coll = collection(firestore,"books");
				let q=query(coll,where("keywords","array-contains-any",[this.seaching_text]),limit(10));
				let c=await getDocs(q);
				c.forEach(element => {
				a.push({
					book_name:element.book_name,
					author:element.author,
					photoURL:element.book_cover
				})
				
				});

				//let query=query(collection,)
				//return  a;
				this.searchedBooks=a;
			},
			lang_change()
			{
				localStorage.setItem("language",this.language);
				//getAuth().languageCode=this.language;
			},
			async is_admin()
			{ 
				let coll=collection(firestore,"users").doc(getAuth().currentUser.uid)
				let k=await getDoc(coll)
				return k.data().admin==null?false:true;
			},
			signedin()
			{
				return !(getAuth().currentUser==null);
			},
			changeTheme: function () {
				console.log("Change theme");
				change_Theme_Fb("change");
				this.themeChanged();
				
			},
			gt(a)
				{
					return get_text(a);
				},
				async check_terms()
				{
					let coll=collection(firestore,"users").doc(getAuth().currentUser.uid)
					let k= await getDoc(coll);
					let terms=false;
					if(k.exists())
					{
						terms=k.data().terms;
					}
					else
					{
						terms=false;
					}
					return terms;


				},
				async accept_terms()
				{
				let ref=doc(firestore,"users",FirebaseAuth.currentUser.uid);
				console.log(ref);
				setDoc(ref,{terms:true},{merge:true});

				},
			logout: function () {
				this.loading = true;
				let _this = this;
				signOut(FirebaseAuth).then(() => {
					// Automatic redirect to login (onAuthStateChanged)
					localStorage.clear();
					_this.$noty.success(this.gt("logout_success"), {
						killer: true,
						timeout: 1500,
					});
					this.$router.replace('/account/login').catch(() => {}); // User not logged
				}).catch((error) => {
					console.log("signOut()", error);
					_this.$noty.error(this.gt("logout_error_pls_refresh"));
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
	.search {
	margin: auto;
	min-width: 230px;
    max-width: 500px;
  }
  @media only screen and (max-width: 1026px) { 
  .search {
	display:none
  }
}

/*

*/
</style>
