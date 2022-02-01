<template>
    <div v-if="dataReady">
        <h3>{{gt("upload_a_title_photoalbums")}}</h3>
        <div>{{gt("upload_a_photoalbums")}}
        
        <div class="section">
        <md-table v-model="searchedphotoalbums" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
            <md-table-toolbar>
                <div class="md-toolbar-section-start">
                <h1 class="md-title">{{gt("Photoalbums")}}</h1>
                </div>

                <md-field md-clearable class="md-toolbar-section-end">
                <md-input :placeholder="gt('search_by_name')" v-model="searching_text" @change="searching" />
                </md-field>
            </md-table-toolbar>

            <md-table-empty-state v-if="searching_text!=''"
                :md-label="gt('photoalbums_cant_found')"
                :md-description="`${gt('no_photoalbums_cant_be_found')} '${searching_text}'.`">
                <md-button class="md-primary md-raised" @click="$router.push(`/admin/photoalbums/new`)">{{gt('add_new_photoalbums')}}</md-button>
            </md-table-empty-state>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>
                <md-table-cell :md-label="gt('photoalbum_name')" md-sort-by="photoalbum_name">{{ item.data.photoalbum_name }}</md-table-cell>
                <md-table-cell :md-label="gt('keywords')" md-sort-by="keywords">{{ item.data.keywords }}</md-table-cell>
                <md-table-cell :md-label="gt('editphotoalbums')" md-sort-by="editphotoalbums"><md-button @click="$router.push(`/admin/photoalbum/${item.id}`)">{{gt("editphotoalbum")}}</md-button></md-table-cell>
            </md-table-row>
        </md-table>
        </div>

        <md-button @click="$router.push(`/admin/photoalbum/new`)">{{gt("add_new_photoalbums")}}</md-button>
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
        searchedphotoalbums: [],
        photoalbums:[],
        dataReady:false
       
    }),
    async mounted()
    {
         const q = query(collection(firestore, "photoalbums"),limit(10));
            const querySnapshot = await getDocs(q);
            let b=[];
            querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            b.push({id:doc.id,data:doc.data()});
            });  
            this.photoalbums=b;
             await this.searching();
            this.dataReady=true;
    },
    methods:{
        gt(a)
        {
            return get_text(a);
        },
       
      async searching()
			{
				this.dataReady=false;
				this.searchedphotoalbums=[];
                if(this.seaching_text=="")
                {
                let q=query(collection(firestore,"photoalbums"),limit(10));
				let c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id,data:element.data()});
				});
                }
                else {
				//if(!(String(this.seaching_text).length>0)) return [];
				let q=query(collection(firestore,"photoalbums"),where("keywords","array-contains",[this.searching_text]),limit(10));
				let c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id,data:element.data()});
				});
				 q=query(collection(firestore,"photoalbums"),where("author","<=",this.searching_text),where("author",">=",this.searching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id,data:element.data()});
				});

				q=query(collection(firestore,"photoalbums"),where("album_name","<=",this.searching_text),where("album_name",">=",this.searching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id,data:element.data()});
				});

                }
				this.dataReady=true;
				//console.log(this.searchedphotoalbums);
			},
			check_element_exist(b){
			 if(!this.searchedphotoalbums.includes(b)) this.searchedphotoalbums.push(b);
			 }
    },
    computed:
    {
    }
}
</script>