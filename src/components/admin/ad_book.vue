<template>
<div v-if="dataReady">
  <md-card class="md-layout-item md-size-50 md-small-size-100">
    <md-card-header>
        <div class="md-title">{{gt('add_new_book')}}</div>
    </md-card-header>
     <md-card-content>
    <md-field>
      <label>{{gt('book_name')}}</label>
      <md-input @change="change" v-model="book.book_name" md-counter="100"></md-input>
    </md-field>
    <md-field>
      <label>{{gt('book_author')}}</label>
      <md-input @change="change" v-model="book.author_name" md-counter="100"></md-input>
    </md-field>
    <md-field>
      <label>{{gt('publisher')}}</label>
      <md-input @change="change" v-model="book.publisher" md-counter="100"></md-input>
    </md-field>
   
      <md-field>
        <b-form-select @change="change" v-model="book.language" :options="languages"></b-form-select>     
      </md-field>
    <md-field>
    <quillEditor @change="change" v-model="book.description" />
    </md-field>
    <md-field>
      
      <md-chips @change="change" v-model="book.keywords" :md-placeholder="gt('add_keywords')">

      
    </md-chips>
    </md-field>


    <md-field>
      <md-switch @change="change" v-model="book.hided">{{gt("hided")}}</md-switch>
    </md-field>
    

    <md-field>
      <label></label>
      <md-switch  v-model="first_page_as_cover">{{gt('first_page_as_cover')}}</md-switch>
    </md-field>
    

    <md-field v-if="!first_page_as_cover">
      <label>{{gt("upload_book_cover")}}</label>
      <md-file v-model="book_cover" :placeholder="gt('upload_book_cover')" />
    </md-field>

    <md-field>
      <label>{{gt("upload_book")}}</label>
      <md-file v-model="book_pdf" :placeholder="gt('upload_book')" />
    </md-field>
     </md-card-content>   
</md-card>
</div>
</template>
<script>
import {get_text} from "@/languages";
import { quillEditor } from 'vue-quill-editor';
import { getStorage, ref, uploadBytes } from "firebase/storage";

import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,user_email_verified,storage} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit, addDoc,FieldValue,updateDoc } from "firebase/firestore";
import { push } from '@firebase/database';
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
        book_ref:null,
        uploading_date:"",
        visible:true},
        book_id:null,
        book_pdf:null,
        keywords:[],
        book_cover:null,
        description:"",
        book_name:"",
        first_page_as_cover:false,
        author_name:"",
        language_chooser:"",
        pdf_file:null,
        pages:[],
        hided:true,
        dataReady:false,
        first_page:null,
        page_number:0,
        abook:null,
        languages:[
          {
            value:"sr-SR",text:"serbian"
          },
          {
            value:"hu-HU",text:"hungarian"
          },
          {
            value:"en-EN",text:"english"
          },
          {
            value:"de-DE",text:"german"
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
      this.abook=this.book;
      
      if(this.$route.params.bid=="new")
      {
     
      this.book.language=this.languages[0].value;
      }
      else
      {
        this.book_id=this.$route.params.bid;
      }
      

      let book_refread=await getDoc(doc(firestore,"books",this.book_id));
      this.book=book_refread.data();
      
      
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
      this.keyword_finder(this.book.author_name);
      this.keyword_finder(this.book.book_name);
      
      this.book.uploading_date=new Date();

       if(this.$route.params.bid=="new" && this.book_id==null)
      {
      
      this.book_ref=await addDoc(collection(firestore,"books"),this.book,{merge:true});
      this.book_id=this.book_ref.id;
      this.$router.push(`/admin/book/${this.book_id}`);
      }
      else
      {
        this.book_ref=updateDoc(doc(firestore,"books",this.book_id),this.book,{merge:true});
      }
           
      
    },
    async upload_book()
    {
     
     

      const firststorageRef = ref(storage,`books/${this.book_id}/thumbnail.jpg`);
      const metadata = {contentType: 'image/jpeg'};
      let uploadTask = await uploadBytes(firststorageRef, this.first_page, metadata);
      let storageRef=null;
      this.page_number=0;
      this.pages.forEach(async(element,index)=>
      {
         storageRef= ref(storage,`books/${this.book_id}/pages/${index+1}.jpg`);
         uploadTask = await uploadBytes(storageRef, element, metadata);
         this.page_number++;
      });
      updateDoc(doc(firestore,"books",this.book_id),{page_number:this.page_number},{merge:true});

      

    },
    keyword_finder(arr="")
    {
      arr.split(' ').forEach((el)=>
      {
        
        if(arr.indexOf(el>=0)){ // semmi
        }
        else if(el!=" "&&el!=null&&el!="")
        {
        this.book.keywords.push(el);
        }
        else {//semmi
        }
      });
    }

    }
}
</script>