<template>
    <div>
    <md-card v-if="dataReady">
     
    <md-card-header>
      <h3>{{gt("dashboard")}}</h3>
    </md-card-header> 
    <md-card-content>
      <md-switch @change="change" v-model="properties.undermaintenance"><small>{{gt("under_construction")}}</small></md-switch>
     <md-switch @change="change" v-model="properties.promotion"> <small>{{gt("promotion")}}</small></md-switch>
     <md-switch @change="change" v-model="properties.promotion_hide"> <small>{{gt("promotion_hide")}}</small></md-switch>
      <md-switch @change="change" v-model="properties.library_user_logout"> <small>{{gt("library_user_logout")}}</small></md-switch>
      <md-button @click="generate_sitemap">{{gt("generate_sitemap")}}</md-button>
       <md-button @click="getmodel">JSON export</md-button>
      <md-field>
            
            <md-chips @change="change" v-model="properties.keywords" :md-placeholder="gt('add_keywords')"></md-chips>
        </md-field>
    </md-card-content>
  
    </md-card>
    <div v-if="dataReady">
        <md-card>
            <md-card-header>
        <md-card-header-text>
          <div class="md-title"> {{gt("settings_of_users")}}</div>
		   </md-card-header-text>
		   </md-card-header>
       

        <md-card-content>
        <div class="section">
        <md-table  v-model="searchedusers" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
            <md-table-toolbar>
                <div class="md-toolbar-section-start">
                <h1 class="md-title">{{gt("users")}}</h1>
                </div>

                <md-field md-clearable class="md-toolbar-section-end">
                <md-input :placeholder="gt('search_by_name')" v-model="searching_user_text" @change="searchinguser" />
                </md-field>
            </md-table-toolbar>

            <md-table-empty-state
                :md-label="gt('users_cant_found')"
                :md-description="`${gt('no_user_cant_be_found')} '${searching_user_text}'.`">
            </md-table-empty-state>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>
                <md-table-cell :md-label="gt('username')" md-sort-by="name">{{ item.name }}</md-table-cell>
                <md-table-cell :md-label="gt('useremail')" md-sort-by="email">{{ item.email }}</md-table-cell>
                <md-table-cell :md-label="gt('edit')" ><md-button @click="$router.push(`/admin/user/${item.id}`)">{{gt("edituser")}}</md-button></md-table-cell>
            </md-table-row>
        </md-table>
        </div>
        
        </md-card-content>
        </md-card>
    </div>
    
    
    </div>
</template>
<script>
import {get_text,title_page} from "@/languages";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,user_email_verified,storage} from "@/firebase";
import  categories from "../../firebase/categories";
import {getAuth,signOut,auth,user_language} from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadString,deleteObject } from "firebase/storage";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit, updateDoc,getDocFromCache  } from "firebase/firestore";

import axios from "axios";

