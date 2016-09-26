var socket = io(); 
var current_user_id = '';
var active_msg_wrap_for = '';
var to_user_name = '';
var username = '';


function sendmessage(){
  var from = $('#message-textarea').attr('data-message-from');
  var to = $('#message-textarea').attr('data-message-to');
  var message = $('#message-textarea').val();
  if(message != '') {
  socket.emit('chatMessage', from,to, message);
}
$('#message-textarea').val('').focus();

//alert("Message From = "+from+" sendTo ="+to+" Message ="+message);
  return false;
}

function wallStatusPost(){
  var message = $('#statusText').val();
  var user_id = current_user_id;
  //alert(user_id);
  if(message != '') {
  socket.emit('wallstatusPost', user_id, message);
  }
  $('#statusText').val('').focus();

//alert("Message From = "+from+" sendTo ="+to+" Message ="+message);
  return false;
}

function startConversionWithUser(e){
     var to_id = $(e).attr('data-user');
     var from_id = current_user_id;
    //alert(from_id);
     active_msg_wrap_for = parseInt(to_id); 
     //alert(active_msg_wrap_for);
     if($(e).hasClass("newmessage")){
      $('.newMessage_'+to_id).html('');
     $(e).removeClass('newmessage');

     }
     $(e).addClass('active').siblings().removeClass('active');
     $('.chat_with_user_name').empty();
     $('.msg-wrap').empty();     
     $("#loader").show();
     setTimeout( function(){ $("#loader").hide(); }, 6000); 
     $("#message-textarea").removeAttr("disabled");
     $("#message-sendbtn").removeAttr("disabled");
     $("#message-textarea").attr("data-message-to",to_id);
     $("#message-textarea").attr("data-message-from",from_id);
    
     var data = {};
          data.to_id = to_id;
          data.from_id = from_id;

     $.ajax('http://localhost:8080/startConversionWithUser', {
                  type: 'POST',
                  data: data,
                  
                  success: function(res) {

                     $('.chat_with_user_name').empty();
                        var conversation_html = '';
                        for (var i = 0; i < res.toUserInfo.length; i++){
                            to_user_name = res.toUserInfo[i].fname +' '+res.toUserInfo[i].lname;
                            $('.chat_with_user_name').append('<div class="conversationHead">' + to_user_name +'</div>');
                          }
                        for (var i = 0; i < res.conversionMessage.length; i++){
                            var nme = (res.conversionMessage[i].from_id == current_user_id ) ? 'Me' : to_user_name;
                            var message_send_by = (nme == 'Me') ? 'message_send_by_me' : 'message_send_by_other';
                            conversation_html +='<div class="media msg"><a class="pull-left" href="#"><img class="media-object img-circle"  data-src="holder.js/64x64" alt="64x64" style="width: 32px; height: 32px;" src="images.png"></a><div class="media-body '+ message_send_by +'"><small class="pull-right time"><i class="fa fa-clock-o"></i>'+ res.conversionMessage[i].sent_on +'</small><h5 class="media-heading">'+ nme +'</h5><small class="col-lg-10">'+res.conversionMessage[i].message+'</small></div></div>';
                          }
                    $('.msg-wrap').html(conversation_html);

                  // console.log('success');
                 },
                  error  : function() { console.log('error');}
          });


     //socket.emit('startConversionWithUser', to_id,from_id);
     chatBoxScrollDown();
}

function notifyTyping(e) { 
  var notify_to = $(e).attr('data-message-to');
  //alert("notify_to =" + notify_to);

  var user = current_user_id;

  socket.emit('notifyUser', user,notify_to);
}

