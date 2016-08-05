/*Make sure to add in a call so that jQuery is loaded properly!*/

function checkExists($a){//Needs work
	if($a===undefined||$a===null){
		return false;
	}
	return true;
}

function charSet(type){
	var newObj={starts:[],ends:[]};
	newObj.getSize=function(){
		return this.starts.length>this.ends.length?this.starts.length:this.ends.length;
	}
	newObj.splice=function(obj){//Appends the 'starts' and 'ends' arrays of one object to another
		if(typeof(obj)!="object"||!checkExists(obj.getSize)||!checkExists(obj.starts)||!checkExists(obj.ends)){
			obj=charSet("empty");
		}
		var result=new charSet("empty");
		var inc=this.getSize();
		for(var i=0;i<inc;i++){
			result.starts[i]=this.starts[i];
			result.ends[i]=this.ends[i];
		}
		for(var i=0;i<obj.getSize();i++){
			result.starts[i+inc]=obj.starts[i];
			result.ends[i+inc]=obj.ends[i];
		}
		return result;
	}
	if(typeof(type)!="string"){
		type="";
	}
	switch(type){
		case "empty":
			break;
		case "whiteSpace":
			var spaces="\f\n\r\t\v ";
			for(var i=0;i<spaces.length;i++){
				newObj.starts[i]=spaces[i];
				newObj.ends[i]='';
			}
			break;
		case "ascii":
			for(var i=0;i<256;i++){
				newObj.starts[i]=String.fromCharCode(i);
				newObj.ends[i]='';
			}
			break;
		case "symbols":	
			var symbols='`!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?';
			for(var i=0;i<symbols.length;i++){
				newObj.starts[i]=symbols[i];
				newObj.ends[i]='';
			}
			break;
		case "nums":
			for(var i=0;i<10;i++){
				newObj.starts[i]=i.toString();
				newObj.ends[i]='';
			}
			break;
		case "lower":
			var letter="a".charCodeAt(0);
			for(var i=0;i<26;i++){
				newObj.starts[i]=String.fromCharCode(i+letter);
				newObj.ends[i]='';
			}
			break;
		case "upper":
			var letter="A".charCodeAt(0);
			for(var i=0;i<26;i++){
				newObj.starts[i]=String.fromCharCode(i+letter);
				newObj.ends[i]='';
			}
			break;
		case "qwerty":
			newObj=charSet("lower").splice(charSet("upper"));
			break;
		case "centerKybd":
			newObj=charSet("nums").splice(charSet("qwerty"));
			newObj.starts[newObj.starts.length]=' ';
			newObj.ends[newObj.ends.length]='';
			break;
		case "noSpace":
			newObj=charSet("symbols").splice(charSet("nums")).splice(charSet("qwerty"));
			break;
		case "kybdChars":
			newObj=charSet("noSpace");
			newObj.starts[newObj.starts.length]=' ';
			newObj.ends[newObj.ends.length]='';
			break;
		case "HTMLText"://HTML tags for changing the appearance of text.  
			newObj.starts=[
			"<em>",
			"<i>",
			"<u>",
			"<s>"
			];
			newObj.ends=[
			"</em>",
			"</i>",
			"</u>",
			"</s>"
			];
			break;
		default://Go on and add your own character set!
			break;
	}
	return newObj;
}

var empty=charSet("empty");
var whiteSpace=charSet("whiteSpace");
var ascii=charSet("ascii");
var symbols=charSet("symbols");
var nums=charSet("nums");
var lower=charSet("lower");
var upper=charSet("upper");
var qwerty=charSet("qwerty");
var centerKybd=charSet("centerKybd");
var noSpace=charSet("noSpace");
var kybdChars=charSet("kybdChars");
var HTMLText=charSet("HTMLText");

