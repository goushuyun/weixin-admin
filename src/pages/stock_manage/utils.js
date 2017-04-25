function handleLocation(locations) {
    locations.forEach(d => {
        d.value = d.id
        d.label = d.name
        if (d.children.length > 0) {
            d.children.forEach(s => {
                s.value = s.id
                s.label = s.name
                if (s.children.length > 0) {
                    s.children.forEach(f => {
                        f.value = f.id
                        f.label = f.name
                        delete f.children
                        return f
                    })
                } else {
                    delete s.children
                }
                return s
            })
        } else {
            delete d.children
        }
        return d
    })
    return locations
}

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

function handleGoodsLocation(total_locations, goods_locations) {
    var stores = total_locations
    var temp_locations = []
    var store
    //遍历stores
    for (var i = 0; i < stores.length; i++) {
        store = stores[i]
        //遍历shelfs
        var shelfs = store.children
        if (shelfs == undefined) {
            continue
        }
        for (var j = 0; j < shelfs.length; j++) {
            var shelf = shelfs[j]
            //遍历 floors
            var floors = shelf.children
            if (floors == undefined) {
                continue
            }
            for (var k = 0; k < floors.length; k++) {
                var floor = floors[k]
                for (var m = 0; m < goods_locations.length; m++) {
                    if (goods_locations[m].floor_id == floor.value) {
                        if (store.value == undefined || shelf.value == undefined || floor.value == undefined) {
                            continue
                        }
                        var temp_location = {
                            "id": goods_locations[m].id, //货架id
                            "storehouse_id": store.value, //仓库id
                            "shelf_id": shelf.value, //货架id
                            "floor_id": floor.value,
                            location_str: store.label + '-' + shelf.label + '-' + floor.label
                        }
                        temp_locations.push(temp_location)
                    }
                }
            }
        }
    }
    return temp_locations
}

export {
    handleLocation,
    checkLocation,
    getLocationLabel,
    handleGoodsLocation
}
