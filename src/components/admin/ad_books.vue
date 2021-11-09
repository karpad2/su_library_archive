<template>
    <div>
        <md-headline>{{gt("upload_a_title_book")}}</md-headline>
        <div>{{gt("upload_a_book")}}
        
        <div class="section" v-if="books.length>0">
        <md-table v-model="searched" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
            <md-table-toolbar>
                <div class="md-toolbar-section-start">
                <h1 class="md-title">{{gt("Books")}}</h1>
                </div>

                <md-field md-clearable class="md-toolbar-section-end">
                <md-input :placeholder="gt('search_by_name')" v-model="search" @input="searchOnTable" />
                </md-field>
            </md-table-toolbar>

            <md-table-empty-state v-if="search!=''"
                :md-label="gt('books_cant_found')"
                :md-description="`${gt('no_book_cant_be_found')} '${search}'.`">
                <md-button class="md-primary md-raised" @click="$router.push(`/admin/book/new`)">{{gt('add_new_book')}}</md-button>
            </md-table-empty-state>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>
                <md-table-cell :md-label="gt('bookname')" md-sort-by="bookname">{{ item.data.book_name }}</md-table-cell>
                <md-table-cell :md-label="gt('Author')" md-sort-by="author">{{ item.data.author_name }}</md-table-cell>
                <md-table-cell :md-label="gt('publisher')" md-sort-by="releaser">{{ item.data.publisher }}</md-table-cell>
                <md-table-cell :md-label="gt('language')" md-sort-by="language"><country-flag :country="item.data.language" size='normal'/></md-table-cell>
                <md-table-cell :md-label="gt('keywords')" md-sort-by="keywords">{{ item.data.keywords }}</md-table-cell>
                <md-table-cell :md-label="gt('editbook')" md-sort-by="editbook"><md-button @click="$router.push(`/admin/book/${item.id}`)">{{gt("editbook")}}</md-button></md-table-cell>
            </md-table-row>
        </md-table>
        </div>

        <md-button @click="$router.push(`/admin/book/new`)">{{gt("add_new_book")}}</md-button>
        </div>


    </div>
</template>
<script>
import { collection, query, where, getDocs,setDoc,limit } from "firebase/firestore";
import {Firedb,firestore} from "@/firebase"; 
import {get_text} from "@/languages";

const toLower = text => {
    return text.toString().toLowerCase()
  }

  const searchByName = (items, term) => {
    if (term) {
      return items.filter(item => toLower(item.data.name).includes(toLower(term)))
    }
    return items
  }

export default {
    
    data:()=>
    ({
        search: "",
        searched: [],
        books:[],
       
    }),
    async mounted()
    {
         const q = query(collection(firestore, "books"),limit(20));
            const querySnapshot = await getDocs(q);
            let b=[];
            querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            b.push({id:doc.id,data:doc.data()});
            });  
            this.books=b;
    },
    methods:{
        gt(a)
        {
            return get_text(a);
        },
       
        async searchOnTable () {
        //this.searched = searchByName(this.books, this.search)
        this.searched=[];
        let k=this.search.toLowerCase();
        const q = query(collection(firestore, "books"),where("keywords","array-contains",k),limit(20));
            const querySnapshot = await getDocs(q);
            let b=[];
            querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            b.push({id:doc.id,data:doc.data()});
            });  
            this.searched=b;
      
      }
    },
    computed:
    {
    }
}
</script>