<template>
		
			<b-card>
				<b-card>
					<logo />
					</b-card>
					<h3>{{gt("about_us")}}</h3>
                    <p>
                        {{gt("about_us_text_1")}}
                    </p>
                     <p>
                        {{gt("about_us_text_2")}}
                    </p>
                    <p>
                        {{gt("about_us_text_3")}}
                    </p>

                    <p v-if="false"> App made by: <a href="https://karpad2.github.io/"> {{author}} </a></p>
					</b-card>
		
</template>

<script>
import {get_text,title_page} from "@/languages";
import logo from '@/assets/bigfulltextlogo';
import version from "../../package.json"
	export default {
		components: {
		logo
		},
		name: "AboutUs",
		data: () => ({
			userTheme: "default",
            author:version.author
		}),
		metaInfo(){
			return{
			title:title_page("","about_us"),
			
			}
		},
		mounted() {
			if (localStorage.userTheme === "dark") {
				this.userTheme = "dark";
			}
		},
		methods:{
			gt(a)
				{
                    return get_text(a);
					//return get_text(a).replace("\n","<br/>");
				},
			goback()
			{
				this.$router.go(-1);
			}
		}
	}
</script>

<style lang="scss">
.middle-center {
				position: absolute;
				top: 30%;
				left: 50%;
				
				transform: translate(-50%, -50%);
				-ms-transform: translate(-50%, -50%);
				text-align: center;
			}
	#error-404-container {
		.md-app {
			height: 100vh;

			.router-link {
				display: flex;
				align-items: center;
			}

			.bar-logo {
				width: 35px !important;
			}

			

			.logo {
				height: 200px;
				transform: rotate(50deg);
				transition: transform .3s;

				&:hover {
					transform: rotate(0deg);
					transition: transform 1s;
				}
			}
		}
	}
</style>
