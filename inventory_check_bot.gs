const LINE_ACCESS_TOKEN = '*';
const SS_ID = SpreadsheetApp.openById('*');
const SH_NAME = SS_ID.getSheetByName('在庫');

function doPost(e){
  // WebHookで受信した応答用Token
  const REPLY_TOKEN = JSON.parse(e.postData.contents).events[0].replyToken;
  // ユーザーのメッセージを取得
  const USER_MESSAGE = JSON.parse(e.postData.contents).events[0].message.text;

  sendPostContent(REPLY_TOKEN,replyFromSheet(USER_MESSAGE));
}

/**
 * スプレッドシートから値を取得してリプライ文を作成する
 */
function replyFromSheet(USER_MESSAGE){
  const LAST_ROW = SH_NAME.getLastRow();
  const HEADER_LIST = SH_NAME.getRange(1,1,1,5).getValues(); 
  const WORD_LIST = SH_NAME.getRange(1,1,LAST_ROW,5).getValues(); 

  let replyMessage ='';
  for(let i = 1; i< WORD_LIST.length; i++){
    if(WORD_LIST[i][0] == USER_MESSAGE){
      for(j = 1;j< 5; j++){ 
        // 例) 在庫(個)・・・2
        let word = WORD_LIST[i][j];
        if(word instanceof Date){
          word = Utilities.formatDate(word, 'Asia/Tokyo','yyyy/MM/dd');
        }
        replyMessage += HEADER_LIST[0][j] +'・・・' + word + '\n'; 
      }
    }
  }
  return replyMessage.trim();
}

/**
 * LINE Messaging APIにデータを送信する
 */
function sendPostContent(replyToken,replyMessage){

  //LINEで受信した語句がシートの受信語句と一致しない場合、関数を終了する
  if(replyMessage.length < 1){
    return;
  }
  
  UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + LINE_ACCESS_TOKEN
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages':[{
        'type': 'text',
        'text': replyMessage
      }]
    })
  });
}