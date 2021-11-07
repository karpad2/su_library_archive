<template>
<div v-if="dataReady">
    <md-title>{{gt('add_new_book')}}</md-title>
    
    <md-field>
      <label>{{gt('book_name')}}</label>
      <md-input @change="change" v-model="book.book_name" md-counter="100"></md-input>
    </md-field>
    <md-field>
      <label>{{gt('book_author')}}</label>
      <md-input @change="change" v-model="book.author_name" md-counter="100"></md-input>
    </md-field>
    <md-field>
      <label>{{gt('language_chooser')}}</label>
     <md-select @change="change" v-model="book.language">
							<md-option v-for="la in languages" :key="la.code"  :value="la.code">{{la.name}}</md-option>
						</md-select>
    </md-field>
    
    <quillEditor />

    <md-field>
      <label>{{gt("upload_book_keywords")}}</label>
      <md-chips @change="change" v-model="book.keywords" :md-placeholder="gt('add_keywords')">

        <div class="md-helper-text">{{gt('up_to_keywords')}}</div>
    </md-chips>
    </md-field>
<md-field>
      <label>{{gt("first_page_as_cover_switch")}}</label>
      <md-switch v-model="use_first_page_as_cover">{{gt("switch")}}</md-switch>
    </md-field>

    <md-field>
      <label>{{gt("hided")}}</label>
      <md-switch v-model="book.hided">{{gt("switch")}}</md-switch>
    </md-field>
    

    <md-field>
      <label>{{gt('first_page_as_cover')}}</label>
      <md-switch v-model="first_page_as_cover">{{gt("switch")}}</md-switch>
    </md-field>
    

    <md-field v-if="!use_first_page_as_cover">
      <label>{{gt("upload_book_cover")}}</label>
      <md-file v-model="placeholder" :placeholder="gt('upload_book_cover')" />
    </md-field>

    <md-field>
      <label>{{gt("upload_book")}}</label>
      <md-file v-model="placeholder" :placeholder="gt('upload_book')" />
    </md-field>   

</div>
</template>
<script>
import {get_text} from "@/languages";
import { quillEditor } from 'vue-quill-editor';
import { getStorage, ref, uploadBytes } from "firebase/storage";

import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,user_email_verified,storage} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit, addDoc,FieldValue } from "firebase/firestore";
export default {
    
    data(){
    return{
      book:{
        book_name:"",
        author_name:"",
        keywords:[],
        page:"",
        description:"",
        language:"",
        favorites:0,
        uploading_date:"",
        visible:true},
        book_id:null,
        keywords:[],
        description:"",
        book_name:"",
        author_name:"",
        language_chooser:"",
        pdf_file:null,
        pages:[],
        hided:false,
        dataReady:false,
        first_page:null,
        page_number:0,
        languages:[
          {
            code:"rs",name:"serbian"
          },
          {
            code:"hu",name:"hungarian"
          },
          {
            code:"en",name:"english"
          },
          {
            code:"ge",name:"german"
          }
        ],
        use_first_page_as_cover:true,
        file:null
    }
    },
    components:{
        quillEditor
    },
    async mounted()
    {
      if(this.$router.params.bid=="new")
      {
      
      this.languages.forEach((el,i)=>{
       this.languages[i].name=this.gt(this.languages[i].name); 
      });
      //console.log( this.$router.params.b_mode);
      }
      else
      {
        this.book_id=this.$router.params.bid;
      }
      
      
      this.dataReady=true;

    },
    methods:{
        gt(a)
		{
			return get_text(a);
		},
    upload_pdf()
    {

    },
    async change()
    {
      let book_ref=null;
       if(this.$router.params.bid=="new" && this.book_id==null)
      {
      book_ref=await addDoc(doc(firestore,"books"),this.book,{merge:true});
      this.book_id=book_ref.id;
      }
      else
      {
        book_ref=await setDoc(doc(firestore,"books",this.$router.params.bid),this.book,{merge:true});
      }

    },
    async upload_book()
    {
     
     

      const firststorageRef = ref(storage,`books/${this.book_id}/thumbnail.png`);
      const metadata = {contentType: 'image/png'};
      let uploadTask = await uploadBytes(firststorageRef, this.first_page, metadata);
      let storageRef=null;
      this.pages.forEach(async(element,index)=>
      {
         storageRef= ref(storage,`books/${this.book_id}/pages/${index+1}.png`);
         uploadTask = await uploadBytes(storageRef, element, metadata);
      })
      

    }

    }
}
</script>