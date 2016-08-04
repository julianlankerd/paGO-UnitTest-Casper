var globals={};
/*This next line is greate for debugging:*/
//require("utils").dump(globals);
var casper=require('casper').create({
//	clientScripts:[
//		'includes/jquery.min.js',	//Script(s) will be injected in remote DOM on every request
//		'includes/paGO_Function.js',	//
//		'includes/paGO_Test_Includes.js'//
//	],
	verbose:true,
	logLevel:"debug"
});
casper.start();
casper.then(function(){
	if(!phantom.cookiesEnabled){
		casper.echo("Critical error: this script can not work correctly without cookies enabled.","ERROR");
		casper.exit();
	}
	/*Load out libraries so that they're available everywhere in this scope*/
	if(phantom.injectJs("includes/jquery.min.js")&&
	phantom.injectJs("includes/paGO_Function.js")&&
	phantom.injectJs("includes/paGO_Test_Includes.js")){
		casper.echo("Successfully loaded resources.","INFO");
	}else{
		casper.echo("Critical error: resources not loaded properly.","ERROR");
		casper.echo("Maybe a file is in the wrong place?","COMMENT");
		casper.exit();
	}
	/*These variables are used throughout the test*/
	globals.username='admin',
	globals.password='admin',
	globals.pageLoadTimeout=Number(casper.cli.get("timeout"));
	globals.frontEnd=casper.cli.get("url");
	globals.backEnd=globals.frontEnd+"administrator/index.php?option=com_pago";
});
casper.then(function(){
	if(globals.frontEnd===""||!checkExists(globals.frontEnd)){
		casper.echo("Critical error: no 'url' argument specified.",'ERROR');
		casper.echo("Try using '--url=\"<'paGO's location here'>\"' on the command line.","COMMENT");
		casper.exit();
	}
	if(globals.pageLoadTimeout==="NaN"){
		globals.pageLoadTimeout=5000;
	}
});
casper.then(function(){
	casper.open(globals.backEnd);
	casper.then(function(){
		casper.page.render("screenshots/backEnd.png");
	});
});
casper.then(function(){
	//PagoLogin needs to be implemented
	casper.then(PagoLogin);
	casper.then(function(){
		casper.page.render("screenshots/backEnd-login.png");
		if(globals.PagoLoginSuccess){
			casper.echo("Successfully logged in to 'paGO' back end.","INFO");
		}else{
			casper.echo("Critical error: could not log in to 'paGO' back end.","ERROR");
			casper.echo("Perhaps there's something wrong with the cookiejar file?","COMMENT");
			casper.exit();
		}
	});
});
//casper.then(function(){
//	globals.CreateCategorySuccess=CreateCategory();
//});
casper.run(function(){
	casper.echo("'paGO' test successfully finished.","INFO");
	casper.exit();
});
