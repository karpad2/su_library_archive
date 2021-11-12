<template>
    <country-flag :country="country_flag" size='normal'/>
</template>
<script>
export default {
    props:["flag"],
    data()
    {
        return{
            country_flag:""
        }
    },
    mounted()
    {
        let l=String(this.flag).split('-');
        this.country_flag=l[0];
        console.log(this.country_flag);
    }
}
</script>