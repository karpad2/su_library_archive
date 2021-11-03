<template>

<md-card >
  <div v-if="dataReady">
      <md-card-media-cover md-solid>
        <md-card-media md-ratio="1:1">
          <img @click="open_book" class="cover" src="/vuematerial/assets/examples/card-sky.jpg" alt="thumb_book_cover">
        </md-card-media>

        <md-card-area>
          <md-card-header>
            <span class="md-title">{{book_cover}}</span>
            <span class="md-subhead">{{book_author}}</span>
          </md-card-header>

          <md-card-actions>
            <country-flag :country="book_language" size='normal'/>
            <md-button class="md-icon-button">
              <md-icon>favorite</md-icon>
            </md-button>

            <md-button class="md-icon-button">
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
import loading from "@/components/parts/loading";
export default {
  name: 'MediaCover',
  props:["book_id"],
  data()
  {
      return{
          dataReady:false,
          book_cover:"",
          book_title:"",
          book_author:"",
          book_keywords:"",
          book_language:"rs"
      }
  },
  components:{
    loading
  },
  mounted()
  {

  },
  methods:
  {
    signedin()
			{
				return !(getAuth().currentUser==null);
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

    }

  }
}
</script>