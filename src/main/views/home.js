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
           <div>更新列表</div>
           <ul><li v-for="(v,index) in listData">
                   <div>{{v.name}}</div>
                   <div  v-for="(i,indez) in v.list"><a :href="i">{{i}}下载</a></div>
                   <button  @click="Downer(v)" class="button">全部下载</button>
               </li>
            </ul>
        </div>`,
        created() {
            fetch('https://www.tw.playblackdesert.com/News/Notice/Detail?boardNo=1579&countryType=zh-TW')
                .then(e => e.text())
                .then(e => {
                    try {
                        let start = e.indexOf('<body>');
                        let end = e.indexOf('</body>');
                        let el = document.createElement('html');
                        el.innerHTML = e.substring(start, end);
                        let cont = el.getElementsByClassName('contents_area')[0];
                        let data = [];
                        for (let i of cont.getElementsByTagName('table')) {
                            let item = {
                                name: '',
                                list: []
                            };
                            for (let t of i.previousSibling.previousSibling.getElementsByTagName('strong')) {
                                item.name += t.innerText;
                            }
                            for (let s of i.getElementsByTagName('a')) {
                                item.list.push(s.getAttribute('href'));
                            }
                            data.push(item);
                        }
                        console.log(data);
                        this.listData = data;
                    } catch (e) {
                        console.log(e);
                    }
                })
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
            Downer(v) {
                for (let i of v.list) {
                    this.download(i.substring(i.lastIndexOf('/')), i);
                }
            },
            download(name, href) {
                let a = document.createElement("a"), //创建a标签
                    e = document.createEvent("MouseEvents"); //创建鼠标事件对象
                e.initEvent("click", false, false); //初始化事件对象
                a.href = href; //设置下载地址
                a.download = name; //设置下载文件名
                a.dispatchEvent(e); //给指定的元素，执行事件click事件
            }
        }
    }
};