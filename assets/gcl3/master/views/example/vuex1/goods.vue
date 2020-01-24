<template>
    <div>
        <h1>Sample Shop - goods</h1>
        Clicked: {{ getCount }} times
        <button @click="increment">+</button>
        <button @click="decrement">-</button>
        <button @click="toCart">to cart</button>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {mapActions} from 'vuex'

    export default {
        computed: {
            // 使用对象展开运算符将 getters 混入 computed 对象中
            ...mapGetters([
                'getCount'
                // ...
            ])
        },

        methods: {
            ...mapActions([
                'increment', // 映射 this.increment() 为 this.$store.dispatch('increment')
                'decrement'
            ]),
            //...mapActions({
            //  add: 'increment' // 映射 this.add() 为 this.$store.dispatch('increment')
            //})

            toCart() {
                this.$router.push({path: 'SampleShopCart'})
            },
        },

        created() {
            console.log('goods created');
        },
    }

</script>
