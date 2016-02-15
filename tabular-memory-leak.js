var Books = new Mongo.Collection('books');

TabularTables = {};

TabularTables.Books = new Tabular.Table({
  name: "Books",
  collection: Books,
  columns: [
    {data: "title", title: "Title"},
    {data: "author", title: "Author"},
    {data: "copies", title: "Copies Available"},
    {
      data: "lastCheckedOut",
      title: "Last Checkout",
      render: function (val, type, doc) {
        if (val instanceof Date) {
          return val.toDateString();
        } else {
          return "Never";
        }
      }
    },
    {data: "summary", title: "Summary"},
  ]
});

Router.configure({
	layoutTemplate: 'layout',
});

Router.route('/', {
	name: 'hello',
});

Router.route('/goodbye', {
	name: 'goodbye',
});

// A patch to clean up tabular's datatables.
Router.onStop(function() {
  var destroy = Session.get('destroy');
  if (!destroy) return;

	var $tables = $('table');
	_.each($tables, function(table){
		if ($.fn.DataTable.isDataTable(table)) {
			console.log("cleaning up: ", table);
			$(table).DataTable().destroy();
		}
	});
});


if (Meteor.isClient) {
  Template.layout.events({
    'click #destroy': function(){
      Session.set('destroy', true);
    },
    'click #dont-destroy': function(){
      Session.set('destroy', false);
    },
  });

  var hello = true;
  Meteor.setInterval(function(){
    if (hello) {
      Router.go('goodbye');
    } else {
      Router.go('hello');
    }
    hello = !hello;
  }, 300);
}


if (Meteor.isServer) {
  function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
    	var randomPoz = Math.floor(Math.random() * charSet.length);
    	randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
  }


  Meteor.startup(function () {
    if(Books.find().count() === 0) {
      for (var i = 0; i < 1000; i++) {
          Books.insert({
            title: randomString(10),
            author: randomString(10),
            copies: Math.floor(Math.random()),
            lastCheckedOut: new Date(),
            summary: randomString(100),
          });
        }
    }
  });
}
