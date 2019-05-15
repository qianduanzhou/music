import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config'
import axios from 'axios'

export function getRecommend() {
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
    //  Object.assign ES6拷贝枚举对象方法
    const data = Object.assign({},commonParams,{
        //网上url地址的Query String Parameters
        platform:'h5',
        uin:0,
        needNewCode:1
    })
    return jsonp(url,data,options)
}

export function getDiscList() {
    const url = '/api/getDiscList'
    const data = Object.assign({},commonParams,{
        platform:'yqq',
        hostUin: 0,
        sortId: 5,
        sin: 0,
        ein: 29,
        needNewCode: 0,
        categoryId: 10000000,
        rnd:Math.random(),
        format:'json'
    })
    return axios.get(url,{
        params:data
    }).then((res) => {
        //ES6 Promise的语法，传递对象，可以通过.then（（res）=>{}）获取
        return Promise.resolve(res.data)
    })
}

export function  getSongList(dissid) {
    const url = '/api/getSongList'
    const data = Object.assign({},commonParams,{
        type: 1,
        json: 1,
        utf8: 1,
        onlysong: 0,
        disstid: dissid,
        loginUin: 0,
        hostUin: 0,
        format: 'json',
        platform: 'yqq.json',
        needNewCode: 0
    })
    return axios.get(url,{
        params:data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}