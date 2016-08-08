/*Used to log into paGO backend*/
function PagoLogin(){
	/*FIXME*/
	/*This needs to be fixed so that it works with async better - accesses "waitLoaded" in "paGO_Test_Includes.js"*/
	casper.then(function(){
		waitLoaded(function(){
			casper.fill('form#form-login',{
				'username':globals.username,
				'passwd':globals.password
			},true);
		},globals.PagoLoginSuccess);
	});
	casper.then(function(){
		casper.echo(globals.PagoLoginSuccess,"ERROR");
		globals.PagoLoginSuccess=globals.PagoLoginSuccess&&(selectFrom(phantom.cookies,'name',"pago_id")!==undefined);
		casper.echo(globals.PagoLoginSuccess,"ERROR");
	});
//	casper.then(function(){
//		casper.waitFor(function(){
//			casper.fill('form#form-login',{
//				'username':globals.username,
//				'passwd':globals.password
//			},true);
//			return casper.evaluate(function(){
//				return true;
//			});
//		},function(){
//			globals.PagoLoginSuccess=(selectFrom(phantom.cookies,'name',"pago_id")!==undefined);
//			casper.echo("CAUGHT!","ERROR");
//		},function(){
//			globals.PagoLoginSuccess=false;
//			casper.echo(":(","ERROR");
//		},globals.pageLoadTimeout);
//	});
}
/*Check for any error labels left in the aftermath of the Input function, and if there are any error labels it will assign a numeric value*/
function errorScan(){
    var errorFields=$('label.label-error');
		for(var j=0;j<errorFields.length;j++){
			errorFields[j].getParent().getElements('input')[0].value=randomString({maxLen:8,minLen:1,charSet:nums,embed:''});
		}
}
/*A very hard-handed way to drop input into all text fields... Need to find a better solution one of these days*/
function Input(){
	var inputFields=$('[type="text"]')
	for(var i=0;i<inputFields.length;i++){
		inputFields[i].value=randomString({maxLen:30,minLen:1,charSet:nums.splice(centerKybd.splice(centerKybd.splice(centerKybd.splice(centerKybd)))),embed:''});
	}
}

/*This will Begin testing the Categories section*/

function CreateCategory(){
//	casper.then(function(){
//		/*Get rid of every category item using paGO's built in call*/
//		casper.evaluate(funciton($element){
//			pago_check_all($element,'tbody td.pg-checkbox input');
//		},$("#checkall")[0]);
//		casper.click('#pago_toolbar > button.delete');
//	});
	casper.then(function(){
		casper.click('#pago > div.pg-sidebar > ul > li.pg-menu-shop > span');//Click on the inverted carat and drop the shop menu down
	});
	casper.then(function(){
		casper.click("#pago > div.pg-sidebar > ul > li.pg-menu-shop.open > div > ul > li:nth-child(2) > a");//Go to the categories menu
	});
	casper.then(function(){
		/*Make a new category and save it*/
		casper.click("#pago_toolbar > button.new.pg-btn-medium.pg-btn-green.pg-btn-dark");
		casper.sendKeys("#params_name",globals.category.categoryName);
		casper.sendKeys("#params_alias",randomString({maxLen:20,minLen:1,charSet:centerKybd}));
//		Needs to be migrated from cypress to casperjs
//		.get("*").then(function($a){
//			SelectRandom('fieldset', 'input', 'checked');
//			SelectRandom('select', 'option');
//		})
		casper.click("#pago_toolbar > button:nth-child(2)");

		/*Add assertion statement here?*/
		casper.then(function(){
			globals.category.selector="#pg-categories-manager > tbody > tr > td.pg-category-name > a";
			var elements=$(globals.category.selector);
			globals.category.listNode=selectFrom(elements,"textContent",categoryName);
			globals.CreateCategorySuccess=(globals.category.listNode!==undefined);
			globals.category.selector+=":nth-child("+(getPos(elements,globals.category.listNode)+1)+")";
		})
	});
	/*Check that it exists*/
	casper.then(function(){
		if(globals.CreateCategorySuccess){
			casper.click('#pago > div.pg-sidebar > ul > li.pg-menu-shop.current.open > div > ul > li:nth-child(2) > a');//Go to the categories menu
			casper.click(globals.category.selector);//Go back to the category
			casper.click("#pago_toolbar > button:nth-child(1)");//Use the other save button and exit
			casper.click(globals.category.selector);//Go back again
			casper.click("#pago_toolbar > button:nth-child(3)");//Save and new
			casper.click("#pago_toolbar > button:nth-child(4)");//Cancel the new category
		}
	});
}