/*Generates a random string; geared to work with HTML tags and text*/
function randomString($argsObj){//Generates a random string; geared to work with HTML tags and text
	if(!checkExists($argsObj.maxLen)){
		$argsObj.maxLen=1;
	}
	if(!checkExists($argsObj.minLen)){
		$argsObj.minLen=1;
	}
	if(!checkExists($argsObj.charSet)){
		$argsObj.charSet=ascii;
	}
	if(!checkExists($argsObj.embed)){
		$argsObj.embed="";
	}
	var calls=0;
	var len=Math.floor(Math.random()*($argsObj.maxLen+1-$argsObj.minLen))+$argsObj.minLen;//Determines the length of the resultant string
	var callEmbed=Math.floor(Math.random()*len);//The instance that the embedded string should be embedded in
	var posEmbed=Math.floor(Math.random()*3);//The position in which the string should be embedded within its instance
	var starts=$argsObj.charSet.starts,	//Make some variables easier to access
	ends=$argsObj.charSet.ends,		//
	embed=$argsObj.embed;			//
	var ranges=function(numSegments,limit){
		var points=[];
		for(var i=0;i<numSegments-1;i++){
			points[i]=Math.floor(Math.random()*(limit+1));
		}
		for(var i=0;i<points.length;i++){
			for(var j=i+1;j<points.length;j++){
				if(points[i]<points[j]){
					var temp=points[i];
					points[i]=points[j];
					points[j]=temp;
				}
			}
		}
		var segments=[];
		for(var i=1;i<points.length;i++){
			segments[i]=points[i-1]-points[i];
		}
		segments[0]=limit-points[0];
		segments[points.length]=points[points.length-1];
		return segments;
	}
	var generator=function(iterations){//This is easier to make recursive if it's named
		var result="";
		var strArr=["","","","","","","","",""];//The resultant string will be built with this
		if(iterations>0){//Die if we're done
			var segments=ranges(3,iterations-1);
			var lenSideA=segments[0],
			lenSubA=segments[1],
			lenSubB=0,
			lenSideB=segments[2];
			var index=Math.floor(Math.random()*starts.length);
			var temp=starts[index];
			strArr[2]=temp;
			temp=ends[index];
			strArr[6]=temp;
			calls++;
			if(calls-1==callEmbed){					//If we're in the right position then add in the embedded string
				switch(posEmbed){				//
					case 0:					//
						strArr[1]=embed;		//
						break;				//
					case 1:					//And make this random segment two-sided
						strArr[4]=embed;		//
						segments=ranges(4,iterations-1);//
						lenSideA=segments[0];		//
						lenSubA=segments[1];		//
						lenSubB=segments[2];		//
						lenSideB=segments[3];		//
						break;				//
					case 2:					//
						strArr[7]=embed;		//
						break;				//
					default:				//
						break;				//
				}						//
			}							//
			strArr[0]=generator(lenSideA);
			strArr[3]=generator(lenSubA);
			strArr[5]=generator(lenSubB);
			strArr[8]=generator(lenSideB);
		}
		for(var i=0;i<strArr.length;i++){	//Build the return and result it
			result+=strArr[i];		//Yes, I did just say that.  
		}					//
		return result;				//
	}
	if(len<0){
		return embed;
	}else{
		return generator(len);//GO!
	}
}

//Check this again
/*
function traverse($func,$args,$context,$selector){
	if(!checkExists($selector)){
		$selector="a";
	}
	var hrefs=$.map($($selector),function(element){	//Make a list of hyperlinks
		return $(element).attr("href");		//
	});						//
	var temp=page.url;
	for(var i=0,i<hrefs.length;i++){
		if(checkExists($func)){//Make sure function exists
			tabs.create().open(hrefs[i],function(status){//Open the webpage
				$func.apply($context,$args);//Do something here
			});
		}else{
			tabs.create().open(hrefs[i]);//Open the webpage
		}
	}
}*/

function contentShouldExclude($strings){//Defaults to checking for 404's
	if(!checkExists($strings)){
		$strings=["not found","can't be found",".php","error"];
	}
	for(var i in $("*:visible:not(:empty):not(:has(*))")){
		for(var j in $strings){
			if(i.textContent==j){
				return false;
			}
		}
	}
	return true;
}

function selectFrom($elements,$property,$value){
	var keyIns=Object.keys($elements);
	for(var i=0;i<keyIns.length;i++){
		if($elements[keyIns[i]][$property]===$value){
			return $elements[keyIns[i]];
		}
	}
	return undefined;
}

function getPos($elements,$element){
	var keyIns=Object.keys($elements);
	for(var i=0;i<keyIns.length;i++){
		if($elements[keyIns[i]]===$element){
			return i;
		}
	}
}

function select($parent,$val){
	var element=selectFrom($($parent).children(),'textContent',$val);
	if(element===undefined){
		element=selectFrom($($parent).children(),'value',$val);
	}
	if(element===undefined){
		return false;
	}
	element=$(element);
	element.trigger('mousedown');
	element.trigger('focus');
	element.trigger('mouseup');
	element.trigger('click');
	return true;
}

//Selects a random option for each 'select' element that's a child of the region
function SelectRandom($region,$selector,$attribute){
	if(!checkExists($attribute)){
		$attribute="selected";
	}
	//TODO: Will need to set all input based interactions in here eventually
	var x=$($region);
	for(var i=0;i<x.length;i++){
		for(var j=0;j<x[i].length;j++){
			x[i].children[j].removeAttribute($attribute);
		}
	}
	for(var i=0;i<x.length;i++){
		var findOptions=x[i].getElements($selector);
		var TheOne=Math.floor(Math.random()*findOptions.length);
		console.log(findOptions[TheOne]);
		findOptions[TheOne].setAttribute($attribute,$attribute);
	}
}

/*FIXME*/
function waitLoaded($func,$variable){
	casper.then(function(){
		casper.waitFor(function(){
			$func();
			return casper.evaluate(function(){
				return true;
			});
		},function(){
			$variable=true;
		},function(){
			$variable=false;
		},globals.pageLoadTimeout);
	});
}
