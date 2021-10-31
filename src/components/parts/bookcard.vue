<template>
<md-card>
      <md-card-media-cover md-solid>
        <md-card-media md-ratio="1:1">
          <img src="/vuematerial/assets/examples/card-sky.jpg" alt="book_cover">
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
    </md-card>
    
</template>
<style lang="scss" scoped>
  .md-card {
    width: 320px;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
  }
</style>

<script>
export default {
  name: 'MediaCover',
  props:["book_id"],
  data()
  {
      return{
          book_cover:"",
          book_title:"",
          book_author:"",
          book_keywords:"",
          book_language:"rs"
      }
  },
  mounted()
  {

  }
}
</script>