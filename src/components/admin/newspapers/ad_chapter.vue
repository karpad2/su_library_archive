<template>
  <div class="middle">
  <md-card class="md-layout-item" v-if="dataReady">
    <div v-if="new_chapter">
      <md-steppers :md-active-step.sync="active" md-linear>
      <md-step id="first" :md-label="gt('upload_chapter')" :md-done.sync="first">
        <div v-if="serverside_finished">
          
    <b-form-file
      v-model="chapter_pdf"
      @change="upload_chapter"
      accept="application/pdf"
      :placeholder="gt('upload_chapter')"
      :drop-placeholder="gt('upload_chapter')"></b-form-file>
         
        </div>
        <loading v-else />
      </md-step>

      <md-step id="second" :md-label="gt('upload_chapter_info')" :md-done.sync="second">

        <md-field>
            <label>{{gt('chapter_name')}}</label>
            <md-input @change="change" v-model="chapter.chapter_name" md-counter="100"></md-input>
          </md-field>
          
          <md-field>
            <label>{{gt('publisher')}}</label>
            <md-input @change="change" v-model="chapter.publisher" md-counter="100"></md-input>
          </md-field>
        
            <md-field>
              <b-form-select @change="change" v-model="chapter.language" :options="languages"></b-form-select> <flag :flag="chapter.language"/>  
            </md-field>
          <md-field>
          <quillEditor class="ql-editor" @change="change" v-model="chapter.description" />
          </md-field>
          <md-field>
            
            <md-chips @change="change" v-model="chapter.keywords" :md-placeholder="gt('add_keywords')"></md-chips>
          </md-field>


          <md-field>
            <md-switch @change="change" v-model="chapter.hided">{{gt("hided")}}</md-switch>
          </md-field>
          

          <md-field>
            <label>{{gt('page_number')}}</label>
            <md-input @change="change" v-model="chapter.page_number" md-counter="100"></md-input>
          </md-field>
     
        <md-button @click="finish">{{gt("continue")}}</md-button>
      </md-step>

      <md-step id="third" :md-label="gt('upload_chapter_finish')" :md-done.sync="third">
      
        <md-button @click="open_chapter">{{gt("open_chapter")}}</md-button>
       </md-step>
    </md-steppers>
      </div>
      <div v-else>
          <md-card-header>
              <div class="md-title">{{gt('add_new_chapter')}}</div>
          </md-card-header>
          <md-card-content>
          <md-field>
            <label>{{gt('chapter_name')}}</label>
            <md-input @change="change" v-model="chapter.chapter_name" md-counter="100"></md-input>
          </md-field>
          <md-field>
            <label>{{gt('chapter_author')}}</label>
            <md-input @change="change" v-model="chapter.author_name" md-counter="100"></md-input>
          </md-field>
          <md-field>
            <label>{{gt('publisher')}}</label>
            <md-input @change="change" v-model="chapter.publisher" md-counter="100"></md-input>
          </md-field>
        
            <md-field>
              <b-form-select @change="change" v-model="chapter.language" :options="languages"></b-form-select>   <flag :flag="chapter.language"/>  
            </md-field>
          <md-field>
          <quillEditor class="ql-editor" @change="change" v-model="chapter.description" />
          </md-field>
          <md-field>
            
            <md-chips @change="change" v-model="chapter.keywords" :md-placeholder="gt('add_keywords')"></md-chips>
          </md-field>


          <md-field>
            <md-switch @change="change" v-model="chapter.hided">{{gt("hided")}}</md-switch>
          </md-field>
          

          <md-field>
            <label></label>
            <md-switch  v-model="first_page_as_cover">{{gt('first_page_as_cover')}}</md-switch>
          </md-field>
          

          <md-field v-if="!first_page_as_cover">
            <label>{{gt("upload_chapter_cover")}}</label>
            <md-file md-change="upload_chapter_cover" v-model="chapter_cover" :placeholder="gt('upload_chapter_cover')" />
          </md-field>

          <md-field>
            <label>{{gt("upload_chapter")}}</label>
            <md-file md-change="upload_chapter" v-model="chapter_pdf" :placeholder="gt('upload_chapter')" />
          </md-field>

          <md-field>
            <label>{{gt('page_number')}}</label>
            <md-input @change="change" v-model="chapter.page_number" md-counter="100"></md-input>
          </md-field>
          <md-button class="md-raised md-primary" @click="deletechapter">{{gt("deletechapter")}}</md-button>
          
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
      chapter:{
        chapter_name:"",
        author_name:"",
        keywords:[],
        page:"",
        active:true,
        description:"",
        language:"",
        favorites:0,
        chapter_ref:null,
        uploading_date:"",
        visible:true},
        chapter_id:null,
        chapter_pdf:null,
        keywords:[],
        chapter_cover:null,
        description:"",
        chapter_name:"",
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
        achapter:null,
        active:"first",
        new_chapter:true,
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
      this.achapter=this.chapter;
      
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
      if(this.$route.params.cid=="new")
      {
        this.new_chapter=true;
        this.chapter.language=this.languages[0].value;
      }
      else
      {
        this.new_chapter=false;
        this.chapter_id=this.$route.params.cid;
         let chapter_refread=await getDoc(doc(firestore,`newspapers/${this.$route.params.bid}/chapters`,this.chapter_id));
        this.chapter=chapter_refread.data();
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
    open_chapter()
    {
      this.$router.push(`/newspaper/${this.newspaper_id}/${this.newspaper_id}/${this.chapter_id}`);
    },
    async deletechapter()
    {
       updateDoc(doc(firestore,`newspapers/${this.$route.params.bid}/chapters`,this.chapter_id),null);
       this.$router.go(-1); 
    },

    async change()
    {
      this.keyword_finder(this.chapter.author_name);
      this.keyword_finder(this.chapter.chapter_name);

       if(this.$route.params.cid=="new" && this.chapter_id==null)
      {
      
      this.chapter_ref=await addDoc(collection(firestore,`newspapers/${this.$route.params.bid}/chapters`),this.chapter,{merge:true});
      this.chapter_id=this.chapter_ref.id;
      this.$router.push(`/admin/newspaper/${this.$route.params.bid}/chapter/${this.chapter_id}`);
      }
      else
      {
        let l=new Date();
        this.chapter.upload_date=`${l.getFullYear()}-${l.getMonth()}-${l.getUTCDay()}`;
        this.chapter_ref=updateDoc(doc(firestore,`newspapers/${this.$route.params.bid}/chapters`,this.chapter_id),this.chapter,{merge:true});
      }
           
      
    },
    async upload_chapter_cover()
    {

      const firststorageRef = ref(storage,`chapters/${this.chapter_id}/thumbnail.jpg`);
      const metadata = {contentType: 'image/jpeg'};
      let uploadTask = await uploadBytes(firststorageRef, this.first_page, metadata);
    },

    async upload_chapter()
    {
      this.serverside_finished=false;
       if(this.$route.params.cid=="new" && this.chapter_id==null)
      {
      
      this.chapter_ref=await addDoc(collection(firestore,`newspapers/${this.$route.params.bid}/chapters`),this.chapter,{merge:true});
      this.chapter_id=this.chapter_ref.id;
      }  


      const firststorageRef = ref(storage,`newspapers/${this.$route.params.bid}/chapters/${this.chapter_id}/newspaper.pdf`);
      const metadata = {contentType: 'application/pdf'};
      this.dataReady=false;
      let uploadTask = await uploadBytes(firststorageRef, this.pdf_file, metadata);
      this.dataReady=true;

      /*setInterval( async ()=>{
        if(this.serverside_finished) return;
        ref(storage,`chapters/${this.chapter_id}/chapter.json`);
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
        this.chapter.keywords.push(el);
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
 // min-height:500px
}
</style>