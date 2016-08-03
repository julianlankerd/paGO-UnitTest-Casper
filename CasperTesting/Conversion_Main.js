var globals={};
var casper=require('casper').create({
	clientScripts:[
		'includes/jquery.min.js',	//Script(s) will be injected in remote DOM on every request
		'includes/paGO_Test_Includes.js'//
	],
	verbose:true,
	logLevel:"info"
});
casper.start('http://localhost/');
casper.then(function(){
	casper.then(function(){
		casper.then(function(){
			globals.username='admin',
			globals.password='admin',
			globals.frontEnd=casper.cli.get("url");
		});
		casper.then(function(){
			globals.backEnd=globals.frontEnd+"administrator/";
			globals.fatalError=function(){console.log("A fatal error occured!")},
			globals.abort=function(){console.log("Aborting...")},
			globals.error="Error: ";
		});
	});
});
casper.then(function(){
	casper.then(function(){
		var keez=Object.keys(globals);
		for(var i=0;i<keez.length;i++){
			console.log(keez[i]+": "+globals[keez[i]]);
		}
	});
//	casper.then(PagoDash);
	casper.then(function(){
		console.log(globals.PagoDashSuccess);
//		this.wait('5000',function(){
//			if(globals.PagoDashSuccess){
//				casper.then(console.log("Successfully opened 'paGO' module."));
//			}else{
//				casper.then(fatalError);
//				casper.then(function(){console.log("Couldn't open 'paGO' module!")});
//				casper.then(abort);
//				casper.then(this.exit);
//			}
//		});
	});
});
casper.run(function(){
	this.exit();
});
