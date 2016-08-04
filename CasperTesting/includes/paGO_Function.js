/*Used to log into 'paGO' backend*/
function PagoLogin(){
	casper.then(function(){
		var loginHandler=function(){
			globals.PagoLoginSuccess=(selectFrom(phantom.cookies,'name',"pago_id")!==undefined);
			casper.echo("CAUGHT!","WARNING");
			/*Change this next line to cancel the wait statement farther down*/
			casper.once("wait.done",function(){
				globals.PagoLoginSuccess=true;
			});
		};
		casper.once("load.finished",loginHandler);
		casper.fill('form#form-login',{
			'username':globals.username,
			'passwd':globals.password
		},true);
		casper.wait(globals.pageLoadTimeout,function(){
			casper.removeListener("load.finished",loginHandler);
			globals.PagoLoginSuccess=false;
		});
	});
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

/*This will Begin testing the Categories section*/

function CreateCategory(){
	$('#pago > div.pg-sidebar > ul > li.pg-menu-shop > span').click()//Click on the 'caret' then Drop the shop menu down
	$("#pago > div.pg-sidebar > ul > li.pg-menu-shop.open > div > ul > li:nth-child(2) > a").click()//Go to the categories menu
		cy.get("#pago_toolbar > button.new.pg-btn-medium.pg-btn-green.pg-btn-dark").click()				//Make a new category and save it
		var categoryName=randomString({maxLen:20,minLen:1,charSet:centerKybd});						//
		cy.get("#params_name").type(categoryName)									//
		.get("#params_alias").type(randomString({maxLen:20,minLen:1,charSet:centerKybd}))				//
//		.get("*").then(function($a){
//			SelectRandom('fieldset', 'input', 'checked');
//			SelectRandom('select', 'option');
//		})
		.get("#pago_toolbar > button:nth-child(2)").click()
		
		.then(function($a){
			cy.get("div.alert-success").should("exist")
		})
		
		.get('#pago > div.pg-sidebar > ul > li.pg-menu-shop.current.open > div > ul > li:nth-child(2) > a').click()//Go to the categories menu
		
		.then(function($a){													//Go back to the category
			return selectFrom($("#pg-categories-manager > tbody > tr > td.pg-category-name > a"),"textContent",categoryName);	//
		}).click()															//
		
		.get("#pago_toolbar > button:nth-child(1)").click()//Use the other save button and exit
		
		.then(function($a){													//Go back again
			return selectFrom($("#pg-categories-manager > tbody > tr > td.pg-category-name > a"),"textContent",categoryName);	//
		}).click()
		
		.get("#pago_toolbar > button:nth-child(3)").click()//Save and new
		.get("#pago_toolbar > button:nth-child(4)").click()//Cancel the new category
		
		/*Get rid of every Category item*/
		//.get('#checkall').check({force:true})			
		//.get('#pago_toolbar > button.delete').click({force:true})
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
