import './style/index.css'
// 导入图片 file-loader url-loader 
import logo from './image/logo.png'

console.log('hello, webpack')
document.querySelector("#app").style.color = 'red';

let img = new Image()
img.src = logo
document.body.appendChild(img)


const test = (n) => {
    return new Promise(function (resolve){
        setTimeout(()=>{
            resolve([1,2,3,4].map(v=> v*v))
        }, n * 1000)
    }).then (res => {
        console.log(res);
    })
}
console.log(test)