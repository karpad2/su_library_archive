<template>
	<div  id="vue-js-index-container">
		<md-app v-if="dataReady" md-waterfall md-mode="fixed" :md-theme="userTheme">
			<md-app-toolbar  v-if="!fullscreen" class="md-primary" md-mode="reveal" md-elevation="5">
				<div class="md-toolbar-row">
					 <div class="md-toolbar-section-start">
				<md-button class="md-icon-button" @click="menuVisible1=!menuVisible1" v-if="!menuVisible1">
					<md-icon>menu</md-icon>
				</md-button>
				
				
				<router-link class="router-link" to="/home">
					<logo class="bar-logo" />
					<hide-at  breakpoint="small">
					<span class="md-title">  {{gt("app-title")}}</span>
					</hide-at>
				</router-link>
				
				<hide-at v-if="!admin_page" breakpoint="large">
				 
				</hide-at>

				<show-at v-if="!admin_page" breakpoint="large">
				 <md-field style="margin-left: 25px" v-if="signed_in">
						<label>{{gt("search_by_name")}}</label>
						<md-input  md-layout="box" @change="searching" v-model="seaching_text" >{{gt("search")}}</md-input>
				</md-field>
				</show-at>
				</div>

				<div v-if="!library_user" class="md-toolbar-section-end">
					<md-button v-if="signed_in"  @click="$router.push('/bookmarks')"><md-icon>bookmark</md-icon> <span v-if="!mini">{{gt("bookmarks")}}</span></md-button>
        			<md-button v-if="signed_in"  @click="$router.push('/favorites')">❤️️ <span v-if="!mini">{{gt("favorites")}}</span></md-button>
					<md-button v-if="signed_in"  @click="$router.push('/user')">
					<md-avatar style="z-index:999" > <img v-if="!anonymus" :src="profile_picture_url" alt="Avatar"/> <md-icon v-else>account_circle</md-icon></md-avatar>
					</md-button>
					<md-button v-else  @click="$router.push('/account/login')">️{{gt("login")}} <md-icon class="md-icon">login</md-icon> </md-button>
     		 	</div>
				<div v-else class="md-toolbar-section-end">
				  <b-form-select v-if="library_user" @change="lang_change" size="sm" class="mt-3 language" v-model="language" :options="languages"></b-form-select>
				</div>
				</div>
				</md-app-toolbar>
				<md-app-drawer ref="drawer" v-if="!fullscreen" :md-active.sync="menuVisible1" :md-persistent="size"  md-swipeable >
							<md-toolbar class="md-transparent" md-elevation="3">
								<span>{{gt("navigation")}}</span>
								<div class="md-toolbar-section-end">
									<md-button class="md-icon-button md-dense" @click="menuVisible1=!menuVisible1">
										<md-icon>keyboard_arrow_left</md-icon>
									</md-button>
								</div>
							</md-toolbar>
							<md-list>
								<div v-for="tab in menuTab" :key="tab.title">
									<router-link :to="tab.link">
										<md-list-item v-if="tab.auth" @click="menuVisible1=false" :class="{'active': $route.fullPath.includes(tab.link)}">
											<md-icon class="md-icon">{{tab.icon}}</md-icon>
											<span style="text-transform:uppercase;"  class="md-list-item-text">{{tab.title}}</span>
										</md-list-item>
										
									</router-link>
								</div>
								<md-divider></md-divider>
								<md-list-item v-if="!member && false" @click="enter_code=1">
											<md-icon class="md-icon">vpn_key</md-icon>
											<span class="md-list-item-text">{{gt("enter_code")}}</span>
								</md-list-item>
								<md-list-item v-if="signed_in" @click="changeTheme">
											<md-icon class="md-icon">settings_brightness</md-icon>
											<span class="md-list-item-text">{{gt("ctheme")}}</span>
								</md-list-item>
								<show-at breakpoint="mediumAndAbove">
								</show-at>
								<router-link v-if="signed_in" :to="add_public('/support')">
								<md-list-item  @click="menuVisible1=false">
											<md-icon class="md-icon">contact_support</md-icon>
											<span class="md-list-item-text">{{gt("support")}}</span>
								</md-list-item>
								</router-link>

								<router-link v-if="signed_in && !library_user"  :to="'/user'">
								<md-list-item  @click="menuVisible1=false">
											<md-icon class="md-icon">translate</md-icon>
											<span class="md-list-item-text">{{gt("language")}}</span>
								</md-list-item>
								</router-link>

								<router-link  :to="'/aboutus'">
								<md-list-item  @click="menuVisible1=false">
											<md-icon class="md-icon">info</md-icon>
											<span class="md-list-item-text">{{gt("about_us")}}</span>
								</md-list-item>
								</router-link>

								<router-link  :to="'/contact'">
								<md-list-item  @click="menuVisible1=false">
											<md-icon class="md-icon">contact_page</md-icon>
											<span class="md-list-item-text">{{gt("contact")}}</span>
								</md-list-item>
								</router-link>
							
								<md-divider></md-divider>
								<md-list-item v-if="signed_in" @click="logout">
											<md-icon class="md-icon">logout</md-icon>
											<span class="md-list-item-text">{{gt("logout")}}</span>
								</md-list-item>

								<router-link v-if="!signed_in"  :to="'/account/login'">
								<md-list-item  @click="menuVisible1=false">
											<md-icon class="md-icon">login</md-icon>
											<span class="md-list-item-text">{{gt("login")}}</span>
								</md-list-item>
								</router-link>												
							</md-list>
				</md-app-drawer>	
			<md-app-content>
				<div v-if="!member">
				    <b-alert v-if="promotion" variant="success" dismissible show>{{gt("promotion_text")}}</b-alert>
					<b-alert v-if="!promotion  && !promotion_hide" variant="warning" dismissible show>{{gt("promotion_over_text")}}</b-alert>
				</div>
					 <md-dialog-confirm
						:md-active.sync="terms"
						:md-title="gt('terms_title')"
						:md-content="generateTerms()"
						:md-confirm-text="gt('agree')"
						:md-cancel-text="gt('disagree')"
						@md-cancel="logout"
						@md-confirm="accept_terms"
						:md-click-outside-to-close="false"
						:md-close-on-esc="false"
						:md-fullscreen="true"  />

						<md-dialog-prompt
						:md-active.sync="enter_code"
						v-model="code"
						:md-title="gt('enter_code')"
						md-input-maxlength="32"
						:md-input-placeholder="gt('type_code_pls')"
						:md-confirm-text="gt('ok')"
						:md-cancel-text="gt('cancel')"
						@md-confirm="check_code" />
								
				<nointernetconnection v-if="!internet_connection" />
				<undermaintenance v-else-if="undermaintenance_flag && !admin" />
				<router-view  :fullscreen="fullscreen" v-else-if="!loading_screen"/>
				<loading v-else />
			</md-app-content>

				
						
		</md-app>
		<loading  v-else/>

		
	</div>
