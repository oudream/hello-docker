<template>
    <section>
        <div style="display: flex; flex-wrap: wrap;">
            <div id="show-ht-curve-7"></div>
            <div id="show-ht-curve-8"></div>
        </div>
    </section>
</template>

<script>

    import Highcharts from 'highcharts'
    import {getContainerQuery} from './../../../../3rd/cvue-3/api/api';

    const csMeasureCurveUiPrefix = 'show-ht-curve-';

    export default {
        methods: {
            showLineBoost (bureauId) {
                // #highcharts

                Highcharts.setOptions({
                    global: {
                        useUTC: false,
                    },
                });

                function getData(n) {
                    var arr = [],
                        i,
                        a,
                        b,
                        c,
                        spike;
                    for (i = 0; i < n; i = i + 1) {
                        if (i % 100 === 0) {
                            a = 2 * Math.random();
                        }
                        if (i % 1000 === 0) {
                            b = 2 * Math.random();
                        }
                        if (i % 10000 === 0) {
                            c = 2 * Math.random();
                        }
                        if (i % 50000 === 0) {
                            spike = 10;
                        }
                        else {
                            spike = 0;
                        }
                        arr.push([
                            i,
                            2 * Math.sin(i / 100) + a + b + c + spike + Math.random()
                        ]);
                    }
                    return arr;
                }

                let n = 5000;
                let data = getData(n);
                console.time('line');

                let curve = {
                    chart: {
                        zoomType: 'x'
                    },
                    boost: {
                        useGPUTranslations: true
                    },
                    title: {
                        text: 'Highcharts drawing ' + n + ' points'
                    },
                    subtitle: {
                        text: 'Using the Boost module'
                    },
                    tooltip: {
                        valueDecimals: 2
                    },
                    series: [{
                        data: data,
                        lineWidth: 0.5
                    }]
                };

                Highcharts.chart(csMeasureCurveUiPrefix + bureauId, curve);

                return curve;
            },

            startUi () {
                this.showLineBoost(7);
                this.showLineBoost(8);
            },

            stopUi () {
            },

        },

        computed: {

        },

        created() {
        },

        mounted() {
            this.startUi();
        },

        beforeDestroy() {
            this.stopUi();
        },
    }

</script>

<style>
</style>
