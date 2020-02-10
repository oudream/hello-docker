<template>
    <section>
        <el-row v-for="(obj, index) in memoryContainers">
            <div>
                <h4>Id : {{obj.Id }}</h4>
                <p>Names : {{obj.Names }}</p>
                <p>Image : {{obj.Image }}</p>
                <p>ImageID : {{obj.ImageID }}</p>
                <p>Command : {{obj.Command }}</p>
                <p>Created : {{obj.Created }}</p>
                <p>Ports : {{obj.Ports }}</p>
                <p>Labels : {{obj.Labels }}</p>
                <p>State : {{obj.State }}</p>
                <p>Status : {{obj.Status }}</p>
                <p>HostConfig : {{obj.HostConfig }}</p>
                <p>NetworkSettings : {{obj.NetworkSettings}}</p>
                <p>Mounts : {{obj.Mounts }}</p>
            </div>
        </el-row>
    </section>
</template>

<script>
    import {getContainerQuery} from './../../../../3rd/cvue-3/api/api';

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
