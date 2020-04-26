<template>
    <simple-a odc-name="user"></simple-a>
</template>

<script>
    import SimpleA from "./../../../../../../3rd/cvue-3/odl/simple-a.vue";

    export default {
        components: {SimpleA},

        props: {},

        data() {
			return {
			}
        },

        methods: {
            init(){
            }
        },

        created() {
            // this.values = [8, 9, 10, 11, 12];
        },

        mounted() {
            this.init();
        },
    }

</script>
