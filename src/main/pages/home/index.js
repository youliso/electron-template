'use strict';
// setInterval(()=>{
//     console.log("213");
//     document.getElementsByTagName('body')[0].style.backgroundImage="";
//     setTimeout(()=>{
//         document.getElementsByTagName('body')[0].style.backgroundImage="url('https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture')";
//     },500)
// },1000);
// Swal.fire({
//     type: 'error',
//     title: '房间已满'
// });
setInterval(() => {
    document.getElementsByTagName('body')[0].className="drag bg-img";
    _.GetHttp({
        url: "https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture",
        callback(is, res) {
            console.log(res);
            document.getElementsByTagName('body')[0].className="drag bg-img fadeIn animated";
            document.getElementsByTagName('body')[0].style.backgroundImage = `url('${"data:image;base64," + res.toString('base64')}')`;
        }
    },);
}, 10000);