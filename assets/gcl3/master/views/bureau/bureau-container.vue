<template>
    <section>
        <el-row v-for="(obj, index) in memoryContainers" :key="index" :prop="obj.name" :label="obj.label" :width="obj.width"
                         :min-width="obj.minWidth" :formatter="obj.format" :sortable="obj.sortable"
                         :show-overflow-tooltip="obj.showOverflowTooltip">
            <span>{{ msg }}</span>
        </el-row>
    </section>
</template>

<script>
    import { getContainerQuery } from './../../../../3rd/cvue-3/api/api';

    export default {
        data() {
            return {
                configContainers: [],
                memoryContainers: [],

                listLoading: false,
            }
        },

        methods: {
            init: function() {
            },

            // query data
            getObjs() {
                let params = {
                    session: Date.now(),
                    action: 'ls',
                };
                this.listLoading = true;
                getContainerQuery(params).then((rs) => {
                    if (rs && rs.state.err) {
                        this.$message({
                            message: '数据请求失败：' + rs.state.err,
                            type: 'error'
                        });
                    }
                    else {
                        this.configContainers = rs.data.configContainers;
                        this.memoryContainers = rs.data.memoryContainers;
                    }
                    this.listLoading = false;
                });
            },
        },

        created() {
            this.init();
        },

        mounted() {
            this.getObjs();
        },
    }
</script>
