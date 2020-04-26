<template>
    <div>
        <h1>Sample Shop - cart</h1>
        Clicked: {{ count }} times
    </div>
</template>

<script>

    import {getHello1} from './../../../../../3rd/cvue-3/api/api.js';

    export default {

        components: {

        },

        props: {
            count: {
                type: Number,
                required: false,
                default: function _count() {
                    return 0;
                },
            },

        },

        data() {
            return {}
        },

        methods: {
            init: function() {
                getHello1({a:1}).then((rs) => {
                    this.count = this.count + 1;
                    console.log(rs);
                });

            }
        },

        created() {
            this.init();
            console.log('cart created');
        },

        mounted() {
        },

    }

</script>
