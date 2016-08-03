var globals={};
var casper=require('casper').create({
//	clientScripts:[
//		'includes/jquery.min.js',	//Script(s) will be injected in remote DOM on every request
//		'includes/paGO_Test_Includes.js'//
//	],
	verbose:true,
	logLevel:"debug"
});
casper.start();
casper.then(function(){
	/*Load out libraries so that they're available everywhere in this scope*/
	phantom.injectJs("includes/jquery.min.js");
	phantom.injectJs("includes/paGO_Test_Includes.js");
	/*These variables are used throughout the test*/
	globals.username='admin',
	globals.password='admin',
	globals.frontEnd=casper.cli.get("url");
	globals.backEnd=globals.frontEnd+"administrator/index.php?option=com_pago";
});
casper.then(function(){
	casper.open(globals.backEnd);
});
/*For debugging and stuff*/
casper.then(function(){
	var keez=Object.keys(globals);
	for(var i=0;i<keez.length;i++){
		console.log(keez[i]+": "+globals[keez[i]]);
	}
	console.log(checkExists);
	console.log("Hi!");
});
casper.run(function(){
	this.exit();
});
