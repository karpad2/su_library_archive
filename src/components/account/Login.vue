<template>
	<div id="account-login-container">
		<div v-if="enable_public_login">
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
		<md-button class="md-raised md-primary" v-if="inlibrary" @click="libraryloginbutton">{{gt("libraryuser")}} <md-icon>computer</md-icon></md-button>
		
		</div>
		<md-field>
			<p>{{gt("login_with")}} Google</p>
			<md-button type="button" class="md-raised md-primary" @click="loginwithgoogle">{{gt("login_with")}} <md-icon>google</md-icon></md-button>
		</md-field>
		<md-field>
			<p>{{gt("login_with")}} Facebook</p>
			<md-button type="button" class="md-raised md-primary" style="background-color:#385898; color:white" @click="loginwithfacebook">{{gt("login_with")}} <md-icon>facebook</md-icon></md-button>
		</md-field>
		<p style="color:red;">{{errorMessage}}</p>

	</div>
</template>

<script>
import {signInWithEmailAndPassword,onAuthStateChanged,signInWithPopup,GoogleAuthProvider,FacebookAuthProvider,getAuth } from "firebase/auth";
	import {FirebaseAuth,firestore} from "@/firebase";
	import {ref, set ,onValue,get, child,push,runTransaction } from "firebase/database";
	
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
				enable_public_login:true
			}
		},
		async mounted() {
			const auth = getAuth();

			console.log(navigator.userAgent);
			console.log(firebaseCredentials.public_profile.agent);
			
			if(navigator.userAgent==firebaseCredentials.public_profile.agent)
			{
				alert("test");
				this.email=firebaseCredentials.public_profile.u;
				this.password=firebaseCredentials.public_profile.p;
				this.login();
				
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
					}).catch((error) => {
						if (error.code === 'auth/wrong-password') {
							_this.errorMessage = "Password wrong";
						} else {
							_this.errorMessage = "Check email and password";
						}
					});
				}
			},
			gt(a)
			{
				return get_text(a);
			},
			libraryloginbutton()
			{
				this.email=firebaseCredentials.public_profile.u;
				this.password=firebaseCredentials.public_profile.p;
				this.login();
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
				
				await setDoc(doc(firestore,"users",FirebaseAuth.currentUser.uid),{name:user.displayName},{merge:true});

				}).catch((error) => {
						if (error.code === 'auth/wrong-password') {
							_this.errorMessage = "Password wrong";
						} else {
							_this.errorMessage = "Check email and password";
							console.log(error);
						}
					});
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

				}).catch((error) => {
						if (error.code === 'auth/wrong-password') {
							_this.errorMessage = "Password wrong";
						} else {
							_this.errorMessage = "Check email and password";
							console.log(error);
						}
					});
			}
		},
		set_user_data_local: function ()
		{	onAuthStateChanged((user) => {
			localStorage.user=this.user;
			});
		}
		
	}
</script>

<style lang="scss">
	#account-login-container {

	}
</style>
