import Vue from 'vue';
import VueRouter  from 'vue-router';
import {FirebaseAuth} from '../firebase';
Vue.use(VueRouter);

import Index from "../components/Index";
import Error404 from "../components/Error404";
import AccountIndex from "../components/account/Index";
import AccountInfo from "../components/account/AccountInfo";
import AccountLogin from "../components/account/Login";

import AccountAdminIndex from "../components/admin/account/Index";
import AccountAdminInfo from "../components/admin/account/AccountInfo";
import AccountAdminLogin from "../components/admin/account/Login";

import AdminUsers from "../components/admin/ad_users";
import AdminUser from "../components/admin/ad_user";
import AdminBooks from "../components/admin/ad_books";
import AdminBook from "../components/admin/ad_book";
import AdminBlogs from "../components/admin/ad_blogs";
import AdminBlog from "../components/admin/ad_blog";


import Home from "../components/Home";
import Info from "../components/Info";
import Books from "../components/Books";
import Book from "../components/Book";
import Page from "../components/Page";

import Support from "@/components/Support";

const router = new VueRouter ({
	mode: 'history',
	base: '/',
	routes: [
		{
			path: '*',
			name: 'error404',
			component: Error404,
		},
		{
			path: '/',
			component: Index,
			meta: {
				requiresAuth: true
			},
			children: [
				{
					path: 'home',
					name: 'home',
					component: Home,
				},
				
				{
					path: 'info',
					name: 'info',
					component: Info,
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
				},
				{
					path: 'book/:bid',
					name: 'book',
					component: Book,
				},
				{
					path: 'book/:bid/:pid',
					name: 'book',
					component: Page,
				},
				{
					path: 'support',
					name: 'support',
					component: Support,
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
			path: '/admin',
			component: AccountIndex,
			children: [
				{
					path: '',
					name: 'admin-info',
					component: AccountInfo,
				},
				{
					path: 'users',
					name: 'admin-users',
					component: AccountLogin,
				},
				{
					path: 'books',
					name: 'admin-books',
					component: A,
				}
			]
		}

	]
});

router.beforeEach((to, from, next) => {
	let currentUser = FirebaseAuth.currentUser;
	let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
	console.log(from);
	if(requiresAuth && !currentUser) next('/account/login');
	else next();
});
/*
router.beforeEach((to, from, next) => {
	let currentUser = FirebaseAuth.currentUser;
	let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
	if(requiresAuth && !currentUser) next('/account/login');
	else next();
})*/

export default router;
