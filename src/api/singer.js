import jsonp from 'common/js/jsonp'
import axios from 'axios'
import {commonParams,options} from './config'

export function  getSingerList() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';
    const data = Object.assign({},commonParams,{
        channel: 'singer',
        page: 'list',
        key: 'all_all_all',
        pagesize: 100,
        pagenum: 1,
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq',
        g_tk:1664029744
    })
    return jsonp(url,data,options)
}

export function getSingerDetail(singerId) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  
    const data = Object.assign({}, commonParams, {
      hostUin: 0,
      needNewCode: 0,
      platform: 'yqq',
      order: 'listen',
      begin: 0,
      num: 80,
      songstatus: 1,
      singermid: singerId
    })
  
    return jsonp(url, data, options)
  }

export function getSong(mid) {

  const url = '/api/getSong'
  const data = Object.assign({},commonParams,{
    // -: getplaysongvkey8811687894825357,
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: "json",
    notice: 0,
    platform: "yqq.json",
    needNewCode: 0,
    data: {"req_0":{"module":"vkey.GetVkeyServer",
    "method":"CgiGetVkey",
    "param":{"guid":"7066161192",
    "songmid":[`${mid}`],
    "songtype":[0],"uin":"0",
    "loginflag":1,"platform":"20"}},
    "comm":{"uin":0,"format":"json","ct":24,"cv":0}}
  })
  return axios.get(url,{
      params:data
  }).then((res) => {
      //ES6 Promise的语法，传递对象，可以通过.then（（res）=>{}）获取
      return res.data
  })
}