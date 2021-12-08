<template>
  <div class="middle">
  <md-card class="md-layout-item" v-if="dataReady">
    <div v-if="new_book">
      <md-steppers :md-active-step.sync="active" md-linear>
      <md-step id="first" :md-label="gt('upload_book')" :md-done.sync="first">
        <div v-if="serverside_finished">
          
    <b-form-file
      v-model="book_pdf"
      @change="upload_book"
      accept="application/pdf"
      :placeholder="gt('upload_book')"
      :drop-placeholder="gt('upload_book')"></b-form-file>
         
        </div>
        <loading v-else />
      </md-step>

      <md-step id="second" :md-label="gt('upload_book_info')" :md-done.sync="second">

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
          

          <md-field v-if="!first_page_as_cover">
            <label>{{gt("upload_book_cover")}}</label>
            <md-file md-change="upload_book_cover" v-model="book_cover" :placeholder="gt('upload_book_cover')" />
          </md-field>

          <md-field>
            <label>{{gt("upload_book")}}</label>
            <md-file md-change="upload_book" v-model="book_pdf" :placeholder="gt('upload_book')" />
          </md-field>

          <md-field>
            <label>{{gt('page_number')}}</label>
            <md-input @change="change" v-model="book.page_number" md-counter="100"></md-input>
          </md-field>
          <md-button class="md-raised md-primary" @click="deletebook">{{gt("deletebook")}}</md-button>
          
          </md-card-content>   
      </div>
</md-card>
<loading v-else />
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
import { push } from '@firebase/database';

export default {
    
    data(){
    return{
      book:{
        book_name:"",
        author_name:"",
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
        book_name:"",
        serverside_finished:true,
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
        active:"first",
        new_book:true,
        languages:[],
        use_first_page_as_cover:true,
        file:null,
        first:"first",
        second:"second",
        third:"third"
    }
    },
    components:{
        quillEditor,
        loading,
        flag
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
      this.$router.push(`/book/${this.book_id}/${this.book.book_name}`);
    },
    async deletebook()
    {
       updateDoc(doc(firestore,"books",this.book_id),null);
       this.$router.go(-1); 
    },

    async change()
    {
      this.keyword_finder(this.book.author_name);
      this.keyword_finder(this.book.book_name);

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
    async upload_book_cover()
    {

      const firststorageRef = ref(storage,`books/${this.book_id}/thumbnail.jpg`);
      const metadata = {contentType: 'image/jpeg'};
      let uploadTask = await uploadBytes(firststorageRef, this.first_page, metadata);
    },

    async upload_book()
    {
      this.serverside_finished=false;
       if(this.$route.params.bid=="new" && this.book_id==null)
      {
      
      this.book_ref=await addDoc(collection(firestore,"books"),this.book,{merge:true});
      this.book_id=this.book_ref.id;
      }  


      const firststorageRef = ref(storage,`books/${this.book_id}/book.pdf`);
      const metadata = {contentType: 'application/pdf'};
      this.dataReady=false;
      let uploadTask = await uploadBytes(firststorageRef, this.pdf_file, metadata);
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