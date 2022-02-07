<template>
	<div id="app">
		<router-view class="router-view"/>
	<footer >
    	<cookie-law v-if="!disablecookiebanner" id="cookie_button" theme="dark-lime" :message="cookie_text" :buttonText="cookie_ok"></cookie-law>
  	</footer>
	</div> 
</template>

<script>
  import CookieLaw from 'vue-cookie-law';
  import {get_text} from "./languages";
  import firebaseCredentials from "./firebase/credentials";
	export default {
		name: 'App',
		components: { CookieLaw },
		mounted()
		{
		
		if( localStorage.getItem("userTheme")===null) localStorage.userTheme = "light";
		if(navigator.userAgent==firebaseCredentials.public_profile.agent)
		{
			this.disablecookiebanner=true;
		}
		this.$material.locale.startYear=1500;
		this.$material.locale.endYear=new Date().getFullYear();
		this.$material.locale.firstDayOfAWeek=1;
		},
		data()
		{
			return{
				cookie_text:get_text("cookie_text"),
				cookie_ok:get_text("ok"),
				disablecookiebanner:false
			/*	<Ribbon v-bind="ribbonOptions"></Ribbon>
		ribbonOptions: {
        	text: 'Fork me on GitHub',
        	linkUrl: "https://github.com/karpad2/obudai_diplomamunka",
        	fixed: true
      }*/
			}
		}
		
	}
</script>

<style lang="scss" scope>
	@import "../src/style/variables.scss";
	@import "~vue-material/dist/theme/engine";
	@include md-register-theme("default", (
		primary: $primary,
		accent: $accent,
	));
	@include md-register-theme("dark", (
			primary: $primary,
			accent: $accent,
			theme: dark
	));
	@import "~vue-material/dist/theme/all";
	@import "~vuejs-noty/dist/vuejs-noty.css";

	#app, .router-view {
		margin: 0;
		border: 0;
		padding: 0;
		height: 100vh;
	}
	.Cookie--mytheme .Cookie__button
	{
	background: $primary;
	}
	#cookie_button 	.Cookie__button
	{
	background: $primary;
	text-transform:uppercase;
	font-family: apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
	font-weight: 500;
	font-size: 14px;
	}
</style>
