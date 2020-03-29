<template>
    <div>
        <Book :bookCondition="book"></Book>
    </div>
    
</template>

<script>
import Book from '../front/Index.vue'


export default {
    data(){
        return{
            book: {ebook: 1},
        }
    },
    created(){

    },
    components:{
        Book: Book
    }
}
</script>

<style>

</style>