/*CreateProduct needs to be migrated to casperjs from cypress*/
/*This function will generate a random product*/
function CreateProduct(){
	var temp=HTMLText;
	temp=temp.splice(temp);
	temp=temp.splice(temp);
	$('#pago > div.pg-sidebar > ul > li.pg-menu-shop > a').click()//Click on the 'caret' then Drop the shop menu down
	$('#pago > div.pg-sidebar > ul > li.pg-menu-shop.open > div > ul > li:nth-child(1) > a').click()	
	$('#pago > div.pg-sidebar > ul > li.pg-menu-shop.open > a').click()//Go to the shop (product view)
	select($('#limit'),"All")//Show 'all' items
	$('#pago_toolbar > button.new.pg-btn-medium.pg-btn-green.pg-btn-dark').click().end()//Make a new item

	cy.then(function($aaa){
		SelectRandom('fieldset', 'input', 'checked');
		SelectRandom('select', 'option');
		Input()//This is going to find all text fields and fire garbage into said fields
		cy.get("#pago_toolbar > button:nth-child(2)").click(); //This is going to try and save the product (Errors are to be expected)
		cy.then(function($bbb){
			errorScan()//This is going to scan all for all error labels, find the sibling text field associated
			cy.get('[title="Toggle editor"]').click({multiple: true})
			.get("#params\\5b description\\5d").type(randomString({maxLen:100,minLen:90,charSet:centerKybd.splice(temp),embed:""}))
			.get("#params\\5b content\\5d").type(randomString({maxLen:100,minLen:90,charSet:centerKybd.splice(temp),embed:""}))
			.get('[title="Toggle editor"]').click({multiple: true})	
			cy.get('#main-1 > ul').find('input').check({force: true})
			.get('#ui-id-6').click()
			.get('#params\\5b meta\\5d \\5b keywords\\5d').type(randomString({maxLen:100,minLen:90,charSet:centerKybd.splice(whiteSpace),embed:""}))
			.get('#params\\5b meta\\5d \\5b description\\5d').type(randomString({maxLen:100,minLen:90,charSet:centerKybd.splice(whiteSpace),embed:""}))
			cy.get('#pago_toolbar > button.apply.pg-btn-medium.pg-btn-dark.pg-btn-green').click()	//and save it
			cy.then(function($ccc){
				cy.get("div.alert-success").should("exist")
			})
		}).end()
	}).end()


		
	//.get('#pago > div.pg-sidebar > ul > li.pg-menu-shop.open > a').click()//Go to the shop (product view)
	/*Go back to the item*/
	/*cy.then(function($a){	
		return selectFrom($("#pg-items-manager > tbody > tr > td.pg-item-name > div > span > a"),"textContent",itemName)
	}).click({force: true})
	/*Use the other save button and exit*/
	/*cy.get("#pago_toolbar > button:nth-child(1)").click()
	cy.then(function($a){													//Go back again
		return selectFrom($("#pg-items-manager > tbody > tr > td.pg-item-name > div > span > a"),"textContent",itemName);
	}).click({force: true})														
	cy.get("#pago_toolbar > button:nth-child(3)").click()//Save and new
	cy.get("#pago_toolbar > button.cancel.pg-btn-medium.pg-btn-dark").click()//Cancel the new item
	/*Don't forget to check the front-end for the item that was created!*/
	/*This will delete the item(s) generated*/
	/*.get('#checkall').check({force:true})				
	.get('#pago_toolbar > button.delete').click({force:true})	*/
}

/*This is going to Create a new attribute*/
function CreateAttribute(){
	cy.get('#pago > div.pg-sidebar > ul > li.pg-menu-shop.open > div > ul > li:nth-child(3) > a').click()
	cy.get('#pago_toolbar > button.new.pg-btn-medium.pg-btn-green.pg-btn-dark').click()
	cy.then(function($aaa){
		SelectRandom('fieldset', 'input', 'checked');
		SelectRandom('select', 'option');
		cy.get('#pago > div.pg-main-container.clearfix > div > div').find().click()
		Input()
		cy.get('#addAttribute > div > div.pg-pad-20.text-center > button').click()
	}).end()

}

/*This is going to test SEO wingman*/
/*function SeoWingman(){
	$('#pago > div.pg-sidebar > ul > li.pg-menu-seo.wingman > a').click()
	$('#pricing > div.pg-wingman-plan-wrapper > wingman-plan:nth-child(2) > button').click()
	select($('#formly_13_select_country_0'),'United States')//Country
	select($('##formly_13_select_state_1'),'')
	select($('#formly_13_select_country_0'),'United States')
	select($('#formly_13_select_country_0'),'United States')
	$('#formly_13_input_name_0').type(randomString({maxLen:8,minLen:1,charSet:ascii.splice(centerKybd)})+' '+randomString({maxLen:8,minLen:1,charSet:ascii.splice(symbols)})) //Type name (Must have spaces)
	$('#formly_13_input_email_0').type('TEST@COREPHP.COM') //Email
	$('#formly_13_input_phone_1').type(randomString({maxLen:8,minLen:1,charSet:nums})) //Phone
	$('#formly_13_input_line1_0').type(randomString({maxLen:8,minLen:1,charSet:ascii.splice(centerKybd)})+' '+randomString({maxLen:8,minLen:1,charSet:ascii.splice(symbols)})) //Address 1
	$('#formly_13_input_city_0').type(randomString({maxLen:8,minLen:1,charSet:ascii.splice(centerKybd)})+' '+randomString({maxLen:8,minLen:1,charSet:ascii.splice(symbols)}))//City
	$('#formly_13_input_postal_code_1').type(randomString({maxLen:5,minLen:5,charSet:nums}))//Zip Code
	$('#formly_13_input_number_0').type('4242424242424242') //Test Card
	$('#formly_13_input_cvc_1').type('4321') //test CVC
	$('#subscribeForm > div > div > ng-form > div:nth-child(7) > div > button').click() //Subscribe
}*/
