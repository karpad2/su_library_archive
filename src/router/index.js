import Vue from 'vue';
import VueRouter  from 'vue-router';
import {FirebaseAuth,isAdmin} from '../firebase';
Vue.use(VueRouter);

import Index from "../components/Index";
import Error404 from "../components/Error404";
import AccountIndex from "../components/account/Index";
import AccountInfo from "../components/account/AccountInfo";
import AccountLogin from "../components/account/Login";


import AdminUsers from "../components/admin/ad_users";
import AdminUser from "../components/admin/ad_user";
import AdminBooks from "../components/admin/ad_books";
import AdminBook from "../components/admin/ad_book";
import Admin_Dashboard from "../components/admin/ad_dashboard";
import AdminBlogs from "../components/admin/ad_blogs";
import AdminBlog from "../components/admin/ad_blog";


import Home from "../components/Home";
import Info from "../components/Info";
import Books from "../components/Books";
import Book from "../components/Book";
import Favorites from "../components/Favorites";
import Page from "../components/Page";

import Support from "@/components/Support";

const router = new VueRouter ({
	mode: 'history',
	base: '/',
	routes: [
		
		{
			path: '/home',
			name: 'home',
			component: Index,
		},
		{
			path: '/',
			name: 'unloggined',
			component: Index,
		},
		{
			path: '/',
			component: Index,
			meta: {requiresAuth: true},
			children: [
				{
					path: '/',
					name: 'homeindex',
					component: Home,
					meta: {requiresAuth: false}
				},
				{
					path: 'home',
					name: 'home',
					component: Home,
					meta: {requiresAuth: false}
				},
				
				{
					path: 'info',
					name: 'info',
					component: Info,
				},
				{
					path: 'favorites',
					name: 'favorites',
					component: Favorites,
				},
				{
					path: 'logout',
					name: 'logout',
					component: Info,
				},
				{
					path: 'books',
					name: 'books',
					component: Books,
					meta: {requiresAuth: false}
				},
				{
					path: 'book/:bid/:b_author/:b_name',
					name: 'book',
					component: Book,
					meta: {requiresAuth: false}
				},
				{
					path: 'book/:bid/:b_author/:b_name/page/:pid',
					name: 'bookpage',
					component: Page,
					
				},
				{
					path: 'support',
					name: 'support',
					component: Support,
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
					path: 'admin/books',
					name: 'admin-books',
					component: AdminBooks,
				},
				{
					path: 'admin/book/:b_id',
					name: 'admin-book',
					component: AdminBook,
					
				},
				
				{
					path: 'admin/blogs',
					name: 'admin-blogs',
					component: AdminBlogs,
				},
				{
					path: 'admin/blog/:b_id',
					name: 'admin-blog',
					component: AdminBlog,
				},

				{
					path: 'admin',
					name: 'admin-info',
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

//	if(String(to.path)=="/home") next("/home"); 

/*
 	if (String(to.path).indexOf("admin")>=0 && !isAdmin()) {
		next("/")
	}*/
	//let requireAdmin = to.matched.some(record=>record.meta.requireAdmin);
	//console.log(from);
	if(requiresAuth && !currentUser) next('/account/login');
	//if(requireAdmin && currentUser) next('/admin/login');
	else next();
	//next();
});
/*
router.beforeEach((to, from, next) => {
	let currentUser = FirebaseAuth.currentUser;
	let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
	if(requiresAuth && !currentUser) next('/account/login');
	else next();
})*/

export default router;
