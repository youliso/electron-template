'use strict';
module.exports = {
    lib: [],
    main: {
        data() {
            return {
                count: 0,
                date: new Date(),
                test: ''
            }
        },
        template: `<div class="subclass">
        <h4>{{date}}</h4>
        <img :src="test">
        </div>`,
        created() {
            //首次加载
            this.r = setInterval(() => {
                this.date = new Date();
            }, 1000);
            fetch('https://picsum.photos/200').then(e => e.blob()).then(blob => {
                let reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onload = (e) => {
                    this.test = e.target.result;
                }
            });
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