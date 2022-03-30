import Vue from 'vue';
import VueRouter  from 'vue-router';
import {createWebHashHistory}  from 'vue-router';
import {FirebaseAuth,isAdmin} from '../firebase';
Vue.use(VueRouter);

import Index from "../components/Index";
import Error404 from "../components/Error404";
import AccountIndex from "../components/account/Index";
import AccountInfo from "../components/account/AccountInfo";
import AccountLogin from "../components/account/Login";
import AccountRegister from "../components/account/Register";
import Admin_Dashboard from "../components/admin/ad_dashboard";
import AdminUsers from "../components/admin/users/ad_users";
import AdminUser from "../components/admin/users/ad_user";

import Home from "../components/Home";
import PublicIndex from "../components/Index";
import AboutUs from "../components/AboutUs";
import Contact from "../components/Contact";
import Terms from "../components/Terms";
import Search from "../components/Search";
import Bookmarks from "../components/Bookmarks";
import Printing from "../components/Printing";


import template_views from "../components/template/template_views";
import template_view from "../components/template/template_view";
import template_chapter from "../components/template/template_chapter";
import template_chapter_page from "../components/template/template_chapterpage";

import AdminContents from "../components/admin/content/ad_contents";
import AdminContent from "../components/admin/content/ad_content";
import AdminContentChapter from "../components/admin/content/ad_chapter_content";


import Favorites from "../components/Favorites";
import User from "../components/account/User";

import Support from "@/components/Support";

const router = new VueRouter ({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		
		
		
		{
			path: '/public',
			component: PublicIndex,
			children: [
		{
			path: 'home',
			name: 'homewithoutloginned',
			component: Home
		},
		
		{
			path: 'search',
			name: 'Searchpublicwithoutlogin',
			component: Search
		},
		{
			path: 'search/:bmode/:bsearch',
			name: 'Search_aa_withoutlogin',
			component: Search
		},
		
		{
			path: 'support',
			name: 'support_public',
			component: Support
		},
		{
			path: 'aboutus',
			name: 'aboutus',
			component: AboutUs
		}		

	]
	},
		{
			path: '/',
			component: Index,
			meta: {requiresAuth: false},
			children: [
			
				{
					path: '/home',
					name: 'home',
					component: Home
				},
				{
					path: 'favorites',
					name: 'favorites',
					component: Favorites,
				},
				{
					path: 'search',
					name: 'Searchwithoutlogin',
					component: Search
				},
				{
					path: 'bookmarks',
					name: 'bookmarks',
					component: Bookmarks
				},
				{
					path: 'terms',
					name: 'terms',
					component: Terms
				},
				{
					path: 'printing',
					name: 'printing',
					component: Printing
				},
				{
					path: 'search/:bmode/:bsearch',
					name: 'Search_a_withoutlogin',
					component: Search
				},
			
				{
					path: 'views/:viewtype',
					name: 'viewswithoutlogin',
					component: template_views
				},
				{
					path: 'view/:viewtype/:nid/:nname',
					name: 'viewwithoutlogin',
					component: template_view
				},
				
				{
			path: 'aboutus',
			name: 'aboutus',
			component: AboutUs
				},

				{
					path: 'contact',
					name: 'contact',
					component: Contact
				},
				
				{
					path: 'view/:viewtype/:bmode/:psearch',
					name: 'viewwithsearchlogin',
					component: template_view
				},
				{
					path: 'view/:viewtype/:nid/:nname/chapter/:cid',
					name: 'chapterviewwithoutlogin',
					component: template_chapter
				},
				{
					path: 'view/:viewtype/:nid/:nname/chapter/:cid/page/:pid',
					name: 'templatepageviewerwithoutlogin',
					component: template_chapter_page
				},
				
				{
					path: 'support',
					name: 'support',
					component: Support,
				},
				{
					path: 'user',
					name: 'user',
					component: User,
				},
				{
					path: 'admin/users',
					name: 'admin-users',
					component: AdminUsers,
				},
				{
					path: 'admin/user/:uid',
					name: 'admin-user',
					component: AdminUser,
				},
			

				{
					path: 'admin/content/:viewtype',
					name: 'admin-contents',
					component: AdminContents,
					
				},
				{
					path: 'admin/content/:viewtype/:bid',
					name: 'admin-content',
					component: AdminContent,
					
				},
				{
					path: 'admin/content/:viewtype/:bid/chapter/:cid',
					name: 'admin-content-chapter',
					component: AdminContentChapter,
					
				},

				
				{
					path: 'admin',
					name: 'admin-info',
					component: Admin_Dashboard,
				},
				{
					path: 'admin/dashboard',
					name: 'admin-info-dashboard',
					component: Admin_Dashboard,
				},
				]
		},
		
		{
			path: '/account',
			component: AccountIndex,
			children: [
				{
					path: '',
					name: 'account-info',
					component: AccountInfo,
				},
				{
					path: 'login',
					name: 'account-login',
					component: AccountLogin,
				},
				{
					path: 'register',
					name: 'account-register',
					component: AccountRegister,
				}
				
			]
		},
		{
			path: '*',
			name: 'error404',
			component: Error404,
		},

	]
});
router.beforeEach((to, from, next) => {
	let currentUser = FirebaseAuth.currentUser;
	let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
	if(!to.path.includes("/page/"))
	{
		localStorage.setItem("fullscreen",false);
	}
	//console.log(to.path);
	if(to.path=="/") 
	{
		if(requiresAuth && !currentUser) next('/account/login');
		else next('/home');
	}
	if(requiresAuth && !currentUser) next('/account/login');
	else next();
})


export default router;
