<template>
    
    <div class="center">
        <maintenance />
        <h1>{{gt("under_construction")}}</h1>
        <h3>{{gt("wewillbeback")}}</h3>
    </div>

</template>

<script>
import {get_text,languages,get_defaultlanguage,title_page} from "@/languages";
import maintenance from "@/assets/maintenance";
export default {
    components:{
        maintenance
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