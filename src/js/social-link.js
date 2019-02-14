class Share{

  constructor(pUrl, pText){
    this.url = pUrl;
    this.text = pText;
    this.send = '';
  }

  facebook(){
    this.send = 'https://www.facebook.com/dialog/share';
    this.send += '?app_id=191230284986134';
    this.send += '&display=popup';
    this.send += '&href=' + encodeURIComponent(this.url);
    this.popup(this.send);
  }

  twitter(){
    this.send = 'https://twitter.com/intent/tweet';
    this.send += '?text=' + encodeURIComponent(this.text);
    this.send += ' ' + encodeURIComponent(this.url);
    this.popup(this.send);
  }

  popup(_url){
    window.open(_url, '', 'toolbar=0,status=0,width=626,height=436');
  }
}

export default Share
