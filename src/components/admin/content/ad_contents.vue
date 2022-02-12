<template>
    <div v-if="dataReady">
        
        
        <div class="section" v-if="newspapers.length>0">
        <md-table v-model="searchednewspapers" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
            <md-table-toolbar>
                <div class="md-toolbar-section-start">
                <h1 class="md-title">{{gt(profile)}}</h1>
                </div>

                <md-field md-clearable class="md-toolbar-section-end">
                <md-input :placeholder="gt('search_by_name')" v-model="searching_text" @change="searching" />
                </md-field>
            </md-table-toolbar>

            <md-table-empty-state v-if="searching_text!=''"
                :md-label="gt('cant_found')"
                :md-description="`${gt('cant_be_found')} '${searching_text}'.`">
                <md-button class="md-primary md-raised" @click="$router.push(`/admin/content/${profile}/new`)">{{gt('add_new_'+profile)}}</md-button>
            </md-table-empty-state>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>
                <md-table-cell :md-label="gt(profile.slice(0,profile.length-1)+'_name')" md-sort-by="newspapername">{{ item.data.name }}</md-table-cell>
                <md-table-cell :md-label="gt('publisher')" md-sort-by="publisher">{{ item.data.publisher }}</md-table-cell>
                <md-table-cell :md-label="gt('language')" md-sort-by="language"><flag :flag="item.data.language"/></md-table-cell>
                <md-table-cell :md-label="gt('keywords')" md-sort-by="keywords">{{ item.data.keywords }}</md-table-cell>
                <md-table-cell :md-label="gt('edit_'+profile)" md-sort-by="editnewspaper"><md-button @click="$router.push(`/admin/content/${profile}/${item.id}`)"> {{gt("edit_"+profile)}}</md-button></md-table-cell>
            </md-table-row>
        </md-table>
        </div>

        <md-button @click="$router.push(`/admin/content/${profile}/new`)">{{gt("add_new_"+profile.slice(0,profile.length-1))}}</md-button>
        </div>


    
</template>
<script>
import { collection, query, where, getDocs,setDoc,limit,doc,getDocFromCache,getDoc } from "firebase/firestore";
import {Firedb,firestore} from "@/firebase"; 
import {getAuth,signOut,auth,user_language} from "firebase/auth";
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
        profile:"newspaper",
        searching_text: "",
        searchednewspapers: [],
        newspapers:[],
         cuuser:null,
      admin:false,
      member:false,
        dataReady:false
       
    }),
    async mounted()
    {

        this.cuuser= getAuth().currentUser;
			let k;
			try{
        k=await getDocFromCache(doc(firestore,"users",this.cuuser.uid));
        
        }
        catch(e)
        {
           k=await getDoc(doc(firestore,"users",this.cuuser.uid)); 
        }


			this.admin=(k.data().admin==null?false:k.data().admin);
			this.member=(k.data().member==null?false:k.data().member);

      if(!this.admin) this.$router.go("/home");
        	if(this.$route.params.viewtype!=undefined)
			{
				this.profile=this.$route.params.viewtype;
			}
         const q = query(collection(firestore, this.profile),limit(10));
            const querySnapshot = await getDocs(q);
            let b=[];
            querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            b.push({id:doc.id,data:doc.data()});
            });  
            this.newspapers=b;
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
				this.searchednewspapers=[];
				//if(!(String(this.seaching_text).length>0)) return [];
				let q=query(collection(firestore,`/${this.profile}`),where("keywords","array-contains",[this.searching_text]),limit(10));
				let c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id,data:element.data()});
				});

				q=query(collection(firestore,`/${this.profile}`),where("name","<=",this.searching_text),where("name",">=",this.searching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id,data:element.data()});
				});

                q=query(collection(firestore,`/${this.profile}`),where("language",">=",this.searching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id,data:element.data()});
				});

				
				this.dataReady=true;
				//console.log(this.searchednewspapers);
			},
			check_element_exist(b){
			 if(!this.searchednewspapers.includes(b)) this.searchednewspapers.push(b);
			 }
    },
    computed:
    {
    }
}
</script>