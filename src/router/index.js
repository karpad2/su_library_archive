import Vue from 'vue';
import VueRouter  from 'vue-router';
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

import AdminBlogs from "../components/admin/blogs/ad_blogs";
import AdminBlog from "../components/admin/blogs/ad_blog";

import AdminNewspaper from "../components/admin/newspapers/ad_newspaper";
import AdminChapter from "../components/admin/newspapers/ad_chapter";
import AdminNewspapers from "../components/admin/newspapers/ad_newspapers";

import AdminBooks from "../components/admin/books/ad_books";
import AdminBook from "../components/admin/books/ad_book";

import AdminPhoto from "../components/admin/photoalbum/ad_photo";
import AdminPhotoalbum from "../components/admin/photoalbum/ad_photoalbum";
import AdminPhotoalbums from "../components/admin/photoalbum/ad_photoalbums";

import AdminNote from "../components/admin/notes/ad_note";
import AdminNoteCollection from "../components/admin/notes/ad_notecollection";
import AdminNoteCollections from "../components/admin/notes/ad_notecollections";

import Home from "../components/Home";
import PublicIndex from "../components/Index";

import Books from "../components/Books/Books";
import Book from "../components/Books/Book";

import NewsPapers from "../components/Newspaper/NewsPapers";
import NewsPaper from "../components/Newspaper/NewsPaper";

import PhotoAlbums from "../components/PhotoAlbum/PhotoAlbums";
import PhotoAlbum from "../components/PhotoAlbum/PhotoAlbum";

import Notes from "../components/Notes/Notes";
import Note from "../components/Notes/Note";

import BookPage from "../components/ViewerPages/BookPage";
import PhotoAlbumViewer from "../components/ViewerPages/PhotoAlbumViewer";
import NoteViewer from "../components/ViewerPages/NoteViewer";
import ChapterPage from "../components/ViewerPages/ChapterPage";

import Blog from "../components/blog/Blog";
import Favorites from "../components/Favorites";

import User from "../components/account/User";

import Support from "@/components/Support";

const router = new VueRouter ({
	mode: 'history',
	base: '/',
	routes: [
		
		
		{
			path: '/',
			name: 'unloggined',
			component: PublicIndex,
		},
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
			path: 'books',
			name: 'bookswithoutlogin',
			component: Books
		},
		{
			path: 'books/:bmode/:bsearch',
			name: 'bookswithoutlogin',
			component: Books
		},
		
		{
			path: 'book/:bid/:bname',
			name: 'bookwithoutlogin',
			component: Book
		},
		{
			path: 'newspapers',
			name: 'newspaperswithoutlogin',
			component: NewsPapers
		},
		{
			path: 'newspapers/:bmode/:bsearch',
			name: 'newspaperswithoutlogin',
			component: NewsPapers
		},
		{
			path: 'newspaper/:nid/:nname',
			name: 'newspaperwithoutlogin',
			component: NewsPaper
		},
		
		{
			path: 'photoalbums',
			name: 'photoalbumswithoutlogin',
			component: PhotoAlbums
		},
		{
			path: 'photoalbums/:bmode/:bsearch',
			name: 'photoalbumswithoutlogin',
			component: PhotoAlbums
		},
		{
			path: 'photoalbum/:pid/:pname',
			name: 'photoalbumwithoutlogin',
			component: PhotoAlbum
		},
		{
			path: 'photoalbum/:pid/:pname/:photo_page',
			name: 'photoalbumwithoutviewerlogin',
			component: PhotoAlbumViewer
		},

		{
			path: 'notes',
			name: 'photoalbumswithoutlogin',
			component: Notes
		},
		{
			path: 'notes/:bmode/:bsearch',
			name: 'photoalbumswithoutlogin',
			component: Notes
		},
		{
			path: 'note/:pid/:pname',
			name: 'photoalbumwithoutlogin',
			component: Note
		},
		{
			path: 'note/:nid/:nname/chapter/:cid/page/:pid',
			name: 'newspaperwithoutlogin',
			component: NoteViewer
		},

		{
			path: 'support',
			name: 'support_public',
			component: Support
		}	
	]
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
					path: 'books',
					name: 'bookssearch',
					component: Books,
					meta: {requiresAuth: false}
				},
				{
					path: 'books/:bmode/:bsearch',
					name: 'bookssearch',
					component: Books,
					meta: {requiresAuth: false}
				},
				{
					path: 'book/:bid/:bname',
					name: 'book',
					component: Book,
					meta: {requiresAuth: false}
				},
				{
					path: 'book/:bid/:bname/page/:pid',
					name: 'bookpage',
					component: BookPage,
					
				},
				{
					path: 'blog/:bid/:bname',
					name: 'blog',
					component: Blog,
					
				},
				
				{
					path: 'newspapers',
					name: 'newspaperswithoutlogin',
					component: NewsPapers
				},
				{
					path: 'newspapers/:bmode/:nsearch',
					name: 'newspaperswithoutlogin',
					component: NewsPapers
				},
				{
					path: 'newspaper/:nid/:nname',
					name: 'newspaperwithoutlogin',
					component: NewsPaper
				},
				
				{
					path: 'newspaper/:nid/:nname/chapter/:cid/page/:pid',
					name: 'newspaperwithoutlogin',
					component: ChapterPage
				},
				{
					path: 'photoalbums',
					name: 'photoalbumswithoutlogin',
					component: PhotoAlbums
				},
				{
					path: 'photoalbums/:bmode/:psearch',
					name: 'photoalbumswithoutlogin',
					component: PhotoAlbums
				},
				{
					path: 'photoalbum/:pid/:pname',
					name: 'photoalbumwithoutlogin',
					component: PhotoAlbum
				},
				{
					path: 'photoalbum/:pid/:pname/:pid',
					name: 'photoalbumwithoutlogin',
					component: PhotoAlbumViewer
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
					path: 'admin/books',
					name: 'admin-books',
					component: AdminBooks,
				},
				{
					path: 'admin/book/:bid',
					name: 'admin-book',
					component: AdminBook,
					
				},
				{
					path: 'admin/photoalbums',
					name: 'admin-photoalbums',
					component: AdminPhotoalbums,
				},
				{
					path: 'admin/photoalbum/:bid',
					name: 'admin-photoalbum-viewer',
					component: AdminPhotoalbum,
					
				},
				{
					path: 'admin/photoalbum/:bid/photo/:pid',
					name: 'admin-photoalbum-viewer',
					component: AdminPhoto,
					
				},
				{
					path: 'admin/notes',
					name: 'admin-notes',
					component: AdminNoteCollections,
				},
				{
					path: 'admin/note/:bid',
					name: 'admin-note-viewer',
					component: AdminNoteCollection,
					
				},
				{
					path: 'admin/notes/:bid/note/:pid',
					name: 'admin-note-viewer',
					component: AdminNote,	
				},
				
				{
					path: 'admin/newspapers',
					name: 'admin-newspapers',
					component: AdminNewspapers,
					
				},
				{
					path: 'admin/newspaper/:bid',
					name: 'admin-newspaper',
					component: AdminNewspaper,
					
				},
				{
					path: 'admin/newspaper/:bid/chapter/:cid',
					name: 'admin-chapter',
					component: AdminChapter,
					
				},
				
				{
					path: 'admin/blogs',
					name: 'admin-blogs',
					component: AdminBlogs,
				},
				{
					path: 'admin/dashboard',
					name: 'admin-dashboard',
					component: Admin_Dashboard,
				},
				{
					path: 'admin/blog/:bid',
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