function chatBoxScrollDown(){
  $('.msg-wrap').animate({
      scrollTop: $('.msg-wrap').get(0).scrollHeight}, 2000);
}
function cutString(text){    
             
     var charsToCutTo = 30;
        if(text.length>charsToCutTo){
            var strShort = "";
            for(i = 0; i < charsToCutTo; i++){
                strShort += text[i];
            }
            
           strShort = strShort + "...";
           return strShort;
        }            
     };

 /*------login start here-----------*/
 /*socket.on('login', function (res,userinfo) {

  //alert("login inside");
  var html = '';
  var username = '';
  var status;
  if(userinfo){
    for (var i = 0; i < userinfo.length; i++){
      username = userinfo[i].fname +' '+ userinfo[i].lname;
      current_user_id = userinfo[i].id;
    }
    $('.username').html(username);
  }
  if(res){
  //alert("login res inside");
//console.log("lenght is"+res.length);
        for (var i = 0; i < res.length; i++){
            if(res[i].id != current_user_id){
            if(res[i].online == 'y'){
              status ='online';
            }else{
              status ='offline';
            }
            // We store html as a var then add to DOM after for efficiency
            html += '<div class="media conversation" onclick="startConversionWithUser(this)" data-user ="'+res[i].id+'"><a class="pull-left" href="#"><img class="media-object img-circle " data-src="holder.js/64x64" alt="64x64" style="width: 50px; height: 50px;" src="images.png"></a><div class="media-body"><h5 class="media-heading">'+ res[i].fname +' '+ res[i].lname +'</h5><span class="'+status+'"></span></div></div>';
            //console.log('Fname'+res[i].fname+'Lname'+res[i].lname);
        //console.log(i);
      }
    }
        $('.conversation-wrap').html(html);
      
    }else{
      html ="<li>No Users Found</li>";
        $('.conversation-wrap').html(html);

    }
    //alert("user id"+res.session);
    //document.location.href="login";
  
});
*/
socket.on('wronglogincredential', function(res){
  if(res.message == "wronglogincredential"){
    $('#signuptab').removeClass('active');
    $('#logintab').addClass('active');
    $('.tab-content > div').not('#sign').hide();
    $('#login').show();

    var wronglogincredential = "Sorry,The email id & password is incorrect!!";
    $('.login-validationerror').html(wronglogincredential);
    setTimeout(function() {
        $(".login-validationerror").hide();

    }, 5000);
  }
});

socket.on('emailidexit', function(res){
  if(res.message == "emailidexit"){
    if($('#logintab').hasClass('active')){
      //alert("login active");
    $('#logintab').removeClass('active');
    $('#signuptab').addClass('active');
    $('#login').hide();
    $('#signup').show();
    }

    var emailidexit = "This email id allready exit,please try with diffrent email id";
    $('.sign-validationerror').html(emailidexit);
    setTimeout(function() {
        $(".sign-validationerror").hide();

    }, 5000);
  }
});

