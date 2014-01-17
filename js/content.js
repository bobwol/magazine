
$( document ).on( "pagebeforecreate", "#content", function() {
	var sp = "http://w3.web_apps.dev/magazine-service/contents/content_list_service";
	$.ajax({
		url: sp,
		type:'get',
		dataType: "jsonp",
        
		complete:function(msg){
			//$('#list').html(msg);
			alert('test');
		}
	
	});
});
