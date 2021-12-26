<template>
  <div class="middle">
  <md-card class="md-layout-item" v-if="dataReady">
    <div v-if="new_note">
      <md-steppers :md-active-step.sync="active" md-linear>
      <md-step id="first" :md-label="gt('upload_note')" :md-done.sync="first">
        <div v-if="serverside_finished">
          
    <b-form-file
      v-model="note_pdf"
      @change="upload_note"
      :placeholder="gt('upload_note')"
      :drop-placeholder="gt('upload_note')"></b-form-file>
         
        </div>
        <loading v-else />
      </md-step>

      <md-step id="second" :md-label="gt('upload_note_info')" :md-done.sync="second">

        <md-field>
            <label>{{gt('note_name')}}</label>
            <md-input @change="change" v-model="note.note_name" md-counter="100"></md-input>
          </md-field>
        
          <md-field>
          <quillEditor class="ql-editor" @change="change" v-model="note.description" />
          </md-field>
          <md-field>
            
            <md-chips @change="change" v-model="note.keywords" :md-placeholder="gt('add_keywords')"></md-chips>
          </md-field>


          <md-field>
            <md-switch @change="change" v-model="note.hided">{{gt("hided")}}</md-switch>
          </md-field>
          

          <md-field>
            <label>{{gt('page_number')}}</label>
            <md-input @change="change" v-model="note.page_number" md-counter="100"></md-input>
          </md-field>
     
        <md-button @click="finish">{{gt("continue")}}</md-button>
      </md-step>

      <md-step id="third" :md-label="gt('upload_note_finish')" :md-done.sync="third">
      
        <md-button @click="open_note">{{gt("open_note")}}</md-button>
       </md-step>
    </md-steppers>
      </div>
      <div v-else>
          <md-card-header>
              <div class="md-title">{{gt('add_new_note')}}</div>
          </md-card-header>
          <md-card-content>
          <md-field>
            <label>{{gt('note_name')}}</label>
            <md-input @change="change" v-model="note.note_name" md-counter="100"></md-input>
          </md-field>
          <md-field>
            <label>{{gt('note_author')}}</label>
            <md-input @change="change" v-model="note.author_name" md-counter="100"></md-input>
          </md-field>
          
        
        
          <md-field>
          <quillEditor class="ql-editor" @change="change" v-model="note.description" />
          </md-field>
          <md-field>
            
            <md-chips @change="change" v-model="note.keywords" :md-placeholder="gt('add_keywords')"></md-chips>
          </md-field>


        

          

    

          <md-field>
            <label>{{gt("upload_note")}}</label>
            <md-file md-change="upload_note" v-model="note_pdf" :placeholder="gt('upload_note')" />
          </md-field>

        
          <md-button class="md-raised md-primary" @click="deletenote">{{gt("deletenote")}}</md-button>
          
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
      note:{
        note_name:"",
        author_name:"",
        keywords:[],
        page:"",
        active:true,
        description:"",
        language:"",
        favorites:0,
        note_ref:null,
        uploading_date:"",
        visible:true},
        note_id:null,
        note_pdf:null,
        keywords:[],
        note_cover:null,
        description:"",
        note_name:"",
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
        anote:null,
        active:"first",
        new_note:true,
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
    
    },
    async mounted()
    {
      this.anote=this.note;
      
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
      if(this.$route.params.pid=="new")
      {
        this.new_note=true;
      }
      else
      {
        this.new_note=false;
        this.note_id=this.$route.params.pid;
        let note_refread=await getDoc(doc(firestore,`notes/${this.$route.params.bid}/sheets`,this.note_id));
        this.note=note_refread.data();
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
    open_note()
    {
      this.$router.push(`/notes/${this.newspaper_id}/${this.newspaper_id}/${this.note_id}`);
    },
    async deletenote()
    {
       updateDoc(doc(firestore,`notes/${this.$route.params.bid}/sheets`,this.note_id),null);
       this.$router.go(-1); 
    },

    async change()
    {
      this.keyword_finder(this.note.author_name);
      this.keyword_finder(this.note.note_name);

       if(this.$route.params.pid=="new" && this.note_id==null)
      {
      
      this.note_ref=await addDoc(collection(firestore,`notes/${this.$route.params.bid}/sheets`),this.note,{merge:true});
      this.note_id=this.note_ref.id;
      this.$router.push(`/admin/note/${this.$route.params.bid}/sheets/${this.note_id}`);
      }
      else
      {
        let l=new Date();
        this.note.upload_date=`${l.getFullYear()}-${l.getMonth()}-${l.getUTCDay()}`;
        this.note_ref=updateDoc(doc(firestore,`notes/${this.$route.params.bid}/sheets`,this.note_id),this.note,{merge:true});
      }
           
      
    },
  

    async upload_note()
    {
      this.serverside_finished=false;
       if(this.$route.params.pid=="new" && this.note_id==null)
      {
      
      this.note_ref=await addDoc(collection(firestore,`notes/${this.$route.params.bid}/sheets`),this.note,{merge:true});
      this.note_id=this.note_ref.id;
      }  


      const firststorageRef = ref(storage,`notes/${this.$route.params.bid}/sheets/${this.note_id}.jpg`);

      this.dataReady=false;
      let uploadTask = await uploadBytes(firststorageRef, this.pdf_file);
      this.dataReady=true;

     
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
        this.note.keywords.push(el);
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
.md-card{
  //min-height:500px
}
</style>