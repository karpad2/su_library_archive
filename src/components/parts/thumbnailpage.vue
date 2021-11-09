<template>
    <div class="container" v-if="dataReady">
        <img class="thumbcontainer" v-lazy="image" alt="thumbnail"/>
    </div>
</template>

<script>
import {getStorage,ref} from "firebase/storage";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,user_email_verified,storage} from "@/firebase";
export default {
    props:["book_id","page"],
    data()
    {
        return{
        dataReady:false,
        image:""            
        }
    },
    async mounted()
    {
        this.image = ref(storage, `/books/${this.book_id}/pages/${this.page}.jpg`);

    }
}
</script>
<style lang="scss">
.thumbcontainer
{
width: 19%;
margin: 3px;

}
.container{
    display: inline-block;
    text-align: center;
    vertical-align: top;
}
</style>
