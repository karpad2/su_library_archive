<template>
	<div id="account-login-container">
		<div v-if="true">
		<div  v-if="enable_public_login">
			<div  v-if="!hide_login">
		<md-field>
			<label>{{gt("email")}}</label>
			<md-input id="email" v-model="email"></md-input>
		</md-field>

		<md-field>
			<label>{{gt("password")}}</label>
			<md-input id="password" v-model="password" type="password"></md-input>
		</md-field>

		

		<md-button class="md-raised md-primary" @click="login">{{gt("login")}}</md-button>
			
		<md-button class="md-raised md-primary" @click="registerbutton">{{gt("register")}}</md-button>
		
		<div>
		<md-button class="md-raised md-primary" v-if="inlibrary" @click="libraryloginbutton">{{gt("libraryuser")}} <md-icon>computer</md-icon></md-button>
		</div>
		<div>
		<md-button class="md-raised md-primary" v-if="true" @click="anonymlogin">{{gt("anonym_login")}} <md-icon>account_circle</md-icon> </md-button>
		</div>
		</div>
		</div>
		<div>
			<p>{{gt("login_with")}} Google</p>
			<md-button type="button" class="md-raised md-primary" @click="loginwithgoogle">{{gt("login_with")}} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-google" viewBox="0 0 16 16">
  						<path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
						</svg></md-button>
						</div>
	<div>
			<p>{{gt("login_with")}} Facebook</p>
			<md-button type="button" class="md-raised md-primary" style="background-color:#385898; color:white" @click="loginwithfacebook">{{gt("login_with")}} <md-icon style="color:white">facebook</md-icon></md-button>
	</div>
		<p style="color:red;">{{errorMessage}}</p>
		</div>
		 <div id="firebaseui-auth-container"></div>
	</div>
</template>

<script>
import {signInWithEmailAndPassword,onAuthStateChanged,signInWithPopup,GoogleAuthProvider,EmailAuthProvider,FacebookAuthProvider,getAuth,signInAnonymously } from "firebase/auth";
	import {FirebaseAuth,firestore,loginerror} from "@/firebase";
	import {ref, set ,onValue,get, child,push,runTransaction } from "firebase/database";
	import firebaseui from 'firebaseui';

	import axios from "axios";
	import firebaseCredentials from '../../firebase/credentials';
	import {get_text,title_page} from "@/languages";
	import { collection, doc, setDoc, query, where, getDocs,getDoc  } from "firebase/firestore";

	export default {
		name: "AccountLogin",
		components: {
    		
  			},
	 metaInfo:{
			title:title_page("","login"),
		},
		data() {
			return {
				email: "",
				password: "",
				errorMessage: "",
				inlibrary:false,
				enable_public_login:true,
				hide_login:false
			}
		},
		async mounted() {
			const auth = getAuth();
	/*		
	  var uiConfig = {
      signInSuccessUrl: '/home',
      signInOptions: [
        GoogleAuthProvider.PROVIDER_ID,
        EmailAuthProvider.PROVIDER_ID,
		FacebookAuthProvider.PROVIDER_ID
        ]
      };
    var ui = new firebaseui.auth.AuthUI(getAuth());
    ui.start('#firebaseui-auth-container', uiConfig);
*/

			console.log(navigator.userAgent);
			console.log(firebaseCredentials.public_profile.agent);
			
			if(navigator.userAgent==firebaseCredentials.public_profile.agent)
			{
				this.libraryloginbutton();	
			} 
			if(navigator.userAgent=="Mobile_profile")
			{
				this.anonymlogin();
			} 
			else {
			onAuthStateChanged(auth,(user) => {
				if (user && this.email === "") this.$router.replace('/account').catch(() => {
				localStorage.user=this.user;
				setDoc(doc(firestore,"users",FirebaseAuth.currentUser.uid),{name:user.displayName,email:user.email,phone:user.phoneNumber},{merge:true});
				
				}); // User already logged
			});
			
			this.checkin();
			}
		},
		methods: {
			login: function () {
				if (this.email.length < 6 || this.password.length < 4) {
					this.errorMessage = "Insert email and password";
				} else {
					let _this = this;
					signInWithEmailAndPassword(FirebaseAuth,this.email, this.password).then(() => {
						this.password = "";
						
						this.$router.replace('/home'); // User logged
						this.set_user_data_local();

					}).catch((error) =>{this.errorhandling(error)});
				}
			},
			set_user_data_local: function ()
		{	onAuthStateChanged((user) => {
			localStorage.user=this.user;
			});
		},
			gt(a)
			{
				return get_text(a);
			},
			libraryloginbutton()
			{
				this.hide_login=true;
				this.email=firebaseCredentials.public_profile.u;
				this.password=firebaseCredentials.public_profile.p;
				this.login();
			},
			async anonymlogin()
			{
				const auth = getAuth();
					signInAnonymously(auth)
					.then(async (result) => {
						// Signed in..

				const user = result.user;
				await setDoc(doc(firestore,"users",FirebaseAuth.currentUser.uid),{name:"Anonym"},{merge:true});
				this.$router.replace('/home');	
					})
					.catch((error) => {
						this.loginerror(error);
					});
			},
			async checkin()
			{
				axios.get("https://api.ipify.org?format=json")
				.then(resp => {
					if(resp.data.ip==firebaseCredentials.public_profile.ip||resp.data.ip==firebaseCredentials.public_profile.ip2)
					{
						this.inlibrary=true;
					}
        		//console.log(resp.data);
    			})
			},
			registerbutton()
			{
				this.$router.push("/account/register");
			},

			loginwithgoogle: async function()
			{
				let _this = this;
				let provider= new GoogleAuthProvider();
				signInWithPopup(await FirebaseAuth,provider).then(async (result)=>
				{	
				
				const credential = await GoogleAuthProvider.credentialFromResult(result);
				const token = credential.accessToken;
				// The signed-in user info.
				const user = result.user;
				this.$router.replace('/home');	
				this.set_user_data_local();
				
				await setDoc(doc(firestore,"users",FirebaseAuth.currentUser.uid),{name:user.displayName,},{merge:true});

				}).catch((error) =>{this.errorhandling(error)});
			},
			errorhandling(error)
			{
				 		//loginerror(error,error.code)
						if (error.code === 'auth/wrong-password') {
							this.errorMessage = "Password wrong";
						} else {
							this.errorMessage = "Check email and password";
							console.log(error);
						}
					
			},
			loginwithfacebook: async function()
			{
				let _this = this;
				let provider= new FacebookAuthProvider();
				signInWithPopup(await FirebaseAuth,provider).then(async (result)=>
				{	
				
				const credential = await FacebookAuthProvider.credentialFromResult(result);
				const token = credential.accessToken;
				// The signed-in user info.
				const user = result.user;
				this.$router.replace('/home');	
				this.set_user_data_local();
				
				await setDoc(doc(firestore,"users",FirebaseAuth.currentUser.uid),{name:user.displayName},{merge:true});

				}).catch((error) =>{this.errorhandling(error)});
			}
		},
		computed:
		{

			
		},

		
		
	}
</script>

<style lang="scss">
	#account-login-container {
		max-width: 600px;	
	}
	.md-field{
	max-width: 600px;	
	}
</style>
