<template>

<md-card style="height:320px" >
  <div v-if="dataReady">
      <md-card-media-cover style="height:320px" md-solid>
        <md-card-media @click="open_book" md-ratio="1:1">
           <img ref="bookcover" draggable="false" v-if="imageload" class="cover" v-lazy="book_cover" alt="thumb_book_cover">
          <loading v-else/>
          
        </md-card-media>

        <md-card-area>
          <md-card-header>
            <router-link  :to="get_link()"> <span  class="md-title">{{book.name}}</span> </router-link>
            
            
            <span @click="open_book" class="md-subhead">{{book.author}}</span>
          </md-card-header>

          <md-card-actions>
            <flag :flag="book.language"/>
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
        <div v-if="!pdf_hide">
			</div>
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
    min-width: 270px;
    max-width: 320px;
    max-height:320px;
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
import VuePdfApp from "vue-pdf-app";
import flag from "@/components/parts/flag";
export default {
  name: 'MediaCover',
  props:["book_id"],
  data()
  {
      return{
          dataReady:false,
          imageload:false,
          book:{},
          user:{},
          bck_image:"",
          jpg_file:"",
          pdf_hide:false,
          is_favorite:false,
          signedin:false,
          sharepopup:false,
          book_cover:"",
          config:{toolbar: false},
				  idConfig: { zoomIn: "zoomInId", zoomOut: "zoomOutId" },
				  pdf_file:"",
      }
  },
  components:{
    loading,
    flag
  },
  async mounted()
  {
    let bookref=await getDoc(doc(firestore,"books",this.book_id));
    this.book=bookref.data();
    //console.log(this.book_cover);
    this.signedin= !(getAuth().currentUser==null);
    if(this.signedin)
    {
    let user_ref= await getDoc(doc(firestore,"users",getAuth().currentUser.uid));
    this.user=user_ref.data();
    if(this.user.favorites==null){
      setDoc(doc(firestore,"users",getAuth().currentUser.uid),{favorites:"test"});
    }
    this.is_favorite=this.user.favorites.includes(this.book_id);
    }
    let ref_img_storage =ref(storage,`/books/${this.book_id}/thumbnail.jpg`);
		this.jpg_file= await getDownloadURL(ref_img_storage);
    this.dataReady=true;
  },
  methods:
  {
    async add_favorite()
			{
			this.is_favorite=!this.is_favorite;
			//let k= await getDoc(doc(firestore,"users",getAuth().currentUser.uid));
			if(!this.signed_in) return;
			if(this.is_favorite) {
			await updateDoc(doc(firestore,"users",getAuth().currentUser.uid),{favorites:arrayUnion(this.book_id)});
			let fav= (await getDoc(doc(firestore,"books",this.book_id))).data().favorites;
			await updateDoc(doc(firestore,"books",this.book_id),{favorites:this.book.favorites+1},{merge:true}); 
			}
			else 
			{
			await updateDoc(doc(firestore,"users",getAuth().currentUser.uid),{favorites:arrayRemove(this.book_id)});	
			let fav= (await getDoc(doc(firestore,"books",this.book_id))).data().favorites;
			await updateDoc(doc(firestore,"books",this.book_id),{favorites:this.book.favorites-1},{merge:true}); 
				
			}
      },
      

    open_book()
    {
      let l="";

      if(this.signedin())
      {
        l=`/book/${this.book_id}/${replace_white(this.book.name)}`;
      }
      else
      {
        l=`/public/book/${this.book_id}/${replace_white(this.book.name)}`;
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
        l=`/book/${this.book_id}/${replace_white(this.book.name)}`;
      }
      else
      {
        l=`/public/book/${this.book_id}/${replace_white(this.book.name)}`;
      }
    return l;
    },
   

  },
  computed:{
    
  }
}
</script>