<template>
	<div class="center">
	<md-card>
      <md-card-header>
        <div class="md-title">{{gt("profile")}}</div>
      </md-card-header>

      <md-card-content>
        {{gt("hello")}}, <span class="profile">{{profilename}}</span>
		<p>{{gt("profile_expiration_txt")}}: <span class="profile">{{profilexpire}}</span> </p>
      </md-card-content>

      <md-card-actions>

        
      </md-card-actions>
    </md-card>

	<md-card>
      <md-card-header>
        <div class="md-title">{{gt("app_info")}}</div>
      </md-card-header>

      <md-card-content>
       <p>{{gt("latest_version")}}: {{v}}</p>
		{{gt("app_made_by")}}  <a href="https://karpad2.github.io" class="karpad2" target="_blank">karpad2</a>
      </md-card-content>

      <md-card-actions>

        
      </md-card-actions>
    </md-card>

		
	</div>
</template>

<script>
import axios from "axios";
import {get_text} from "@/languages";
	export default {
		name: "Info",
		data:function ()
		{
			return {
			v:"0.1.0"
			}
		},
		methods:{
			gt(a)
			{
				return get_text(a)
			}
		}
	}
</script>

<style scoped>
	.center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		text-align: center;
	}

	.karpad2 {
		font-weight: bold;
	}
</style>