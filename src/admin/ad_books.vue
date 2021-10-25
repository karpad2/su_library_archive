<template>
    <div>
        <md-headline>{{gt("upload_a_title_book")}}</md-headline>
        <div>{{gt("upload_a_book")}}
        
        <div class="section" v-if="books.length>0">
            
        </div>

        <md-button>{{gt("upload")}}</md-button>
        </div>


    </div>
</template>
<script>
import { collection, doc, setDoc } from "firebase/firestore";
import {Firedb} from "@firebase"; 
import {get_text} from "../languages";
export default {
    
    methods:{
        gt(a)
        {
            return get_text(a);
        }
    },
    computed:
    {
        books()
        {

        }
    }
}
</script>