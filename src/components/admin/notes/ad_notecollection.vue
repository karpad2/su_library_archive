<template>
<div >
  <div class="middle-center">
  <md-card class="md-layout-item md-size-50 md-small-size-100" v-if="dataReady">
    <md-card-header>
        <div class="md-title">{{gt('add_new_note')}}</div>
    </md-card-header>
     <md-card-content>
    <md-field>
      <label for="note_name">{{gt('note_name')}}</label>
      <md-input id="note_name" @change="change" v-model="note.note_name" md-counter="100"></md-input>
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
    
     <b-form-file
      v-model="note_cover"
      @change="upload_photo"
      accept="image/jpeg"
      :placeholder="gt('upload_note_cover')"
      :drop-placeholder="gt('upload_note')"></b-form-file>

      <md-table v-model="sheets" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
            <md-table-toolbar>
                <div class="md-toolbar-section-start">
                <h1 class="md-title">{{gt("sheets")}}</h1>
                </div>
            </md-table-toolbar>

            <md-table-empty-state
                :md-label="gt('note_cant_found')"
               >
                <md-button class="md-primary md-raised" @click="$router.push(`/admin/note/${note_id}/sheets/new`)">{{gt('add_new_note')}}</md-button>
            </md-table-empty-state>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>
                <md-table-cell :md-label="gt('note_name')" md-sort-by="notename"><div> <img  :width="64" :height="64" :src="linkgenerate(item.id)" class="img"  :alt="rp(item.data.photo_name)"/></div></md-table-cell>
                <md-table-cell :md-label="gt('note_name')" md-sort-by="notename">{{ item.data.note_name }}</md-table-cell>
                <md-table-cell :md-label="gt('editnote')" md-sort-by="editnote"><md-button @click="$router.push(`/admin/note/${note_id}/sheet/${item.id}`)">{{gt("editnote")}}</md-button></md-table-cell>
            </md-table-row>
        </md-table>


     </md-card-content>   
</md-card>
<loading v-else />
</div>
<b-modal ref="photo_desc" hide-footer title="Using Component Methods">
      <div class="d-block text-center">
        <b-form-input v-model="note_name" :placeholder="gt('note_name')"></b-form-input>
        <quillEditor class="ql-editor"  v-model="photo_description" />
      </div>
      <b-button class="mt-2" variant="outline-warning" block @click="savePhoto">{{gt("save")}}</b-button>
    </b-modal>
</div>
</template>
<script>
import {get_text,replace_white} from "@/languages";
import { quillEditor } from 'vue-quill-editor';
import { getStorage,getDownloadURL, ref, uploadBytes } from "firebase/storage";
import loading from "@/components/parts/loading";
import InnerImageZoom from 'vue-inner-image-zoom';
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,user_email_verified,storage} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit, addDoc,FieldValue,updateDoc } from "firebase/firestore";
import flag from "@/components/parts/flag";
import { push } from '@firebase/database';
export default {
    
    data(){
    return{
      note:{
        note_name:"",
        author:"",
        keywords:[],
        page:"",
       
        description:"",
        language:"",
        favorites:0,
        note_ref:null,
        uploading_date:"",
        visible:true},
        photo_name:"",
        photo_description:"",
        photo_data:{
          
        },
        note_id:null,
        note_pdf:null,
        keywords:[],
        sheets:[],
        note_cover:null,
        description:"",
        note_name:"",
        first_page_as_cover:false,
        author:"",
        language_chooser:"",
        pdf_file:null,
        pages:[],
        hided:true,
        dataReady:false,
        first_page:null,
        page_number:0,
        anote:null,
        languages:[],
        use_first_page_as_cover:true,
        file:null,
        photo_id:null
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
      if(this.$route.params.bid=="new")
      {
        this.note.language=this.languages[0].value;
      }
      else
      {
        this.note_id=this.$route.params.bid;
      let note_refread=await getDoc(doc(firestore,"notes",this.note_id));
      this.note=note_refread.data();
     
     let chapters_refread=await getDocs(collection(firestore,`notes/${this.note_id}/sheets`));
        this.sheets=[];
        chapters_refread.forEach(as=>{
          this.sheets.push({data:as.data(),id:as.id});
        });
      /*this.note_name=this.note.note_name;
      this.description=this.note.description;
      this.keywords=this.note.keywords;*/
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
    rp(b)
    {
      return replace_white(b);
    },
    async linkgenerate(a)
    {
      let image_ref = ref(storage, `/notes/${this.note_id}/sheets/${a}.jpg`);// loading page from bucket
			 return await getDownloadURL(image_ref);

    },
    async change()
    {
           
      this.keyword_finder(this.note.note_name);
      
      this.note.uploading_date=new Date();

       if(this.$route.params.bid=="new" && this.note_id==null)
      {
      
      this.note_ref=await addDoc(collection(firestore,"notes"),this.note,{merge:true});
      this.note_id=this.note_ref.id;
      this.$router.push(`/admin/note/${this.note_id}`);
      }
      else
      {
        this.note_ref=updateDoc(doc(firestore,"notes",this.note_id),this.note,{merge:true});


      }
           
      
    },
    async changephoto()
    {
      /*this.keyword_finder(this.note.author);
      this.keyword_finder(this.note.note_name);
      
      this.note.uploading_date=new Date();

       if(this.$route.params.bid=="new" && this.note_id==null)
      {
      
      this.note_ref=await addDoc(collection(firestore,"blogs"),this.note,{merge:true});
      this.note_id=this.note_ref.id;
      this.$router.push(`/admin/note/${this.note_id}`);
      }
      else
      {*/
       // this.note_ref=updateDoc(doc(firestore,`note/${this.note_id}/sheets/${this.photo_id}`),this.photo,{merge:true});
      
           
      
    },
    async upload_note_cover()
    {

      const firststorageRef = ref(storage,`notes/${this.note_id}/thumbnail.jpg`);
      const metadata = {contentType: 'image/jpeg'};
      let uploadTask = await uploadBytes(firststorageRef, this.first_page, metadata);
    },

    async upload_photo()
    {
      this.photo_id=0;
      let note_refread=await getDoc(doc(firestore,`notes/${this.note_id}/sheets`));
      this.photo_id= this.note_refread.data().length;
      this.note_ref=await setDoc(collection(firestore,`notes/${this.note_id}/sheets/${this.photo_id}`),{photo_name:"",photo_description:""},{merge:true});
      const firststorageRef = ref(storage,`notes/${this.note_id}/sheets/${this.photo_id}.jpeg`);
      const metadata = {contentType: 'image/jpeg'};
      this.dataReady=false;
      let uploadTask = await uploadBytes(firststorageRef, this.note_pdf, metadata);
      this.dataReady=true;
      

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
    }

    }
}
</script>
<style lang="scss">
.ql-editor{
    min-height:200px;
}
</style>
.