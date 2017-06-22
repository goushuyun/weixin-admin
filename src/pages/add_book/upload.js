import axios from "../../scripts/http"

export default {
	created() {
		this.store = JSON.parse(localStorage.getItem('store'))

		// while page load, get token data
		this.getToken()

	},
	mounted() {
		//handle location
		axios.post('/v1/location/list_children_location', {level: 3}).then(res => {
			this.location_options = JSON.parse(JSON.stringify(res.data.data).replace(/id/g, 'value').replace(/name/g, 'label').replace(/,"children":\[\]/g, ''))
		})
	},
	methods : {
		// trigger after upload success
		on_upload_success(){
			this.getToken()
		},
		on_upload_error(){
			this.getToken()
		},
		pre_check(file) {
			// check file type
			if (file.type.indexOf('sheet') < 0 || file.name.indexOf('xlsx') < 0) {
				this.$message({type: 'warning', message: '文件格式错误，必须为 .xlsx 格式的文件'})
				return false
			}

			this.origin_filename = file.name
		},

		upload_to_cloud(formName) {
			// check ruleForm
			this.$refs[formName].validate((valid)=>{
				if(valid){
					if(this.origin_filename == '' || this.origin_file == ''){
						this.$message({
							type: 'warning',
							message: '请上传 Excel 文件 ！'
						})
						return
					}

					this.is_uploading = true

					let params = {
						discount: this.ruleForm.discount,
						storehouse_id: this.ruleForm.location[0],
						shelf_id: this.ruleForm.location[1],
						floor_id: this.ruleForm.location[2],
						origin_filename: this.origin_filename,
						origin_file: this.upload_params.url,
						type: this.ruleForm.type
					}

					axios.post('/v1/goods/batch_upload', params).then(res=>{
						console.log(res.data);
						this.$message('提交成功！')
						// go to list page
						this.$router.replace({name: 'by_excel'})
					})
				}
			})

		},

		go_back() {
			this.$router.go(-1)
		},
		getToken() {
			this.upload_params.key = 'tmp_30days/' +
				'store_' + this.store.id + '/upload_excel_' + moment().unix() + '.xlsx'

			axios.post('/v1/mediastore/get_upload_token', this.upload_params).then(res => {
				this.upload_params.token = res.data.data.token
				this.upload_params.url = res.data.data.url
			})
		}
	}
}
