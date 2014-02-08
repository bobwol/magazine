$(document).on('mobileinit',function(){
	set_viewport();
	get_data();
	set_swipe_event();
});

$(document).on( "orientationchange", function( event ) {
	//alert('test');
});



/*
 * get data 
 */
 function get_data(){
 	var url = 'http://magazine.w3-app.com/mobiles/magazine_paid.json';      
    $.ajax({
        url			: url ,
		crossDomain : true,
        dataType	: "jsonp",
		beforeSend: loading(),
        success	: function(msg){
			store_page_ids(msg.Content);
			create_home(msg.Magazine);
			create_context(msg.Content);
			create_magazine(msg.Content);
			//processing responsive image
			$('.content-description img').addClass('ri');
			ui_content();
			
		},
		complete:function(msg){
			$.mobile.changePage('#home');
		},
		error  : function(msg){
			$.mobile.changePage('#error',{transition:"turn"});
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
	var home_data = '<div data-role="page" id="home">'+create_header()+'<div data-role="content" class="home-content my_content"><img src="http://magazine.w3-app.com/img/magazine_covers/mobiles/'+data.id+'.png" class="home-baner ri"/></div>'+menu+'</div>';
	$.mobile.pageContainer.append(home_data);
	
	$('.home-baner').css({'min-width':d_width,'min-height': d_height-87});
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
			top_add = '<div class="text-center"><img src="http://magazine.w3-app.com/img/ads/'+this.top_ad+'" class="ri" /></div>';
		}
		if(this.bottom_ad != 'none'){
			bottom_add = '<div class="text-center"><img src="http://magazine.w3-app.com/img/ads/'+this.bottom_ad+'" class="ri" /></div>';
		}
		var content_data = '<div data-role="page" id="page_'+this.id+'">'+create_header('page_header')+'<div data-role="content" class="my_content"><div class="content-wrapper "><div class="title-wrapper" ><h1>'+this.title+'</h1></div><div class="content-description">'+top_add+this.description+'<div class="clearfix"></div>'+bottom_add+'</div><div class="clearfix"></div></div><div class="bottom-space"> </div></div>'+menu+'</div>'
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
	var content_data = '<div id="context" data-role="page">'+create_header()+'<div data-role="content" class="my_content"><ul data-role="listview" data-inset="true" id="context-ul">'+context_data+'</ul><div class="bottom-space"> </div></div>'+menu+'<div/>'
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
	var common_header = '<header data-role="header" data-theme="b" data-position="fixed" data-fullscreen="true" data-tap-toggle="false"><h1><img src="images/logo.png" id="logo"/></h1></header>';
	var page_header = '<header data-role="header" data-theme="b" data-position="fixed" data-fullscreen="true" data-tap-toggle="false"><a href="#"  onclick="back_page()" class="ui-btn ui-shadow ui-corner-all ui-icon-arrow-l ui-btn-icon-notext ui-btn-inline"></a><h1><img src="images/logo.png" id="logo"/></h1><a href="#" onclick="next_page()" class="ui-btn ui-shadow ui-corner-all ui-icon-arrow-r ui-btn-icon-notext ui-btn-inline"></a></header>';
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
	pages[0] = '#home';
	pages[1] = '#context';
	$.each(data,function(){
		pages.push("#page_"+this.id);
		}
	);
	setLocalStorage('my_pages',pages);
	//json_debug(getLocalStorage('my_pages'));
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
 * loading
 */
function loading(){
	$.mobile.changePage('#loading');
}

/*
 * close app
 */
function close_app(){
	navigator.app.exitApp();
}



/*
 * ui content
 */
function ui_content(){
	var d_height = $(window).height();
	$('.my_content').height(d_height-83);
}


//set viewpost
function set_viewport(){
	$('<meta>', { name: 'viewport',content: 'width=device-width, minimum-scale=1, maximum-scale=4, user-scalable=yes'}).appendTo('head');
}

function set_swipe_event(){
		$( window ).on( "swipeleft", function( event ) { 
			back_page();
		});

		$( window ).on( "swiperight", function( event ) { 
				next_page();
		});
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

