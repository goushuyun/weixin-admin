import axios from "../../scripts/http"

export default {
	methods : {
		view_detail(index) {
			this.dialog_data = this.data[index]
			this.dialog_show = true
		},

		// to upload excel
		to_upload() {
			this.$router.push({name: 'upload_excel'})
		},

		// get page data
		getData() {
            let params = {
    			page: this.page,
    			size: this.size
    		}
    		axios.post('/v1/goods/batch_list', params).then(res => {
    			this.data = res.data.data.map(upload => {
    				upload.create_at_text = moment.unix(upload.create_at).format('YYYY-MM-DD HH:mm:ss')
    				return upload
    			})

    			this.total = res.data.total_count
    		})
        },

        // download file by url
        download(url){
            console.log(url);
            window.location.href = url
        }

	},
	created() {
		// get excel list
		this.getData()
	}
}