export default {
  async mounted()
  {

    //console.log();
    if(FirebaseAuth.currentUser==null) return;
   // getDoc(doc(firestore,`users`,FirebaseAuth.uid))
    let _properties= await getDoc(doc(firestore,"properties","global_flags"));
    this.properties= _properties.data();
    await this.searchinguser();
    this.dataReady=true;
   
  },
  metaInfo:{
			title:title_page("","dashboard"),
		},
  data()
  {
    return{
      properties:{},
      searching_user_text:"",
      searchedusers:[],
      users:[],
      user:null,
      admin:false,
      member:false,
      dataReady:false,
      maps:[]
    }
  },
  methods:
  {
    gt(a)
				{
					return get_text(a);
				},
    change()
    {
      updateDoc(doc(firestore,"properties","global_flags"),this.properties,{merge:true});
    },

    async getmodel()
			{
			await categories.categories.forEach(async (a)=>{
			let c=collection(firestore,`${a.name}`);
			let e=await getDocs(c);
			
			e.forEach(async (bb)=>{
				let d=await getDocs(collection(firestore,`${a.name}/${bb.id}/chapters`));
				d.forEach((f)=>
				{
					this.maps.push({
						profile:a.name,
						id:bb.id,
						chapter_id:f.id,
						publisher:f.data().publisher,
						author_name:f.data().author_name,
						chapter_name:f.data().name,
						chapter_description:f.data().description,
						category_description:bb.data().description,
						category_name:bb.data().name,
						chapter_upload_date:f.data().upload_date,
						chapter_release_date:f.data().release_date
					});
				});
				
			});
			});
			console.log(this.maps);


      const firststorageRef = ref(storage,`sitemap.json`);
      
      let text = await JSON.stringify(this.maps)
    uploadString(firststorageRef,text).then((a)=>
      {
        console.log("File uploaded");
          this.$noty.success(this.gt("file_uploaded"), {
						killer: true,
						timeout: 1500,
					});
      })


			},
     async searchinguser()
			{
                
				this.dataReady=false;
				this.searchedusers=[];

      this.user= getAuth().currentUser;
			let k;
			try{
        k=await getDocFromCache(doc(firestore,"users",this.user.uid));
        
        }
        catch(e)
        {
           k=await getDoc(doc(firestore,"users",this.user.uid)); 
        }


			this.admin=(k.data().admin==null?false:k.data().admin);
			this.member=(k.data().member==null?false:k.data().member);
      if(!this.admin) this.$router.go("/home");
				//if(!(String(this.seaching_text).length>0)) return [];
                if(this.searching_user_text=='')
                {
                let q= await query(collection(firestore,"users"),limit(100));
				let c=await getDocs(q);
				c.forEach(element => {
				this.check_element_user_exist({id:element.id,name:element.data().name,email:element.data().email,data:element.data()});
				});
                }
                else 
                {
				let q= await query(collection(firestore,"users"),where("name","<=",[this.searching_user_text]),limit(10));
				let c=await getDocs(q);
				c.forEach(element => {
				this.check_element_user_exist({id:element.id,data:element.data()});
				});

				q= await query(collection(firestore,"users"),where("email","<=",this.searching_user_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_user_exist({id:element.id,data:element.data()});
				});
                }

				
				this.dataReady=true;
				//console.log(this.searchedusers);
			},
      check_element_user_exist(b){
        if(this.searchedusers.indexOf(b)<0)
        {
          this.searchedusers.push(b);
        }

			 },
        async generate_sitemap()
       {
        const address=`https://www.digitalna.subiblioteka.rs`;
        var date = (new Date()).toISOString();
        const day=date.substring(0,10)
  

    let routing_public=[{
      path:"home",
      title:"",                                                                                                                                                                                                                               
      description:"",
      last_modifcations:day
    },
    {
      path:"support",
      title:"",                                                                                                                                                                                                                               
      description:"",
      last_modifcations:day
    },
    {
      path:"account/login",
      title:"",                                                                                                                                                                                                                               
      description:"",
      last_modifcations:day
    }
  ]
    let sitemap="";
    console.log(categories)
    sitemap+=`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    await routing_public.forEach( async (element)=>
    {
      sitemap+=`<url><loc>${address}/${element.path}</loc><lastmod>${element.last_modifcations}</lastmod><changefreq>monthly</changefreq></url>\n`;
    });
    let _category=categories.categories;
    await _category.forEach(async (category)=>{
      //functions.logger.log(category.name);
      console.log(category.name);
       sitemap+=`<url><loc>${address}/views/${category.name}</loc><lastmod>${day}</lastmod><changefreq>monthly</changefreq></url>\n`;
      try{
      let m_category= await collection(firestore,category.name);
      let m_category_as_documents= await getDocs(m_category);
      await m_category_as_documents.forEach( async (b)=>{
          let book= await b.data();
          sitemap+=`<url><loc>${address}/view/${category.name}/${b.id}/${book.name}</loc><lastmod>${day}</lastmod><changefreq>monthly</changefreq></url>\n`;
          try {
          let chapters_category= await collection(firestore,`/${category.name}/${b.id}/chapters`);
          let d=await getDocs(chapters_category);
          
          await d.forEach( async (c)=>{
              sitemap+=`<url><loc>${address}/view/${category.name}/${b.id}/${book.name}/chapter/${c.id}</loc><lastmod>${day}</lastmod><changefreq>monthly</changefreq></url>\n`;
            });
          }
          catch(ex)
            {
              console.log(ex)
            }
          });
     }
      catch(ex){
      console.log(ex)}
      });
 
    sitemap+="</urlset>";
    console.log(sitemap);
  
    await uploadString(ref("sitemap.xml"),sitemap);
    

   const google = `https://www.google.com/webmasters/sitemaps/ping?sitemap=https://www.digitalna.subiblioteka.rs/sitemap.xml`
   const bing = `https://www.bing.com/ping?sitemap=https://www.digitalna.subiblioteka.rs/sitemap.xml`
  
   await axios.get(google).catch(console.log)
   await axios.get(bing).catch(console.log)
  
       }
  }

  

}
</script>