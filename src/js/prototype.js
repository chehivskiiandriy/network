import Vue from 'vue'


Vue.prototype.$unixTime = (() => {
  let month = null;
  return function (_time = 0, _type = true, _length, monthIndex) {
    let u = new Date();
    if(!month || month[0] !== this.$lang.variables.January) {
      month = [
        this.$lang.variables.January,
        this.$lang.variables.February,
        this.$lang.variables.March,
        this.$lang.variables.April,
        this.$lang.variables.May,
        this.$lang.variables.June,
        this.$lang.variables.July,
        this.$lang.variables.August,
        this.$lang.variables.September,
        this.$lang.variables.October,
        this.$lang.variables.November,
        this.$lang.variables.December,
      ];
      console.log('fill lang')
    }

    let activeDate = [];
    if (_type) {
      u = new Date(_time * 1000);
    } else {
      //@TODO on IPhone don't work
      u = new Date(_time);
    }

    if (_length !== 'full' && _length !== 'contest') {
      let checkDate = new Date();
      let checkDay = ('0' + checkDate.getDate()).slice(-2);
      let checkMonth = ('0' + Number(checkDate.getMonth() + 1)).slice(-2);
      let checkYear = checkDate.getFullYear();
      let checkDateString = checkDay + '.' + checkMonth + '.' + checkYear;

      let dateCheckPost = ('0' + u.getDate()).slice(-2) +
        '.' + ('0' + Number(u.getMonth() + 1)).slice(-2) +
        '.' + u.getFullYear();


      if (checkDateString === dateCheckPost) {
        return this.$lang.variables.today + ' / ' + ('0' + u.getHours()).slice(-2) +
          ':' + ('0' + u.getMinutes()).slice(-2);
      } else if (checkDate.getDate() - 1 === u.getDate()) {
        return this.$lang.variables.yesterday + ' / ' + ('0' + u.getHours()).slice(-2) +
          ':' + ('0' + u.getMinutes()).slice(-2);
      } else {
        return ('0' + u.getDate()).slice(-2) +
          '.' + ('0' + Number(u.getMonth() + 1)).slice(-2) +
          '.' + u.getFullYear() +
          ' / ' + ('0' + u.getHours()).slice(-2) +
          ':' + ('0' + u.getMinutes()).slice(-2)
      }
    }
    else if (_length === 'contest') {
      if (monthIndex === 'day') {
        return ('0' + u.getDate()).slice(-2) +
          '.' + ('0' + Number(u.getMonth() + 1)).slice(-2) +
          '.' + u.getFullYear();
      }
      else {
        return (month[u.getMonth()] +
          ' ' + u.getFullYear());
      }
    }
    else {
      return ('0' + u.getDate()).slice(-2) +
        '.' + ('0' + Number(u.getMonth() + 1)).slice(-2) +
        '.' + u.getFullYear() +
        ' / ' + ('0' + u.getHours()).slice(-2) +
        ':' + ('0' + u.getMinutes()).slice(-2);
    }


  }
})();
