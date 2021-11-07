<template>
    
    <div class="center">
        
        
        <h1>{{gt("promotion_has_ended")}}</h1>
        <h3>{{gt("promotion_text_get_membership")}}</h3>
    </div>

</template>

<script>
import {get_text,languages,get_defaultlanguage} from "@/languages";

export default {
    components:{
        
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