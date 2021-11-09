<template>

<md-card >
  <div v-if="dataReady">
      <md-card-media-cover md-solid>
        <md-card-media @click="open_book" md-ratio="1:1">
          <img  class="cover" v-lazy="book_cover" alt="thumb_book_cover">
        </md-card-media>

        <md-card-area>
          <md-card-header>
            <router-link v-if="signedin" :to="'/book/'+book_id+'/'+book.book_name"> <span  class="md-title">{{book.book_name}}</span> </router-link>
            <router-link v-else :to="'/public/book/'+book_id+'/'+book.book_name"> <span class="md-title">{{book.book_name}}</span> </router-link>
            
            <span @click="open_book" class="md-subhead">{{book.author_name}}</span>
          </md-card-header>

          <md-card-actions>
            <country-flag :country="book.language" size='normal'/>
            <md-button v-if="signedin" @click="add_favorite" class="md-icon-button">
              <md-icon v-if="is_favorite" style="background-color:red;">favorite</md-icon>
              <md-icon v-else>favorite</md-icon>
            </md-button>

            <md-button @click="sharepopup=true" class="md-icon-button">
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
    margin: 4px;
    display: inline-block;
    vertical-align: top;
  }
  .cover{
    padding:0 0 140.0% 0;

  }
</style>

<script>
import {getAuth,signOut,auth,user_language} from "firebase/auth";
import {get_text,languages,get_defaultlanguage} from "@/languages";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit, addDoc,updateDoc } from "firebase/firestore";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,user_email_verified,storage} from "@/firebase";
import loading from "@/components/parts/loading";
export default {
  name: 'MediaCover',
  props:["book_id"],
  data()
  {
      return{
          dataReady:false,
          book:{},
          user:{},
          is_favorite:false,
          signedin:false,
          sharepopup:false
      }
  },
  components:{
    loading
  },
  async mounted()
  {
    let bookref=await getDoc(doc(firestore,"books",this.book_id));
    this.book=bookref.data();
    this.book_cover=ref(storage,`/books/${this.book_id}/thumbnail.jpg`);
    this.signedin= !(getAuth().currentUser==null);
    if(this.signedin)
    {
    let user_ref= await getDoc(doc(firestore,"users",getAuth().currentUser.uid));
    this.user=user_ref.data();
    if(this.user.favorites==null){
      setDoc(doc(firestore,"users",getAuth().currentUser.uid),{favorites:"test"});
    }
    this.is_favorite=(this.user.favorites.indexOf(this.book_id)>=0);
    }
    this.dataReady=true;
  },
  methods:
  {
    async add_favorite()
			{
			if(this.is_favorite) return;
      this.user.favorites.push(this.book_id);
			setDoc(doc(firestore,"users",getAuth().currentUser.uid),{favorites:this.user.favorites},{merge:true})
			let fav= (await getDoc(doc(firestore,"books",this.book_id))).data().favorites;
			updateDoc(doc(firestore,"books",this.book_id),{favorites:this.book.favorites+1},{merge:true}); 
			},
    open_book()
    {
      let l="";

      if(this.signedin())
      {
        l=`/book/${this.book_id}`;
      }
      else
      {
        l=`/public/book/${this.book_id}`;
      }
      this.$router.push(l);

    },
    share()
    {

    }

  }
}
</script>