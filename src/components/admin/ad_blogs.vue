<template>
    <div>
        <h3>{{gt("upload_a_blog")}}</h3>
        <div>
        
        <div class="section">
        <md-table v-model="searchedBlogs" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
            <md-table-toolbar>
                <div class="md-toolbar-section-start">
                <h1 class="md-title">{{gt("Blogs")}}</h1>
                </div>

                <md-field md-clearable class="md-toolbar-section-end">
                <md-input :placeholder="gt('search_by_name')" v-model="searching_text" @change="searching" />
                </md-field>
            </md-table-toolbar>

            <md-table-empty-state v-if="searching_text!=''"
                :md-label="gt('blogs_cant_found')"
                :md-description="`${gt('no_blog_cant_be_found')} '${searching_text}'.`">
                <md-button class="md-primary md-raised" @click="$router.push(`/admin/book/new`)">{{gt('add_new_book')}}</md-button>
            </md-table-empty-state>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>
                <md-table-cell :md-label="gt('bookname')" md-sort-by="bookname">{{ item.data.blog_name }}</md-table-cell>
                <md-table-cell :md-label="gt('Author')" md-sort-by="author">{{ item.data.blog_name }}</md-table-cell>
              
                <md-table-cell :md-label="gt('editblog')" md-sort-by="editblog"><md-button @click="$router.push(`/admin/blog/${item.id}`)">{{gt("editblog")}}</md-button></md-table-cell>
            </md-table-row>
        </md-table>
        </div>

        <md-button @click="$router.push(`/admin/blog/new`)">{{gt("add_new_blog")}}</md-button>
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
    
    data:()=>
    ({
        searching_text: "",
        searchedBlogs: [],
        blogs:[],
       
    }),
    async mounted()
    {
         const q = query(collection(firestore, "blogs"),limit(10));
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
				let q=query(collection(firestore,"blogs"),where("keywords","array-contains",[this.searching_text]),limit(10));
				let c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id,data:element.data()});
				});
				 q=query(collection(firestore,"blogs"),where("author_name","<=",this.searching_text),where("author_name",">=",this.searching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id,data:element.data()});
				});

				q=query(collection(firestore,"blogs"),where("book_name","<=",this.searching_text),where("book_name",">=",this.searching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id,data:element.data()});
				});

                q=query(collection(firestore,"blogs"),where("language",">=",this.searching_text),limit(10));
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