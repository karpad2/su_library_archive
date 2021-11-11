<template>
	<div v-if="dataReady" id="account-index-container">
		<md-app md-waterfall md-mode="fixed" :md-theme="userTheme">
			<md-app-toolbar class="md-primary" md-elevation="5">
				<router-link class="router-link" to="/public/home">
					<logo class="bar-logo" />
					<span class="md-title">{{gt("app-title")}}</span>
				</router-link>
				<div class="md-toolbar-section-end">
						
						<b-form-select @change="lang_change" size="sm" class="mt-3 language" v-model="language" :options="languages"></b-form-select>
					
					</div>
				
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
import {getAuth} from "firebase/auth";
import {get_text,languages,get_defaultlanguage} from "@/languages";
	export default {
		components: {
		logo
		},
		name: "AccountIndex",
		data: () => ({
			userTheme: "default",
			languages:[{value:"sr-SR",text:"Srpski"},{value:"hu-HU",text:"Magyar"},{value:"en-EN",text:"English"}],
			language:"",
			dataReady:false
		}),
		mounted() {
			this.themeChanged();
			if(localStorage.getItem("language")!=undefined|| localStorage.getItem("language")!=undefined)
			{ localStorage.setItem("language",get_defaultlanguage());
				this.language=get_defaultlanguage();
			}
			else this.language=localStorage.getItem("language");
			this.dataReady=true;
		},
		methods: {
			themeChanged: function () {
				if (localStorage.userTheme === "dark") this.userTheme = "dark";
				else this.userTheme = "default";
			},
			lang_change()
			{
				this.dataReady=false;
				//getAuth().languageCode=this.language;
				
				localStorage.setItem("language",this.language);
				this.dataReady=true;
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
	.language
	{
		max-width: 200pt;
		min-width: 100pt;
	}
	/*.md-select{
		max-width: 200pt;
		min-width: 100pt;
		
	}*/
</style>
