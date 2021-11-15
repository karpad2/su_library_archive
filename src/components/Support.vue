<template>
<div class="center">
    <h2>{{gt("Support")}}</h2>

    <p> Please click<a class="help" href="https://github.com/karpad2/su_library_archive/issues"> here </a> if you want to contact us, feature request and report and if you need help. </p> 
    <p> Please click<a class="help" href="https://github.com/karpad2/su_library_archive/wiki"> here </a> if you want to check manual. </p> 
    <p> App version: {{version}}</p>
	<p> App made by: {{author}}</p>

</div>
</template>
<script>
import {get_text,languages,get_defaultlanguage,title_page} from "@/languages";
import version from "../../package.json"
export default {
    metaInfo:{
			title:title_page("","Support"),
		},
        methods: {
			gt(a)
			{
				return get_text(a)
			}},
			data(){
				return{
					version:version.version,
					author:version.author
				}
			}
}
</script>


<style lang="scss" scoped>

.help{
	  font-weight: bold;
  }
</style>
