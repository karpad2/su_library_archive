<template>
  <div class="middle">
  <md-card class="md-layout-item" v-if="dataReady">
    <div v-if="new_photo">
      <md-steppers :md-active-step.sync="active" md-linear>
      <md-step id="first" :md-label="gt('upload_photo')" :md-done.sync="first">
        <div v-if="serverside_finished">
          
    <b-form-file
      v-model="photo_pdf"
      @change="upload_photo"
      :placeholder="gt('upload_photo')"
      :drop-placeholder="gt('upload_photo')"></b-form-file>
         
        </div>
        <loading v-else />
      </md-step>

      <md-step id="second" :md-label="gt('upload_photo_info')" :md-done.sync="second">

        <md-field>
            <label>{{gt('photo_name')}}</label>
            <md-input @change="change" v-model="photo.photo_name" md-counter="100"></md-input>
          </md-field>
        
          <md-field>
          <quillEditor class="ql-editor" @change="change" v-model="photo.description" />
          </md-field>
          <md-field>
            
            <md-chips @change="change" v-model="photo.keywords" :md-placeholder="gt('add_keywords')"></md-chips>
          </md-field>


          <md-field>
            <md-switch @change="change" v-model="photo.hided">{{gt("hided")}}</md-switch>
          </md-field>
          

          <md-field>
            <label>{{gt('page_number')}}</label>
            <md-input @change="change" v-model="photo.page_number" md-counter="100"></md-input>
          </md-field>
     
        <md-button @click="finish">{{gt("continue")}}</md-button>
      </md-step>

      <md-step id="third" :md-label="gt('upload_photo_finish')" :md-done.sync="third">
      
        <md-button @click="open_photo">{{gt("open_photo")}}</md-button>
       </md-step>
    </md-steppers>
      </div>
      <div v-else>
          <md-card-header>
              <div class="md-title">{{gt('add_new_photo')}}</div>
          </md-card-header>
          <md-card-content>
          <md-field>
            <label>{{gt('photo_name')}}</label>
            <md-input @change="change" v-model="photo.photo_name" md-counter="100"></md-input>
          </md-field>
          <md-field>
            <label>{{gt('photo_author')}}</label>
            <md-input @change="change" v-model="photo.author_name" md-counter="100"></md-input>
          </md-field>
          
        
        
          <md-field>
          <quillEditor class="ql-editor" @change="change" v-model="photo.description" />
          </md-field>
          <md-field>
            
            <md-chips @change="change" v-model="photo.keywords" :md-placeholder="gt('add_keywords')"></md-chips>
          </md-field>


        

          

    

          <md-field>
            <label>{{gt("upload_photo")}}</label>
            <md-file md-change="upload_photo" v-model="photo_pdf" :placeholder="gt('upload_photo')" />
          </md-field>

        
          <md-button class="md-raised md-primary" @click="deletephoto">{{gt("deletephoto")}}</md-button>
          
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
      photo:{
        photo_name:"",
        author_name:"",
        keywords:[],
        page:"",
        active:true,
        description:"",
        language:"",
        favorites:0,
        photo_ref:null,
        uploading_date:"",
        visible:true},
        photo_id:null,
        photo_pdf:null,
        keywords:[],
        photo_cover:null,
        description:"",
        photo_name:"",
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
        aphoto:null,
        active:"first",
        new_photo:true,
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
      this.aphoto=this.photo;
      
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
        this.new_photo=true;
      }
      else
      {
        this.new_photo=false;
        this.photo_id=this.$route.params.pid;
        let photo_refread=await getDoc(doc(firestore,`photoalbums/${this.$route.params.bid}/photos`,this.photo_id));
        this.photo=photo_refread.data();
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
    open_photo()
    {
      this.$router.push(`/photoalbum/${this.newspaper_id}/${this.newspaper_id}/${this.photo_id}`);
    },
    async deletephoto()
    {
       updateDoc(doc(firestore,`photoalbum/${this.$route.params.bid}/photos`,this.photo_id),null);
       this.$router.go(-1); 
    },

    async change()
    {
      this.keyword_finder(this.photo.author_name);
      this.keyword_finder(this.photo.photo_name);

       if(this.$route.params.pid=="new" && this.photo_id==null)
      {
      
      this.photo_ref=await addDoc(collection(firestore,`photoalbums/${this.$route.params.bid}/photos`),this.photo,{merge:true});
      this.photo_id=this.photo_ref.id;
      this.$router.push(`/admin/newspaper/${this.$route.params.bid}/photo/${this.photo_id}`);
      }
      else
      {
        let l=new Date();
        this.photo.upload_date=`${l.getFullYear()}-${l.getMonth()}-${l.getUTCDay()}`;
        this.photo_ref=updateDoc(doc(firestore,`photoalbums/${this.$route.params.bid}/photos`,this.photo_id),this.photo,{merge:true});
      }
           
      
    },
  

    async upload_photo()
    {
      this.serverside_finished=false;
       if(this.$route.params.pid=="new" && this.photo_id==null)
      {
      
      this.photo_ref=await addDoc(collection(firestore,`photoalbums/${this.$route.params.bid}/photos`),this.photo,{merge:true});
      this.photo_id=this.photo_ref.id;
      }  


      const firststorageRef = ref(storage,`photoalbums/${this.$route.params.bid}/photos/${this.photo_id}.jpg`);

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
        this.photo.keywords.push(el);
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