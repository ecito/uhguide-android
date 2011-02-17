var contactWindow = Titanium.UI.currentWindow;
contactWindow.backgroundColor = '#000';
contactWindow.layout = 'vertical';

var person = contactWindow.person;

var nameLabel = Ti.UI.createLabel({
	text:person.givenname + ' ' + person.sn,
	height:'auto',
	color:'#fff',
	shadowColor:'#000',
	shadowOffset:{x:5,y:5},
	left:10,
	right:10,
	top:5,
	font:{
		fontFamily:'Helvetica Neue',
		fontSize:28,
		fontWeight:'bold'
	}
});
contactWindow.add(nameLabel);

if (person.title == null) {
	person.title = '';
}
var titleLabel = Ti.UI.createLabel({
	text:person.affiliation + ': ' + person.title,
	height:'auto',
	left:10,
	right:10,
	top:0,
	font:{
		fontFamily:'Helvetica Neue',
		fontSize:18
	}
});
contactWindow.add(titleLabel);

function sendEmailTo(email) {
	var emailDialog = Titanium.UI.createEmailDialog();
    emailDialog.setSubject('Hello');
    emailDialog.setToRecipients([email]);

    emailDialog.addEventListener('complete',function(e)
    {
        if (e.result != emailDialog.SENT) {
            alert("E-mail was not sent. " + e.result);
        }
    });
    emailDialog.open();
	
};

if (person.buildingname) {
	person.at = person.buildingname + ' ' + person.roomnumber;
}
attributes = ["telephonenumber", "mail", "at"];
pretty_names = ["Phone", "E-mail", "At"];

for (var x = 0; x < attributes.length; x++) {
	if (person[attributes[x]]) {
		var attributeCell = Ti.UI.createView({
			borderRadius:15,
			borderColor:'#fff',
			backgroundColor:'#ccc', 
			height:40,
			left:10,
			right:10,
			top:10
		});
		
		contactWindow.add(attributeCell);
	
		var attributeTitleLabel = Ti.UI.createLabel({
			text:pretty_names[x],
			color:'blue',
			font:{
				fontFamily:'Helvetica Neue',
				fontWeight:'bold'
			},
			height:'auto', left:10, right:10, top:8});
	
		var attributeTextLabel = Ti.UI.createLabel({
			text:person[attributes[x]],
			color:'black',
			font:{
				fontFamily:'Helvetica Neue',
				fontWeight:'bold'
			},
			height:'auto', textAlign:'right', width:'auto', right:10, top: 8});
	
	
		attributeCell.add(attributeTitleLabel);
		attributeCell.add(attributeTextLabel);
		
		if (attributes[x] == 'mail') {
			attributeCell.addEventListener('click',function(e) {
				sendEmailTo(person[attributes[x]]);
			});
		}
	}
}