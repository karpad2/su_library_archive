
<template>

<md-card >
  <div v-if="dataReady">
    <router-link :to="get_link()">
      <md-card-media-cover md-solid>
        <md-card-media @click="open_newspaper" md-ratio="1:1">
          <img draggable="false" v-if="imageload" class="cover" :src="newspaper_cover" alt="thumb_newspaper_cover">
          <loading v-else/>
        </md-card-media>

        <md-card-area>
          <md-card-header>
            <router-link  :to="get_link()"> <span  class="md-title">{{newspaper.name}}</span> </router-link>
            <span v-if="page!=''"> {{page+' '+gt("page")}}</span>
            <span  v-if="newspaper.author!=''" @click="open_newspaper" class="md-subhead">{{newspaper.author}}</span>
            <span  v-if="false&&newspaper.description!=''" @click="open_newspaper" class="md-subhead">{{remove_tags(newspaper.description)}}</span>
             <span  v-else-if="newspaper.category!=''" @click="open_newspaper" class="md-subhead">{{newspaper.category}}</span>
            <span  v-else-if="cat_name!=''" @click="open_newspaper" class="md-subhead">{{cat_name}}</span>
            <span  v-else-if="newspaper.publisher!=''" @click="open_newspaper" class="md-subhead">{{newspaper.publisher}}</span>
            <span  v-if="newspaper.release_date!=''" @click="open_newspaper" class="md-subhead">{{newspaper.release_date}}</span>

          </md-card-header>

          <md-card-actions>
            <flag :flag="language"/>
            <md-button v-if="signedin && !libraryuser"  class="md-icon-button">
              <md-icon @click="add_favorite" v-if="is_favorite" style="color:red">favorite</md-icon>
              <md-icon @click="add_favorite" v-else>favorite</md-icon>
            </md-button>

            <md-button v-if="false" @click="sharepopup=true" class="md-icon-button">
              <md-icon>share</md-icon>
            </md-button>
          </md-card-actions>
        </md-card-area>
      </md-card-media-cover>
      </router-link>
    </div>
    <div v-else>
      <md-card-media-cover md-solid>
        <md-card-media md-ratio="1:1">
          <loading/>
        </md-card-media>
      </md-card-media-cover>
      <ShareNetwork v-if="sharepopup" :popup="{width: 400, height: 200}" />
    </div>
  </md-card>
    
</template>
<style lang="scss" scoped>
  .md-card {
    max-width: 200px;
    //min-width: 150px;
    height:290px;
    margin: 2px;
    display: inline-block;
    //padding-top: 10px;
    vertical-align: top;
  }
  .cover{
    //padding:0 0 0% 10%;

  }
</style>

