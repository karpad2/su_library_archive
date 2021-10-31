<template>
     <div>
        <md-headline>{{gt("Users")}}</md-headline>
        <div>{{gt("settings_of_users")}}
        
        <div class="section" v-if="users.length>0">
        <md-table v-model="searched" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
            <md-table-toolbar>
                <div class="md-toolbar-section-start">
                <h1 class="md-title">{{gt("users")}}</h1>
                </div>

                <md-field md-clearable class="md-toolbar-section-end">
                <md-input :placeholder="gt('search_by_name')" v-model="search" @input="searchOnTable" />
                </md-field>
            </md-table-toolbar>

            <md-table-empty-state
                :md-label="gt('users_cant_found')"
                :md-description="`${gt('no_user_cant_be_found')} '${search}'.`">
                <md-button class="md-primary md-raised" @click="newBook">Create New User</md-button>
            </md-table-empty-state>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>
                <md-table-cell :md-label="gt('username')" md-sort-by="name">{{ item.name }}</md-table-cell>
                <md-table-cell :md-label="gt('useremail')" md-sort-by="email">{{ item.email }}</md-table-cell>
                <md-table-cell :md-label="gt('valid_until')" md-sort-by="gender">{{ item.valid_until }}</md-table-cell>
            </md-table-row>
        </md-table>
        </div>

        <md-button>{{gt("upload")}}</md-button>
        </div>


    </div>

</template>
<script>
import {get_text} from "@/languages";
//import { initializeApp, applicationDefault } from 'firebase-admin/app';

export default {
    methods:
    { gt(a)
        {
            return get_text(a);
        }
    },
    computed:{
        users(){
            let a=[];
            return a;
        }
    }
}
</script>