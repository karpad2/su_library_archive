<template>
  <div>
   <img :src="imgsrc" :width="width" :alt="'page-'+page"/>
  </div>
</template>

<script>
import generatePdfThumbnails from 'pdf-thumbnails-generator';


export default {
  name: 'PdfThumbnail',
  props: {
    pdfurl: {
      type: String,
    },
    width: {
      type: Number,
      default: 300,
    },
    page:{
      type:Number,
      default:1
    }
  },
  data: () => ({
    thumbnails:[],
    imgsrc:null
  }),
  
  async mounted() {
   
   try{
    this.thumbnails=await generatePdfThumbnails(this.pdfurl,this.width);
     console.log(this.thumbnails);
    this.imgsrc=this.thumbnails[this.page-1].src;
   }
   catch(ex)
   {
     console.error(ex);
   }
  
  }
 
  

}
</script>

<style>
</style>