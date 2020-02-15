<template>
    <section>
        <div v-for="(bureau, index) in bureaus">
            <CurveView :odc-name="odcName" :id-name="'show-ht-curve-'+bureau.id" :title="getConditions(bureau.id)" :fields="fields" :conditions="getConditions(bureau.id)"></CurveView>
        </div>
    </section>
</template>

<script>
    /*
    format string : formatSex formatDouble formatDate formatTime formatDateTime
    handle : ui event
    remote request [ajax] : getXXX
     */

    import Util from "../../../../3rd/cvue-3/js/util";
    import {getOdoQuery} from "../../../../3rd/cvue-3/api/api";
    import CurveView from "../../../../3rd/cvue-3/odl/curve-view";

    const STAT_FIELD_NAME = 'memMaxUsage';
    const TITLE_EXT = '的内存峰值历史数据';

    export default {
        components: {CurveView},

        data() {
            return {
                odcName: 'container_stat',

                bureaus: [],

                fields: [
                    {
                        name: 'id',
                    },
                    {
                        name: STAT_FIELD_NAME,
                    },
                    {
                        name: 'statTime',
                    }
                ],

                listLoading: false
            }
        },

        methods: {
            getConditions(bureauId){
                return [
                    {
                        name: 'bureauId',
                        operation: '=',
                        value: bureauId,
                        isAnd: true
                    },
                    {
                        name: 'statTime',
                        operation: '>',
                        value: Date.now() - 3600 * 1000,
                        isAnd: true
                    },
                    {
                        name: 'statTime',
                        operation: '<',
                        value: Date.now(),
                        isAnd: false
                    }
                ]
            },

            getConditions(bureauId){
                return '服务实例 ' + bureauId + TITLE_EXT;
            },
        },

        created() {
        },

        mounted() {
            let params = {
                session: Date.now(),
                odc: 'bureau',
                action: 'ls',
            };
            this.listLoading = true;
            getOdoQuery(params).then((rs) => {
                if (rs && rs.state.err) {
                    this.$message({
                        message: '数据请求失败：' + rs.state.err,
                        type: 'error'
                    });
                }
                else {
                    this.bureaus = rs.data;
                }
                this.listLoading = false;
            });
        },

        updated: function () {
        },

        watch: {
        }
    }

</script>

<style scoped>

</style>
