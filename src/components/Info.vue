<template>
	<div class="center">
		<p>Latest version: {{v}}</p>
		App made by <a href="https://karpad2.github.io" class="karpad2" target="_blank">karpad2</a>
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
			v:"0.1.0"
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