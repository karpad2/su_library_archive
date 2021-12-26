<template>
    <div  class="pagecontainer" >
        <router-link :to="link">
        <img draggable="false"  class="thumbcontainer" v-lazy="image" v-if="dataReady" alt="thumbnail"/>
        </router-link>
    </div>
</template>

<script>
import {getStorage,ref,getDownloadURL} from "firebase/storage";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,user_email_verified,storage} from "@/firebase";
import {get_text,languages,get_defaultlanguage,title_page,replace_white,replace_under} from "@/languages";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit,updateDoc,getDocFromCache,arrayUnion,arrayRemove} from "firebase/firestore";
export default {
    props:["book_id","page"],
    data()
    {
        return{
        dataReady:false,
        image:"",
        link:"",
        book:{}            
        }
    },
    async mounted()
    {
        let k= ref(storage, `/books/${this.book_id}/pages/${this.page}.jpg`);
        this.image =await getDownloadURL(k);
        let book_ref;
        try{
        book_ref=await getDocFromCache(doc(firestore,"books",this.book_id));
        this.book=book_ref.data();
        }
        catch(e)
        {
           book_ref=await getDoc(doc(firestore,"books",this.book_id));
           this.book=book_ref.data(); 
        }
		
        this.link=this.enter_read();

        this.dataReady=true;

    },
    methods:{
        enter_read()
			{
				return `/book/${this.book_id}/${replace_white(this.book.book_name)}/page/${this.page}`;
			}
    }
}
</script>
<style lang="scss">
.thumbcontainer
{

margin: 3px;

}
.pagecontainer{
    display: inline-block;
    text-align: center;
    vertical-align: top;
    width: 19%;
}
</style>
