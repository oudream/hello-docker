<template>
    <div>
        <el-row v-for="(filter, index) in filters">
            <section v-if="filter.fields.length === 1">
                {{filter.fields[0].label}}
                <section v-if="filter.operations.length === 1">
                    {{filter.operations[0].label}}
                </section>
                <section v-else>
                    <el-select v-model="filter.operationValue" clearable placeholder="OP" style="width: 80px">
                        <el-option
                                v-for="(operation, ind) in filter.operations"
                                :key="operation.value"
                                :label="operation.label"
                                :value="operation.value"
                                :disabled="operation.disabled">
                        </el-option>
                    </el-select>
                </section>
                <section v-if="">

                </section>
                <el-input v-model="filter.value" placeholder=""></el-input>
                {{filter.isAnd ? "And" : "Or"}}
            </section>
            <section v-else>
                <el-select v-model="filter.fieldValue" clearable placeholder="查询的属性" style="width: 130px" @change="handleFilterChange(index)">
                    <el-option
                            v-for="(field, ind) in filter.fields"
                            :key="field.value"
                            :label="field.label"
                            :value="field.value"
                            :disabled="field.disabled">
                    </el-option>
                </el-select>
                <el-select v-model="filter.operationValue" clearable placeholder="OP" style="width: 80px">
                    <el-option
                            v-for="(operation, ind) in filter.operations"
                            :key="operation.value"
                            :label="operation.label"
                            :value="operation.value"
                            :disabled="operation.disabled">
                    </el-option>
                </el-select>
                <el-input v-model="filter.value" placeholder=""></el-input>
                <section v-if="index < filters.length-1">
                    {{filter.isAnd ? "And" : "Or"}}
                </section>
            </section>
        </el-row>
        <el-button type="primary" v-on:click="handleFilter">查询</el-button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                filters: [
                    {
                        fields: [
                            {value: 'ManID', label: '品牌'}
                        ],
                        fieldValue: '',
                        operations: [
                            {value: '=', label: '='}
                        ],
                        operationValue: '',
                        value: '',
                        isAnd: true,
                    },
                    {
                        fields: [
                            {value: 'Time', label: '时间'}
                        ],
                        fieldValue: '',
                        operations: [
                            {value: '=', label: '='},
                            {value: '>', label: '>'},
                            {value: '<', label: '<'}
                        ],
                        operationValue: '',
                        value: '',
                        isAnd: true,
                    },
                    {
                        fields: [
                            {value: 'ModelName', label: '模型名称'},
                            {value: 'Height', label: '身高'},
                        ],
                        fieldValue: '',
                        operations: [],
                        operationValue: '',
                        value: '',
                        isAnd: true,
                    }
                ]
            }
        },

        methods: {
            handleFilterChange(index){
                let filters = this.filters;
                let filter = filters[index];
                if (filter.fieldValue === 'Height') {
                    filter.operations = [
                        {value: '=', label: '='},
                        {value: '>', label: '>'}
                    ];
                } else {
                    filter.operations = [
                        {value: '=', label: '='}
                    ];
                }
            },

            handleFilter(){
                for (let i = 0; i < this.filters.length; i++) {
                    let filter = this.filters[i];
                    if (filter.fields.length === 1) {
                        console.log(filter.fields[0].value, ' - ', filter.operations[0].value, ' - ', filter.value);
                    } else {
                        console.log(filter.fieldValue, ' - ', filter.operationValue, ' - ', filter.value);
                    }
                }
            }
        },

        components: {
        }
    }
</script>

<style>
    .short{
        width: 120px!important;
    }
</style>
