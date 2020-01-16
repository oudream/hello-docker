<template>
    <section>
        <table id="main-svg" class="main-svg">
            <tr>
                <td style="width: 90%">
                    <table>
                        <tr>
                            <td class="td-rtdata">
                                <div id="div-rtdata-11">
                                </div>
                            </td>
                            <td class="td-rtdata">
                                <div id="div-rtdata-12">
                                </div>
                            </td>
                            <td class="td-rtdata">
                                <div id="div-rtdata-13">
                                </div>
                            </td>
                            <td class="td-rtdata">
                                <div id="div-rtdata-14">
                                </div>
                            </td>
                            <td class="td-rtdata">
                                <div id="div-rtdata-15">
                                </div>
                            </td>
                            <td class="td-rtdata">
                                <div id="div-rtdata-16">
                                </div>
                            </td>
                            <td class="td-rtdata">
                                <div id="div-rtdata-17">
                                </div>
                            </td>
                        </tr>
                        <tr>
                        <td class="td-rtdata">
                            <div id="div-rtdata-21">
                            </div>
                        </td>
                        <td class="td-rtdata">
                            <div id="div-rtdata-22">
                            </div>
                        </td>
                        <td class="td-rtdata">
                            <div id="div-rtdata-23">
                            </div>
                        </td>
                        <td class="td-rtdata">
                            <div id="div-rtdata-24">
                            </div>
                        </td>
                        <td class="td-rtdata">
                            <div id="div-rtdata-25">
                            </div>
                        </td>
                        <td class="td-rtdata">
                            <div id="div-rtdata-26">
                            </div>
                        </td>
                        <td class="td-rtdata">
                            <div id="div-rtdata-27">
                            </div>
                        </td>
                        </tr>
                        <tr>
                            <td class="td-rtdata">
                                <div id="div-rtdata-31">
                                </div>
                            </td>
                            <td class="td-rtdata">
                                <div id="div-rtdata-32">
                                </div>
                            </td>
                            <td class="td-rtdata">
                                <div id="div-rtdata-33">
                                </div>
                            </td>
                            <td class="td-rtdata">
                                <div id="div-rtdata-34">
                                </div>
                            </td>
                            <td class="td-rtdata">
                                <div id="div-rtdata-35">
                                </div>
                            </td>
                            <td class="td-rtdata">
                                <div id="div-rtdata-36">
                                </div>
                            </td>
                            <td class="td-rtdata">
                                <div id="div-rtdata-37">
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="td-rtdata">
                                <div id="div-rtdata-41">
                                </div>
                            </td>
                            <td class="td-rtdata">
                                <div id="div-rtdata-42">
                                </div>
                            </td>
                            <td class="td-rtdata">
                                <div id="div-rtdata-43">
                                </div>
                            </td>
                            <td class="td-rtdata">
                                <div id="div-rtdata-44">
                                </div>
                            </td>
                            <td class="td-rtdata">
                                <div id="div-rtdata-45">
                                </div>
                            </td>
                            <td class="td-rtdata">
                                <div id="div-rtdata-46">
                                </div>
                            </td>
                            <td class="td-rtdata">
                                <div id="div-rtdata-47">
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="td-rtdata">
                                <div id="div-rtdata-51">
                                </div>
                            </td>
                            <td class="td-rtdata">
                                <div id="div-rtdata-52">
                                </div>
                            </td>
                            <td class="td-rtdata">
                                <div id="div-rtdata-53">
                                </div>
                            </td>
                            <td class="td-rtdata">
                                <div id="div-rtdata-54">
                                </div>
                            </td>
                            <td class="td-rtdata">
                                <div id="div-rtdata-55">
                                </div>
                            </td>
                            <td class="td-rtdata">
                                <div id="div-rtdata-56">
                                </div>
                            </td>
                            <td class="td-rtdata">
                                <div id="div-rtdata-57">
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="width:10%">
                   <tr style="height: 70%">
                        <div id="div-huizong">
                        </div>
                   </tr>
                    <tr style="height: 30%">
                        <div id="div-tuli">
                        </div>
                    </tr>
                 </td>
            </tr>
        </table>
    </section>
