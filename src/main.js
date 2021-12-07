import Vue from 'vue';
import router from './router';
//import ForkeMeOnGithub from 'fork-me-on-github-vue';
import {IconsPlugin } from 'bootstrap-vue';
import VueQuillEditor from 'vue-quill-editor';
//import "./serviceWorker/registersw";
import BootstrapVue from "bootstrap-vue";
import VueNoty from 'vuejs-noty';
//import VCalendar from 'v-calendar';
import disableDevtool from 'disable-devtool';
//import AudioRecorder from 'vue-audio-recorder';
//import vueAwesomeCountdown from 'vue-awesome-countdown'
import VueMaterial from 'vue-material'; // TODO: import only needed component, not all
import 'vue-material/dist/vue-material.min.css';
import VueMeta from 'vue-meta';
import CountryFlag from 'vue-country-flag'
//import VueSocialSharing from 'vue-social-sharing'
//import Vuetify from 'vuetify';
import VueLazyload from 'vue-lazyload'
import 'vuetify/dist/vuetify.min.css';
import flag from "./components/parts/flag";
import 'viewerjs/dist/viewer.css'
import Vuer from 'v-viewer'

Vue.component('country-flag', CountryFlag);
//Vue.use(Vuetify);
Vue.use(flag);
Vue.use(VueMeta);
Vue.use(VueMaterial);
Vue.use(VueLazyload);
Vue.use(Vuer);



import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

Vue.use(VueQuillEditor, /* { default global options } */);

//Vue.use(ForkeMeOnGithub);


 
//Vue.use(AudioRecorder);
Vue.use(BootstrapVue);
//Vue.use(VueSocialSharing);
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(IconsPlugin);
//Vue.use(VCalendar, {})
//Vue.use(vueAwesomeCountdown);

Vue.use(VueNoty, {
	timeout: 4000,
	progressBar: true,
	layout: 'topRight'
});



import App from './App.vue';
let app = null;
Vue.config.productionTip = false;

//console.log(this.webpackHotUpdate);
if(!Vue.config.devtools)
{
	//disableDevtool();
}

import { getAuth, onAuthStateChanged } from "firebase/auth";
import {get_text,languages,get_defaultlanguage} from "@/languages";
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
	if (!app) {
		app = new Vue({
			router,
			render: h => h(App)
		});
		//app.use(BootstrapIconsPlugin);
		app.$mount('#app');
	}
});

const gt=(a)=>{
	return get_text(a);
};
