/*
Template.addressList는 <template name="addressList">의 매니저.
helper는 데이터를 제공하는 기능을 가진다.
list를 함수로 만들어 코드를 간결하게.
*/ 
Template.addressList.helpers({
    list(){
        return AddressBook.find({},{limit:10, sort:{name:1}})
    }
})

/*템플릿 안의 이벤트 리스트를 핸들링 할수 있는 함수.
click = 이벤트 종류
button[name=remove] = 샐렉터  
이벤트 함수 내에서의 this는 context를 의미하며,  each list안에 있는 tr의 도큐먼트를 가르킨다.
evt = 이벤트
tmpl = 이벤트가 일어난 템플릿 요소 (Blaze.template)*/ 
Template.addressList.events({
    'click button[name=remove]' (evt,tmpl){
        AddressBook.remove({_id: this._id});
    }
});

Template.addressList.events({
    'click button[name=saveAddress]' (evt,tmpl){
			//입력값을 객체형으로 받기
			let address = {
				name:tmpl.find('input[name=name]').value,
				phone:tmpl.find('input[name=phone]').value,
				email:tmpl.find('input[name=email]').value,
				company:tmpl.find('input[name=company]').value,
				birthday:tmpl.find('input[name=birthday]').value,
			}
			//insert
			AddressBook.insert(address);
			//insert후 초기화
			tmpl.find('input[name=name]').value = '';
			tmpl.find('input[name=phone]').value = '';
			tmpl.find('input[name=email]').value = '';
			tmpl.find('input[name=company]').value = '';
			tmpl.find('input[name=birthday]').value = '';
    }
});
