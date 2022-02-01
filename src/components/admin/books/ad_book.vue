<template>
  <div class="middle">
  <md-card class="md-layout-item" v-if="dataReady">
    <div v-if="new_book">
      <md-steppers :md-active-step.sync="active" md-linear>
      <md-step id="first" :md-label="gt('upload_book')" :md-done.sync="first">
        <div v-if="serverside_finished">
          
    <b-form-file
      v-model="pdf_file"
      @change="upload_book"
      accept="application/pdf"
      :placeholder="gt('upload_book')"
      :drop-placeholder="gt('upload_book')"></b-form-file>
         
        </div>
        <loading v-else />
      </md-step>

      <md-step id="second" :md-label="gt('upload_book_info')" :md-done.sync="second">

        <md-field>
            <label>{{gt('name')}}</label>
            <md-input @change="change" v-model="book.name" md-counter="100"></md-input>
          </md-field>
          <md-field>
            <label>{{gt('book_author')}}</label>
            <md-input @change="change" v-model="book.author" md-counter="100"></md-input>
          </md-field>
          <md-field>
            <label>{{gt('publisher')}}</label>
            <md-input @change="change" v-model="book.publisher" md-counter="100"></md-input>
          </md-field>
          <md-field>
            <label>{{gt('publishing-year')}}</label>
            <md-input @change="change" v-model="book.publishingyear" md-counter="100"></md-input>
          </md-field>
          <md-field>
            <label>{{gt('publishing-place')}}</label>
            <md-input @change="change" v-model="book.publishingplace" md-counter="100"></md-input>
          </md-field>
        
            <md-field>
              <b-form-select @change="change" v-model="book.language" :options="languages"></b-form-select> <flag :flag="book.language"/>  
            </md-field>
          <md-field>
          <quillEditor class="ql-editor" @change="change" v-model="book.description" />
          </md-field>
          <md-field>
            
            <md-chips @change="change" v-model="book.keywords" :md-placeholder="gt('add_keywords')"></md-chips>
          </md-field>


          <md-field>
            <md-switch @change="change" v-model="book.hided">{{gt("hided")}}</md-switch>
          </md-field>
          

          <md-field>
            <label>{{gt('page_number')}}</label>
            <md-input @change="change" v-model="book.page_number" md-counter="100"></md-input>
          </md-field>
     
        <md-button @click="finish">{{gt("continue")}}</md-button>
      </md-step>

      <md-step id="third" :md-label="gt('upload_book_finish')" :md-done.sync="third">
      
        <md-button @click="open_book">{{gt("open_book")}}</md-button>
       </md-step>
    </md-steppers>
      </div>
      <div v-else>
          <md-card-header>
              <div class="md-title">{{gt('add_new_book')}}</div>
          </md-card-header>
          <md-card-content>
          <md-field>
            <label>{{gt('name')}}</label>
            <md-input @change="change" v-model="book.name" md-counter="100"></md-input>
          </md-field>
          <md-field>
            <label>{{gt('book_author')}}</label>
            <md-input @change="change" v-model="book.author" md-counter="100"></md-input>
          </md-field>
          <md-field>
            <label>{{gt('publisher')}}</label>
            <md-input @change="change" v-model="book.publisher" md-counter="100"></md-input>
          </md-field>
          <md-field>
            <label>{{gt('publishing_year')}}</label>
            <md-input @change="change" v-model="book.year" md-counter="4"></md-input>
          </md-field>
        
            <md-field>
              <b-form-select @change="change" v-model="book.language" :options="languages"></b-form-select>   <flag :flag="book.language"/>  
            </md-field>
          <md-field>
          <quillEditor class="ql-editor" @change="change" v-model="book.description" />
          </md-field>
          <md-field>
            
            <md-chips @change="change" v-model="book.keywords" :md-placeholder="gt('add_keywords')"></md-chips>
          </md-field>


          <md-field>
            <md-switch @change="change" v-model="book.hided">{{gt("hided")}}</md-switch>
          </md-field>
          

          <md-field>
            <label></label>
            <md-switch  v-model="first_page_as_cover">{{gt('first_page_as_cover')}}</md-switch>
          </md-field>
          <img ref="bookcover" v-if="!first_page_as_cover" id="book_cover" draggable="false" class="book_cover"/>

          <md-field v-if="!first_page_as_cover">
            <label>{{gt("upload_book_cover")}}</label>
            <md-file md-change="upload_book_cover" v-model="book_cover" :placeholder="gt('upload_book_cover')" />
          </md-field>

         
            

             <b-form-file
      v-model="book_pdf"
      @change="upload_book"
      :state="Boolean(book_pdf)"
      :placeholder="gt('upload_book')"
      :drop-placeholder="gt('upload_book')"
    ></b-form-file>
        

          <md-field>
            <label>{{gt('page_number')}}</label>
            <md-input @change="change" v-model="book.page_number" md-counter="100"></md-input>
          </md-field>
          <md-button class="md-raised md-primary" @click="deletebook">{{gt("deletebook")}}</md-button>
          
          </md-card-content>   
      </div>
