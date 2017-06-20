export default {
    methods: {
        view_detail(){
            this.dialog_show = true
        },

        // to upload excel
        to_upload(){
            this.$router.push({name: 'upload_excel'})
        }


    }
}
