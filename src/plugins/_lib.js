let _lib = {
  // Обьект  в массив
  transformObjToArray(obj) {
    let arr = [];
    for (let key in obj) {
      arr.push(obj[key]);
    }
    return arr;
  },

  // Массив в объект
  transformArrToObject(arr) {
    let obj = {};
    for (let item of arr) {
      obj[item] = item;
    }
    return obj;
  },
};

export default _lib;
