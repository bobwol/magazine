$( document ).delegate("#magazine", "pageinit", function() {
		$("#magazine-context").hide();
		$("#internet").hide();
 		get_data();
});



/*
 * create contents and contexts
 */

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
			create_covers(msg.Magazine);
			create_contents(msg.Content);
			create_context(msg.Content);
			$('body').removeClass('ui-loading');
		},
		error  : function(msg){
			$('body').removeClass('ui-loading');
			$("#magazine-context").hide();
			$("#internet").show();
		},
       timeout : 10000
		
    });         
 }

/*
 * menus
 */

function show_contexts(){  
	$("#magazine-context").show(1500);
	$('#magazine-cover-page').hide();
	$("#magazine-content").hide();
}


function show_contents(){
	$("#magazine-context").hide('slow');
	$("#magazine-cover-page").show();
	$("#magazine-content").show();
}

function close_app(){
	navigator.app.exitApp();
}

/*
 * pages
 */

// create home page
function create_covers(data){
	$("#magazine-cover-page").html('<img src="http://ns.dev/magazine-service/img/magazine_covers/mobiles/'+data.id+'.png" class="ri"/>');
}
//create contents
function create_contents(data){
	$('#magazine-content').html('');
	$.each(data,function(){
		var top_add = '';
		var bottom_add = '';
		if(this.top_ad != 'none'){
			top_add = '<div class="text-center"><img src="http://ns.dev/magazine-service/img/ads/'+this.top_ad+'" class="ri" /></div>';
		}
		if(this.bottom_ad != 'none'){
			bottom_add = '<div class="text-center"><img src="http://ns.dev/magazine-service/img/ads/'+this.bottom_ad+'" class="ri" /></div>';
		}
		var content_data = '<div class="content-wrapper content_id_'+this.id+'"><div class="title-wrapper" id="content_'+this.id+'"><h1>'+this.title+'</h1></div><div class="content-description">'+top_add+this.description+'<div class="clearfix"></div>'+bottom_add+'</div><div class="clearfix"></div></div>'
		$('#magazine-content').append(
			content_data
		);
	});
}

//create contexts
function create_context(data){
	$('#context-ul').empty();
	$.each(data,function(){
		$('#context-ul').append(
			'<li><a href="#" onclick="goto_contents('+"'content_"+this.id+"'"+')" data-transition="filp">'+this.title+'</a></li>'
		);
	});
	$('#context-ul').listview('refresh');
}

function goto_contents(data){
	var base_url = jQuery.mobile.path.parseLocation();
	
	var new_url = base_url.domain+base_url.pathname+'#'+data;
	//alert(data);
	show_contents();
	$.mobile.navigate(new_url);
}

function goto_home(){
	var base_url = jQuery.mobile.path.parseLocation();
	show_contents();
	
	$.mobile.navigate(base_url.domain+base_url.pathname+'#magazine-cover-page');
}

//create reload if internet not found

function refresh_page(){
	var internet_status = window.navigator.onLine;
	if(internet_status == true){
		$("#magazine-context").hide();
		$("#internet").hide();
 		get_data();
	 } else {
	 	$("#magazine-context").hide();
		$("#internet").show();
	 }
}


function show_loading(){
	$('.loading').show();
}

function json_debug(data){
	alert(JSON.stringify(data, null, 4));
}

