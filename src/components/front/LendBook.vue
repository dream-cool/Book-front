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
            book: {bookStatus: '1', ebook: 0},
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