</md-card>
<loading v-else />

 <vue-pdf-app @pages-rendered="cucc" id="pdfreader" ref="pdfreader"  v-cloak :config="config"  :id-config="idConfig"  style="height:100vh;" :page-scale="page-actual" :pdf="pdf_file" ></vue-pdf-app>
			
</div>

</template>
<script>
import {get_text} from "@/languages";
import { quillEditor } from 'vue-quill-editor';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import axios from "axios";
import loading from "@/components/parts/loading";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,user_email_verified,storage} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit, addDoc,FieldValue,updateDoc } from "firebase/firestore";
import flag from "@/components/parts/flag";
import VuePdfApp from "vue-pdf-app";
import { push } from '@firebase/database';

export default {
    
    data(){
    return{
      book:{
        name:"",
        author:"",
        keywords:[],
        page:"",
        active:true,
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
        name:"",
        serverside_finished:true,
        first_page_as_cover:true,
        author:"",
        language_chooser:"",
        pdf_file:null,
        pages:[],
        hided:true,
        dataReady:false,
        first_page:null,
        page_number:0,
        abook:null,
        active:"first",
        new_book:true,
        languages:[],
        use_first_page_as_cover:true,
        file:null,
        first:"first",
        second:"second",
        third:"third",
			user:{},
			 config:{toolbar: true},
			idConfig: { zoomIn: "zoomInId", zoomOut: "zoomOutId",numPages: "vuePdfAppNumPages",pageNumber: "vuePdfAppPageNumber" },
			
    }
    },
    components:{
        quillEditor,
        loading,
        flag,
        VuePdfApp
    },
    async mounted()
    {
      this.abook=this.book;
      
      this.languages=[
          {
            value:"rs-RS",text:this.gt("serbian")
          },
          {
            value:"hu-HU",text:this.gt("hungarian")
          },
          {
            value:"en-EN",text:this.gt("english")
          },
          {
            value:"de-DE",text:this.gt("german")
          }
        ];
      if(this.$route.params.bid=="new")
      {
        this.new_book=true;
        this.book.language=this.languages[0].value;
      }
      else
      {
        this.new_book=false;
        this.book_id=this.$route.params.bid;
      }
      
    if(!this.new_book){
      let book_refread=await getDoc(doc(firestore,"books",this.book_id));
      this.book=book_refread.data();
    }
     let ref_storage =ref(storage,`/books/${this.book_id}/book.pdf`);
			this.pdf_file= await getDownloadURL(ref_storage);
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
    open_book()
    {
      this.$router.push(`/book/${this.book_id}/${this.book.name}`);
    },
    async deletebook()
    {
       updateDoc(doc(firestore,"books",this.book_id),null);
       this.$router.go(-1); 
    },

    async change()
    {
      this.keyword_finder(this.book.author);
      this.keyword_finder(this.book.name);

       if(this.$route.params.bid=="new" && this.book_id==null)
      {
      
      this.book_ref=await addDoc(collection(firestore,"books"),this.book,{merge:true});
      this.book_id=this.book_ref.id;
      this.$router.push(`/admin/book/${this.book_id}`);
      }
      else
      {
        let l=new Date();
        this.book.upload_date=`${l.getFullYear()}-${l.getMonth()}-${l.getUTCDay()}`;
        this.book_ref=updateDoc(doc(firestore,"books",this.book_id),this.book,{merge:true});
      }
           
      
    },
    cucc()
    {

    },
    async upload_book_cover()
    {

      const firststorageRef = ref(storage,`books/${this.book_id}/thumbnail.jpg`);
      const metadata = {contentType: 'image/jpeg'};
       uploadBytes(firststorageRef, this.first_page, metadata).then((snapshot)=>{
         console.log("uploaded cover");
       })
    },

    async upload_book()
    {

       var pdfjs = require("pdfjs"); 
     // pdfjs.Document.
      this.serverside_finished=false;
       if(this.$route.params.bid=="new" && this.book_id==null)
      {
      
      this.book_ref=await addDoc(collection(firestore,"books"),this.book,{merge:true});
      this.book_id=this.book_ref.id;
      }  


      const firststorageRef = ref(storage,`books/${this.book_id}/book.pdf`);
      const metadata = {contentType: 'application/pdf'};
      this.dataReady=false;
      console.log(this.pdf_file);
      let file = new File(this.pdf_file,"book.pdf");
       await uploadBytes(firststorageRef,file, metadata).then((snapshot)=>{
         console.log("uploaded cover");
       })
      this.dataReady=true;

      /*setInterval( async ()=>{
        if(this.serverside_finished) return;
        ref(storage,`books/${this.book_id}/book.json`);
        let url=await getDownloadURL(ref);
        let data=await axios.get(url).then(data=>
        {
         if(data.progress=="finished")
         {
           this.serverside_finished=true;
           this.first=true;
          this.active=this.second;
         }
        });
        
      },1000);*/
      this.serverside_finished=true;
      this.first=true;
      this.active=this.second;

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
    },
    finish()
    {
      this.second=true;
      this.active=this.third;
    }

    }
}
</script>
<style lang="scss">
.ql-editor{
    min-height:200px;
}
.md-step{
  min-height:500px
}
.md-card1{
 // min-height:500px
}
</style>