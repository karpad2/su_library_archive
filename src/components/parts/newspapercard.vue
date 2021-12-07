<template>

<md-card >
  <div v-if="dataReady">
      <md-card-media-cover md-solid>
        <md-card-media @click="open_newspaper" md-ratio="1:1">
          <img v-if="imageload" class="cover" v-lazy="newspaper_cover" alt="thumb_newspaper_cover">
          <loading v-else/>
        </md-card-media>

        <md-card-area>
          <md-card-header>
            <router-link  :to="get_link()"> <span  class="md-title">{{newspaper.newspaper_name}}</span> </router-link>
            
            
            <span @click="open_newspaper" class="md-subhead">{{newspaper.author_name}}</span>
          </md-card-header>

          <md-card-actions>
            <flag :flag="newspaper.language"/>
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
          newspaper:{},
          user:{},
          is_favorite:false,
          signedin:false,
          sharepopup:false,
          newspaper_cover:""
      }
  },
  components:{
    loading,
    flag
  },
  async mounted()
  {
    let newspaperref=await getDoc(doc(firestore,"newspapers",this.newspaper_id));
    this.newspaper=newspaperref.data();


    this.image_loading();
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
        let ref_thumbnail=ref(storage,`/newspapers/${this.newspaper_id}/thumbnail.jpg`);
    this.newspaper_cover=await getDownloadURL(ref_thumbnail);
    this.imageload=true;
      },

    open_newspaper()
    {
      let l="";

      if(this.signedin())
      {
        l=`/newspaper/${this.newspaper_id}/${replace_white(this.newspaper.newspaper_name)}`;
      }
      else
      {
        l=`/public/newspaper/${this.newspaper_id}/${replace_white(this.newspaper.newspaper_name)}`;
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
        l=`/newspaper/${this.newspaper_id}/${replace_white(this.newspaper.newspaper_name)}`;
      }
      else
      {
        l=`/public/newspaper/${this.newspaper_id}/${replace_white(this.newspaper.newspaper_name)}`;
      }
    return l;
    }

  },
  computed:{
    
  }
}
</script>