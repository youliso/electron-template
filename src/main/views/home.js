'use strict';
module.exports = {
    lib: [],
    main: {
        data() {
            return {
                count: 0,
                date: new Date()
            }
        },
        template: `<div class="subclass">

        <h4>{{date}}</h4>
        <button @click="ssa">切换到登录</button>  
        <button @click="tks">测试弹框</button>  
        </div>`,
        created() {
            //首次加载
            this.r = setInterval(() => {
                this.date = new Date();
            }, 1000);
        },
        beforeDestroy() {
            //卸载
            clearInterval(this.r);
        },
        activated() {
            //开启缓存后 切换加载
        },
        deactivated() {
            //开启缓存后 切换卸载
        },
        methods: {
            async ssa() {
                await this.$parent.switchComponent('app-login');
            },
            tks() {
                const ipAPI = 'https://api.ipify.org?format=json';

                Swal.queue([{
                    title: 'Your public IP',
                    confirmButtonText: 'Show my public IP',
                    text:
                        'Your public IP will be received ' +
                        'via AJAX request',
                    showLoaderOnConfirm: true,
                    preConfirm: () => {
                        return fetch(ipAPI)
                            .then(response => response.json())
                            .then(data => Swal.insertQueueStep(data.ip))
                            .catch(() => {
                                Swal.insertQueueStep({
                                    icon: 'error',
                                    title: 'Unable to get your public IP'
                                })
                            })
                    }
                }])
            }
        }
    }
};