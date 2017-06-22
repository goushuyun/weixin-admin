import axios from "../../scripts/http"

export default {
	methods : {
		// handle pagination size change
		on_size_change(size){
			this.size = size
			this.getData()
		},

		// handle pagination current change
		on_current_change(current){
			this.page = current
			this.getData()
		},

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
					// moment of upload at
    				upload.create_at_text = moment.unix(upload.create_at).format('YYYY-MM-DD HH:mm:ss')

					// tip text
					switch (upload.state) {
						case 1:
							upload.tip_text = '正在上传'
							break;
						case 2:
							upload.tip_text = '上传失败'
							break;
						case 3:
							upload.tip_text = '上传完成'
							break;
						default:
					}
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
