$(document).ready(function($){
	webresize();
	/*==================================================================================================	
	화면 관련 
	==================================================================================================*/
	$(window.document).on("contextmenu" , function(event){return false;}); // 우클릭방지
	$(window.document).on("dragstart" , function(event){return false;}); // 드래그 방지
	
	
    var full = $('#fullscreen');
    $(full).show();
	$("#TextCallDestDN").val('');
	
	
	
	// 로그인 페이지 닫기
    $('.login-close').click(function(){
		$(full).fadeOut();
		$('#login-check').attr('aria-pressed', 'true');
		$('#login-check').addClass('active');
		
		$("#btn_ready").prop("disabled", true);
		$("#TextCallDestDN").prop("disabled", true);
		$("#btn_makeCall").prop("disabled", true);
		$("#btn_answerCall").prop("disabled", true);
		$("#btn_clearCall").prop("disabled", true);
		$("#btn_holdCall").prop("disabled", true);
		$("#btn_retrieveCall").prop("disabled", true);
		$('#agent_state').prop("selectedIndex",0);
		$("#agent_state").prop("disabled", true);
    });  
	
	// 로그인 체크 토글
	$('#login-check').click(function(){
		var loginChk = $('#login-check').attr('aria-pressed');
		if(loginChk == true) {
			$(full).fadeIn(300);
		}else {
			ipron.AgentLogout(g_Device_DN , g_Agent_Id, g_Tenant_Name, 0);
			$(full).show();
		}
		
	});  
	
	
	
	
	// 로그인 버튼
	$('.log-btn').click(function(){
		g_Device_DN 	= TextAgentDN.value;
		g_Tenant_Name 	= TextTenantName.value;
		g_Agent_Id 		= TextAgentID.value;
		g_Password 		= TextAgentPasswd.value;
		
		$('.id-status').removeClass('wrong-entry');
		$('.pwd-status').removeClass('wrong-entry');
		$('.tn-status').removeClass('wrong-entry');
		$('.dn-status').removeClass('wrong-entry');
			
		if(g_Agent_Id == null || g_Agent_Id == '' ){
			$('.id-status').addClass('wrong-entry');
			$('.error-alert').text("아이디를 입력해주시기 바랍니다.");
			$('.error-alert').fadeIn(500);
			
		} else if (g_Password == null || g_Password == '' ){
			$('.pwd-status').addClass('wrong-entry');
			$('.error-alert').text("비밀번호를 입력해주시기 바랍니다.");
			$('.error-alert').fadeIn(500);
			
		} else if (g_Tenant_Name == null || g_Tenant_Name == '' ){
			$('.tn-status').addClass('wrong-entry');
			$('.error-alert').text("테넌트를 입력해주시기 바랍니다.");
			$('.error-alert').fadeIn(500);
			
		} else if (g_Device_DN == null || g_Device_DN == '' ){
			$('.dn-status').addClass('wrong-entry');
			$('.error-alert').text("내선번호를 입력해주시기 바랍니다.");
			$('.error-alert').fadeIn(500);
			
		} else {
			ipron.SetProtocol(g_Protocol);
			ipron.SetServerInfo(g_Ip, g_Port, g_Ip2, g_Port);
			ipron.SetHeartbeatInfo(10, 18);
			ipron.OpenServer("EASD Test App", CBFuncEvent, CBFuncResponse);
			
			$('#login-check').attr('aria-pressed', 'false');
			$('#login-check').removeClass('active');
		}
	});
	
	
	
	
	// 로그인 input영역 Refresh
	$('.id-status').keypress(function(){
		$('.id-status').removeClass('wrong-entry');
		$('.error-alert').fadeOut();
	});
	$('.pwd-status').keypress(function(){
		$('.pwd-status').removeClass('wrong-entry');
		$('.error-alert').fadeOut();
	});
	$('.tn-status').keypress(function(){
		$('.tn-status').removeClass('wrong-entry');
		$('.error-alert').fadeOut();
	});
	$('.dn-status').keypress(function(){
		$('.dn-status').removeClass('wrong-entry');
		$('.error-alert').fadeOut();
	});
	
	// 메뉴 토글
	$('.navigation li a').click(function() {
		var $this = $(this).closest('li');
		var index = $this.index();
		var $article = $('article');

		$('.navigation li, article').removeClass('selected');
		$this.addClass('selected');
		$article.eq(index).addClass('selected');
	});
	
	// 화면 리사이즈 불가
	$( window ).resize( function() {
		$("#infoModalTitle").text("변경 불가");
		$("#infoModalBody").text("브라우저 크기 변경은 불가합니다.");
		$('#infoModal').modal({backdrop: 'static', keyboard: false}, 'show');
		webresize();
	});
	
	/*==================================================================================================	
	전화 관련 
	==================================================================================================*/
	// 전화 걸기 버튼
	$('#btn_makeCall').click(function(){
		g_Device_DN = TextAgentDN.value;
		g_CallDest_DN = TextCallDestDN.value;
		
		if(chkFlag == 1) {
			if(g_CallDest_DN.length > 3){
				//$("#TextCallDestDN").val('');
				if(g_CallDest_DN.length > 9) g_CallDest_DN = '9' + g_CallDest_DN;
				ipron.MakeCall (g_Device_DN, g_CallDest_DN, '', 0, 0, '', '', 0, 0, 0, 0, '', 3, g_MediaType, 1, 1, 0);	
				
			} else if(g_CallDest_DN.length < 1 ){
				$("#infoModalTitle").text("전화번호 확인");
				$("#infoModalBody").text("전화번호를 입력해주시기 바랍니다.");
				$('#infoModal').modal({backdrop: 'static', keyboard: false}, 'show');
				disEnable(0, 0);
			} else {
				$("#infoModalTitle").text("전화번호 확인");
				$("#infoModalBody").text("전화번호를 확인해주시기 바랍니다.");
				$('#infoModal').modal({backdrop: 'static', keyboard: false}, 'show');
				disEnable(0, 0);
			}
		} else {
			$("#infoModalTitle").text("로그인 필요");
			$("#infoModalBody").text("로그인이 필요한 서비스입니다.");
			$('#infoModal').modal({backdrop: 'static', keyboard: false}, 'show');
		}
	});	
	
	// 전화 받기 버튼
	$('#btn_answerCall, #btn_answerCall2').click(function(){
		g_Device_DN = TextAgentDN.value;
		if(chkFlag == 1) {
			ipron.AnswerCall(g_Device_DN, g_ConnId, g_exHandle, g_MediaType);
			
		} else {
			$("#infoModalTitle").text("로그인 필요");
			$("#infoModalBody").text("로그인이 필요한 서비스입니다.");
			$('#infoModal').modal({backdrop: 'static', keyboard: false}, 'show');
		}
	});

	// 전화 끊기 버튼
	$('#btn_clearCall, #btn_clearCall2').click(function(){
		g_Device_DN = TextAgentDN.value;
		if(chkFlag == 1) {
			console.log("호 끊기 버튼 클릭 : g_ConnID======================================> + " + g_ConnId);
			
			if(g_ConnId != g_ConnId2 && g_ConnId2 != "")
				ipron.ClearCall(g_Device_DN, g_ConnId2, 0, g_MediaType);
			else
				ipron.ClearCall(g_Device_DN, g_ConnId, 0, g_MediaType);
			
			$("#TextCallDestDN").prop("disabled", false);
			$("#btn_makeCall").prop("disabled", false);
			$("#btn_answerCall").prop("disabled", false);
			$("#btn_clearCall").prop("disabled", true);
			$("#btn_holdCall").prop("disabled", true);
			$("#btn_retrieveCall").prop("disabled", true);
		} else {
			$("#infoModalTitle").text("로그인 필요");
			$("#infoModalBody").text("로그인이 필요한 서비스입니다.");
			$('#infoModal').modal({backdrop: 'static', keyboard: false}, 'show');
		}
	});
	
	// 전화 대기 버튼
	$('#btn_holdCall, #btn_holdCall2').click(function(){
		g_Device_DN = TextAgentDN.value;
		if(chkFlag == 1) {
			ipron.HoldCall(g_Device_DN, g_ConnId, 0, g_MediaType);
			
			$("#TextCallDestDN").prop("disabled", true);
			$("#btn_makeCall").prop("disabled", true);
			$("#btn_answerCall").prop("disabled", true);
			$("#btn_clearCall").prop("disabled", false);
			$("#btn_holdCall").prop("disabled", true);
			$("#btn_retrieveCall").prop("disabled", false);
		} else {
			$("#infoModalTitle").text("로그인 필요");
			$("#infoModalBody").text("로그인이 필요한 서비스입니다.");
			$('#infoModal').modal({backdrop: 'static', keyboard: false}, 'show');
		}
	});
	
	// 전화 대기해제 버튼
	$('#btn_retrieveCall, #btn_retrieveCall2').click(function(){
		g_Device_DN = TextAgentDN.value;
		if(chkFlag == 1) {
			ipron.RetrieveCall(g_Device_DN, g_ConnId, 0, g_MediaType);
			
			$("#TextCallDestDN").prop("disabled", false);
			$("#btn_makeCall").prop("disabled", false);
			$("#btn_answerCall").prop("disabled", false);
			$("#btn_clearCall").prop("disabled", false);
			$("#btn_holdCall").prop("disabled", false);
			$("#btn_retrieveCall").prop("disabled", true);
		} else {
			$("#infoModalTitle").text("로그인 필요");
			$("#infoModalBody").text("로그인이 필요한 서비스입니다.");
			$('#infoModal').modal({backdrop: 'static', keyboard: false}, 'show');
		}
	});
	
	// 전화 통화중 즉시전달 버튼
	$('#btn_singlestepTransfer').click(function(){
		g_Device_DN = TextAgentDN.value;
		g_CallDest_DN = TextCallDestDN.value;
		
		if(chkFlag == 1) {
			ipron.SinglestepTransfer(g_Device_DN, g_ConnId, g_CallDest_DN, "", 0, 0, "", "", 0, 0, 0, 0, g_exHandle, 0, 1, 1, 0);
	
			$("#TextCallDestDN").prop("disabled", false);
			$("#btn_makeCall").prop("disabled", false);
			$("#btn_answerCall").prop("disabled", false);
			$("#btn_clearCall").prop("disabled", false);
			$("#btn_holdCall").prop("disabled", false);
			$("#btn_retrieveCall").prop("disabled", true);
		} else {
			$("#infoModalTitle").text("로그인 필요");
			$("#infoModalBody").text("로그인이 필요한 서비스입니다.");
			$('#infoModal').modal({backdrop: 'static', keyboard: false}, 'show');
		}
	});
	
	// 상담사 수신대기 버튼
	$('#btn_ready').click(function(){
		if(chkFlag == 1) {
			notRFlagVal = "";
			ringFlag = 0;
			// ready(40) 로 상태변경 
			ipron.SetAgentState(g_Agent_Id, g_Tenant_Name, 40, 0, 0,"");	
			
		} else {
			$("#infoModalTitle").text("로그인 필요");
			$("#infoModalBody").text("로그인이 필요한 서비스입니다.");
			$('#infoModal').modal({backdrop: 'static', keyboard: false}, 'show');
		}	
		
	});
	
	// 호전환 버튼
	$("#btn_deFlectCall").click(function(){
		if(chkFlag == 0) {
			console.log("clicked deflectcall Button , Selected Option => " +$("#black-select option:selected").val());
			return;
		}
		else {
			var selectIndex = $("#black-select option:selected").val();//IVR에 보내야 하는값
			//selectIndex 데이터 변환작업 필요!!!==========
			console.log("---------------------------");
			console.log(g_exHandle,selectIndex);
			ipron.EXTAddRecord(g_exHandle, "UEI22" , selectIndex);
			console.log("---------------------------");
			//========================================
			console.log("conn1->" + conn1);
			
			
			//ipron.DeflectCall(g_Device_DN, TKConn1, "4400", "" , "" , "" , "" ,"" , "" , "" , "" , "" , "", g_extensionhandle,//extension, 
			//		0, "", "", "");
			ipron.SinglestepConference(g_Device_DN,conn1,"4400","","",g_exHandle,""); 
			
		}
		
		$('#blackModal').modal('hide');
	});
	
	// 악성고객 팝업 버튼
	$(".btn-open-blackModal").click(function(){
		$('#blackModal').modal({backdrop: 'static', 
								keyboard: true, 
								closeExisting: false,
								}, 
								'show');		
				
	});
	
	
});
