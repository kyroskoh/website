webpackJsonp([4],{309:function(e,s,n){(function(e){(function(){"use strict";e(function(){e("#compose.message-composition").each(function(){var s=e("#compose"),n=s.find(".modal-message"),t=s.find("#compose-form"),i=e("#alerts-container"),o=t.find("textarea#compose-message"),a=t.find("input#compose-recipients"),c=t.find(".modal-recipients .recipient-container"),r=t.find("button#modal-send-btn"),l=t.find("button#modal-close-btn"),d=t.find(".modal-user-groups"),p=!1,u=function(){t.find("button,input,textarea").attr("disabled","disabled")},f=function(){t.find("button,input,textarea").removeAttr("disabled")},m=function(){o.val(""),a.val(""),c.empty(),n.hide(),f()},h=function(){var t=o.val(),a=w();return 0==a.length?void n.show().html('<span class="text-danger">Recipients required</span>'):""==t.trim()?void n.show().html('<span class="text-danger">Message required</span>'):t.trim().length>500?void n.show().html('<span class="text-danger">Your message cannot be longer than 500 characters</span>'):(p=!0,u(),n.show().html('<i class="fa fa-cog fa-spin"></i> Sending message ...'),void e.ajax({type:"POST",url:"/profile/messages/send",data:{recipients:a,message:t},success:function(e){p=!1,!0===e.success?(i.show().html('<div class="alert alert-info"><strong>Sent!</strong> Your message has been sent.</div>'),window.setTimeout(function(){i.hide()},3e3),s.modal("hide")):(n.show().html('<span class="text-danger">'+e.message+"</span>"),f())},error:function(e){p=!1,n.show().html('<span class="text-danger">'+e.status+": "+e.statusText+"</span>")}}))},g=function(e){for(var s=e.split(" "),n=[],t=0;t<s.length;++t)0==s[t].search(/^[A-Z0-9_]{3,20}$/i)&&n.push(s[t]);return n},v=function(e,s){var n=e.toLowerCase();s=["recipient",s],c.find('.recipient[data-recipient="'+n+'"]').get(0)||c.append('<span class="'+s.join(" ")+'" data-recipient="'+n+'">                    <span class="recipient-name">'+e+'</span>                    <i class="glyphicon glyphicon-remove remove-recipient" title="Remove"></i>                  </span>')},w=function(){var s=[];return c.find(".recipient").each(function(){s.push(e(this).data("recipient"))}),s};s.on("keydown",function(e){n.hide()}),s.on("shown.bs.modal",function(s){e(this).find("input#compose-recipients").focus()}),s.on("hidden.bs.modal",function(e){p||m()}),s.on("click",".remove-recipient",function(){e(this).closest(".recipient").remove()}),s.on("change","input#compose-recipients",function(s){var n=g(e(this).val());a.val("");for(var t=0;t<n.length;++t)v(n[t])}),s.on("keypress","input#compose-recipients",function(s){var n=/[\;\:\,\']/i,t=s.which;if(32==t||13==t||n.test(String.fromCharCode(t))){var i=g(e(this).val());a.val("");for(var o=0;o<i.length;++o)v(i[o]);s.preventDefault(),s.stopPropagation()}a.focus()}),l.on("click",function(e){s.modal("hide")}),r.on("click",function(e){h()}),o.on("keydown",function(e){e.ctrlKey&&13==e.keyCode&&(h(),e.preventDefault(),e.stopPropagation())}),d.on("click",".groups a",function(){v(e(this).text(),"group")});var b=e("#compose");e(".message-list").on("click",".message-header,.message-summary",function(){e(this).closest(".message").toggleClass("message-active message-hidden")}),e(".message-reply").on("click","#reply-toggle",function(){b.unbind("shown.bs.modal").on("shown.bs.modal",function(){e(this).find("textarea").focus()}),b.find("#composeLabel").text("Reply ..."),b.find(".modal-recipients,.modal-settings,.modal-user-groups").hide(),a.val(""),c.empty(),v(e(this).data("replyto"))}),e(".message-list").each(function(){var s=function(){e(this).closest(".message").addClass("message-active").removeClass("message-hidden")};e(this).on("click",".message-summary",s)})})}),e(function(){var s=function(){e(this).find("i").attr("class","fa fa-dot-circle-o"),e(this).addClass("active")},n=function(){e(this).find("i").attr("class","fa fa-circle-o"),e(this).removeClass("active")},t=function(t){var i=e(this);t.preventDefault(),t.stopPropagation(),i.hasClass("active")?n.apply(i):s.apply(i)},i=function(s){var n=e(this),t=n.data("id");void 0!=t&&(s.preventDefault(),s.stopPropagation(),window.location.href="/profile/messages/"+t)},o=function(){e(this).addClass("pressed")},a=function(){e(this).removeClass("pressed")};e("table#inbox").each(function(s,n){e(n).on("click","tbody tr",i).on("click","tbody td.selector",t).on("mousedown","tbody tr",o).on("mouseup","tbody tr",a)}),e("#mark-all").on("click",function(s){s.preventDefault(),e.ajax({url:"/profile/messages/openall",success:function(){window.location.reload()}})})}),e(function(){var s=e(".message-list .message");if(s.length>10){var n=s.slice(0,-10);n.wrapAll('<div class="collapsed-group">                <div class="collapsed-group-label"><a href="#"><i class="fa fa-chevron-circle-down"></i> show '+n.length+" older messages</a></div>            </div>")}e(".message-list").on("click",".collapsed-group",function(s){e(this).addClass("active"),s.preventDefault()}),e(window).on("load",function(){e(".message-reply").each(function(){var s=e(this),n=s.offset().top+s.outerHeight(!0)-e(window).height();e("html,body").animate({scrollTop:n},5)})})})}).call(window)}).call(s,n(4))},312:function(e,s,n){"use strict";n(309)}},[312]);