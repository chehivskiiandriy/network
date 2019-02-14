import _Vue from "vue";
import api from 'utils/api';

export function Plugin(Vue: typeof _Vue, options?: any): void{

  // return time with back countdown (number)
  Vue.prototype.$timeBack = (time: any, callback: any) =>{
    let day: any, hour: any, min: any, sec: any, left_hour: any, needType: any;

    let parseTime = (_timeBack: any) =>{

      day = Math.floor((_timeBack / 60 / 60) / 24);
      hour = Math.floor(_timeBack / 60 / 60);
      min = Math.floor((_timeBack - hour * 60 * 60) / 60);
      sec = Math.floor(_timeBack - hour * 60 * 60 - min * 60);
      left_hour = Math.floor((_timeBack - day * 24 * 60 * 60) / 60 / 60);
      if(day > 0){
        callback(day + ' дней ');
      }else{
        callback(left_hour + ':' + (String(min).length > 1 ? min : '0' + min) + ':' + (String(sec).length > 1 ? sec : '0' + sec));
      }
    };

    let interval = setInterval(() =>{
      time = time - 1;
      if(time < 0) clearInterval(interval);
      parseTime(time);
    }, 1000);

  };

  Vue.prototype.$textLength = (_text: string, _length: number) =>{
    let sliced = _text.slice(0, _length);
    if(sliced.length < _text.length){
      return sliced += '...';
    }
    return sliced;
  };

}

// export class PluginOption {
//   // тут можно добавлять опции для обработки только вопрос как они будут работать
// }