</template>

<script>

    import $ from 'jquery'
    import * as d3 from 'd3'
//    import Highcharts from 'highcharts'

    export default {
        methods: {
            loadSvg (id, filename,m) {
                fetch('/static/svg/' + filename).then(data => data.text()).then(data => {

                    if(m){
           //             根据配置替换id
                        for (let k in m){
                            data = data.replace(k,m[k]);
                        }
                    }

                    let ele = window.document.querySelector(id);
                    if (ele) {
                        window.document.querySelector(id).innerHTML = data;
                    }
                    this.startUi();
                }).then()
            },

            startUi () {
                this.resIndex++;
                if (this.resIndex === this.resCount) {
                    this.svgContianer = window.document.querySelector('#main-svg');
                    gcl.gis.ind.startView(this.svgContianer);
                    gcl.gis.comp.startView(this.svgContianer);
                }
            },

            stopUi () {
                gcl.gis.ind.stopView(this.svgContianer);
                gcl.gis.comp.stopView(this.svgContianer);
            },
        },

        created() {
            window.$ = $;
            window.d3 = d3;
//            window.Highcharts = Highcharts;

            this.resCount = 37;
            this.resIndex = 0;

            for(let i=1;i<=5;i++)
            {
                for (let j=1;j<=7;j++)
                {
                    let v = '#div-rtdata-'+i.toString()+j.toString();
                    let k = 256*(i-1)+16*(j-1);
                    let base1 = 0x1000;
                    let base0 = 0x0000;
                    let m = {
                        rt_0001:'m__0x01'+((base0+k+0).toString(16)).padStart(6,'0')+"__m",
                        rt_0002:'m__0x01'+((base1+k+0).toString(16)).padStart(6,'0')+"__m",
                        rt_0003:'m__0x01'+((base0+k+1).toString(16)).padStart(6,'0')+"__m",
                        rt_0004:'m__0x01'+((base1+k+1).toString(16)).padStart(6,'0')+"__m",
                        rt_0005:'m__0x01'+((base0+k+2).toString(16)).padStart(6,'0')+"__m",
                        rt_0006:'m__0x01'+((base1+k+2).toString(16)).padStart(6,'0')+"__m",
                        //上层名字及状态
                        rt_0011:'m__0x03'+((base0+k+0).toString(16)).padStart(6,'0')+"__m",
                        rt_0012:'m__0x02'+((base0+k+0).toString(16)).padStart(6,'0')+"__m",
                        rt_0013:'m__0x03'+((base0+k+1).toString(16)).padStart(6,'0')+"__m",
                        rt_0014:'m__0x02'+((base0+k+1).toString(16)).padStart(6,'0')+"__m",
                        rt_0015:'m__0x03'+((base0+k+2).toString(16)).padStart(6,'0')+"__m",
                        rt_0016:'m__0x02'+((base0+k+2).toString(16)).padStart(6,'0')+"__m",
                        //名称
                        rt_0007:'m__0x03'+((base0+k+3).toString(16)).padStart(6,'0')+"__m",
                    };
                    this.loadSvg(v, 'cabinet.svg',m);
                }
            }
            //加载汇总
            this.loadSvg('#div-huizong', 'huizong.svg');
            //加载图例
            this.loadSvg('#div-tuli', 'tuli.svg');
        },

        mounted() {

        },

        beforeDestroy() {
            this.stopUi();
        },
    }


    // $(document).ready(function () {
    // });


</script>

<style>
    .main-svg{
        /*background-image: url(../../img/bg.jpg);*/
        /*background-size: 100%,100%;*/
    }

    .td-rtdata {
        position: relative;
        display: inline-block;
        /*border-bottom: 1px dotted black;*/
        border-bottom: 1px;
    }

    .td-rtdata .tooltiptext {
        visibility: hidden;
        width: 250px;
        background-color: lightgrey;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px 0;
        /* 定位 */
        position: absolute;
        z-index: 1;
    }

    .td-rtdata:hover .tooltiptext {
        visibility: visible;
    }
</style>
