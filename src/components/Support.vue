<template>
<div class="center">
    <h2>{{gt("Support")}}</h2>

    <p> Please click<a class="help" href="https://github.com/karpad2/su_library_archive/issues"> here </a> if you want to contact us, feature request and report and if you need help. </p> 
    <p> Please click<a class="help" href="https://github.com/karpad2/su_library_archive/wiki"> here </a> if you want to check manual. </p> 
    <p> App version: {{version}}</p>
	<p> App made by: <a href="https://karpad2.github.io/"> {{author}} </a></p>
	<h3>{{gt('problem_report')}}</h3>
	<quillEditor @change="change" v-model="ticket.text" />

	 <b-form-file
      @change="upload_chapter_cover"
      accept="image/jpeg"
      :placeholder="gt('upload_screenshot')"
      :drop-placeholder="gt('upload_screenshot')"></b-form-file>

 	<md-button class="md-raised md-primary" @click="send">{{gt("save")}}</md-button>


</div>
</template>
<script>
import {get_text,languages,get_defaultlanguage,title_page} from "@/languages";
import version from "../../package.json"
import {getAuth,signOut,auth,user_language} from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadString,deleteObject,uploadBytes } from "firebase/storage";
import {collection, doc, setDoc, query, where, getDocs,getDoc,limit, updateDoc,getDocFromCache,addDoc  } from "firebase/firestore";
import {FireDb,FirebaseAuth,change_Theme_Fb,firestore,user_email_verified,storage} from "@/firebase";
import bugreportwebhook from "../firebase/credentials";
import { quillEditor } from 'vue-quill-editor';
//const { htmlToText } = require('html-to-text');
import axios from "axios";
import { update } from '@firebase/database';

export default {
	components:{
		quillEditor
	},
    metaInfo:{
			title:title_page("","Support"),
		},
        methods: {
			gt(a)
			{
				return get_text(a)
			},
			async change()
			{
			if(this.ticket.id==null)
			{
				console.log(bugreportwebhook.bugreportwebhook);
				let ticket_ref=await addDoc(collection(firestore,`tickets`),{user_uid:getAuth().currentUser.uid,user_name:getAuth().currentUser.displayName});
				this.ticket.id=ticket_ref.id; 
				await updateDoc(doc(firestore,`tickets/${this.ticket.id}`),{text:this.ticket.text},{merge:true});
			
				
			}
			else {
					await updateDoc(doc(firestore,`tickets/${this.ticket.id}`),{text:this.ticket.text},{merge:true});
		
			}
			if(this.ticket.file!=null)
			{
				const firststorageRef = ref(storage,`tickets/${this.ticket.id}/image.jpg`);
     			 uploadBytes(firststorageRef, this.ticket.file).then((a)=>{
       			this.$noty.success(this.gt("file_uploaded"), {
						killer: true,
						timeout: 1500,
					});
			});
			}
			},

			async send()
			{
				await axios.post(bugreportwebhook.bugreportwebhook,{username:getAuth().currentUser.displayName,avatar_url:getAuth().currentUser.photoURL,content:this.ticket.text.replace(/<[^>]*>?/gm, '')});
				this.$noty.success(this.gt("thank_you_for_your_feedback"), {
						killer: true,
						timeout: 1500,
					});
			},
			async upload_chapter(event)
    		{
				this.ticket.file= event.target.files[0];
				this.change();
			}
			
			},
			data(){
				return{
					version:version.version,
					author:version.author,
					
					ticket:{
					id:null,
					text:"",
					title:"",
					img:null}
				}
			}
}
</script>


<style lang="scss" scoped>

.help{
	  font-weight: bold;
  }
</style>
