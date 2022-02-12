<template>
  <div class="middle">
  <md-card class="md-layout-item" v-if="dataReady">
    
      <div>
          <md-card-header>
          <div class="md-title">{{gt("add_new_"+profile.slice(0,profile.length-1))}}</div>
          </md-card-header>
          <md-card-content>
          <md-field>
            <label for="name">{{gt(profile.slice(0,profile.length-1)+"_name")}}</label>
            <md-input id="name" @change="change" v-model="newspaper.name" md-counter="100"></md-input>
          </md-field>
         
          <md-field>
            <label for="publisher_name">{{gt('publisher')}}</label>
            <md-input id="publisher_name" @change="change" v-model="newspaper.publisher" md-counter="100"></md-input>
          </md-field>

           <md-field>
            <label for="category">{{gt('category')}}</label>
            <md-input id="category" @change="change" v-model="newspaper.category" md-counter="100"></md-input>
          </md-field>

           
        
           <md-field>
              <b-form-select @change="change" v-model="newspaper.language" :options="languages"></b-form-select>   <flag :flag="newspaper.language"/>  
            </md-field>
          <md-field>
          <quillEditor class="ql-editor" @change="change" v-model="newspaper.description" />
          </md-field>
          <md-field>
            
            <md-chips @change="change" v-model="newspaper.keywords" :md-placeholder="gt('add_keywords')"></md-chips>
          </md-field>
          <md-field>
            <label for="cobisslink">Cobiss link:</label>
            <md-input id="cobisslink" @change="change" v-model="newspaper.cobiss" md-counter="100"></md-input>
          </md-field>

       
          <md-datepicker :md-closed="change" v-model="newspaper.upload_date">
              <label>{{gt("upload_date")}}</label>
        </md-datepicker>

          <md-field>
            <md-switch @change="change" v-model="newspaper.hided">{{gt("hided")}}</md-switch>
          </md-field>
         <div>
     
        <b-form-file
          v-if="!first_page_as_cover"
      
      @change="upload_chapter_cover"
      accept="image/jpeg"
      :placeholder="gt('upload_chapter_cover')"
      :drop-placeholder="gt('upload_chapter_cover')"></b-form-file>
         
          
        <div v-if="imageData!=null"> 
          <img class="preview" style="min-width:200px" :src="img"/>
        </div>  
          </div>
        <md-table v-model="chapters" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
            <md-table-toolbar>
                <div class="md-toolbar-section-start">
                <h1 class="md-title">{{gt("chapters")}}</h1>
                </div>
            </md-table-toolbar>

            <md-table-empty-state
                :md-label="gt(profile.slice(0,profile.length-1)+'_cant_found')"
               >
                <md-button class="md-primary md-raised" @click="$router.push(`/admin/content/${profile}/${newspaper_id}/chapter/new`)">{{gt('chapter_add_new')}}</md-button>
            </md-table-empty-state>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>
                <md-table-cell :md-label="gt(profile)+' '+gt('name')" md-sort-by="newspapername">{{ item.data.name }}</md-table-cell>
                <md-table-cell :md-label="gt('release_date')" md-sort-by="release_date">{{ item.data.release_date }}</md-table-cell>
                <md-table-cell :md-label="gt('edit')" md-sort-by="editnewspaper"><md-button @click="$router.push(`/admin/content/${profile}/${newspaper_id}/chapter/${item.id}`)">{{gt("edit")}}</md-button></md-table-cell>
            </md-table-row>
        </md-table>
        <md-button class="md-primary md-raised" @click="$router.push(`/admin/content/${profile}/${newspaper_id}/chapter/new`)">{{gt('add_new_chapter')}}</md-button>
            

          <md-button class="md-raised md-primary" @click="delete_newspaper">{{gt(`delete`)}}</md-button>
          
          </md-card-content>   
      </div>
</md-card>
<loading v-else />
</div>

</template>
<script>
import {get_text} from "@/languages";
import langa from "../../../languages/languages";
import { quillEditor } from 'vue-quill-editor';
import { getDownloadURL, getStorage, ref, uploadBytes,put,deleteObject } from "firebase/storage";
import axios from "axios";
import loading from "@/components/parts/loading";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,user_email_verified,storage,log} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit, addDoc,FieldValue,updateDoc,deleteDoc,getDocFromCache } from "firebase/firestore";
import flag from "@/components/parts/flag";
import {getAuth,signOut,auth,user_language} from "firebase/auth";

