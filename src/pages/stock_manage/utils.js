// 检查是否已经存在该货架位
function checkLocation(locations, floor_id) {
    var result = false
    if (locations.length > 0) {
        locations.forEach(st => {
          if (st.floor_id == floor_id) {
            result = true
          }
        })
    }
    return result
}

// 获取货架位的中文字符串
function getLocationLabel(locations, val) {
    var location = ''
    locations.forEach(st => {
        if (st.value == val[0]) {
            location += st.name
            location += '-'
            if (st.children) {
                st.children.forEach(sh => {
                    if (sh.value == val[1]) {
                        location += sh.name
                        location += '-'
                        if (sh.children) {
                            sh.children.forEach(fl => {
                                if (fl.value == val[2]) {
                                    location += fl.name
                                }
                            })
                        }
                    }
                })
            }
        }
    })
    return location
}
export {
    checkLocation,
    getLocationLabel
}
