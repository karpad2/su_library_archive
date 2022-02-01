<template>

<md-card >
  <div v-if="dataReady">
      <md-card-media-cover md-solid>
        <md-card-media @click="open_manuscript" md-ratio="1:1">
          <img draggable="false" v-if="imageload" class="cover" v-lazy="manuscript_cover" alt="thumb_manuscript_cover">
          <loading v-else/>
        </md-card-media>

        <md-card-area>
          <md-card-header>
            <router-link  :to="get_link()"> <span  class="md-title">{{manuscript.manuscript_name}}</span> </router-link>
            
            
            <span @click="open_manuscript" class="md-subhead">{{manuscript.author}}</span>
          </md-card-header>

          <md-card-actions>
            <flag :flag="manuscript.language"/>
            <md-button v-if="signedin"  class="md-icon-button">
              <md-icon @click="add_favorite" v-if="is_favorite" style="color:red">favorite</md-icon>
              <md-icon @click="add_favorite" v-else>favorite</md-icon>
            </md-button>

            <md-button v-if="false" @click="sharepopup=true" class="md-icon-button">
              <md-icon>share</md-icon>
            </md-button>
          </md-card-actions>
        </md-card-area>
      </md-card-media-cover>
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
    width: 320px;
    height:320px;
    margin: 4px;
    display: inline-block;
    //padding-top: 10px;
    vertical-align: top;
  }
  .cover{
    //padding:0 0 0% 10%;

  }
</style>

<script>
import {getAuth,signOut,auth,user_language} from "firebase/auth";
import {get_text,languages,get_defaultlanguage,title_page,replace_white} from "@/languages";
import { getStorage, ref, uploadBytes ,getDownloadURL} from "firebase/storage";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit, addDoc,updateDoc,arrayUnion,arrayRemove } from "firebase/firestore";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,user_email_verified,storage} from "@/firebase";
import loading from "@/components/parts/loading";
import flag from "@/components/parts/flag";
export default {
  name: 'MediaCover',
  props:["newspaper_id"],
  data()
  {
      return{
          dataReady:false,
          imageload:false,
          manuscript:{},
          user:{},
          is_favorite:false,
          signedin:false,
          sharepopup:false,
          manuscript_cover:"",
          failimage:false
      }
  },
  components:{
    loading,
    flag
  },
  async mounted()
  {
    let manuscriptref=await getDoc(doc(firestore,"manuscripts",this.manuscript_id));
    this.manuscript=manuscriptref.data();

    try {
    this.image_loading();
    }
    catch (e)
    {
      this.failimage=true;
    }
   
    //console.log(this.manuscript_cover);
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
    let ref_thumbnail=ref(storage,`/manuscripts/${this.manuscript_id}/thumbnail.jpg`);
    this.manuscript_cover=await getDownloadURL(ref_thumbnail);
    this.imageload=true;
      },

    open_manuscript()
    {
      let l="";

      if(this.signedin())
      {
        l=`/manuscript/${this.manuscript_id}/${replace_white(this.manuscript.manuscript_name)}`;
      }
      else
      {
        l=`/public/manuscript/${this.manuscript_id}/${replace_white(this.manuscript.manuscript_name)}`;
      }
      this.$router.push(l);

    },
    share()
    {

    },
    get_link()
    {
    let l="";

      if(this.signedin)
      {
        l=`/manuscript/${this.manuscript_id}/${replace_white(this.manuscript.manuscript_name)}`;
      }
      else
      {
        l=`/public/manuscript/${this.manuscript_id}/${replace_white(this.manuscript.manuscript_name)}`;
      }
    return l;
    }

  },
  computed:{
    
  }
}
</script>