export default {
    
   
    components:{
        quillEditor,
        loading,
        flag,
        
    },
     data:()=>({
      profile:"newspaper", 
      newspaper:null,
      newspaper_id:null,
      newspaper_pdf:null,
      keywords:[],
      newspaper_cover:null,
      description:"",
      serverside_finished:true,
      first_page_as_cover:false,
      author:"",
      language_chooser:"",
      pdf_file:null,
      pages:[],
      hided:true,
      dataReady:false,
      first_page:null,
      page_number:0,
      anewspaper:null,
      active:"first",
      imageData:null,
      img:null,
      new_newspaper:true,
      languages:[],
      use_first_page_as_cover:true,
      file:null,
      first:false,
      second:false,
      third:false,
      language_flag_reload:true,
      chapters:[],
       cuuser:null,
      admin:false,
      member:false,
    }),
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

      	if(this.$route.params.viewtype!=undefined)
			{
				this.profile=this.$route.params.viewtype;
			}
       this.newspaper={
        name:"",
        author:"",
        keywords:[],
        chapters:[],
        page:"",
        seperator_name:"",
        active:"",
        description:"",
        language:"",
        favorites:0,
        
        flagready:true,
        newspaper_ref:null,
        uploading_date:"",
        visible:true};
        console.log(this.newspaper);
      this.anewspaper=this.newspaper;
     
     langa.language_books.forEach((a)=>
     {
       this.languages.push({"value":a.value,"text":this.gt(a.text)});
     });
      if(this.$route.params.bid=="new")
      {
        this.new_newspaper=true;
        this.newspaper.language=this.languages[0].value;
      }
      else
      {
        this.new_newspaper=false;
        this.newspaper_id=this.$route.params.bid;
        let newspaper_refread=await getDoc(doc(firestore,`/${this.profile}`,this.newspaper_id));
        this.newspaper=newspaper_refread.data();

        let chapters_refread=await getDocs(collection(firestore,`/${this.profile}/${this.newspaper_id}/chapters`));
        this.chapters=[];
        chapters_refread.forEach(as=>{
          this.chapters.push({data:as.data(),id:as.id});
        });

      }
      
      this.dataReady=true;
    },
    methods:{
        gt(a)
		{
			return get_text(a);
		},
    
    open_newspaper()
    {
      this.$router.push(`/view/${this.profile}/${this.newspaper_id}/${this.newspaper.name}`);
    },
   
      async delete_newspaper()
    {
      try{
        try{
       await deleteObject(ref(storage,`/${this.profile}/${this.newspaper_id}`));
        }
         catch(ex)
      {
        console.error(ex);
        this.$noty.error(this.gt("deleted"), {
						killer: true,
						timeout: 1500,
					});
      }

       await deleteDoc(doc(firestore,`/${this.profile}`,this.newspaper_id));
       this.$noty.error(this.gt("deleted"), {
						killer: true,
						timeout: 1500,
					});
          this.$router.push(`/${this.profile}`); 
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
      this.language_flag_reload=false;
      this.keyword_finder(this.newspaper.name);
        
       if(this.$route.params.bid=="new" && this.newspaper_id==null)
      {
      
      this.newspaper_ref=await addDoc(collection(firestore,`/${this.profile}`),this.newspaper,{merge:true});
      this.newspaper_id=this.newspaper_ref.id;
      this.$router.push(`/admin/content/${this.profile}/${this.newspaper_id}`);
      }
      
        let l=new Date();
        var date = (new Date()).toISOString();
        this.newspaper.upload_date=date.substring(0,10);
        
        
        this.newspaper_ref=setDoc(doc(firestore,`/${this.profile}`,this.newspaper_id),this.newspaper,{merge:true});
      
      this.language_flag_reload=true;
      this.$noty.success(this.gt("saved"), {
						killer: true,
						timeout: 1500,
					});
    },
     async upload_chapter_cover(event)
    {

      const firststorageRef = ref(storage,`${this.profile}/${this.$route.params.bid}/thumbnail.jpg`);
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


    async upload_newspaper(event)
    {
      this.serverside_finished=false;
       if(this.$route.params.nid=="new" && this.newspaper_id==null)
      {
      
      this.newspaper_ref=await addDoc(collection(firestore,`/${this.profile}`),this.newspaper,{merge:true});
      this.newspaper_id=this.newspaper_ref.id;
      }  


      const firststorageRef = ref(storage,`/${this.profile}/${this.newspaper_id}/book.pdf`);
      const metadata = {contentType: 'application/pdf'};
      this.dataReady=false;
      let uploadTask = await uploadBytes(firststorageRef, this.pdf_file, metadata);
      this.dataReady=true;

      setInterval( async ()=>{
        if(this.serverside_finished) return;
        ref(storage,`/${this.profile}/${this.newspaper_id}/book.json`);
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
        
      },1000);
      

    },
    keyword_finder(arr="")
    {
      arr.split(' ').forEach((el)=>
      {
        
        if(arr.indexOf(el>=0)){ // semmi
        }
        else if(el!=" "&&el!=null&&el!="")
        {
        this.newspaper.keywords.push(el);
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