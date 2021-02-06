function testReplyFromSheet(){
  console.log(replyFromSheet("ABC"));
}

function testSendPostContent(){
  replyTextList = '在庫(ml)・・・500\n在庫(個)・・・1\n含有量(ml)・・・500\n最終使用日・・・2021/01/20\n';

  console.log(sendPostContent('replyToken',replyTextList));
}

function test(){
  let day = SH_NAME.getRange(2,5).getValue();
  if (day instanceof Date){
    day = Utilities.formatDate(day, 'Asia/Tokyo','yyyy/MM/dd')
  }
  console.log(day);
}
