<template>
    <img :src="img" alt="app_logo" width="128" height="128" />

</template>
<script>
import logo from "@/assets/icons/android-chrome-512x512.png"
export default {
    
    data()
    {
        return {
            img:logo
        }
    }
}
</script>
