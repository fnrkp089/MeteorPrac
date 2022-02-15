/* 
서버와 데이터를 주고받는 방법은 
미티어 발행.구독을 사용하여 서버 몽고디비와 클라이언트 미니몽고를 싱킹하는 방법이잇고
서버측 메서드를 클라이언트에서 호출하는 방식으로 데이터를 주고받는다
 */

Meteor.publish('AddressBookData', function(count){
    let userId = this.userId;
    if(userId){
        return AddressBook.find({owner:userId}, {limit:count, sort: {name:1}})//로그인한 사용자가 등록한 본인의 주소록만 볼수잇도록.
    }
    //return AddressBook.find({}, {limit: count, sort : {name : 1}});
}); // count개의 주소데이터를 정렬후 addressBookData로 발행. count는 클라이언트에서 넘겨줄수잇는 