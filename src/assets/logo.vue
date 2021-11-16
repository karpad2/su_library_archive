<template>
    <img :src="img" alt="app_logo" width="32" height="32" />

</template>
<script>
import logo from "@/assets/icons/favicon-32x32.png"
export default {
    
    data()
    {
        return {
            img:logo
        }
    }
}
</script>
