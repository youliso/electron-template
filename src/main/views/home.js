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

        }
    }
};