</template>

<script>
import {getAuth,signOut,auth,user_language} from "firebase/auth";
import {signInWithEmailAndPassword,onAuthStateChanged,signInWithPopup,GoogleAuthProvider } from "firebase/auth";
import {get_text,languages,get_defaultlanguage,title_page} from "@/languages";
import langa from "../languages/languages";
import cat from "../firebase/categories";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,user_email_verified,functions} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit, updateDoc,getDocFromCache  } from "firebase/firestore";
import {showAt, hideAt} from 'vue-breakpoints';
import { getFunctions, httpsCallable } from "firebase/functions";
import firebaseCredentials from "@/firebase/credentials";
import loading from "@/components/parts/loading";
import undermaintenance from "@/components/parts/undermaintenance";
import nointernetconnection from "@/components/parts/nointernetconnection";
import logo from "@/assets/logo";
import * as firebaseui from 'firebaseui';

	export default {
		components: {
		logo,
		loading,
		hideAt, 
		showAt,
		undermaintenance,
		nointernetconnection 
		},
		name: 'Index',
		title:"",
		selectedBooks: null,
		data: () => ({
			profile_picture_url:"",
			profile_name:"",
			admin:false,
			oath:false,
			member:false,
			library_user:false,
			anonymus:false,
			valid_until:new Date(),
			dateFormat:"",
			user:{},
			seaching_text:"",
			terms_text:{
				title:"",
				text:""
			},
			code:"",
			fullscreen:false,
			mini:false,
			size:"mini",
			enter_code:false,
			languages:langa.languages,
			searchedBooks:[],
			dataReady: false,
			aterms:true,
			undermaintenance_flag:false,
			email_verified:true,
			language_chooser_dialog:false,
			showSidepanel:false,
			terms:false,
			admin_page:false,
			promotion:false,
			promotion_hide:false,
			signed_in:false,
			menuVisible1: false,
			internet_connection:false,
			menuVisible2: false,
			userTheme: "default",
			loading_screen:false,
			generated_keywords:"",
			library_user_logout:false,
			menuTab:[{
					icon: 'event',
					title: 'Calendar',
					link: '/events',
					auth: true,
				}],
	 uiConfig : {
      signInSuccessUrl: '/home',
      signInOptions: [
        GoogleAuthProvider
        ]
      }	

		}),
		metaInfo(){
			return{
			title:title_page("",""),
			meta:[
			{ name: 'keywords',content:this.generated_keywords},
			{ name: 'description',content:title_page("","")},
			{ name: 'og:description',content:title_page("","")},
			{ name: 'og:image',content:"img/icons/favicon-32x32.png"},
			]
			}
		},
		async mounted() {

			this.signed_in= !(await getAuth().currentUser==null);
			
			this.$router.beforeEach((to,from,next)=>{
				
				this.loading_screen=true;
				next();
			});


			let get_under; //= await getDoc(doc(firestore,"properties","global_flags"));
           	get_under=await getDoc(doc(firestore,"properties","global_flags"));
			//console.log("Properties reading")
			//console.log(get_under.data());
			this.undermaintenance_flag= get_under.data().undermaintenance;
			this.promotion=get_under.data().promotion;
			this.promotion_hide=get_under.data().promotion_hide;
			this.library_user_logout=get_under.data().library_user_logout;
			let keywords= get_under.data().keywords;
			keywords.forEach(as=>{
				this.generated_keywords+=`${as},`;
			});

			setInterval(()=>
			{
				this.fullscreen=JSON.parse(localStorage.getItem("fullscreen"));
				//logger(JSON.parse(localStorage.getItem("fullscreen")));
				 this.internet_connection=window.navigator.onLine;

				 if(window.innerWidth>550)
				 {
					//console.log(this.$refs["drawer"].$data);
					 this.size="mini"
					 this.mini=false;
				 }
				 else
				 {
					 this.size=null;
					 this.mini=true;
				 }
			},500);
			
			this.$router.afterEach(()=>{
				setTimeout(()=>{this.loading_screen=false},300);
			});
			
			try{
			this.user=await FirebaseAuth.currentUser;
			if(getAuth().currentUser!=null)
			{
			
			this.anonymus=await getAuth().currentUser.isAnonymous;
			this.profile_picture_url=await FirebaseAuth.currentUser.photoURL;
			this.profile_name=await FirebaseAuth.displayName;
			
			this.email_verified=await getAuth().currentUser.emailVerified;
			this.library_user=await getAuth().currentUser.email==firebaseCredentials.public_profile.u;
			//this.language= await this.get_user_language();
			console.log(getAuth().currentUser);
			//let k=await getDoc(doc(firestore,"users",this.user.uid));
			let k;
		
           	k=await getDoc(doc(firestore,"users",getAuth().currentUser.uid));
			
			
        
			if(await getAuth().currentUser.displayName!=k.data().name)
			{
				await setDoc(doc(firestore,"users",getAuth().currentUser.uid),{name: await getAuth().currentUser.displayName},{merge:true});	
			}
			console.log("email")
			console.log(k.data().email);
			console.log("email")
			if(k.data().email==null)
			{
			if(await getAuth().currentUser.email!=null)
			{
			if(await getAuth().currentUser.email!=k.data().email)
			{
				
				await setDoc(doc(firestore,"users",getAuth().currentUser.uid),{email: await getAuth().currentUser.email},{merge:true});	
			}}
			else
			{
				await setDoc(doc(firestore,"users",getAuth().currentUser.uid),{email: await getAuth().currentUser.providerData[0].email},{merge:true});	
			}
			}
			if(await getAuth().currentUser.phoneNumber!=k.data().phoneNumber)
			{
				await setDoc(doc(firestore,"users",getAuth().currentUser.uid),{phoneNumber: await getAuth().currentUser.phoneNumber},{merge:true});	
			}

			if(await getAuth().currentUser.photoURL!=k.data().photoURL)
			{
				await setDoc(doc(firestore,"users",getAuth().currentUser.uid),{photoURL: await getAuth().currentUser.photoURL},{merge:true});	
			}


			this.admin=(k.data().admin==null?false:k.data().admin);
			this.oath=(k.data().oath==null?false:k.data().oath);
			this.member=(k.data().member==null?false:k.data().member);
			console.log("terms data");
			console.log(k.data().terms);
			this.terms=(k.data().terms==undefined?true:!k.data().terms);

			if(k.data().h4cker==null||!k.data().h4cker)
			{
				console.log("validated");
			}
			else
			{
				if(!k.data().h4cker) return;
				this.logout();
				
				this.$noty.success(this.gt(":3"), {
						killer: true,
						timeout: 1500,
					});
				this.$router.push("/account/login");
			}
			
			if(this.library_user){
			this.language=get_defaultlanguage();
			}
			else {
				this.language="sr-SR";
			}
			

			if(!this.library_user)
			{
			if(k.data().language!=localStorage.getItem("language"))
			{
				localStorage.setItem("language",k.data().language);
				window.location.reload();
			}

			localStorage.setItem("language",k.data().language);
			}
			else 
			{
				if(localStorage.getItem("language")==null)
				{
					localStorage.setItem("language",k.data().language);
				}
				
			}
			this.language=localStorage.getItem("language");
		

			//this.language=await getAuth().languageCode;
			}
			else 
			{
				var ui = new firebaseui.auth.AuthUI(getAuth());
    			ui.start('#firebaseui-auth-container', this.uiConfig);
			}
			let theme="light";
			
			}
			catch (e)
			{
				///error
			}
			if (localStorage.userTheme === "dark") {
				this.userTheme = "dark";
				}
			if (this.$route.fullPath === '/') {
				this.$router.replace('/home').catch(() => {
				});
			}
			if (String(this.$route.fullPath).indexOf("/admin/") >=0)
			{
				this.admin_page=true;
			}
			else this.admin_page=false;

			if (String(this.$route.fullPath).indexOf("/admin/") >=0 && !this.admin) {
				updateDoc(doc(firestore,"users",this.user.uid),{h4cker:true},{merge:true})
				this.$router.push("/home");
			}

			this.menuTab= [
				{
					icon: 'home',
					title: this.gt("Home"),
					link: '/home',
					auth: true,
				},
				{
					icon: 'search',
					title: this.gt("Search"),
					link: '/search',
					auth: true,
				}
		
			];
			cat.categories.forEach((a)=>{
				this.menuTab.push({
					icon: a.icon,
					title: this.gt(a.name),
					link: `/views/${a.name}`,
					auth: true,
				})
			})
			if(this.admin && this.signed_in)
			{

				this.menuTab.push({	
					icon: 'dashboard',
					title: this.gt("admin_dashboard"),
					link: '/admin/dashboard',
					auth: true,
					admin:true
				
					});
				this.menuTab.push({
						
					icon: 'local_printshop',
					title: this.gt("printing_queue"),
					link: '/admin/printing',
					auth: true,
					admin:true
				
					});	
				
				
			}
			this.dataReady=true;
		},
		
		methods: {
			toggleMenu() {
				this.menuVisible = !this.menuVisible;
			},
			 year()
            {
                let k=new Date();
                return k.toISOString().substring(0,4);
            },
			generateTerms()
			{
			 return `<h3>${this.gt("terms_title")}</h3>
                    <p>
                        ${this.gt("terms_text")}
                    </p>
                    <h3>${this.gt("terms_title_2")}</h3>
                    <p>
                        ${this.gt("terms_text_2")}
                    </p>
                      <h3>${this.gt("privacy_title")}</h3>
                    <p>
                        ${this.gt("privacy_text")}
                    </p>
                      <h3>${this.gt("legal_title")}</h3>
                    <p>
                        ${this.gt("legal_text")}
                    </p>
                    <p>${this.gt("su_library")} &copy; | ${this.year()} ${this.gt("all_rights_reserved")} |  ${this.gt("terms_title")}</p>`;
			},
			toggleSidepanel()
			{
				this.showSidepanel = !this.showSidepanel;
			},
			themeChanged() {
				if (localStorage.userTheme === "dark") this.userTheme = "dark";
				else this.userTheme = "default";
			},
			add_public(k)
			{	let l="";
				if(this.signed_in)
				{
					l=`${k}`;
				}
				else
				{
					l=`/public/${k}`;
				}
				return l;
			},
			send_email()
			{
				
			},
			searching()
			{
				let k=this.seaching_text;
				this.seaching_text="";
				this.$router.push(`/search/search_text/${k}`);
			
			},
			
			changeTheme() {
				
				change_Theme_Fb("change");
				this.themeChanged();
				
			},
			async lang_change()
			{
				this.dataReady=false;
				//getAuth().languageCode=this.language;
				
				await  localStorage.setItem("language",this.language);
			    window.location.reload();
				this.dataReady=true;
			},
			gt(a)
				{
					return get_text(a);
				},
				
				async accept_terms()
				{
				 await setDoc(doc(firestore,"users",FirebaseAuth.currentUser.uid),{terms:true},{merge:true});
				},
				refresh_page()
				{
					this.dataReady=false;
					this.dataReady=true;
				},
				async check_code()
				{
					const checkCode=httpsCallable(functions,"checkCode");
					checkCode({ text: this.code })
					.then((result) => {
						// Read result of the Cloud Function.
						/** @type {any} */
						const data = result.data;
						const sanitizedMessage = data.text;
						this.refresh_page();

					});
				},
			logout() {
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
					
					_this.$noty.error(this.gt("logout_error_pls_refresh"));
				});
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
				max-width: 350px !important;
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
		width: 350px;
		//max-width: calc(100vw - 125px);
 		 }
		  
	}
	.btn-outline-warning {
		color: $accent;
		border-color:$accent;
	}
  
  .search {
	min-width: 130px;
    max-width: 300px;
  }
  .desktop {
	display:block;
  }
  #vue-js-index-container .md-drawer
  {
	  width: 350px;
  }
  #vue-js-index-container .md-app .md-app-drawer {
    max-width: 330px !important;
}
#vue-js-index-container .md-drawer
{
	width: 350px;
}
  @media only screen and (max-width: 600px) { 
  .desktop {
	display:none;
  }
}

.phone-viewport {
    width: 322px;
    height: 200px;
    display: inline-flex;
    align-items: flex-end;
    overflow: hidden;
    border: 1px solid rgba(#000, .26);
    background: rgba(#000, .06);
  }

/*

*/
</style>
