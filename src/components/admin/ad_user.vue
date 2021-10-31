<template>
<div >
<h2>{{gt("user")}}</h2>

<md-field>
      <label>{{gt('user_name')}}</label>
      <md-input v-model="user_name" md-counter="100"></md-input>
</md-field>
<md-field>
      <label>{{gt('user_email')}}</label>
      <md-input v-model="user_email" md-counter="100"></md-input>
</md-field>
<md-field>
      <label>{{gt('user_expired')}}</label>
      <md-input v-model="user_expired" md-counter="100"></md-input>
</md-field>

</div>
</template>
<script>
import {get_text} from "@/languages";
export default {
  methods:{
    gt(a)
    {
      return get_text(a);
    }
  },
  data()
  {
    return{
      user_name:"",
      user_email:""
    }
  }
}
</script>

