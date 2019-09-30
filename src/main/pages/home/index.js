'use strict';
setInterval(async () => {
    document.getElementsByTagName('body')[0].className = "drag bg-img";
    try {
        let result = await _.GetHttp({url: "https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture"});
        document.getElementsByTagName('body')[0].className = "drag bg-img fadeIn animated";
        document.getElementsByTagName('body')[0].style.backgroundImage = `url('${"data:image;base64," + result.toString('base64')}')`;
    }catch (e) {
        console.log(e);
    }
}, 10000);