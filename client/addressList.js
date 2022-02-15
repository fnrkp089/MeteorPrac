/*
Template.addressList는 <template name="addressList">의 매니저.
helper는 데이터를 제공하는 기능을 가진다.
list를 함수로 만들어 코드를 간결하게.
*/ 
Template.addressList.onCreated(function() { // onCreated는 템플릿 인스턴스가 생성될때 단 한번 호출됨
	Session.set('cnt',30); //cnt 세션 변수 생성후 초깃값을 30으로 설정.
	let self = this;
	self.autorun(function(){ // autorun : 인자로 넘어온 익명함수 구분내 세션같은 리액티브 데이터 소스가 잇다면 해당값이 바뀔때마다 자동감지하여 자동호출, 리액트의 스테이트 하위호환
		self.subscribe('AddressBookData', Session.get('cnt')); //5개씩 페이징 추가하기
	});
})

Template.addressList.helpers({
    list(){
        return AddressBook.find({},{limit:10, sort:{name:1}})
    }
});

Template.addressList.events({
	'click button[name=more]' (evt, tmpl){
		Session.set('cnt', Session.get('cnt') + 5);
	}
});

/*템플릿 안의 이벤트 리스트를 핸들링 할수 있는 함수.
click = 이벤트 종류
button[name=remove] = 샐렉터  
이벤트 함수 내에서의 this는 context를 의미하며,  each list안에 있는 tr의 도큐먼트를 가르킨다.
evt = 이벤트
tmpl = 이벤트가 일어난 템플릿 요소 (Blaze.template)*/ 
Template.addressListItem.events({
    'click button[name=remove]' (evt,tmpl){
        AddressBook.remove({_id: this._id});
    },
		'click button[name=modify]' (evt,tmpl){
			Session.set('editItem', this._id); //editItem이라는 세션에 현재 클릭한 주소록의 id를 부여한다.
	},
	'click button[name=save]' (evt, tmpl){
		let address = {
			name:tmpl.find('input[name=name]').value,
			phone:tmpl.find('input[name=phone]').value,
			email:tmpl.find('input[name=email]').value,
			company:tmpl.find('input[name=company]').value,
			birthday:tmpl.find('input[name=birthday]').value,
		}
		try{
			check(address.name, NotEmptyString); // 이름 체크
			check(address.company, NotEmptyString); // 회사 체크
			check(address.email, EmailString);
			check(address.phone, PhoneStirng);
			check(address.birthday, BirthdayString);
		} catch(err){
			alert('입력하신 값을 확인해 주세요 : ERR : ' + err.message );
			return;
		}

		AddressBook.update({_id:this._id}, {$set:address});
		Session.set('editItem', null);
	},
	'click button[name=cancel]' (evt, tmpl){
		Session.set('editItem', null);
	},
	'click .edit-thing' (evt, tmpl){
		Session.set('editItem', this._id);
	}
});
/*
1.editItem 세션 변수에 뷰,수정모드로 스위칭되는 <리액티비티> 구현
2.수정 버튼 누를시, editItem세션 변수에 현재 주소록(this)의 _id를 넣는다
3.editing이라는 헬퍼를 사용하여 editItem값과  this._id값이 같을 경우 true를 반환.
4.editing헬퍼 함수의 true false여부에 따라 뷰 변환.
헬퍼값이 변경 될 경우 뷰 또한 자동으로 갱신.
*/


Template.addressListItem.helpers({ // 변화감지 헬퍼
	editing(){
		return this._id == Session.get('editItem'); // editItem값과 this._id가 같을경우 true반환
		//변화감지.
	}
});

Template.addressInput.events({
    'click button[name=saveAddress]' (evt,tmpl){
			//입력값을 객체형으로 받기
			let address = {
				name:tmpl.find('input[name=name]').value,
				phone:tmpl.find('input[name=phone]').value,
				email:tmpl.find('input[name=email]').value,
				company:tmpl.find('input[name=company]').value,
				birthday:tmpl.find('input[name=birthday]').value,
				owner: Meteor.userId()//로그인된 사용자 아이디 추가.
			}
			try{
				check(address.name, NotEmptyString); // 이름 체크
				check(address.company, NotEmptyString); // 회사 체크
				check(address.email, EmailString);
				check(address.phone, PhoneStirng);
				check(address.birthday, BirthdayString);
			} catch(err){
				alert('입력하신 값을 확인해 주세요 : ERR : ' + err.message );
				return;
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
