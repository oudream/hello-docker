<template>
    <section>
        <el-row v-for="(obj, index) in memoryContainers">
            <ul>
                <li>NO : {{index }}</li>
                <li> Id : {{obj.Id }} </li>
                <li>Names : {{obj.Names }}</li>
                <li>Image : {{obj.Image }}</li>
                <li>ImageID : {{obj.ImageID }}</li>
                <li>Command : {{obj.Command }}</li>
                <li>Created : {{obj.Created }}</li>
                <li>Ports : {{obj.Ports }}</li>
                <li>Labels : {{obj.Labels }}</li>
                <li>State : {{obj.State }}</li>
                <li>Status : {{obj.Status }}</li>
                <li>HostConfig : {{obj.HostConfig }}</li>
                <li>NetworkSettings : {{obj.NetworkSettings}}</li>
                <li>Mounts : {{obj.Mounts }}</li>
            </ul>
        </el-row>
    </section>
</template>

<script>
    import {getContainerQuery} from '../../../../3rd/cvue-3/api/api';

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
