<template>
    <section>
        <div :id="idName"></div>
    </section>
</template>

<script>
    /*
    format string : formatSex formatDouble formatDate formatTime formatDateTime
    handle : ui event
    remote request [ajax] : getXXX
     */

    import Util from './../js/util'
    import {getOdoQuery} from './../api/api';
    import Highcharts from "highcharts";

    export default {
        components: {},

        props: {
            odcName: {
                type: String,
                required: true,
            },
            idName: {
                type: String,
                required: true,
            },
            visible: {
                type: Boolean,
                default: false
            },
            fields: {
                type: Array,
                default: []
            },
            conditions: {
                type: Array,
                default: []
            },
            title: {
                type: String,
                required: true,
            },
        },

        data() {
            return {
                listLoading: false,

                objs: [],

                points: [],
            }
        },

        methods: {
            clear() {
                this.odc = undefined;
                this.nObj = undefined;
                this.objs = [];
            },

            init() {
                // odc nObj
                this.odc = odl.findOdc(this.odcName);
                if (!this.odc) {
                    this.clear();
                    return;
                }
                // nObj
                this.nObj = odl.findNObj(this.odc, odl.UiVueTable.kind);
                if (!this.nObj || !this.nObj.spec.key) {
                    this.clear();
                    return;
                }
            },

            // query data
            getObjs() {
                if (!this.nObj || this.conditions.length <= 0) {
                    this.clear();
                    return;
                }
                let params = {
                    session: Date.now(),
                    odc: this.odcName,
                    action: 'ls',
                    conditions: {
                        fields: this.fields,
                        attrs: this.conditions,
                    }
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
                        let objs = rs.data;
                        let points = [];
                        let fieldName = this.fields[1].name;
                        for (let i = 0; i < objs.length; i++) {
                            points.push([i, objs[i][fieldName]]);
                        }
                        this.objs = objs;
                        this.points = points;
                        this.showLineBoost();
                    }
                    this.listLoading = false;
                });
            },

            showLineBoost () {
                // #highcharts

                Highcharts.setOptions({
                    global: {
                        useUTC: false,
                    },
                });

                console.time('line');

                let curve = {
                    chart: {
                        zoomType: 'x'
                    },
                    boost: {
                        useGPUTranslations: true
                    },
                    title: {
                        text: this.title + ' has ' + this.points.length + ' points'
                    },
                    subtitle: {
                        text: 'Using the Boost module'
                    },
                    tooltip: {
                        valueDecimals: 2
                    },
                    series: [{
                        data: this.points,
                        lineWidth: 0.5
                    }]
                };

                Highcharts.chart(this.idName, curve);

                return curve;
            },
        },

        created() {
            this.odc = undefined;
            this.nObj = undefined;
            this.init();
            this.getObjs();
        },

        mounted() {
            // console.log('mounted')
        },

        updated: function () {
            // console.log('updated');
        },

        watch: {
            conditions(nv, ov) {
                // this.clear();
                this.init();
                this.getObjs();
            },
        }
    }

</script>

<style scoped>

</style>
