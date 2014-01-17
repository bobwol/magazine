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
 	var url = 'http://magazine.w3-app.com/mobiles/magazine_paid.json';      
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

/*
 * pages
 */

// create home page
function create_covers(data){
	$("#magazine-cover-page").html('<img src="http://magazine.w3-app.com/img/magazine_covers/mobiles/'+data.id+'.png" class="ri"/>');
}
//create contents
function create_contents(data){
	$('#magazine-content').html('');
	$.each(data,function(){
		$('#magazine-content').append(
			'<div class="content-wrapper content_id_'+this.id+'"><div class="title-wrapper" id="content_'+this.id+'"><h1>'+this.title+'</h1></div><div class="content-description">'+this.description+'</div></div>'
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

