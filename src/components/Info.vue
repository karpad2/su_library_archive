<template>
	<div class="center">
		<p>Latest version: {{v}}</p>
		App made by <a href="https://karpad2.github.io" class="karpad2" target="_blank">karpad2</a>
		<p><a href="https://karpad2.github.io" target="_blank">GitHub</a></p>
	</div>
</template>

<script>
import axios from "axios";
import {get_text} from "../languages";
	export default {
		name: "Info",
		data:function ()
		{
			return {
			version_number2:"",
			v:"0.1.0"
			}
		},
		mounted()
		{
			//this.v=String(this.get_version());
		},
		methods:
		{
			get_version()
			{
				let ver="";
				let res= axios.get("https://raw.githubusercontent.com/karpad2/obudai_diplomamunka/main/package.json")
					.then(function (response) {
    // handle success
				ver= String(response.data.version);
				console.log(ver);
			});
			return ver;
			},
			gt(a)
				{
					return get_text(a);
				},
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