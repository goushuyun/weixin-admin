import axios from '../../../scripts/http'

export default {
    mounted() {


    },


    methods: {
        addMarker(vm, poi){
            let marker = {
                name: poi.name,
                loc: [poi.lng, poi.lat]
            }
            vm.markers.push(marker);
            vm.center = market.loc;
        },
        confirm() {
            console.log(this.pointer);
            this.visible = false

            this.pointer.express_fee *= 100
            if (this.pointer.id != '') {
                // update school
                axios.post('/v1/school/update', this.pointer).then(res => {
                    console.log(res.data);
                })
            } else {
                // add new school
                axios.post('/v1/school/add', this.pointer).then((res) => {
                    console.log(res.data);
                })
            }

            this.list_school()
        },

        list_school() {
            axios.post('/v1/school/store_schools', {}).then(res => {
                console.log(res.data);
                this.schools = res.data.data.map(school => {
                    school.active = false
                    return school
                })
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



        }
    }
}
