<template>
    <div>
        <h3>{{gt("upload_a_title_book")}}</h3>
        <div>{{gt("upload_a_book")}}
        
        <div class="section" v-if="books.length>0">
        <md-table v-model="searchedBooks" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
            <md-table-toolbar>
                <div class="md-toolbar-section-start">
                <h1 class="md-title">{{gt("Books")}}</h1>
                </div>

                <md-field md-clearable class="md-toolbar-section-end">
                <md-input :placeholder="gt('search_by_name')" v-model="searching_text" @change="searching" />
                </md-field>
            </md-table-toolbar>

            <md-table-empty-state v-if="searching_text!=''"
                :md-label="gt('books_cant_found')"
                :md-description="`${gt('no_book_cant_be_found')} '${searching_text}'.`">
                <md-button class="md-primary md-raised" @click="$router.push(`/admin/book/new`)">{{gt('add_new_book')}}</md-button>
            </md-table-empty-state>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>
                <md-table-cell :md-label="gt('bookname')" md-sort-by="bookname">{{ item.data.book_name }}</md-table-cell>
                <md-table-cell :md-label="gt('Author')" md-sort-by="author">{{ item.data.author_name }}</md-table-cell>
                <md-table-cell :md-label="gt('publisher')" md-sort-by="releaser">{{ item.data.publisher }}</md-table-cell>
                <md-table-cell :md-label="gt('language')" md-sort-by="language"><flag :flag="item.data.language"/></md-table-cell>
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
import flag from "@/components/parts/flag";


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
    components:{flag},
    data:()=>
    ({
        searching_text: "",
        searchedBooks: [],
        books:[],
       
    }),
    async mounted()
    {
         const q = query(collection(firestore, "books"),limit(10));
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
       
      async searching()
			{
				this.dataReady=false;
				this.searchedBooks=[];
				if(!(String(this.seaching_text).length>0)) return [];
				let q=query(collection(firestore,"books"),where("keywords","array-contains",[this.searching_text]),limit(10));
				let c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id,data:element.data()});
				});
				 q=query(collection(firestore,"books"),where("author_name","<=",this.searching_text),where("author_name",">=",this.searching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id,data:element.data()});
				});

				q=query(collection(firestore,"books"),where("book_name","<=",this.searching_text),where("book_name",">=",this.searching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id,data:element.data()});
				});

                q=query(collection(firestore,"books"),where("language",">=",this.searching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id,data:element.data()});
				});

				
				this.dataReady=true;
				//console.log(this.searchedBooks);
			},
			check_element_exist(b){
			 if(!this.searchedBooks.includes(b)) this.searchedBooks.push(b);
			 }
    },
    computed:
    {
    }
}
</script>