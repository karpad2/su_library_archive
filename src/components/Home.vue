<template>
	<div>
		<div class="section">
	
</div>
<div class="section">
	<h4>Newer books:</h4>
	</div>
	</div>
	
</template>

<script>
import {FireDb,FirebaseAuth,userId} from "@/firebase";
import {get_data_from_allroomdb,get_rooms,get_data_fromroomdb} from "@/mod_data/get_data";

	export default {
		name: "Home",
		data: () => ({
			selectedMovies: [],
			selectedDate: null,
			boolean: false,
			profilexpire:"",
			active:0,
			inactive:0,
			devices:{},
			events:[],
			date: new Date(),
			
		}),
		components:{
			
    		
		},
		computed: {
			firstDayOfAWeek: {
				get() {
					return this.$material.locale.firstDayOfAWeek;
				},
				set(val) {
					this.$material.locale.firstDayOfAWeek = val;
				},
				
			},
			dateFormat: {
				get() {
					return this.$material.locale.dateFormat;
				},
				set(val) {
					this.$material.locale.dateFormat = val;
				}
			},
			profilename()
			{
				return FirebaseAuth.currentUser.displayName;
			},
			attributes() {
				return this.events.map(t => ({
					key: `events.${t.id}`,
					dot: {
					backgroundColor: "red",
					},
					dates: t.contact_date,
					customData: t.contact_name,
      }));
			}
			
		},
		mounted()
		{
			console.log(FirebaseAuth.currentUser);
			this.get_name();
			this.events=get_data_from_allroomdb("events");
			//console.log(this.$route)
		},
		methods: {
			showSuccess: function () {
				this.$noty.success("Success!");
			},
			showError: function () {
				this.$noty.error("Error :(", {
					killer: true,
					timeout: 1500,
				});
			}
		},
		
	}
</script>

<style scoped>
.md-card {
    width: 320px;
    margin: 15px;
	padding: 15px;
    display: inline-block;
    vertical-align: top;
  }
  .profile{
	  font-weight: bold;
  }

</style>