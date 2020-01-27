<template>
    <validator-a odc-name="user"
                 :cancel-button="{title:'取消提交', visible: true, }"
                 :submit-button="{title:'提交登录', visible: true, }"
                 back-ground-image="/static/jpg/login-bg.jpg"
                 @submit="handleValidatorSubmit"></validator-a>
</template>

<script>
    import ValidatorA from "./../../../../../../3rd/cvue-3/odl/validator-a.vue";

    export default {
        components: {ValidatorA},

        props: {},

        data() {
            return {}
        },

        methods: {
            handleValidatorSubmit: function(err, data) {
                debugger;
                if (Array.isArray(data) && data.length > 0) {
                    sessionStorage.setItem('user', JSON.stringify(data[0]));
                    this.$router.push({path: '/Main'});
                }
                else {
                    this.$message({
                        message: '登录失败.：' + err,
                        type: 'error'
                    });
                }
            },

            handleValidatorCancel: function() {
            }
        },
    }

</script>
