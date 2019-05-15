import originJSONP from 'jsonp'

export default function jsonp(url,data,option) {
  //判断url是否包含？，再拼接上param函数执行后的url
  url += (url.indexOf('?') < 0 ? '?':'&')  + param(data)
  return new Promise((resolve,reject) => {
    //访问url，获取数据
    originJSONP(url,option,(err,data) => {
      if(!err) {
        resolve(data)
      }else{
        reject(err)
      }
    })
  })
}

function param(data) {
  let url = ''
  //for in 枚举遍历将data中的属性取出
  for(var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    //encodeURIComponent将data里对应属性的值作为uri组件进行编码
    url += `&${k}=${encodeURIComponent(value)}`
  }
  //去除第一个&
  return url ? url.substring(1) : ''
}