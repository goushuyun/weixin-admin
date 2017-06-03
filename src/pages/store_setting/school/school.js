import axios from '../../../scripts/http'

export default {
    created(){
    },
    mounted() {
        this.getData()
    },
    methods: {


        del_school(id) {
            this.$confirm('此操作将永久删除该学校, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.post('/v1/school/del', {
                    id
                }).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getData()
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
        },
        // change map's center
        changeCenter(center) {
            console.log(center);
            this.map.setCenter(center)
        }

    }
}
