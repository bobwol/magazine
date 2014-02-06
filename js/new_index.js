$(document).on('mobileinit',function(){
	get_data();
	$( ".home-content" ).on( "swipeleft", function(){
		alert('test');
		$.mobile.changePage('#context',{transition:"fade"});
	} );
	$( ".home-content" ).on( "swiperight", function(){
		$.mobile.changePage('#context',{transition:"fade"});
	} );
});

/*
 * get data 
 */
 function get_data(){
 	var url = 'http://ns.dev/magazine-service/mobiles/magazine_paid.json';      
    $.ajax({
        url			: url ,
		crossDomain : true,
        dataType	: "jsonp",
		beforeSend: function() {  $('body').addClass('ui-loading'); },
        success	: function(msg){
			store_page_ids(msg.Content);
			create_home(msg.Magazine);
			create_context(msg.Content);
			create_magazine(msg.Content);
			$('body').removeClass('ui-loading');
			$.mobile.changePage('#home');
		},
		error  : function(msg){
			$('body').removeClass('ui-loading');
			$.mobile.pageContainer.html('').append('<div data-role="page">'+create_header()+'<div data-role="content"><a href="#" onclick="get_data()">Reload</a></div></div>');
		},
       timeout : 10000
		
    });         
 }

/*
 * create homes
 */
function create_home(data){
	var d_width = $(window).width();
	var d_height = $(window).height();
	var h_height = $('header').height();
	var menu = menus();
	var home_data = '<div data-role="page" id="home">'+create_header()+'<div data-role="content" class="home-content"><img src="http://ns.dev/magazine-service/img/magazine_covers/mobiles/'+data.id+'.png" class="home-baner ri"/></div>'+menu+'</div>';
	$.mobile.pageContainer.append(home_data);
	
	$('.home-baner').css({'min-width':d_width,'min-height': d_height-90});
}
/*
 * create pages
 */
function create_magazine(data){
	var menu = menus();
	$.each(data,function(){
		var top_add = '';
		var bottom_add = '';
		if(this.top_ad != 'none'){
			top_add = '<div class="text-center"><img src="http://ns.dev/magazine-service/img/ads/'+this.top_ad+'" class="ri" /></div>';
		}
		if(this.bottom_ad != 'none'){
			bottom_add = '<div class="text-center"><img src="http://ns.dev/magazine-service/img/ads/'+this.bottom_ad+'" class="ri" /></div>';
		}
		var content_data = '<div data-role="page" id="page_'+this.id+'">'+create_header('page_header')+'<div data-role="content"><div class="content-wrapper "><div class="title-wrapper" ><h1>'+this.title+'</h1></div><div class="content-description">'+top_add+this.description+'<div class="clearfix"></div>'+bottom_add+'</div><div class="clearfix"></div></div></div>'+menu+'</div>'
		$.mobile.pageContainer.append(content_data);
	});
}


/*
 * create index
 */
function create_context(data){
	var menu = menus();
	var context_data = '';
	$.each(data,function(){
		context_data += '<li><a href="#page_'+this.id+'" data-transition="slide">'+this.title+'</a></li>'
	});
	var content_data = '<div id="context" data-role="page">'+create_header()+'<div data-role="content"><ul data-role="listview" data-inset="true" id="context-ul">'+context_data+'</ul></div>'+menu+'<div/>'
	$.mobile.pageContainer.append(content_data);
	
}


/*
 * create menus
 */

function menus(){
	var menu = '<div data-role="footer" data-position="fixed" data-fullscreen="true" data-tap-toggle="false">'+
               '<div data-role="navbar" >'+
                '<ul><li><a href="#home" data-transition="slideup" class="ui-btn ui-shadow ui-corner-all ui-btn-icon-left ui-icon-home ui-btn-active">Home</a></li>'+
                    '<li><a href="#context" data-transition="slideup" class="ui-btn ui-shadow ui-corner-all ui-btn-icon-left ui-icon-grid">Index</a></li>'+
                    '<li><a href="javascript:void(0)" onclick="close_app()" class="ui-btn ui-shadow ui-corner-all ui-btn-icon-left ui-icon-power">Close</a></li>'+
                '</ul>'+
            '</div></div>';
     return menu;
}

/*
 * create header
 */
function create_header(type){
	var common_header = '<header data-role="header" data-theme="b"><h1><img src="images/logo.png"/></h1></header>';
	var page_header = '<header data-role="header" data-theme="b"><a href="#"  onclick="back_page()" class="ui-btn ui-shadow ui-corner-all ui-icon-arrow-l ui-btn-icon-notext ui-btn-inline"></a><h1><img src="images/logo.png"/></h1><a href="#" onclick="next_page()" class="ui-btn ui-shadow ui-corner-all ui-icon-arrow-r ui-btn-icon-notext ui-btn-inline"></a></header>';
	if(type == 'page_header'){
		return page_header;
	}
	return common_header;
}

/*
 * store pages
 */
function store_page_ids(data){
	var pages = new Array();
	$.each(data,function(){
		pages.push("#page_"+this.id);
		}
	);
	setLocalStorage('my_pages',pages);
}

/*
 * back page
 */

function back_page(){
	var base_url = jQuery.mobile.path.parseLocation();
	var c_loc = base_url.hash;
	var i = 0;
	var my_pages = getLocalStorage('my_pages');
	$.each(my_pages,function(){
		
		if(this == c_loc){
			if(i != 0){
				var back_page  = my_pages[(i-1)];
				$.mobile.changePage(back_page,{transition : "slide"});
			}
			return false;
		}
		i++;
	})
	
}

/*
 * next page
 */
function next_page(){
	var base_url = jQuery.mobile.path.parseLocation();
	var c_loc = base_url.hash;
	var j = 1;
	var my_pages = getLocalStorage('my_pages');
	$.each(my_pages,function(){
		if(this == c_loc){
			if(j != my_pages.length){
				var next_page  = my_pages[(j)];
				$.mobile.changePage(next_page,{transition : "slide"});
			}
			return false;
		}
		j++;
	})
	
}


/* 
 * config local storage
 */

//save
function setLocalStorage(fieldName, value) {
	window.localStorage.setItem(fieldName, JSON.stringify(value));	
}
//get
function getLocalStorage(fieldName) {
	if(window.localStorage.getItem(fieldName) == null) {
		return null;
	}
	return JSON.parse(window.localStorage.getItem(fieldName));	
}

/*
 * json debug
 */
function json_debug(data){
	alert(JSON.stringify(data, null, 4));
}