socket.on('chatMessage', function(from,to, msg){
  
  var message_html ='';
  var sent_on = new Date().getTime();
  var nme = (from == current_user_id ) ? 'Me' : to_user_name;
  var message_send_by = (nme == 'Me') ? 'message_send_by_me' : 'message_send_by_other';
//  console.log("name"+nme);
  if(current_user_id == from ){
  $('.msg-wrap').append('<div class="media msg"><a class="pull-left" href="#"><img class="media-object img-circle"  data-src="holder.js/64x64" alt="64x64" style="width: 32px; height: 32px;" src="images.png"></a><div class="media-body '+ message_send_by +'"><small class="pull-right time"><i class="fa fa-clock-o"></i>'+ sent_on +'</small><h5 class="media-heading">'+ nme +'</h5><small class="col-lg-10">'+msg+'</small></div></div>');
     chatBoxScrollDown();
  }else if(active_msg_wrap_for == from) {

    $('.msg-wrap').append('<div class="media msg"><a class="pull-left" href="#"><img class="media-object img-circle"  data-src="holder.js/64x64" alt="64x64" style="width: 32px; height: 32px;" src="images.png"></a><div class="media-body '+ message_send_by +'"><small class="pull-right time"><i class="fa fa-clock-o"></i>'+ sent_on +'</small><h5 class="media-heading">'+ nme +'</h5><small class="col-lg-10">'+msg+'</small></div></div>');
     chatBoxScrollDown();
  }else if(to == current_user_id){
    //alert("hello checking"+from);
    var user = parseInt(from);
    $('.conversation').each(function(index,value){
      if($(value).data( "user" ) == user){
        //alert("inside conversation loop");
        console.log(value);
        if ($('.newMessage_'+user).is(':empty')){
          $('.notifyTyping_'+user).empty();
          $(value).addClass('newmessage');
            $('.newMessage_'+user).html('<b>'+cutString(msg)+'</b>');  
        }
      }
      //console.log(v);
    });

  //setTimeout(function(){ $('.newMessage_'+user).html(''); }, 10000);
}

});
/*---------login end here----*/
/*socket.on('startConversionWithUser', function(to_user,chatmessage){
  $('.chat_with_user_name').empty();
  var conversation_html = '';
  var to_user_name = '';
   for (var i = 0; i < to_user.length; i++){
    to_user_name = to_user[i].fname +' '+to_user[i].lname;
  $('.chat_with_user_name').append('<div class="conversationHead">' + to_user[i].fname +' '+to_user[i].lname  +'</div>');
}
  for (var i = 0; i < chatmessage.length; i++){
  
  var nme = (chatmessage[i].from_id == current_user_id ) ? 'Me' : to_user_name;
  var message_send_by = (nme == 'Me') ? 'message_send_by_me' : 'message_send_by_other';
    conversation_html +='<div class="media msg"><a class="pull-left" href="#"><img class="media-object img-circle"  data-src="holder.js/64x64" alt="64x64" style="width: 32px; height: 32px;" src="images.png"></a><div class="media-body '+ message_send_by +'"><small class="pull-right time"><i class="fa fa-clock-o"></i>'+ chatmessage[i].sent_on +'</small><h5 class="media-heading">'+ nme +'</h5><small class="col-lg-10">'+chatmessage[i].message+'</small></div></div>';
}
$('.msg-wrap').html(conversation_html);
});*/
 

