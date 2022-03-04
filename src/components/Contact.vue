<template>
		<div  class="middle-center" >
					<logo />
					<h3>{{gt("contact")}}</h3>
                    <h4>{{gt("app-title")}}</h4>
                    <address>
                    <p>
                        {{gt("address_label")}}: {{gt("address")}}, <br>
                        24000 {{gt("subotica")}} 
                    </p>
                     <p>
                        Tel.: +381 (0)24 553 115
                    </p>
                    <p>
                        Fax: +381 (0)24 521 383
                    </p>
                     <p>
                       {{gt("email")}}: <a :href="'mailto:'+mailaddress">{{mailaddress}}</a>
                    </p>
                    <h4>{{gt("contactperson")}}:</h4>
                    <p>
                        {{gt("contactpersonname")}}<br>
                        {{gt("email")}}: <a :href="'mailto:'+contactmailaddress">{{contactmailaddress}}</a>
                    </p>
                    </address>
		</div>
</template>

<script>
import {get_text,title_page} from "@/languages";
import logo from '@/assets/bigfulltextlogo';
	export default {
		components: {
		logo
		},
		name: "AboutUs",
		data: () => ({
			userTheme: "default",
            mailaddress:"subiblioteka@gmail.com",
            contactmailaddress:"lalitsanita@subiblioteka.rs"
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
				
				margin-top:5% ;
				left: 50%;
				
				
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
