<template>
    <div  class="pagecontainer" >
        <router-link :to="link">
        <img draggable="false" class="thumbcontainer" v-lazy="image" v-if="dataReady" alt="thumbnail"/>
        </router-link>
    </div>
</template>

<script>
import {getStorage,ref,getDownloadURL} from "firebase/storage";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,user_email_verified,storage} from "@/firebase";
import {get_text,languages,get_defaultlanguage,title_page,replace_white,replace_under} from "@/languages";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit,updateDoc,getDocFromCache,arrayUnion,arrayRemove} from "firebase/firestore";
export default {
    props:["photoalbum_id","number"],
    data()
    {
        return{
        dataReady:false,
        image:"",
        link:"",
        photoalbum:{}            
        }
    },
    async mounted()
    {
        let k= ref(storage, `/photoalbums/${this.photoalbum_id}/images/${this.page}.jpg`);
        this.image =await getDownloadURL(k);
        let photoalbum_ref;
        try{
        photoalbum_ref=await getDocFromCache(doc(firestore,"photoalbums",this.photoalbum_id));
        this.photoalbum=photoalbum_ref.data();
        }
        catch(e)
        {
           photoalbum_ref=await getDoc(doc(firestore,"photoalbums",this.photoalbum_id));
           this.photoalbum=photoalbum_ref.data(); 
        }
		
        this.link=this.enter_read();

        this.dataReady=true;

    },
    methods:{
        enter_read()
			{
				return `/photoalbums/${this.photoalbum_id}/${replace_white(this.book.book_name)}/photo/${this.page}`;
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
