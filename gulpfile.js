const isWin = /^win/.test(process.platform);
const fs = require('fs');
const join = require('path').join;
const execSync = require('child_process').execSync;
const gulp = require("gulp");
const minifyCss = require('gulp-minify-css');//压缩CSS为一行；
const htmlmin = require('gulp-htmlmin');//html压缩组件
const gulpRemoveHtml = require('gulp-remove-html');//标签清除
const removeEmptyLines = require('gulp-remove-empty-lines');//清除空白行
const buildBasePath = 'dist/';//构建输出的目录
const config = require('./package');
const allowToChangeInstallationDirectory = true; //是否允许用户修改安装为位置
let nConf = {//基础配置
    'app-assembly': [], 'app-views': [], 'dialog-assembly': [], 'dialog-views': [],'menu-assembly': [], 'menu-views': [],
    "themeColor": "#333333", //主题色
    "appUrl": "http://127.0.0.1:3000/", //程序主访问地址
    "socketUrl": "http://127.0.0.1:3000/",// 程序socket访问地址
    "updateUrl": "http://127.0.0.1:3000/", //更新地址
    "updateFileUrl": "http://127.0.0.1:3000/public/dist/", //更新文件地址
    "appSize": [800, 500],
    "dialogSize": [400, 150],
    "menuSize": [60, 70]
};

// 下载compiler.jar(http://dl.google.com/closure-compiler/compiler-latest.zip)
function findSync(startPath) {
    let result = [];

    function finder(path) {
        let files = fs.readdirSync(path);
        files.forEach((val, index) => {
            let fPath = join(path, val);
            let stats = fs.statSync(fPath);
            if (stats.isDirectory()) finder(fPath);
            if (stats.isFile()) result.push(fPath);
        });
    }

    finder(startPath);
    return result;
}

const checkDirExist = (folderpath) => {
    const pathArr = folderpath.split(isWin ? '\\' : '/');
    let _path = '';
    for (let i = 0; i < pathArr.length; i++) {
        if (pathArr[i]) {
            _path += `${i === 0 ? '' : '/'}${pathArr[i]}`;
            if (!fs.existsSync(_path)) {
                fs.mkdirSync(_path);
            }
        }
    }
};

//读取文件，并且替换文件中指定的字符串
const replaceFile = (filePath, sourceRegx, targetStr) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            return err;
        }
        let str = data.toString();
        str = str.replace(sourceRegx, targetStr);
        fs.writeFile(filePath, str, (err) => {
            if (err) return err;
        });
    });
};

gulp.task('retrieval', async () => {
    //app
    fs.readdirSync('src/main/views/app/vh').forEach((element) => {
        nConf["app-assembly"].push('../views/app/vh/' + element);
    });
    fs.readdirSync('src/main/views/app').forEach((element) => {
        if (element !== 'vh') {
            let {keepAlive} = require('./src/main/views/app/' + element);
            nConf["app-views"].push({keepAlive, v: '../views/app/' + element});
        }
    });
    //dialog
    fs.readdirSync('src/main/views/dialog/vh').forEach((element) => {
        nConf["dialog-assembly"].push('../views/dialog/vh/' + element);
    });
    fs.readdirSync('src/main/views/dialog').forEach((element) => {
        if (element !== 'vh') {
            let {keepAlive} = require('./src/main/views/dialog/' + element);
            if (keepAlive === undefined) keepAlive = true;
            nConf["dialog-views"].push({keepAlive, v: '../views/dialog/' + element});
        }
    });
    //menu
    fs.readdirSync('src/main/views/menu/vh').forEach((element) => {
        nConf["menu-assembly"].push('../views/menu/vh/' + element);
    });
    fs.readdirSync('src/main/views/menu').forEach((element) => {
        if (element !== 'vh') {
            let {keepAlive} = require('./src/main/views/menu/' + element);
            if (keepAlive === undefined) keepAlive = true;
            nConf["menu-views"].push({keepAlive, v: '../views/menu/' + element});
        }
    });

    fs.writeFileSync(__dirname + '/src/main/config.json', JSON.stringify(nConf));
    config.build.publish = [{
        "provider": "generic",
        "url": nConf.updateUrl
    }]
    config.build.nsis.allowToChangeInstallationDirectory = allowToChangeInstallationDirectory;
    fs.writeFileSync('./package.json', JSON.stringify(config));
});

