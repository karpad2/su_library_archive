<template>
<div >
  <div class="middle-center">
  <md-card class="md-layout-item md-size-50 md-small-size-100" v-if="dataReady">
    <md-card-header>
        <div class="md-title">{{gt('add_new_photoalbum')}}</div>
    </md-card-header>
     <md-card-content>
    <md-field>
      <label for="photoalbum_name">{{gt('photoalbum_name')}}</label>
      <md-input id="photoalbum_name" @change="change" v-model="photoalbum.photoalbum_name" md-counter="100"></md-input>
    </md-field>
     
    <md-field>
    <quillEditor class="ql-editor" @change="change" v-model="photoalbum.description" />
    </md-field>
    <md-field>
      
      <md-chips @change="change" v-model="photoalbum.keywords" :md-placeholder="gt('add_keywords')"></md-chips>
    </md-field>


    <md-field>
      <md-switch @change="change" v-model="photoalbum.hided">{{gt("hided")}}</md-switch>
    </md-field>
    
     <b-form-file
      v-model="photoalbum_cover"
      @change="upload_photo"
      accept="image/jpeg"
      :placeholder="gt('upload_photoalbum_cover')"
      :drop-placeholder="gt('upload_photoalbum')"></b-form-file>

      <md-table v-model="photos" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
            <md-table-toolbar>
                <div class="md-toolbar-section-start">
                <h1 class="md-title">{{gt("photos")}}</h1>
                </div>
            </md-table-toolbar>

            <md-table-empty-state
                :md-label="gt('photo_cant_found')"
               >
                <md-button class="md-primary md-raised" @click="$router.push(`/admin/photoalbum/${photoalbum_id}/photo/new`)">{{gt('add_new_photo')}}</md-button>
            </md-table-empty-state>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>
                <md-table-cell :md-label="gt('photoalbum_name')" md-sort-by="photoalbumname"><div> <img  :width="64" :height="64" :src="linkgenerate(item.id)" class="img"  :alt="rp(item.data.photo_name)"/></div></md-table-cell>
                <md-table-cell :md-label="gt('photoalbum_name')" md-sort-by="photoalbumname">{{ item.data.photo_name }}</md-table-cell>
                <md-table-cell :md-label="gt('editphotoalbum')" md-sort-by="editphotoalbum"><md-button @click="$router.push(`/admin/photoalbum/${photoalbum_id}/photo/${item.id}`)">{{gt("editphoto")}}</md-button></md-table-cell>
            </md-table-row>
        </md-table>


     </md-card-content>   
</md-card>
<loading v-else />
</div>
<b-modal ref="photo_desc" hide-footer title="Using Component Methods">
      <div class="d-block text-center">
        <b-form-input v-model="photo_name" :placeholder="gt('photo_name')"></b-form-input>
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
      photoalbum:{
        photoalbum_name:"",
        author_name:"",
        keywords:[],
        page:"",
       
        description:"",
        language:"",
        favorites:0,
        photoalbum_ref:null,
        uploading_date:"",
        visible:true},
        photo_name:"",
        photo_description:"",
        photo_data:{
          
        },
        photoalbum_id:null,
        photoalbum_pdf:null,
        keywords:[],
        photos:[],
        photoalbum_cover:null,
        description:"",
        photoalbum_name:"",
        first_page_as_cover:false,
        author_name:"",
        language_chooser:"",
        pdf_file:null,
        pages:[],
        hided:true,
        dataReady:false,
        first_page:null,
        page_number:0,
        aphotoalbum:null,
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
      this.aphotoalbum=this.photoalbum;
      
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
        this.photoalbum.language=this.languages[0].value;
      }
      else
      {
        this.photoalbum_id=this.$route.params.bid;
      let photoalbum_refread=await getDoc(doc(firestore,"photoalbums",this.photoalbum_id));
      this.photoalbum=photoalbum_refread.data();
     
     let chapters_refread=await getDocs(collection(firestore,`photoalbums/${this.photoalbum_id}/photos`));
        this.photos=[];
        chapters_refread.forEach(as=>{
          this.photos.push({data:as.data(),id:as.id});
        });
      /*this.photoalbum_name=this.photoalbum.photoalbum_name;
      this.description=this.photoalbum.description;
      this.keywords=this.photoalbum.keywords;*/
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
      let image_ref = ref(storage, `/photoalbums/${this.photoalbum_id}/photos/${a}.jpg`);// loading page from bucket
			 return await getDownloadURL(image_ref);

    },
    async change()
    {
       /* this.photoalbum.photoalbum_name=this.photoalbum_name;
        this.photoalbum.keywords=this.keywords;
        this.photoalbum.description=this.description;*/



      
      this.keyword_finder(this.photoalbum.photoalbum_name);
      
      this.photoalbum.uploading_date=new Date();

       if(this.$route.params.bid=="new" && this.photoalbum_id==null)
      {
      
      this.photoalbum_ref=await addDoc(collection(firestore,"photoalbums"),this.photoalbum,{merge:true});
      this.photoalbum_id=this.photoalbum_ref.id;
      this.$router.push(`/admin/photoalbum/${this.photoalbum_id}`);
      }
      else
      {
        this.photoalbum_ref=updateDoc(doc(firestore,"photoalbums",this.photoalbum_id),this.photoalbum,{merge:true});


      }
           
      
    },
    async changephoto()
    {
      /*this.keyword_finder(this.photoalbum.author_name);
      this.keyword_finder(this.photoalbum.photoalbum_name);
      
      this.photoalbum.uploading_date=new Date();

       if(this.$route.params.bid=="new" && this.photoalbum_id==null)
      {
      
      this.photoalbum_ref=await addDoc(collection(firestore,"blogs"),this.photoalbum,{merge:true});
      this.photoalbum_id=this.photoalbum_ref.id;
      this.$router.push(`/admin/photoalbum/${this.photoalbum_id}`);
      }
      else
      {*/
       // this.photoalbum_ref=updateDoc(doc(firestore,`photoalbum/${this.photoalbum_id}/photos/${this.photo_id}`),this.photo,{merge:true});
      
           
      
    },
    async upload_photoalbum_cover()
    {

      const firststorageRef = ref(storage,`photoalbums/${this.photoalbum_id}/thumbnail.jpg`);
      const metadata = {contentType: 'image/jpeg'};
      let uploadTask = await uploadBytes(firststorageRef, this.first_page, metadata);
    },

    async upload_photo()
    {
      this.photo_id=0;
      let photoalbum_refread=await getDoc(doc(firestore,`photoalbums/${this.photoalbum_id}/photos`));
      this.photo_id= this.photoalbum_refread.data().length;
      this.photoalbum_ref=await setDoc(collection(firestore,`photoalbums/${this.photoalbum_id}/photos/${this.photo_id}`),{photo_name:"",photo_description:""},{merge:true});
      const firststorageRef = ref(storage,`photoalbums/${this.photoalbum_id}/photos/${this.photo_id}.jpeg`);
      const metadata = {contentType: 'image/jpeg'};
      this.dataReady=false;
      let uploadTask = await uploadBytes(firststorageRef, this.photoalbum_pdf, metadata);
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
        this.photoalbum.keywords.push(el);
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