<template>
    <section>
        <div v-for="(bureauId, index) in bureauIds">
            <CurveView odc-name="container_stat" :id-name="'show-ht-curve-'+bureauId" :title="'服务实例 '+bureauId+'的内存常规值历史数据'" :fields="fields" :conditions="getConditions(bureauId)"></CurveView>
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

    export default {
        components: {CurveView},

        data() {
            return {
                bureauIds: [3,4,5,6,7],

                fields: [],

                conditions: []
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
            }
        },

        created() {
        },

        mounted() {
            this.fields = [
                {
                    name: 'id',
                },
                {
                    name: 'memUsage',
                },
                {
                    name: 'statTime',
                }
            ];
        },

        updated: function () {
        },

        watch: {
        }
    }

</script>

<style scoped>

</style>
