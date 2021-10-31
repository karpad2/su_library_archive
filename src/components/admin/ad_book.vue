<template>
<div>
    <md-title>{{gt('add_new_book')}}</md-title>
    
    <md-field>
      <label>{{gt('book_name')}}</label>
      <md-input v-model="book_name" md-counter="100"></md-input>
    </md-field>
    <md-field>
      <label>{{gt('book_author')}}</label>
      <md-input v-model="author_name" md-counter="100"></md-input>
    </md-field>
    
    <quillEditor />

    <md-field>
      <label>{{gt("upload_book_keywords")}}</label>
      <md-chips v-model="keywords" :md-placeholder="gt('add_keywords')">

        <div class="md-helper-text">{{gt('up_to_keywords')}}</div>
    </md-chips>
    </md-field>
<md-field>
      <label>{{gt("first_page_as_cover_switch")}}</label>
      <md-switch v-model="use_first_page_as_cover">{{gt("switch")}}</md-switch>
    </md-field>
    

    <md-field>
      <label>{{gt('first_page_as_cover')}}</label>
      <md-input v-model="author_name" md-counter="100"></md-input>
    </md-field>
    

    <md-field>
      <label>{{gt("upload_book_cover")}}</label>
      <md-file v-model="placeholder" :placeholder="gt('upload_book_cover')" />
    </md-field>

    <md-field>
      <label>{{gt("upload_book")}}</label>
      <md-file v-model="placeholder" :placeholder="gt('upload_book')" />
    </md-field>

    <md-field>
      <label>{{gt("uploading_date")}}</label>
       <md-datepicker v-model="date" />
    </md-field>

   

</div>
</template>
<script>
import {get_text} from "@/languages";
import { quillEditor } from 'vue-quill-editor';
export default {
    
    data(){
    return{
        keywords:[],
        book_name:"",
        author_name:"",
        use_first_page_as_cover:true,
        file:null
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