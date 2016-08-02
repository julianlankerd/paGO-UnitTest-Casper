var casper = require('casper').create({
	clientScripts:  [
        'includes/paGO_Test_Includes.js'      // These two scripts will be injected in remote DOM on every request
    ],
	verbose: true,
	logLevel: "info"

});

//var backend = "http://localhost/Mr.Bince-is-my-Hero%3C3/administrator/index.php";

casper.start(casper.cli.get('Login'), function() {
	this.fillSelectors('form#form-login', {
		'input[name="username"]': 'admin',
		'input[name="passwd"]': 'admin'
	}, true);
	casper.options.waitTimeout = 1000;
	this.wait('5000', function(){
		this.echo('Page title is: ' + this.evaluate(function(){
	    	return document.title;
	    }), 'INFO');
	})
	
});

casper.run(function(){
	console.log(this.getRandomColor());
	this.exit();
});

//Command to run the script:
//casperjs Conversion_Main.js --Login="http://localhost/Mr.Bince-is-my-Hero%3C3/administrator/index.php?option=com_pago"