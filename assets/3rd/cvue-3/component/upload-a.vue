<template>
    <el-dialog
            :title="title"
            :visible.sync="visible_d"
            top="1vh"
            width=390px
            v-dialog-drag
            append-to-body>
        <el-upload
                class="avatar-uploader"
                action="/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl_d" :src="imageUrl_d" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <!-- operate toolbar on bottom -->
        <div style="display: flex; flex-direction: column; align-items: center; margin: 10px; margin-top: 30px">
            <div>
                <el-button type="danger" @click="handleSubmit" :disabled="!Boolean(this.imageFileName_d)">确认选择</el-button>
                <el-button type="danger" @click="handleEmpty">空白返回</el-button>
                <el-button type="danger" @click="handleCancel">取　消</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 300px;
        height: 300px;
        line-height: 300px;
        text-align: center;
    }

    .avatar {
        width: 300px;
        height: 300px;
        display: block;
    }
</style>

<script>
    export default {
        props: {
            title: {
                type: String,
                required: true
            },
            visible: {
                type: Boolean,
                default: false
            },
            imageFileName: {
                type: String
            },
            returnAttach: {
                type: Object
            }
        },

        data() {
            return {
                imageFileName_d: '',
                imageUrl_d: '',
                visible_d: false,
            };
        },

        methods: {
            init() {
                this.imageFileName_d = '';
                this.imageUrl_d = '';
            },

            handleAvatarSuccess(res, file) {
                if (res && file) {
                    // this.imageUrl_d = URL.createObjectURL(file.raw);
                    this.imageFileName_d = res;
                    this.imageUrl_d = "/static/images/" + res;
                }
            },

            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },

            handleSubmit() {
                this.$emit('submit', this.imageFileName_d, this.returnAttach);
                this.visible_d = false;
            },

            handleEmpty() {
                this.$emit('submit', "", this.returnAttach);
                this.visible_d = false;
            },

            handleCancel() {
                this.visible_d = false;
            }
        },

        watch: {
            title(nv, ov) {
                // this.clear();
                this.init();
            },

            visible(nv, ov) {
                this.visible_d = nv;
            },

            imageFileName(nv, ov) {
                this.imageFileName_d = nv;
                this.imageUrl_d = "/static/images/" + nv;
            },

            visible_d(nv, ov) {
                this.$emit("update:visible", nv);
                // console.log('visible_d:', nv);
            }
        }
    }
</script>
