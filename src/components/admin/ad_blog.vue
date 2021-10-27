<template>
    <div>
        
        <quillEditor/>

    </div>

</template>
<script>
import {get_text} from "@/languages";
import { quillEditor } from 'vue-quill-editor';
export default {
    
    data(){
    return{
       
    }
    },
    components:{
        quillEditor
    },
    methods:{
        gt(a)
		{
			return get_text(a);
		},
    }
}
</script>