'use strict';
module.exports = {
    lib: [],
    main: {
        data() {
            return {
                count: 0,
                date: new Date(),
                test: '',
                test_show: false
            }
        },
        template: `<div class="subclass">
        <h4>{{date}}</h4>
        <transition name="fade">
        <img v-if="test_show" width="100%;" :src="test">
        </transition>
        </div>`,
        created() {
            //首次加载
            this.r = setInterval(() => {
                this.date = new Date();
            }, 1000);
           setInterval(()=>{
               fetch('https://picsum.photos/950/400').then(e => e.blob()).then(blob => {
                   this.test_show = false;
                   let reader = new FileReader();
                   reader.readAsDataURL(blob);
                   reader.onload = (e) => {
                       this.test = e.target.result;
                       this.test_show = true;
                   }
               });
           },10000)
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