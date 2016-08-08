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
/*Change the screen size for very page*/
casper.on("page.initialized",function(webPage){
	casper.page.viewportSize={width:1600,height:900};
});
casper.start();
casper.then(function(){
	//Examine the next statement in a comedic sense
	/*It's not possible to continue without cookies*/
	casper.then(function(){
		if(!phantom.cookiesEnabled){
			casper.echo("Critical error: this script can not work correctly without cookies enabled.","ERROR");
			casper.exit(2);
		}
	});
	/*Load out libraries so that they're available everywhere in this scope*/
	casper.then(function(){
		if(phantom.injectJs("includes/jquery.min.js")&&
		phantom.injectJs("includes/paGO_Function.js")&&
		phantom.injectJs("includes/paGO_Test_Includes.js")){
			casper.echo("Successfully loaded resources.","INFO");
		}else{
			casper.echo("Critical error: resources not loaded properly.","ERROR");
			casper.echo("Maybe a file is in the wrong place?","COMMENT");
			casper.exit(2);
		}
	});
	/*Get command-line variables and make them global*/
	casper.then(function(){
		globals.username='admin',
		globals.password='admin',
		globals.pageLoadTimeout=Number(casper.cli.get("timeout"));
		globals.frontEnd=casper.cli.get("url");
		globals.backEnd=globals.frontEnd+"administrator/index.php?option=com_pago";
	});
	/*Detect argument errors from the user*/
	casper.then(function(){
		if(globals.frontEnd===""||!checkExists(globals.frontEnd)){
			casper.echo("Critical error: no 'url' argument specified.",'ERROR');
			casper.echo("Try using '--url=\"<paGO's location here'>\"' on the command line.","COMMENT");
			casper.exit(1);
		}
	});
	/*Deal with default arguments*/
	casper.then(function(){
		if(isNaN(globals.pageLoadTimeout)||globals.pageLoadTimeout<=0){
			globals.pageLoadTimeout=5000;
		}
		globals.PagoLoginSuccess=false;
		globals.CreateCategorySuccess=false;
		globals.addCategory=true;
		globals.hasProduct=false;
		globals.category={categoryName:randomString({maxLen:20,minLen:1,charSet:centerKybd}),listNode:undefined};
	});
	casper.then(function(){
		casper.echo("Initialization successfull.","INFO");
	});
});
/*Open paGO's back end and take a pretty pretty picture*/
casper.then(function(){
	casper.open(globals.backEnd);
	casper.then(function(){
		casper.page.render("screenshots/backEnd.png");
	});
});
/*FIXME*/
/*Log in to pago*/
casper.then(function(){
	casper.then(PagoLogin);
	casper.then(function(){
		casper.page.render("screenshots/backEnd-login.png");
		if(globals.PagoLoginSuccess){
			casper.echo("Successfully logged in to paGO back end.","INFO");
		}else{
			casper.echo("Critical error: could not log in to paGO back end.","ERROR");
			casper.echo("Is there something wrong with the cookiejar file?","COMMENT");
			casper.echo("Perhaps you've set the timeout too low?","COMMENT");
			casper.exit(3);
		}
	});
});
/*FIXME: Not tested with the new login*/
//casper.then(function(){
//	casper.then(CreateCategory);
//	casper.then(function(){
//		if(globals.CreateCategorySuccess){
//			casper.echo("Successfully created a category.","INFO");
//			globals.addCategory=true;
//		}else{
//			casper.echo("Error: couldn't create a category.","COMMENT");
//			globals.addCategory=false;
//		}
//	});
//});
/*CreateProduct needs to be migrated to casperjs from cypress*/
//casper.then(function(){
//	casper.then(function(){
//		CreateProduct(globals.addCategory);
//	});
//	casper.then(function(){
//		if(globals.CreateProductSuccess){
//			casper.echo("Successfully created a category.","INFO");
//			globals.hasProduct=true;
//		}else{
//			casper.echo("Error: couldn't create a product.","COMMENT");
//			globals.hasProduct=false;
//		}
//	})
//});
casper.run(function(){
	casper.echo("paGO test finished successfully.","INFO");
	casper.exit(0);
});
