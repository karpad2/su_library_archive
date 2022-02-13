<template>
	<div>
	<div div v-if="dataReady">
	<md-card>
		<md-card-header>
        <md-card-header-text>
		 <div class="md-title"> <h1>{{gt("printing_queue")}}</h1></div>
		 </md-card-header-text>
		 </md-card-header>
		  <md-card-content>
		<md-table v-model="printings" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
            <md-table-toolbar>
                <div class="md-toolbar-section-start">
                <h1 class="md-title"></h1>
                </div>
            </md-table-toolbar>

            <md-table-empty-state :md-label="gt(`cant_found`)"></md-table-empty-state>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
               
                <md-table-cell :md-label="gt('name')" md-sort-by="name">{{item.name}}</md-table-cell>
                <md-table-cell :md-label="gt('page')" md-sort-by="page">{{ item.page}}</md-table-cell>
                <md-table-cell :md-label="''"><md-button @click="print(item.id,true)"><md-icon>done</md-icon></md-button></md-table-cell>
				<md-table-cell :md-label="''"><md-button @click="print(item.id,false)"><md-icon>clear</md-icon></md-button></md-table-cell>
            
			</md-table-row>
        </md-table>
		<div class="middle-center"> <md-button @click="update">{{gt("load_more")}}</md-button></div>
		 </md-card-content>
	</md-card>
	</div>
	 <loading v-else/>
	</div>

</template>

<script>
import {signOut,getAuth} from "firebase/auth";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,storage,libraryuser} from "@/firebase";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit,updateDoc,getDocFromCache,arrayUnion,arrayRemove, orderBy,addDoc, deleteDoc} from "firebase/firestore";
import {get_text,languages,get_defaultlanguage,title_page,replace_white,replace_under} from "@/languages";
import { getStorage, ref, uploadBytes ,getDownloadURL} from "firebase/storage";
import moment from "moment";
import loading from "@/components/parts/loading";
import flag from "@/components/parts/flag";


	export default {
		components: {
		
		loading,
		},
		
		name: 'category_viewer',
		data: () => ({
			newspaper:{},
			printings:[],
			profile:"newspaper",
			dataReady: false,
			signed_in:false,
			newspaper_thumbnail:"",
			admin:false,
			loading_fail:false,
			chapters:[],
			member:false,
			libraryuser:false,
			promotion:false,
			is_favorite:false,
			title_side:"",
			newspaper_id:"",
			generated_keywords:"",
			counted_chapters:0,
			loading_values:10,
			user:{}
			
		}),
		metaInfo(){
			return{
			title:title_page("","printing_queue"),
			
			}
		},
		async mounted() {
			
			setInterval(()=>{this.update()},10000);

			
		},
		methods: {
			gt(a)
				{
					return get_text(a);
				},
			gy(a)
			{
				return replace_white(a);
			},	
			async print(id,_status)
			{
				let c= await collection(firestore,"printings");
				if(!_status) deleteDoc(doc(c,id));
				else
				await updateDoc(doc(c,id),{status:_status?"true":"false"},{merge:true});
			},
			async update()
			{
			//this.dataReady=false;
			let c= await collection(firestore,"printings");
			this.printings=[];
			let q=query(c,where("status","==","not-decided"));
			let k=await getDocs(q);
			k.forEach(async(e)=>
			{
				this.printings.push({name:e.data().name,page:e.data().name,id:e.id});
			});
			this.dataReady=true;
			},
			enter_read(i)
			{
				this.$router.push(`/view/${this.profile}/${this.newspaper_id}/${replace_white(this.newspaper.name)}/page/${i}`);
			},
			keyword_link(i)
			{
				this.$router.push(`/search/${this.profile}/${i}`);
			},
			open_cobiss(i){
				window.open(i,"_blank");
			},
			movetoadmin()
			{
				this.$router.push(`/admin/content/${this.profile}/${this.newspaper_id}`);
			},
			async loadmore()
			{
			this.loading_values+=10;
			await  this.load_chapters();
			},

			 async add_favorite()
    {
      let c=await collection(firestore,`/users/${ await getAuth().currentUser.uid}/favorites`);
      let _query=null;
     
       _query= query(c,where("profile","==",this.profile),where("id","==",this.newspaper_id));
      
      let l=await getDoc(_query);
      /*if(!l.exists())
      {
    	 let q= await addDoc(c,{profile:this.profile,id:this.newspaper_id});
      }*/
    },
			to_date_format(a)
			{
				console.log(Date(a));
				return	moment(Date(a)).format("YYYY-MM-DD");
			}
		}
	}
	
</script>

<style lang="scss" >
	.newspaper_cover{
		width: 350px;
		
	}
	.big_container
	{
		display: inline-block;
		width: 48%;
		vertical-align: top;
	}
		
.newspaperavatar{
	float: left;
    margin: 2 em;

}
.newspaperavatar img{
	width: 350px;
	
	aspect-ratio: auto 350/494; 
    

}
.newspaper-info{
	float:left;
	 margin: 50px;
}
.newspaper-container
{
	overflow: auto;
	margin-bottom: 25px;
	padding: 30px 20px;
}
</style>
