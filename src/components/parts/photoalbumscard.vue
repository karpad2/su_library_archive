<template>

<md-card >
  <div class="md-card" v-if="dataReady">
      <md-card-media-cover md-solid>
        <md-card-media @click="open_photoalbum" md-ratio="1:1">
          <img v-if="imageload" class="cover" v-lazy="photoalbum_cover" alt="thumb_photoalbum_cover">
          <loading v-else/>
        </md-card-media>

        <md-card-area>
          <md-card-header>
            <router-link  :to="get_link()"> <span  class="md-title">{{photoalbum.photoalbum_name}}</span> </router-link>
            
          </md-card-header>

          <md-card-actions>
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
     
    </div>
  </md-card>
    
</template>
<style lang="scss" scoped>
  .md-card {
    width: 320px;
    height:200px;
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
  props:["photoalbum_id"],
  data()
  {
      return{
          dataReady:false,
          imageload:false,
          photoalbum:{},
          user:{},
          is_favorite:false,
          signedin:false,
          sharepopup:false,
          photoalbum_cover:""
      }
  },
  components:{
    loading,
  },
  async mounted()
  {
    
    let photoalbumref=await getDoc(doc(firestore,"photoalbums",this.photoalbum_id));
    this.photoalbum=photoalbumref.data();


    
    //console.log(this.photoalbum_cover);
    this.signedin= !(getAuth().currentUser==null);
    if(this.signedin)
    {
    let user_ref= await getDoc(doc(firestore,"users",getAuth().currentUser.uid));
    this.user=user_ref.data();
    }
    await this.image_loading();
    this.dataReady=true;
  },
  methods:
  {
    async image_loading()
      {
    let ref_thumbnail=ref(storage,`/photoalbums/${this.photoalbum_id}/thumbnail.jpg`);
    this.photoalbum_cover=await getDownloadURL(ref_thumbnail);
    this.imageload=true;
      },

    open_photoalbum()
    {
      let l="";

      if(this.signedin())
      {
        l=`/photoalbum/${this.photoalbum_id}/${replace_white(this.photoalbum.photoalbum_name)}`;
      }
      else
      {
        l=`/public/photoalbum/${this.photoalbum_id}/${replace_white(this.photoalbum.photoalbum_name)}`;
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
        l=`/photoalbum/${this.photoalbum_id}/${replace_white(this.photoalbum.photoalbum_name)}`;
      }
      else
      {
        l=`/public/photoalbum/${this.photoalbum_id}/${replace_white(this.photoalbum.photoalbum_name)}`;
      }
    return l;
    }

  },
  computed:{
    
  }
}
</script>