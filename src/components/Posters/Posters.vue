<template>
	<div>
	<md-card>	
		<md-card-header>
		{{gt("search_for_"+profile+"s")}}
		<md-field>
			<md-input @change="searching" v-model="seaching_text" >{{gt("search")}}</md-input>
		</md-field>
		<md-button class="md-raised md-primary" v-if="admin" @click="movetoadmin">{{gt("admin_"+profile)}}</md-button>
		</md-card-header>

		<md-card-content>
		 
		
		<div class="section">
			<postercard v-for="newspaper in searchednewspapers" :key="newspaper.id" :newspaper_id="newspaper.id"/>
		</div>
		</md-card-content>
	</md-card>
	</div>
</template>

<script>
import {signOut} from "firebase/auth";
import {get_text,languages,get_defaultlanguage,title_page} from "@/languages";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,storage} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit,getDocFromCache  } from "firebase/firestore";
import { getStorage, ref, listAll,get } from "firebase/storage";
import loading from "@/components/parts/loading";
import postercard from "@/components/parts/postercard";

import logo from "@/assets/logo";

// {{gt("genres")}}
		
	export default {
		components: {
		postercard

		},
		name: "posters",
		metaInfo:{
			title:title_page("","posters"),
		},
		
		data: () => ({
			profile:"poster",
			profile_picture_url:"",
			profile_name:"",
			seaching_text:"",
			showSidepanel:false,
			menuVisible: false,
			searchednewspapers:[],
			userTheme: "default",
			loading_screen:false,
			dataReady:false,
			user:{},
			admin:false
			
		}),
		async mounted() {
			if(this.$route.params.bsearch!=undefined)
			{
			this.seaching_text=this.$route.params.bsearch;
			await this.searching();
			}
			else 
			{
				let q=query(collection(firestore,this.profile+"s"),limit(10));
				let c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id});
				});
			}
			this.user=await FirebaseAuth.currentUser;
			let k;
			try{
				k=await getDocFromCache(doc(firestore,"users",this.user.uid));
				
				}
				catch(e)
				{
				k=await getDoc(doc(firestore,"users",this.user.uid)); 
				}


			this.admin=(k.data().admin==null?false:k.data().admin);

			this.dataReady=true;
		},
		methods: {
			async searching()
			{
				this.dataReady=false;
				this.searchednewspapers=[];
				if(!(String(this.seaching_text).length>0)) return [];
				let q=query(collection(firestore,this.profile+"s"),where("keywords","array-contains",[this.seaching_text]),limit(10));
				let c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id});
				});
				 q=query(collection(firestore,this.profile+"s"),where("author","<=",this.seaching_text),where("author",">=",this.seaching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id});
				});

				q=query(collection(firestore,this.profile+"s"),where(this.profile+"_name","<=",this.seaching_text),where(this.profile+"_name",">=",this.seaching_text),limit(10));
				c=await getDocs(q);
				c.forEach(element => {
				this.check_element_exist({id:element.id});
				});

				
				this.dataReady=true;
				console.log(this.searchednewspapers);
			},
			gt(a){
					return get_text(a);
				},
			check_element_exist(b){
			 if(!this.searchednewspapers.includes(b)) this.searchednewspapers.push(b);
			 },
			  movetoadmin()
			{
				this.$router.push("/admin/"+this.profile+"s");
			},
		},
		computed:
		{
			

		}
	}
			
</script>

<style lang="scss">
	.a
	{
		margin: 3px;
	}
</style>
