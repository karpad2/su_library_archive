

<template>
	<div id="account-login-container">
		<div v-if="enable_public_login">
			<md-field>
			<label>{{gt("username")}}</label>
			<md-input id="name" v-model="name"></md-input>
		</md-field>
		<md-field>
			<label>{{gt("email")}}</label>
			<md-input id="email" v-model="email"></md-input>
		</md-field>
		

		<md-field>
			<label>{{gt("password")}}</label>
			<md-input id="password" v-model="password" type="password"></md-input>
			
		</md-field>
		<md-field>
			<label>{{gt("password_pls_write_again")}}</label>
			<md-input id="password2" v-model="password2" type="password"></md-input>
		</md-field>

		

		<md-button class="md-raised md-primary" @click="register">{{gt("register")}}</md-button>
		</div>
		<p style="color:red;">{{errorMessage}}</p>

	</div>
</template>

<script>
import {signInWithEmailAndPassword,createUserWithEmailAndPassword,onAuthStateChanged,signInWithPopup,GoogleAuthProvider,getAuth } from "firebase/auth";
	import {FirebaseAuth,firestore} from "@/firebase";

  import Password from 'vue-password-strength-meter'
	import {ref, set ,onValue,get, child,push,runTransaction } from "firebase/database";
	import glogo from "@/assets/glogo";
	import {get_text,title_page} from "@/languages";
	import { collection, doc, setDoc, query, where, getDocs,getDoc  } from "firebase/firestore";

	export default {
		name: "AccountRegister",
		components: {
			
  			},
	 metaInfo:{
			title:title_page("","register"),
		},
		data() {
			return {
				email: "",
				password: "",
				password2:"",
				name:"",

				errorMessage: "",
				enable_public_login:true
			}
		},
		mounted() {
			const auth = getAuth();
			onAuthStateChanged(auth,(user) => {
				if (user && this.email === "") this.$router.replace('/account').catch(() => {
				localStorage.user=this.user;
				setDoc(doc(firestore,"users",FirebaseAuth.currentUser.uid),{name:user.displayName,email:user.email,phone:user.phoneNumber},{merge:true});
				
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
			async register()
		{
			const auth=getAuth();
			if (this.email.length < 6 || this.password.length < 4) {
					this.errorMessage = "Insert email and password";
			return;
			}
			if(this.password!=this.password2) {this.errorMessage = "Password wrong"; return}
			createUserWithEmailAndPassword(auth,this.email,this.password).then(
				async (result)=>
				{
				// The signed-in user info.
				const user = result.user;
				this.$router.replace('/home');	
				this.set_user_data_local();
				
				await setDoc(doc(firestore,"users",FirebaseAuth.currentUser.uid),{name:user.displayName},{merge:true});

				}
			)
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
			}
		},
		set_user_data_local: function ()
		{	onAuthStateChanged((user) => {
			localStorage.user=this.user;
			});
		},
		

		
	}
</script>

<style lang="scss">
	#account-login-container {

	}
</style>
