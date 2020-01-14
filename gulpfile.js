const gulp = require("gulp");
const minifyCss = require('gulp-minify-css');//压缩CSS为一行；
const htmlmin = require('gulp-htmlmin');//html压缩组件
const gulpRemoveHtml = require('gulp-remove-html');//标签清除
const removeEmptyLines = require('gulp-remove-empty-lines');//清除空白行
const js_obfuscator = require('gulp-js-obfuscator');//js压缩混淆
const babel = require("gulp-babel");
const buildBasePath = 'dist/';//构建输出的目录

gulp.task('compress', async () => {
    //cfg
    gulp.src('src/main/**/*.json')
        .pipe(gulp.dest(buildBasePath));
    //css
    gulp.src('src/main/**/*.css')
        .pipe(minifyCss())//压缩css到一样
        .pipe(gulp.dest(buildBasePath));//输出到css目录
    //js
    gulp.src('src/main/**/*.min.js')
        .pipe(gulp.dest(buildBasePath));
    //js
    //h
    let h_opt_js = {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 1,
        debugProtection: true,
        debugProtectionInterval: true,
        disableConsoleOutput: true,
        identifierNamesGenerator: 'hexadecimal',
        log: false,
        renameGlobals: false,
        rotateStringArray: true,
        selfDefending: true,
        splitStrings: true,
        splitStringsChunkLength: '5',
        stringArray: true,
        stringArrayEncoding: 'rc4',
        stringArrayThreshold: 1,
        transformObjectKeys: true,
        unicodeEscapeSequence: false
    };
    let z_opt_js = {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.75,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.4,
        debugProtection: false,
        debugProtectionInterval: false,
        disableConsoleOutput: true,
        identifierNamesGenerator: 'hexadecimal',
        log: false,
        renameGlobals: false,
        rotateStringArray: true,
        selfDefending: true,
        splitStrings: true,
        splitStringsChunkLength: '10',
        stringArray: true,
        stringArrayEncoding: 'base64',
        stringArrayThreshold: 0.75,
        transformObjectKeys: true,
        unicodeEscapeSequence: false
    };

    gulp.src(['src/main/**/*.js', '!src/main/**/*.min.js']) //JS文件地址
        .pipe(babel({//编译ES6
            presets: ['es2015']
        }))
        .pipe(js_obfuscator(h_opt_js))
        .pipe(gulp.dest(buildBasePath)); //混淆后文件输出地址

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
});
