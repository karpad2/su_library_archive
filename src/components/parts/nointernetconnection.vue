<template>    
    <div class="center">
        <md-icon style="width:150px;height:150px;">cloud_off</md-icon>
        <h3>{{gt("no_internet_connection")}}</h3>
    </div>
</template>

<script>
import {get_text,languages,get_defaultlanguage,title_page} from "@/languages";

export default {
    components:{
       
    },
    metaInfo:{
			title:title_page("","under_constructions"),
		},
    setup() {
        
    },
    methods:{
        gt(a)
        {
            return get_text(a);
        }
    }
}
</script>