/*socket.on('chatMessage', function(from_id,to_id,message){
    var from = parseInt(from_id);
    var to = parseInt(to_id);
     var message_to_html ='';
       var sent_on = new Date().getTime();
        var nme = (from == current_user_id ) ? 'Me' : to_user_name;
    var message_send_by = (nme == 'Me') ? 'message_send_by_me' : 'message_send_by_other';
    message_to_html ='<div class="media msg"><a class="pull-left" href="#"><img class="media-object img-circle"  data-src="holder.js/64x64" alt="64x64" style="width: 32px; height: 32px;" src="images.png"></a><div class="media-body '+ message_send_by +'"><small class="pull-right time"><i class="fa fa-clock-o"></i>'+ sent_on +'</small><h5 class="media-heading">'+ nme +'</h5><small class="col-lg-10">'+message+'</small></div></div>';
    $('.msg-wrap').append(message_to_html);
     chatBoxScrollDown();
     /*alert("active_msg_wrap_for = "+active_msg_wrap_for);
     alert("to_id = "+to_id);*/
     //alert("From = "+from_id+" To = "+ to_id+" Message = "+ message);
     //console.log("From = "+from_id+" To = "+ to_id+" Message = "+ message);
     /*if(current_user_id == from ){
       //alert(active_msg_wrap_for+'='+ to+'=>'+current_user_id+'='+from);
       var message_from_html ='';
    var sent_on = new Date().getTime();
    var nme = (from == current_user_id ) ? 'Me' : to_user_name;
    var message_send_by = (nme == 'Me') ? 'message_send_by_me' : 'message_send_by_other';
    message_from_html ='<div class="media msg"><a class="pull-left" href="#"><img class="media-object img-circle"  data-src="holder.js/64x64" alt="64x64" style="width: 32px; height: 32px;" src="images.png"></a><div class="media-body '+ message_send_by +'"><small class="pull-right time"><i class="fa fa-clock-o"></i>'+ sent_on +'</small><h5 class="media-heading">'+ nme +'</h5><small class="col-lg-10">'+message+'</small></div></div>';
    $('.msg-wrap').append(message_from_html);
     chatBoxScrollDown();
     }else if(active_msg_wrap_for == from) {
       //alert(active_msg_wrap_for+'='+ from+'=>'+current_user_id+'='+to);
       var message_to_html ='';
       var sent_on = new Date().getTime();
        var nme = (from == current_user_id ) ? 'Me' : to_user_name;
    var message_send_by = (nme == 'Me') ? 'message_send_by_me' : 'message_send_by_other';
    message_to_html ='<div class="media msg"><a class="pull-left" href="#"><img class="media-object img-circle"  data-src="holder.js/64x64" alt="64x64" style="width: 32px; height: 32px;" src="images.png"></a><div class="media-body '+ message_send_by +'"><small class="pull-right time"><i class="fa fa-clock-o"></i>'+ sent_on +'</small><h5 class="media-heading">'+ nme +'</h5><small class="col-lg-10">'+message+'</small></div></div>';
    $('.msg-wrap').append(message_to_html);
     chatBoxScrollDown();

     }*/
  /*if(active_msg_wrap_for == to || current_user_id == from ){
    var message_html ='';
    var sent_on = new Date().getTime();
    var nme = (from == current_user_id ) ? 'Me' : to_user_name;
    var message_send_by = (nme == 'Me') ? 'message_send_by_me' : 'message_send_by_other';
    message_html ='<div class="media msg"><a class="pull-left" href="#"><img class="media-object img-circle"  data-src="holder.js/64x64" alt="64x64" style="width: 32px; height: 32px;" src="images.png"></a><div class="media-body '+ message_send_by +'"><small class="pull-right time"><i class="fa fa-clock-o"></i>'+ sent_on +'</small><h5 class="media-heading">'+ nme +'</h5><small class="col-lg-10">'+message+'</small></div></div>';
    $('.msg-wrap').append(message_html);
     chatBoxScrollDown();


  }
  /*else{
    //alert("message-wrap-not-available");
  }*/
  /*var me = $('#user').val();
  var color = (from == me) ? 'green' : '#009afd';
  var from = (from == me) ? 'Me' : from;
  $('#messages').append('<li><b style="color:' + color + '">' + from + '</b>: ' + msg + '</li>');*/
/*});*/
 
socket.on('notifyUser', function(user,notify_to){
  //alert(notify_to+"="+ current_user_id );
  if(notify_to == current_user_id){
  var me = current_user_id;
  if(user != me) {
    /*if($(".conversation").data( "user" ) === user){
    $('.conversation').text('typing...');  
    }*/
    $('.conversation').each(function(i,v){
      if($(v).data( "user" ) === user){
        if ($('.notifyTyping_'+user).is(':empty')){
            $('.notifyTyping_'+user).html('<b>typing...</b>');  
        }
      }
      //console.log(v);
    });
  }
  setTimeout(function(){ $('.notifyTyping_'+user).html(''); }, 10000);
}
});

socket.on('wallstatusPost', function(user_id,msg){
  if(user_id == current_user_id){
    var sent_on = new Date().getTime();
    //var nme = (user_id == current_user_id ) ? 'Me' : to_user_name;
    //var nme = (user_id == current_user_id ) ? 'Me' : to_user_name;
    $('.msg-wrap').append('<div class="panel panel-primary"><div class="panel-heading"><h3 class="panel-title">'+username+'<small class="pull-right time"><i class="fa fa-clock-o"></i>'+sent_on +'</small></h3></div><div class="panel-body"><div class="media msg"><a class="pull-left" href="#"><img class="media-object img-circle"  data-src="holder.js/64x64" alt="64x64" style="width: 32px; height: 32px;" src="images.png"></a><div class="media-body"><small class="col-lg-10">'+msg+'</small></div></div></div></div>');

  }

});
 
$(document).ready(function(){
  $("#loader").show();
  setTimeout( function(){ $("#loader").hide(); }, 3000); 

  /*var name = makeid();
  $('#user').val(name);
  socket.emit('chatMessage', 'System', '<b>' + name + '</b> has joined the discussion');*/
  /*$('.conversation-wrap').on('click','.conversation',function(){
   
  });*/

  
});
 