<script>
/* eslint-disable */
import {getAuth,signOut,auth,user_language} from "firebase/auth";
import {get_text,languages,get_defaultlanguage,title_page,replace_white} from "@/languages";
import { getStorage, ref, uploadBytes ,getDownloadURL} from "firebase/storage";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit, addDoc,updateDoc,arrayUnion,arrayRemove } from "firebase/firestore";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,user_email_verified,storage,libraryuser} from "@/firebase";
import loading from "@/components/parts/loading";
import flag from "@/components/parts/flag";
export default {
  name: 'MediaCover',

  props:{
    
    id: {
      type: String,
    },
    profile: {
      type: String,
      default: "",
    },
    chapter:{
      type:String,
      default:""
    },
    page:{
      type:String,
      default:""
    }
    },
  
  data()
  {
      return{
          dataReady:false,
          imageload:false,
          libraryuser:false,
          newspaper:{},
          user:{},
          language:"rs-RS",
          cat_name:"",
          is_favorite:false,
          signedin:false,
          sharepopup:false,
          newspaper_cover:"",
          failimage:false
      }
  },
  components:{
    loading,
    flag
  },
  async mounted()
  {

    this.libraryuser=libraryuser();
    console.log(this.chapter);
    let k=null;
    if(this.chapter!="")
    {
      k=doc(firestore,`/${this.profile}/${this.id}/chapters`,this.chapter);
      let tmp=await getDoc(doc(firestore,`/${this.profile}`,this.id));
      this.cat_name=tmp.data().name;
      this.language=tmp.data().language;
      let newspaperref;
      try{
      newspaperref=await getDocFromCache(k);
      console.log("from cache")
      }
      catch(ex)
      {
        newspaperref=await getDoc(k);
      }
      this.newspaper=newspaperref.data();
    }
    else
    {
       k=doc(firestore,`/${this.profile}`,this.id);
       let newspaperref;
      try{
      newspaperref=await getDocFromCache(k);
      console.log("from cache")
      }
      catch(ex)
      {
        newspaperref=await getDoc(k);
      }
    this.newspaper=newspaperref.data();
    this.language=this.newspaper.language;
    }

    

    try {
    this.image_loading();
    }
    catch (e)
    {
      this.failimage=true;
    }
   
    //console.log(this.newspaper_cover);
    this.signedin= !(getAuth().currentUser==null);
    if(this.signedin)
    {
    let user_ref= await getDoc(doc(firestore,"users",getAuth().currentUser.uid));
    this.user=user_ref.data();
    }
    this.dataReady=true;
  },
  methods:
  {
    async image_loading()
    {
      let ref_thumbnail="";
      if(this.chapter=="")
      {
        ref_thumbnail=ref(storage,`/${this.profile}/${this.id}/thumbnail.jpg`);
        let k=await getDownloadURL(ref_thumbnail);
       
        //console.log(k);
        this.newspaper_cover=k;
      }
      else{
        try{
        ref_thumbnail=ref(storage,`/${this.profile}/${this.id}/chapters/${this.chapter}/thumbnail.jpg`);
        this.newspaper_cover=await getDownloadURL(ref_thumbnail);
        }
        catch(ex)
        {
          console.log(ex);
          ref_thumbnail=ref(storage,`/${this.profile}/${this.id}/thumbnail.jpg`);
          this.newspaper_cover=await getDownloadURL(ref_thumbnail);
        }
      }

      /*let k=this.newspaper_cover;
       k=k.replace('https://', '');
        k="https://cdn.statically.io/screenshot/"+k;
        this.newspaper_cover=k;*/
    const newCache = await caches.open('su-library-archive');
			 let response= await newCache.match(this.newspaper_cover);
			 if(!response||!response.ok)
			 {
				 await newCache.add(this.newspaper_cover);
				 response= await newCache.match(this.newspaper_cover);
			 }
        await response.blob().then((blob)=>{

			var objectURL = URL.createObjectURL(blob);
			this.newspaper_cover=objectURL;
			});
    this.imageload=true;
      },

    open_newspaper()
    {
     
     
    

    },
    share()
    {

    },
    gt(a)
				{
					return get_text(a);
				},
    get_link()
    {
    let l="";


     
      if(this.chapter!="")
      {
        
        l=`/view/${this.profile}/${this.id}/${replace_white(this.newspaper.name)}/chapter/${this.chapter}`;
      
      }
      else
      {
        l=`/view/${this.profile}/${this.id}/${replace_white(this.newspaper.name)}`;
      }
      if(this.page!="")
      {
        l+=`/page/${this.page}`;
      }
      
    return l;
    },
   async add_favorite()
    {
      let c=collection(firestore,`users/${getAuth().currentUser.uid}/favorites`);
      let _query=null;
      if(this.chapter==""){
       _query= query(c,where("profile","==",this.profile),where("id","==",this.id));
      }
      else 
      {
        _query= query(c,where("profile","==",this.profile),where("id","==",this.id),where("chapter","==",this.chapter));
      }
      let l=await getDoc(_query);
      if(!l.exists())
      {
      if(this.chapter==""){
      await addDoc(c,{profile:this.profile,id:this.id});
      }
      else 
      {
        await addDoc(c,{"profile":this.profile,"id":this.id,"chapter":this.chapter});
      }
      }
    },
    remove_tags(a)
    {
      return String(a).replace(/<[^>]*>?/gm, '')
    }

  },
  computed:{
    
  }
}
</script>
