'use strict';
module.exports = {
    lib: [],
    main: {
        data() {
            return {
                listData: []
            }
        },
        template: `<div class="subclass">
           <h4>demo</h4>
        </div>`,
        created() {
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
        methods: {}
    }
};