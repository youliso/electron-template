'use strict';
class $fetch {
    constructor(url) {
        this.url = url;
    }

    get(url, is) {
        return new Promise((resolve, reject) => {
            fetch(!is ? this.url + url : url)
                .then(res => res.json())
                .then(data => resolve(data))
                .catch(err => reject(err))

        })
    }

    // post方式
    post(url, data, is) {
        return new Promise((resolve, reject) => {
            fetch(!is ? this.url + url : url, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(data => resolve(data))
                .catch(err => reject(err))

        })
    }


    //put 修改
    put(url, data, is) {
        return new Promise((resolve, reject) => {
            fetch(!is ? this.url + url : url, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(data => resolve(data))
                .catch(err => reject(err))

        })
    }

    //delete
    delete(url, data, is) {
        return new Promise((resolve, reject) => {
            fetch(!is ? this.url + url : url, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(data => resolve('数据删除成功!'))
                .catch(err => reject(err))
        })
    }
}

module.exports = $fetch;