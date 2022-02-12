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
            <md-input @change="change" v-model="chapter.name" md-counter="100"></md-input>
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

          <md-datepicker :md-closed="change" v-model="chapter.release_date">
              <label>{{gt("release_date")}}</label>
        </md-datepicker>

         <md-field>
            <label></label>
            <md-switch  v-model="first_page_as_cover">{{gt('first_page_as_cover')}}</md-switch>
          </md-field>
          

          
         <b-form-file
          v-if="!first_page_as_cover"
      
      @change="upload_chapter_cover"
      accept="image/jpeg"
      :placeholder="gt('upload_chapter_cover')"
      :drop-placeholder="gt('upload_chapter_cover')"></b-form-file>
          

     
        <md-button @click="finish">{{gt("continue")}}</md-button>
      </md-step>

      <md-step id="third" :md-label="gt('upload_chapter_finish')" :md-done.sync="third">
        <md-button @click="open_chapter">{{gt("open_"+profile.slice(0,profile.length-1))}}</md-button>
        <md-button @click="reload">{{gt("add_new_chapter")}}</md-button>
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
            <md-input @change="change" v-model="chapter.name" md-counter="100"></md-input>
          </md-field>
          <md-field>
            <label>{{gt('chapter_author')}}</label>
            <md-input @change="change" v-model="chapter.author" md-counter="100"></md-input>
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
          

          
         <b-form-file
          v-if="!first_page_as_cover"
      
      @change="upload_chapter_cover"
      accept="image/jpeg"
      :placeholder="gt('upload_chapter_cover')"
      :drop-placeholder="gt('upload_chapter_cover')"></b-form-file>

      <b-form-file
      v-model="chapter_pdf"
      @change="upload_chapter"
      accept="application/pdf"
      :placeholder="gt('upload_chapter')"
      :drop-placeholder="gt('upload_chapter')"></b-form-file>
         
          
           <md-datepicker :md-closed="change" v-model="chapter.release_date">
              <label>{{gt("release_date")}}</label>
        </md-datepicker>
          <md-datepicker  :md-closed="change" v-model="chapter.upload_date">
              <label>{{gt("upload_date")}}</label>
        </md-datepicker>

          <md-field>
            <label>{{gt('page_number')}}</label>
            <md-input @change="change" v-model="chapter.page_number" md-counter="100"></md-input>
          </md-field>
           <md-button class="md-raised md-primary" @click="change">{{gt("save")}}</md-button>
          <md-button class="md-raised md-primary" @click="deletechapter">{{gt("delete")}}</md-button>
          
          </md-card-content>   
      </div>
</md-card>
<loading v-else />
</div>

</template>
<script>
import {get_text,title_page} from "@/languages";
import langa from "../../../languages/languages";
import { quillEditor } from 'vue-quill-editor';
import { getDownloadURL, getStorage, ref, uploadBytes,deleteObject } from "firebase/storage";
import axios from "axios";
import loading from "@/components/parts/loading";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,user_email_verified,storage,logerror} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit, addDoc,FieldValue,updateDoc,deleteDoc,getDocFromCache } from "firebase/firestore";
import flag from "@/components/parts/flag";
import {getAuth,signOut,auth,user_language} from "firebase/auth";
import { push } from '@firebase/database';

