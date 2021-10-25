<template>
	<div id="account-login-container">
		<div v-if="false">
		<md-field>
			<label>Email</label>
			<md-input id="email" v-model="email"></md-input>
		</md-field>

		<md-field>
			<label>Password</label>
			<md-input id="password" v-model="password" type="password"></md-input>
		</md-field>

		

		<md-button class="md-raised md-primary" @click="login">Login</md-button>
		</div>
		<md-field>
			<p>Sign in with the Google</p>
			<md-button class="md-raised md-primary" @click="loginwithgoogle">Login with <glogo/></md-button>
		</md-field>
		<p>For security reasons we support Google profile authentication only.</p>
		<p style="color:red;">{{errorMessage}}</p>

	</div>
</template>

<script>
import {signInWithEmailAndPassword,onAuthStateChanged,signInWithPopup,GoogleAuthProvider,getAuth } from "firebase/auth";
	import {FirebaseAuth,FireDb} from "@/firebase";
	import {ref, set ,onValue,get, child,push,runTransaction } from "firebase/database";
	import glogo from "@/assets/glogo";
	import {get_text} from "@/languages";

	export default {
		name: "AccountLogin",
		components: {
    		glogo
  			},
		data() {
			return {
				email: "",
				password: "",
				errorMessage: ""
			}
		},
		mounted() {
			const auth = getAuth();
			onAuthStateChanged(auth,(user) => {
				if (user && this.email === "") this.$router.replace('/account').catch(() => {
				localStorage.user=this.user;
				set(ref(FireDb,`users/${FirebaseAuth.currentUser.uid}/user_name`),FirebaseAuth.currentUser.displayName);
				
				}); // User already logged
			});
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
			loginwithgoogle: function()
			{
				let _this = this;
				let provider= new GoogleAuthProvider();
				signInWithPopup(FirebaseAuth,provider).then((result)=>
				{	
				
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const token = credential.accessToken;
				// The signed-in user info.
				const user = result.user;
				this.$router.replace('/home');	
				this.set_user_data_local();
				set(ref(FireDb,`users/${FirebaseAuth.currentUser.uid}/user_name`),FirebaseAuth.currentUser.displayName);
				}).catch((error) => {
						if (error.code === 'auth/wrong-password') {
							_this.errorMessage = "Password wrong";
						} else {
							_this.errorMessage = "Check email and password";
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