function getAllUsers(){
  $.ajax('http://localhost:8080/getAllUsers', {
              type: 'POST',
              success: function(res) { 
                    var html = '';
                    var status;
                    if(res.currentUserinfo){

                      for (var i = 0; i < res.currentUserinfo.length; i++){
                        username = res.currentUserinfo[i].fname +' '+ res.currentUserinfo[i].lname;
                        current_user_id = res.currentUserinfo[i].id;
                      }
                      $('.username').html(username);
                    }
                    if(res.getUserCollections){
                        //alert("login res inside");
                        //console.log("lenght is"+res.length);
                      for (var i = 0; i < res.getUserCollections.length; i++){
                        if(res.getUserCollections[i].id != current_user_id){
                          if(res.getUserCollections[i].online == 'y'){
                            status ='online';
                          }else{
                            status ='offline';
                          }
                                  // We store html as a var then add to DOM after for efficiency
                                  html += '<div class="media conversation" onclick="startConversionWithUser(this)" data-user ="'+res.getUserCollections[i].id+'"><a class="pull-left" href="#"><img class="media-object img-circle " data-src="holder.js/64x64" alt="64x64" style="width: 50px; height: 50px;" src="images.png"></a><div class="media-body"><h5 class="media-heading">'+ res.getUserCollections[i].fname +' '+ res.getUserCollections[i].lname +'</h5><span class="'+status+'"></span><span class="notifyTyping_'+res.getUserCollections[i].id+'"></span><span class="newMessage_'+res.getUserCollections[i].id+'"></span></div></div>';
                                  //console.log('Fname'+res[i].fname+'Lname'+res[i].lname);
                              //console.log(i);
                            }
                          }
                          $('.conversation-wrap').html(html);

                        }else{
                          html ="<li>No Users Found</li>";
                          $('.conversation-wrap').html(html);

                        }
                          //alert("user id"+res.session);
                          //document.location.href="login";

                          console.log(res.message);
                        },
                        error  : function() { console.log('error');}
                      });
}

function getWallStatusPost(){

  $.ajax('http://localhost:8080/getWallStatusPost', {
              type: 'POST',
              success: function(res) { 
                    var html = '';
                    var status;
                    if(res.currentUserinfo){

                      for (var i = 0; i < res.currentUserinfo.length; i++){
                        username = res.currentUserinfo[i].fname +' '+ res.currentUserinfo[i].lname;
                        current_user_id = res.currentUserinfo[i].id;
                      }
                      $('.username').html(username);
                      $('.sessionName').html(username);
                      $('.profile-usertitle-name').html(username);
                    }
                    if(res.getWallStatusCollections){
                        //alert("login res inside");
                        //console.log("lenght is"+res.length);
                      for (var i = 0; i < res.getWallStatusCollections.length; i++){
                        // We store html as a var then add to DOM after for efficiency
                                  html += '<div class="panel panel-primary"><div class="panel-heading"><h3 class="panel-title">'+username+'<small class="pull-right time"><i class="fa fa-clock-o"></i>'+res.getWallStatusCollections[i].sent_at +'</small></h3></div><div class="panel-body"><div class="media msg"><a class="pull-left" href="#"><img class="media-object img-circle"  data-src="holder.js/64x64" alt="64x64" style="width: 32px; height: 32px;" src="images.png"></a><div class="media-body"><small class="col-lg-10">'+res.getWallStatusCollections[i].status+'</small></div></div></div></div>';
                                  //console.log('Fname'+res[i].fname+'Lname'+res[i].lname);
                              //console.log(i);
                            
                          }
                          $('.msg-wrap').append(html);

                        }else{
                          html ="<li>No Status Available.</li>";
                          $('.msg-wrap').append(html);

                        }
                          //alert("user id"+res.session);
                          //document.location.href="login";

                          console.log(res.message);
                        },
                        error  : function() { console.log('error');}
                      });


}
