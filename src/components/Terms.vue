<template>
				<b-card>
					<logo />
					<h3>{{gt("terms_title")}}</h3>
                    <p>
                        {{gt("terms_text")}}
                    </p>
                    <h3>{{gt("terms_title_2")}}</h3>
                    <p>
                        {{gt("terms_text_2")}}
                    </p>
                      <h3>{{gt("privacy_title")}}</h3>
                    <p>
                        {{gt("privacy_text")}}
                    </p>
                      <h3>{{gt("legal_title")}}</h3>
                    <p>
                        {{gt("legal_text")}}
                    </p>
                    <p>&copy; {{gt("su_library")}} {{year}} | {{gt("all_rights_reserved")}} |  {{gt("terms_title")}}</p>
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
		},
        computed:{
            year()
            {
                let k=new Date();
                return k.toISOString().substring(0,4);
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