export default {
    
    data(){
    return{
      chapter:{
        profile:"newspaper",
        name:"",
        author:"",
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
       
        serverside_finished:true,
        first_page_as_cover:false,
        author:"",
        language_chooser:"",
        pdf_file:null,
        pages:[],
        hided:true,
        dataReady:false,
        release_date:null,
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
        third:"third",
        count:0,
         cuuser:null,
      admin:false,
      member:false,
    }
    },
    components:{
        quillEditor,
        loading,
        flag
    },
    metaInfo(){
			return{
			title:title_page(this.chapter.name),
			keywords:this.generated_keywords
			}
		},
    async mounted()
    {
       this.cuuser= getAuth().currentUser;
			let k;
			try{
        k=await getDocFromCache(doc(firestore,"users",this.cuuser.uid));
        
        }
        catch(e)
        {
           k=await getDoc(doc(firestore,"users",this.cuuser.uid)); 
        }


			this.admin=(k.data().admin==null?false:k.data().admin);
			this.member=(k.data().member==null?false:k.data().member);

      if(!this.admin) this.$router.go("/home");

      if(FirebaseAuth.currentUser==null) return;
      	if(this.$route.params.viewtype!=undefined)
			{
				this.profile=this.$route.params.viewtype;
			}
      this.achapter=this.chapter;
      
     langa.language_books.forEach((a)=>
     {
       this.languages.push({"value":a.value,"text":this.gt(a.text)});
     });
      if(this.$route.params.cid=="new")
      {
        this.new_chapter=true;
        this.chapter.language=this.languages[0].value;
      }
      else
      {
        this.new_chapter=false;
        this.chapter_id=this.$route.params.cid;
         let chapter_refread=await getDoc(doc(firestore,`${this.profile}/${this.$route.params.bid}/chapters`,this.chapter_id));
        this.chapter=chapter_refread.data();
       
        if(this.chapter.release_date==undefined)
        {
          this.chapter.release_date=null;
        }
        else{
this.release_date=new Date();
        }
         
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
      this.$router.push(`/view/${this.profile}/${this.$route.params.bid}/template/chapter/${this.chapter_id}`);
    },
    async deletechapter()
    {
      try{
        try{
       await deleteObject(ref(storage,`/${this.profile}/${this.$route.params.bid}/chapters/${this.chapter_id}`));
        }
         catch(ex)
      {
        console.error(ex);
        this.$noty.error(this.gt("deleted"), {
						killer: true,
						timeout: 1500,
					});
      }

       await deleteDoc(doc(firestore,`/${this.profile}/${this.$route.params.bid}/chapters`,this.chapter_id));
       this.$noty.success(this.gt("deleted"), {
						killer: true,
						timeout: 1500,
					});
       this.$router.go(`/admin/content/${this.profile}/${this.$route.params.bid}`);    
      }
      catch(ex)
      {
        console.error(ex);
        this.$noty.error(this.gt("deleted"), {
						killer: true,
						timeout: 1500,
					});
      }
     
       
    },

    async change()
    {
      this.keyword_finder(this.chapter.author);
      this.keyword_finder(this.chapter.name);

       if(this.$route.params.cid=="new" && this.chapter_id==null)
      {
      
      this.chapter_ref=await addDoc(collection(firestore,`/${this.profile}/${this.$route.params.bid}/chapters`),this.chapter,{merge:true});
      this.chapter_id=this.chapter_ref.id;
      this.$router.push(`/admin/content/${this.profile}/${this.$route.params.bid}/chapter/${this.chapter_id}`);
      }
      
        let l=new Date();
        this.chapter.upload_date=l.toISOString().substring(0,10);
        l=new Date(this.chapter.release_date)
        this.chapter.release_date=l.toISOString().substring(0,10);
        this.chapter_ref=updateDoc(doc(firestore,`/${this.profile}/${this.$route.params.bid}/chapters`,this.chapter_id),this.chapter,{merge:true});
           
      this.$noty.success(this.gt("saved"), {
						killer: true,
						timeout: 1500,
					});
    },
    

    async upload_chapter_cover(event)
    {

      const firststorageRef = ref(storage,`${this.profile}/${this.$route.params.bid}/chapters/${this.chapter_id}/thumbnail.jpg`);
      const metadata = {contentType: 'image/jpeg'};
      console.log(event.target.files[0]);
      uploadBytes(firststorageRef, event.target.files[0], metadata).then((a)=>
      {
        console.log("File uploaded");
          this.$noty.success(this.gt("file_uploaded"), {
						killer: true,
						timeout: 1500,
					});
      })
    },

    async upload_chapter(event)
    {
      this.serverside_finished=false;
       if(this.$route.params.cid=="new" && this.chapter_id==null)
      {
      
      this.chapter_ref=await addDoc(collection(firestore,`/${this.profile}/${this.$route.params.bid}/chapters`),this.chapter,{merge:true});
      this.chapter_id=this.chapter_ref.id;
      }  


      const firststorageRef = ref(storage,`/${this.profile}/${this.$route.params.bid}/chapters/${this.chapter_id}/book.pdf`);
      const metadata = {contentType: 'application/pdf'};
      this.dataReady=false;
      if(this.chapter.name=="")
      this.chapter.name=event.target.files[0].name;
       console.log(event.target.files[0]);
      uploadBytes(firststorageRef, event.target.files[0]).then((a)=>
      {
       this.$noty.success(this.gt("file_uploaded"), {
						killer: true,
						timeout: 1500,
					});
          this.dataReady=true;
      });
      

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

    },
    reload()
    {
      window.location.reload();
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