gulp.task('compress', async () => {
    //cfg
    gulp.src(['src/main/**/*.json', 'src/main/**/*.ico'])
        .pipe(gulp.dest(buildBasePath));
    //css
    gulp.src('src/main/**/*.css')
        .pipe(minifyCss())//压缩css到一样
        .pipe(gulp.dest(buildBasePath));//输出到css目录
    //js
    gulp.src('src/main/**/*.min.js')
        .pipe(gulp.dest(buildBasePath));


    if (isWin) {
        // Closure Compiler-Win
        for (let i of findSync(__dirname + '/src/main')) {
            i = i.replace(__dirname + '\\src\\main', '');
            if (i.indexOf('config.json') < 0 && /^((?!js).*)js/.test(i) && !/^((?!min.js).*)min.js/.test(i)) {
                let dUrl = __dirname + '\\dist' + i;
                checkDirExist(dUrl.slice(0, dUrl.lastIndexOf('\\')));
                if (fs.existsSync(dUrl)) fs.unlinkSync(dUrl);
                let javaExe = "D:\\Program Files\\idea\\jbr\\bin\\java";
                execSync(`"${javaExe}" -jar closure-compiler-v20200406.jar --js ${'src/main' + i} --js_output_file ${'dist' + i} --language_in=ECMASCRIPT_2018 --language_out=ECMASCRIPT_2018 --compilation_level=SIMPLE --jscomp_warning=* --env=CUSTOM --module_resolution=NODE`, {cwd: process.cwd()});
            }
        }
    } else {
        // Closure Compiler-Linux
        for (let i of findSync(__dirname + '/src/main')) {
            i = i.replace(__dirname + '/src/main', '');
            if (i.indexOf('config.json') < 0 && /^((?!js).*)js/.test(i) && !/^((?!min.js).*)min.js/.test(i)) {
                let dUrl = __dirname + '/dist' + i;
                checkDirExist(dUrl.slice(0, dUrl.lastIndexOf('/')));
                if (fs.existsSync(dUrl)) fs.unlinkSync(dUrl);
                let javaExe = "/lib/idea/jbr/bin/java";
                execSync(`"${javaExe}" -jar closure-compiler-v20200406.jar --js ${'src/main' + i} --js_output_file ${'dist' + i} --language_in=ECMASCRIPT_2018 --language_out=ECMASCRIPT_2018 --compilation_level=SIMPLE --jscomp_warning=* --env=CUSTOM --module_resolution=NODE`, {cwd: process.cwd()});
            }
        }
    }

    //html
    gulp.src('src/main/**/*.html')
        .pipe(gulpRemoveHtml())//清除特定标签
        .pipe(removeEmptyLines({removeComments: true}))//清除空白行
        .pipe(htmlmin({
            removeComments: true,//清除HTML注释
            collapseWhitespace: true,//压缩HTML
            collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
            minifyJS: true,//压缩页面JS
            minifyCSS: true//压缩页面CSS
        }))
        .pipe(gulp.dest(buildBasePath));

    //写入nsis
    let nsh = "; Script generated by the HM NIS Edit Script Wizard.\n" +
        "\n" +
        "; HM NIS Edit Wizard helper defines custom install default dir\n" +
        "!macro preInit\n" +
        "    SetRegView 64\n" +
        "    WriteRegExpandStr HKLM \"${INSTALL_REGISTRY_KEY}\" InstallLocation \"C:\\" + config.name + "\"\n" +
        "    WriteRegExpandStr HKCU \"${INSTALL_REGISTRY_KEY}\" InstallLocation \"C:\\" + config.name + "\"\n" +
        "    SetRegView 32\n" +
        "    WriteRegExpandStr HKLM \"${INSTALL_REGISTRY_KEY}\" InstallLocation \"C:\\" + config.name + "\"\n" +
        "    WriteRegExpandStr HKCU \"${INSTALL_REGISTRY_KEY}\" InstallLocation \"C:\\" + config.name + "\"\n" +
        "!macroend";

    //写入nsis  appData目录
    // let nsh = "; Script generated by the HM NIS Edit Script Wizard.\n" +
    //     "\n" +
    //     "; HM NIS Edit Wizard helper defines custom install default dir\n" +
    //     "!macro preInit\n" +
    //     "    SetRegView 64\n" +
    //     "    WriteRegExpandStr HKLM \"${INSTALL_REGISTRY_KEY}\" InstallLocation \"$LOCALAPPDATA\\" + config.name + "\"\n" +
    //     "    WriteRegExpandStr HKCU \"${INSTALL_REGISTRY_KEY}\" InstallLocation \"$LOCALAPPDATA\\" + config.name + "\"\n" +
    //     "    SetRegView 32\n" +
    //     "    WriteRegExpandStr HKLM \"${INSTALL_REGISTRY_KEY}\" InstallLocation \"$LOCALAPPDATA\\" + config.name + "\"\n" +
    //     "    WriteRegExpandStr HKCU \"${INSTALL_REGISTRY_KEY}\" InstallLocation \"$LOCALAPPDATA\\" + config.name + "\"\n" +
    //     "!macroend";
    fs.writeFileSync(__dirname + '/src/resources/script/installer.nsh', nsh);

});
