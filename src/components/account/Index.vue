<template>
	<div id="account-index-container">
		<md-app md-waterfall md-mode="fixed" :md-theme="userTheme">
			<md-app-toolbar class="md-primary" md-elevation="5">
				<router-link class="router-link" to="/home">
					<logo class="bar-logo" />
					<span class="md-title">{{gt("app-title")}}</span>
				</router-link>
			</md-app-toolbar>

			<md-app-content>
				<div class="middle-center">
					
					<logo class="logo" />
					<div> <h4>{{gt("app-title")}}</h4></div>
					<router-view @themeChanged="themeChanged"/>
				</div>
			</md-app-content>
		</md-app>
	</div>
</template>

<script>
import logo from '@/assets/logo';
import {get_text} from "@/languages";
	export default {
		components: {
		logo
		},
		name: "AccountIndex",
		data: () => ({
			userTheme: "default",
		}),
		mounted() {
			this.themeChanged();
		},
		methods: {
			themeChanged: function () {
				if (localStorage.userTheme === "dark") this.userTheme = "dark";
				else this.userTheme = "default";
			},
			changeTheme: function () {
				if (this.themeSwitch) localStorage.userTheme = "dark";
				else localStorage.userTheme = "light";
				this.$emit('themeChanged');
			},
			gt(a)
			{
				return get_text(a);
			},
		}
	}
</script>

<style lang="scss">
	#account-index-container {
		.md-app {
			height: 100vh;

			.router-link {
				display: flex;
				align-items: center;
			}

			.bar-logo {
				width: 35px !important;
				height: 30pt;
			}

			.middle-center {
				position: absolute;
				top: 50%;
				left: 50%;
				width: 300px;
				transform: translate(-50%, -50%);
				-ms-transform: translate(-50%, -50%);
				text-align: center;
			}

			.logo {
				height: 200px;
			}
		}
	}
</style>
