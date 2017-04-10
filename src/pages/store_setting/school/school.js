import axios from '../../../scripts/http'

export default {
    created(){
    },
    mounted() {
        this.getData()
    },
    methods: {
        confirm(ruleForm) {
            this.$refs[ruleForm].validate(valid=>{
                if(!valid){
                    return false
                }else{
                    console.log(this.school);
                    this.school.tel = this.ruleForm.tel
                    this.school.express_fee = this.ruleForm.express_fee

                    this.visible = false

                    this.school.express_fee *= 100
                    if (this.school.id != '') {
                        // update school
                        axios.post('/v1/school/update', this.school).then(res => {
                            console.log(res.data);
                        })
                    } else {
                        // add new school
                        axios.post('/v1/school/add', this.school).then((res) => {
                            console.log(res.data);
                        })
                    }

                    this.getData()
                }
            })


        },

        del_school(id) {
            this.$confirm('此操作将永久删除该学校, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.post('/v1/school/delete', {
                    id
                }).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    console.log(res.data);
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // list all schools
        getData(){
            axios.post('/v1/school/store_schools', {}).then(res=>{
                this.schools = res.data.data.map(el=>{
                    el.active = false
                    return el
                })
                console.log(res);
            })
        }

    }
}
