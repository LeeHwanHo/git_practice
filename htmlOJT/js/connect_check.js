
function AgentReport(in_total, in_success, in_talk_time, out_total, out_success, out_talk_time, transfer_calls, login_time, logout_time, in_int_suc, in_ext_suc, in_con_suc, out_int_suc, out_ext_suc, out_con_suc, ringing_time, dialing_time, ready_time, notready_time, acw_time) {
        var msg = "";

        msg += "Agent Report \n";
        msg += "Inbound Total : " + in_total.toString() + "\n";
        msg += "Inbound 성공 : " + in_success.toString() + "\n";
        msg += "Inbound 통화시간 : " + in_talk_time.toString() + "\n";
        msg += "Outbound Total : " + out_total.toString() + "\n";
        msg += "Outbound 성공 : " + out_success.toString() + "\n";
        msg += "Outbound 통화시간 : " + out_talk_time.toString() + "\n";
        msg += "전환 호 합계 : " + transfer_calls.toString() + "\n";
        msg += "최근 로그인 시각 : " + login_time + "\n";
        msg += "최근 로그아웃 시각 : " + logout_time + "\n";
        msg += "내선 인바운드 통화수 : " + in_int_suc.toString() + "\n";
        msg += "국선 인바운드 통화수 : " + in_ext_suc.toString() + "\n";
        msg += "협의 인바운드 통화수 : " + in_con_suc.toString() + "\n";
        msg += "내선 아웃바운드 통화수 : " + out_int_suc.toString() + "\n";
        msg += "국선 아웃바운드 통화수 : " + out_ext_suc.toString() + "\n";
        msg += "협의 아웃바운드 통화수 : " + out_con_suc.toString() + "\n";
        msg += "벨울림 시간 : " + ringing_time.toString() + "\n";
        msg += "다이얼링 시간 : " + dialing_time.toString() + "\n";
        msg += "수신대기상태 시간 : " + ready_time.toString() + "\n";
        msg += "자리비움상태 시간 : " + notready_time.toString() + "\n";
        msg += "후 처리상태 시간 : " + acw_time.toString() + "\n";

        //AddReportOutput(msg);
    }
	
	function MakeAgentStateString(state) {
		var str;

		switch (state) {
			case 0: str = "NULL"; break;
			case 10: str = "Logout"; break;
			case 20: str = "Login"; break;
			case 30: str = "Not Ready"; break;
			case 40: str = "Ready"; break;
			case 41: str = "InReady"; break;
			case 42: str = "OutReady"; break;
			case 50: str = "Busy"; break;
			case 51: str = "Ringing Busy"; break;
			case 52: str = "Dialing Busy"; break;
			case 60: str = "Work After Call"; break;
			//default: str = "Unknown State : " + state.toString(); break;
			default: str = "Unknown State : " + JSON.stringify(state); break;
		}
		return str;
	}
	
	function ExtensionData(data) {
		var extlog = "[" + data.method + "]";
		var ex = "";

		ex = ipron.GetExtensionData(data.extensionhandle);
		extlog += " Extension Data [" + ex + "]";
		
		if (-1 != ex.indexOf('MUTETRAGTID')) {
			console.log("MUTETRAGTID");
		}
		return extlog;
	}

	var bReconnect = false;
//index : 1	
	function CBFuncEvent(data) {
		console.log("---------------------");
		console.log(data.method);
		console.log("---------------------");
		var log = "[" + data.method + "]";
		switch (data.method) {
			case ipron.APIEvent.RINGING: // ringing
				console.log("RINGING 상대 DN확인 : "+JSON.stringify(data));
				// 전화가 걸려오면  그때의 자리비움 value 와 ringingFlag 에 값을 저장한다
	        	ringFlag = 1;
	        	notRFlagVal = $("#agent_state").val();

	        	log += " Rringing. ThisDn[" + data.thisdn + "]";
				conn1 = data.connectionid;
				g_ConnId = conn1;
				$("#stateView").text("벨 울림중");
				//고객전화끊킴 안내text
				clearInterval(timerId);
				disEnable(0, 0); //수신대기,자리비움 버튼 숨김처리
				disEnablePopup(false,false,true,true,true);
				// 상태 시간 
        		clearTime();	//UEI 데이터 팝업
        		var ani = null,queueNum = 0,queueName = "";      		

        		if(data.extensionhandle != null){
        			ani = ipron.EXTGetValueForKey(data.extensionhandle,"UEI01",0);
        			queueNum = ipron.EXTGetValueForKey(data.extensionhandle,"UEI03",0);
        			console.log("==============" + queueNum);
        			$('#ani').text(ani);
        			if	   (queueNum == 8001){queueName = "예약 상담";}
        			else if(queueNum == 8002){queueName = "병원 안내 상담";}
        			else if(queueNum == 8003){queueName = "기타 상담";}
        			
        			$('#queueName').text(queueName);
        		}else{
        			queueName = "내선 번호";
        		}
        		
        		
        		g_exHandle = data.extensionhandle;        		        		
        		$('#customerInfoModal').modal({backdrop: 'static', keyboard: false}, 'show');
        				
        		//$("#btn_answerCall2").focus();
        		//$("#btn_answerCall2").focus();
        		
				break;
			case ipron.APIEvent.ESTABLISHED: // establish
				log += " Establish. ThisDn[" + data.thisdn + "]";
				$("#stateView").text("통화중");
	            ringFlag = 0;
	         	// 상태 시간 
        		clearTime();
        		
        		disEnablePopup(true,false,false,true,false);
        		
				break;
			case ipron.APIEvent.RELEASED: //released
				log += " Released. ThisDn[" + data.thisdn + "]";
				
				ipron.AgentReport(g_Agent_Id, g_Tenant_Name, 0);
				
				
				var otherdn = data.otherdn;
	        	var connid = data.connectionid;
	        	
	        	//호가 끊길시, 팝업창 닫음
				$('#blackModal').modal('hide');
				$('#customerInfoModal').modal('hide');
	        	// 고객 호 끊킴 확인
	        	clientDisConn(otherdn, connid);
				clearInterval(timerId);
				disEnable(0, 0); //수신대기,자리비움 버튼 숨김처리
				disEnablePopup(false,false,true,true,true);
				
	         	// 상태 시간 
        		clearTime();
        	        						
				break;
			case ipron.APIEvent.DIALING: // dialing
				log += " Dialing. ThisDn[" + data.thisdn + "]";
				console.log("dialing=================================================");
				if(confCall == "Y"){
					conn2 = data.connectionid;
				}else{
					conn1 = data.connectionid;
				}
				confCall = "N";
				$("#stateView").text("다이얼링중");
				/*
				console.log("||||||||||||||||||||||||||||||||||data.otherdn|||||||||||||||||||||||||");
				console.log("||||||||||||||||||||||||||||||||||"+data.otherdn+"|||||||||||||||||||||||||");
				console.log("||||||||||||||||||||||||||||||||||data.connectionid|||||||||||||||||||||||||");
				console.log("||||||||||||||||||||||||||||||||||"+data.connectionid+"|||||||||||||||||||||||||");
				var otherdn = data.otherdn;
	        	var connid = data.connectionid;
	        	// 고객 호 끊킴 확인
	        	clientDisConn(otherdn, connid);
				
				clearInterval(timerId);
            	//수신대기,자리비움 버튼 숨김처리
				disEnable(0, 0); 
				// 상태 시간 
        		clearTime();
				*/
				
				
				break;
			case ipron.APIEvent.ABANDONED: // abandoned
				log += " Abandoned. ThisDn[" + data.thisdn + "]";
				break;
			case ipron.APIEvent.DESTBUSY: // dest busy
				log += " DestBusy. ThisDn[" + data.thisdn + "]";
				break;
			case ipron.APIEvent.HELD: // held
				log += " Held. ThisDn[" + data.thisdn + "]";
				$("#stateView").text("보류");
				
				disEnablePopup(true,false,true,false,true);
				break;
			case ipron.APIEvent.RETRIEVED: // retrieved
				log += " Retrieved. ThisDn[" + data.thisdn + "]";
				$("#stateView").text("통화중");
				
				$("#TextCallDestDN").prop("disabled", true);
				$("#btn_makeCall").prop("disabled", true);
				$("#btn_answerCall").prop("disabled", true);
				$("#btn_clearCall").prop("disabled", false);
				$("#btn_holdCall").prop("disabled", false);
				$("#btn_retrieveCall").prop("disabled", true);
				
				disEnablePopup(true,false,false,true,false);
				break;
			case ipron.APIEvent.PARTYADDED: // party added
				log += " PartyAdded. ThisDn[" + data.thisdn + "]";
				
				g_ConnId2 = data.connectionid;
				
				console.log("g_ConnId2 ================================ : " + g_ConnId2);
				break;
			case ipron.APIEvent.PARTYCHANGED: // party changed
				log += " PartyChanged. ThisDn[" + data.thisdn + "]";
				break;
			case ipron.APIEvent.PARTYDELETED: // party deleted				
				log += " PartyDeleted. ThisDn[" + data.thisdn + "]";
				var otherdn = data.otherdn;
	        	var connid = data.connectionid;
	        	
	        	g_ConnId = g_ConnId2;	        	
	        	//g_ConnId2 = "";
	        	
	        	console.log("g_ConnId ================================ : " + g_ConnId);
	        	// 고객 호 끊킴 확인
	        	clientDisConn(otherdn, connid);
				break;
			case ipron.APIEvent.QUEUED: // queued
				log += " Queued. ThisDn[" + data.thisdn + "]";
				break;
			case ipron.APIEvent.DIVERTED: // diverted
				$('#blackModal').modal('hide');
				$('#customerInfoModal').modal('hide');
				disEnablePopup(false,false,true,true,true);
				log += " Diverted. ThisDn[" + data.thisdn + "]";
				//diverted 이후 바로 수신대기로 변경
	            ipron.SetAgentState(g_Agent_Id, g_Tenant_Name, 40, 0, 0,"");
				break;
			case ipron.APIEvent.ACDAGENT_LOGGEDON: // acd Login
				log += " ACD Login. ThisDn[" + data.thisdn + "] AgentID[" + data.agentid + "]";
				break;
			case ipron.APIEvent.ACDAGENT_LOGGEDOFF: // acd Logout
				log += " ACD Logout. ThisDn[" + data.thisdn + "] AgentID[" + data.agentid + "]";
				break;
			case ipron.APIEvent.ACDAGENT_NOTREADY: // acd NotReady
				log += " ACD NotReady. ThisDn[" + data.thisdn + "] AgentID[" + data.agentid + "]";
				break;
			case ipron.APIEvent.ACDAGENT_READY: // acd Ready
				log += " ACD Ready. ThisDn[" + data.thisdn + "] AgentID[" + data.agentid + "]";
				break;
			case ipron.APIEvent.ACDAGENT_WORKAFTCALL: // acd AFTCall
				log += " ACD AFTCall. ThisDn[" + data.thisdn + "] AgentID[" + data.agentid + "]";
				break;
			case ipron.APIEvent.AGENTLOGIN: // agent login
				log += " AgentLogin. AgentID[" + data.agentid + "] VoipState[" + data.voipagentstate;
				log += "] VoipStateSub[" + data.voipagentstatesub + "]";   

				$("#agentId").text(data.agentid);
				$("#agentDn").text(data.agentdn);
				$("#stateView").text(data.voipagentstate);
				break;
			case ipron.APIEvent.AGENTLOGOUT: // agent logout
				log += " AgentLogout. AgentID[" + data.agentid + "]";
				// unreginster
				ipron.Unregister(g_Device_DN, g_Tenant_Name);
				break;
			case ipron.APIEvent.AGENTREADY: // agent ready
				log += " AgentReady. AgentID[" + data.agentid + "]";
				log += " Agent State[" + data.agentstate + "] SubState[" + data.agentstatesub + "]";
				
				disEnable(0, 1); //수신대기,자리비움 버튼 숨김처리
	            clearInterval(timerId);	// Interval 이벤트  stop
	            $("#connState").text("");
				$("#stateView").text("수신대기"); 
				$('#agent_state').prop("selectedIndex",0);
				
	            clearTime(); // 상태 시간 
				
				break;
			case ipron.APIEvent.AGENTNOTREADY: // agent not ready
				log += " AgentNotReady. AgentID[" + data.agentid + "]";
				log += " Agent State[" + data.agentstate + "] SubState[" + data.agentstatesub + "]";
				
				disEnable(1, 1); //버튼 disable 처리
				clearInterval(timerId);	// Interval 이벤트  stop
				$("#stateView").text("자리비움 ("+ $("#agent_state option:selected").text() + ")");
				
	            clearTime(); // 상태 시간 
				
				break;
			case ipron.APIEvent.AGENTACW: // agent acw
				log += " AgentAcw. AgentID[" + data.agentid + "]";
				log += " Agent State[" + data.agentstate + "] SubState[" + data.agentstatesub + "]";
				
				// 후처리 상태가되면 해당 connection id 를 리셋시킨다.
	            conn1 = "";
	            conn2 = "";
	            $("#stateView").text("후처리");
				
				break;
			case ipron.APIEvent.REGISTERED: // registered
				log += " Registered. ThisDn[" + data.thisdn + "]";
				log += " result[" + MakeResult(data.result) + "]";
				if(data.result == 0){
	            	//agentLogin 
	            	ipron.GetAgentState(g_Tenant_Name, g_Agent_Id, "", 0, g_MediaType);
					ipron.GetAgentList(g_Tenant_Name, "", "", "", 40, g_MediaType);
	            	
	            }else{
					$("#infoModalTitle").text("오류");
					$("#infoModalBody").text(MakeResult(data.result));
	            	$('#infoModal').modal({backdrop: 'static', keyboard: false}, 'show');
	            }
				break;
			case ipron.APIEvent.UNREGISTERED: // unregistered
				log += " Unregistered. ThisDn[" + data.thisdn + "]";
				log += " result[" + MakeResult(data.result) + "]";
				notRFlagVal = "";
	    		ringFlag = 0;
	        	//CloseServer
	            ipron.CloseServer();
				
				var full = $('#fullscreen');
				$(full).show();
				break;
			case ipron.APIEvent.UPDATE_USERDATA: // update userdata
				log += " UpdateUserdata. UpdateDn[" + data.updatedn + "]";
				break;
			case ipron.APIEvent.USEREVENT: // user event
				log += " UserEvent. SenderDn[" + data.senderdn + "]";
				break;
			case ipron.APIEvent.INITIATED: // initiated
				log += " Initiated. ThisDn[" + data.thisdn + "]";
				//
				
				break;
			case ipron.APIEvent.AGENTINREADY: // agent in ready
				log += " AgentInReady. ThisDn[" + data.thisdn + "]";
				log += " Agent State[" + data.agentstate + "]";
				break;
			case ipron.APIEvent.AGENTOUTREADY: // agent out ready
				log += " AgentOutReady. ThisDn[" + data.thisdn + "]";
				log += " Agent State[" + data.agentstate + "]";
				break;
			case ipron.APIEvent.MEDIAPLAY: // media play
				log += " MediaPlay. ThisDn[" + data.thisdn + "]";
				break;
			case ipron.APIEvent.MEDIACOLLECT: // media collect
				log += " MediaCollect. ThisDn[" + data.thisdn + "]digits[" + data.digits + "]";
				break;
			case ipron.APIEvent.BANISHMENT: // banishment
				log += " Banishment. DestDn[" + data.destdn + "]";
				
				/*
				상담원id : data.destagentid
				내선번호 : data.destdn
				시간 : data.datetime */
                var str = data.otherloginipaddr;
                var res = str.substring(7);
				
				$("#infoModalTitle").text("중복로그인");
				$("#infoModalBody").html("IP : "+res+"<br/>상담사 ID : "+data.destagentid+"<br/>내선번호 : "+data.destdn);
	            $('#infoModal').modal({backdrop: 'static', keyboard: false}, 'show');	
				
				break;
			case ipron.APIEvent.ACDAGENT_BUSY: // acd agent busy
				log += " AcdAgentBusy. ThisDn[" + data.thisdn + "]";
				break;
			case ipron.APIEvent.MCS_REROUTE: // reroute
				log += " Reroute. ThisDn[" + data.thisdn + "]";
				break;
			case ipron.APIEvent.VIRTUAL_MEDIA_CREATE: // virtual media create
				log += " VirtualMediaCreate. QueueDn[" + data.queuedn + "]";
				break;
			case ipron.APIEvent.VIRTUAL_MEDIA_DISTRIBUTE: // virtual media distribute
				log += " VirtualMediaDistribute. QueueDn[" + data.queuedn + "]";
				break;
			case ipron.APIEvent.VIRTUAL_MEDIA_DELETE: // virtual media delete
				log += " VirtualMediaDelete. QueueDn[" + data.queuedn + "]";
				break;
			case ipron.APIEvent.DEVICE_DND: // device dnd
				log += " Device DND. AgentDn[" + data.agentdn + "] AgentId[" + data.agentid + "]";
				break;
			case ipron.APIEvent.HASTATE_CHANGED: // ha state changed
				log += " HaStateChanged. HaState[" + data.hastate + "]";
				break;
			case ipron.APIEvent.AGENT_SSCRIBE_PUSH: // agent subscribe push
				log += " Agent Subscribe Push.";
				SubscribePage.AgentSubscribe(data.subscribeid, data.intotal, data.insuccess, data.intalktime, data.outtotal, data.outsuccess, data.outtalktime, data.transfercalls, data.logintime,
											   data.logouttime, data.inintsuc, data.inextsuc, data.inconsuc, data.outintsuc, data.outextsuc, data.outconsuc, data.ringingtime, data.dialingtime,
											   data.readytime, data.notreadytime, data.acwtime);
				break;
			case ipron.APIEvent.GROUP_SSCRIBE_PUSH: // agent subscribe push
				log += " Group Subscribe Push.";
				SubscribePage.GroupSubscribe(data);
				break;
			case ipron.APIEvent.QUEUE_SSCRIBE_PUSH: // agent subscribe push
				log += " Queue Subscribe Push.";
				SubscribePage.QueueSubscribe(data);
				break;
			case ipron.APIEvent.TENANT_SSCRIBE_PUSH: // agent subscribe push
				log += " Tenant Subscribe Push.";
				SubscribePage.TenantSubscribe(data);
				break;
			case ipron.APIEvent.DNIS_SSCRIBE_PUSH: // agent subscribe push
				log += " Dnis Subscribe Push.";
				SubscribePage.DnisSubscribe(data.subscribeid, data.inboundtotal, data.abandontotal, data.agttry, data.agttryabandon, data.rejecttotal, data.accepttotal, data.nonsvctotal, data.ivrsvccount, data.waitcount, data.inbusyagentcount, data.ivragtconfcount);
				break;
			case ipron.APIEvent.NEW_NOTICE: // Notice
				log += " New Notice.";
				break;
			case ipron.APIEvent.CALLBACK_DISTRIBUTE: // Callback
				log += " Callback.";
				break;
			case ipron.APIEvent.MEDIA_ENABLED: //Media Enabled
				log += " Media Enabled. AgentID[" + data.agentid + "] MediaType[" + data.mediatype + "] Enable [" + data.enable + "]";
				break;
			case ipron.APIEvent.MEDIA_READY: // Media Ready
				log += " Media Ready. AgentID[" + data.agentid + "] MediaType[" + data.mediatype + "] MediaReady [" + data.mediaready + "]";
				break;
			case ipron.APIEvent.FAILED: // failed
				log += " Failed. ThisDn[" + data.thisdn + "]";
				disEnable(0, 0); //수신대기,자리비움 버튼 숨김처리
				break;
			default:
				break;
		}

		switch (data.method) {
			case ipron.APIEvent.INITIATED: // initiated
				g_PrevConnId = g_ThisDn;
				g_ThisDn = data.thisdn;
				g_UCID= data.ucid;
				g_Hop= data.hop;
				g_ConnId= data.connectionid;
				g_CallId= data.callid;
				
				
				
				break;
			case ipron.APIEvent.HELD: // held
			case ipron.APIEvent.RINGING: // ringing
				
			case ipron.APIEvent.ESTABLISHED: // establish
			case ipron.APIEvent.RELEASED: //released
			case ipron.APIEvent.DIALING: // dialing
			case ipron.APIEvent.DIVERTED: // diverted
			case ipron.APIEvent.RETRIEVED: // retrieved
			case ipron.APIEvent.PARTYADDED: // party added
			case ipron.APIEvent.PARTYCHANGED: // party changed
			case ipron.APIEvent.PARTYDELETED: // party delete
			case ipron.APIEvent.QUEUED: // queued
				g_PrevConnId = g_ThisDn;
				g_ThisDn = data.thisdn;
				g_UCID= data.ucid;
				g_Hop= data.hop;
				g_ConnId= data.connectionid;
				g_CallId= data.callid;
				break;
			default:
				break;
		}

		AddEvent(log);

		// 재접속 관련...
		switch (data.method) {
			case ipron.APIEvent.ACTIVE_TIMEOUT:
				AddEvent("ACTIVE_TIMEOUT");
				AddEvent("Retry OpenServer...");
				bReconnect = true;
				ipron.OpenServer("EASD Test App", CBFuncEvent, CBFuncResponse);
				break;
			case ipron.WebEvent.ERR_DISCONNECT:
				AddEvent("ERR_DISCONNECT");
				AddEvent("Retry OpenServer...");
				bReconnect = true;
				ipron.OpenServer("EASD Test App", CBFuncEvent, CBFuncResponse);
				break;
			case ipron.WebEvent.ERR_OPENSERVER:
				AddEvent("ERR_OPENSERVER");
				if (bReconnect) {
					AddEvent("Retry OpenServer...");
					ipron.OpenServer("EASD Test App", CBFuncEvent, CBFuncResponse);
					break;
				}
		}
		
		if (data.extensionhandle > 0) {
			AddEvent(ExtensionData((data)));
			g_exHandle = data.extensionhandle;
		}
	}

	function sleep(num) {	//[1/1000초]
		var now = new Date();
		var stop = now.getTime() + num;
		while (true) {
			now = new Date();
			if (now.getTime() > stop) return;
		}
	}

	function CBFuncResponse(data) {
		var log = "";
		var result = 0;
		switch (data.messagetype) {
			case ipron.MsgType.AjaxResponse:
				log += data.method + " (AJAX Response) result[" + data.result + "]";
				if (data.method == ipron.Request.OpenServer) {
					if (data.result == ipron.JSONValue.True) {
						g_SessionKey = data.key;
						bReconnect = false;
						ipron.Register(g_Device_DN, g_Tenant_Name);
						log += " Handle[" + data.handle + "]";
					}
					else {
						log += " Result[" + MakeOpenServerResult(data.handle) + "]";
						if (bReconnect) {
							AddEvent("OpenServerTry Fail...");
							AddEvent("Retry OpenServer...");
							setTimeout('ipron.OpenServer("EASD Test App", CBFuncEvent, CBFuncResponse)', 3000);
							break;
						}
					}
				}

				break;
			case ipron.MsgType.ICResponse:
				log += "[" + data.method + "]";
				switch (data.method) {
					case ipron.APIMethod.REGIADDR_RES: // register
						log += " RegisterRes. Result[" + MakeResult(data.result) + "]";
						
						console.log("Register 체크 : "+JSON.stringify(data.result));
						if(data.result != '0'){
							$("#infoModalTitle").text("오류");
							$("#infoModalBody").text(MakeResult(data.result));
							$('#infoModal').modal({backdrop: 'static', keyboard: false}, 'show');

							//CloseServer
							ipron.CloseServer();
	                	}
						break;
					case ipron.APIMethod.UNREGIADDR_RES: // unregister
						log += " UnregisterRes. Result[" + MakeResult(data.result) + "]";
						
						if(data.result != '0'){
							$("#infoModalTitle").text("오류");
							$("#infoModalBody").text(MakeResult(data.result));
							$('#infoModal').modal({backdrop: 'static', keyboard: false}, 'show');	
	                	}
						clearTime(); //상태 시간 
						break;
					case ipron.APIMethod.GROUP_REGIADDR_RES: // groupregister
						log += " GroupRegisterRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.GROUP_UNREGIADDR_RES: // groupunregister
						log += " GroupUnregisterRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.MAKECALL_RES: // make call
						log += " MakeCallRes. Result[" + MakeResult(data.result) + "]";
						
						$("#TextCallDestDN").prop("disabled", true);
						$("#btn_makeCall").prop("disabled", true);
						$("#btn_answerCall").prop("disabled", true);
						$("#btn_clearCall").prop("disabled", false);
						$("#btn_holdCall").prop("disabled", false);
						$("#btn_retrieveCall").prop("disabled", true);
						
						break;
					case ipron.APIMethod.ANSWERCALL_RES: // Answer Call
						log += " AnswerCallRes. Result[" + MakeResult(data.result) + "]";
						
						$("#TextCallDestDN").prop("disabled", true);
						$("#btn_makeCall").prop("disabled", true);
						$("#btn_answerCall").prop("disabled", true);
						$("#btn_clearCall").prop("disabled", false);
						$("#btn_holdCall").prop("disabled", false);
						$("#btn_retrieveCall").prop("disabled", true);
						
						break;
					case ipron.APIMethod.CLEARCALL_RES: // clear call
						log += " ClearCallRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.HOLDCALL_RES: // hold call
						log += " HoldCallRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.HOLDCALL_EX_RES: // hold call Ex
						log += " HoldCallExRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.RETRIEVECALL_RES: // retrieve call
						log += " RetrieveCallRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.JOINCALL_RES: // join call
						log += " JoinCallRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.GRPICKUP_RES: // group pickup
						log += " GroupPickupRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.QUEUE_PICKUP_RES: // queue pickup
						log += " QueuePickupRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.SINGLESTEP_TRANSFER_RES: // singlestep transfer
						log += " SinglestepTransferRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.MUTE_TRANSFER_RES: // mute transfer
						log += " MuteTransferRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.SINGLESTEP_CONFERENCE_RES: // singlestep conference
						log += " SinglestepConferenceRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.CONFERENCE_RES: // mute conference call
						log += " MuteConferenceRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.DEFLECTCALL_RES: // deflect call
						log += " DeflectCallRes. Result[" + MakeResult(data.result) + "]";
						
						break;
					case ipron.APIMethod.MCS_REROUTE_RES: // mcs reroute
						log += " McsRerouteRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.GETCONNECTION_RES: // get connection
						log += " GetConnectionRes. Result[" + MakeResult(data.result) + "]";
						log += " ConnectionId1[" + data.connectionid1 + "]";
						log += " ConnectionId2[" + data.connectionid2 + "]";
						break;
					case ipron.APIMethod.AGENTLOGIN_RES: // agent login
						log += " AgentLoginRes. Result["+data.result+"|"+ MakeResult(data.result) + "]";
						bReconnect = false;
	                	clearInterval(timerId);
	                	$("#connState").text(""); // 네트워크 에러 재연결 텍스트 리셋
						
						if(data.result == 0){
							var full = $('#fullscreen');
							
							// 쿠키에 로그인 정보 저장
	                		saveLogin(g_Device_DN, g_Agent_Id, g_Password, g_Tenant_Name);	
	                		// GetAgentState
	                		ipron.GetAgentState(g_Tenant_Name, g_Agent_Id, "", 0, g_MediaType);
	                		// 통화후 수신대기 상태로 변경
							ipron.SetAFTCallState(g_Agent_Id, g_Tenant_Name, 40, 0, "");
		                	// 자리비움 selected 에 상태코드 셋팅
		                	ipron.GetStateSubcode(g_Tenant_Name, 30);
							
							ipron.GetAgentInfo(g_Tenant_Name, g_Agent_Id, "");
							ipron.AgentReport(g_Agent_Id, g_Tenant_Name, 0);
							//ipron.GetAgentList(g_Tenant_Name, "", "", "", 40, g_MediaType);
							
							chkFlag = 1;
							$(full).fadeOut();
					        
		            		clearTime(); //상태 시간 
							realtimeClock();
							
						}else  {
							
							$("#infoModalTitle").text("오류");
							$("#infoModalBody").text(MakeResult(data.result));
							$('#infoModal').modal({backdrop: 'static', keyboard: false}, 'show');	
							
							// unreginster
							ipron.Unregister(g_Device_DN, g_Tenant_Name);
						}
						break;
					case ipron.APIMethod.ADNLOGIN_RES: // adn agent login
						log += " AdnLoginRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.AGENTLOGOUT_RES: // agent logout
						log += " AgentLogoutRes. Result[" + MakeResult(data.result) + "]";
						
						$("#agentDn").text("-");
						$("#agentId").text("-");
						$("#agentName").text("-");
						$("#stateView").text("로그아웃");
						clearInterval(timerId);
						clearTimeout(sTimer);
						clearTime(1); //상태 시간 
						
						break;
					case ipron.APIMethod.GETSTATE_SUBCODE_RES: // get state sub code
						log += " GetStateSubcodeRes. Result[" + MakeResult(data.result) + "]";
						$('#agent_state').empty();	//자리비움 콤보 데이터 비움
	                    $('#agent_state').append('<option disabled selected>자리비움</option>'); 
	                    
						var i = 0;
	                    for(var list in data.extensiondata) {
							$('#agent_state').append('<option value="'+ i +'">' + data.extensiondata[i]['0'] + '</option>');
	                     	i++;
	                    }
						break;
					case ipron.APIMethod.GETROUTEABLE_RES: // get routeable
						log += " GetRouteableRes. Result[" + MakeResult(data.result) + "]";
						if (data.result == 0)
							log += " 통화 가능";
						else
							log += " 통화 불가능";
						break;
					case ipron.APIMethod.UPDATE_USERDATA_RES: // update userdata
						log += " UpdateUserdataRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.DELETE_KEY_USERDATA_RES: // delete key userdata
						log += " DeleteKeyUserdataRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.DELETE_ALL_USERDATA_RES: // delete all userdata
						log += " DeleteAllUserdataRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.SEND_USEREVENT_RES: // send user event
						log += " SendUserEventRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.GET_USERDATA_RES: // get userdata
						log += " GetUserdataRes. Result[" + MakeResult(data.result) + "]";
						log += " Conn ID [" + data.connectionid + "]";
						log += " "
						break;
					case ipron.APIMethod.GETCONNSTATE_RES: // get conn state
						log += " GetConnStateRes. Result[" + MakeResult(data.result) + "]";
						log += " Conn ID [" + data.connectionid + "]";
						log += " State [" + MakeICConnectionState(data.connectionstate) + "]";
						break;
					case ipron.APIMethod.SET_ANI_USERDATA_RES: // set ani userdata
						log += " SetAniUserdataRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.SET_UCID_USERDATA_RES: // set ucid userdata
						log += " SetUcidUserdataRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.SETAGENTSTATE_RES: // set agent state
						log += " SetAgentStateRes. Result[" + MakeResult(data.result) + "]";
//						log += " State [" + MakeAgentStateString(data.agentstate) + "]";
						log += " State Sub [" + data.agentstatesub + "]";
						
						ipron.AgentReport(g_Agent_Id, g_Tenant_Name, 0);
						break;
					case ipron.APIMethod.SETAGENTSTATE_DATA_RES: // set agent state data
						log += " SetAgentStateDataRes. Result[" + MakeResult(data.result) + "]";
//						log += " State [" + MakeAgentStateString(data.agentstate) + "]";
						log += " State Sub [" + data.agentstatesub + "]";
						break;
					case ipron.APIMethod.GETAGENTSTATE_RES: // get agent state
						log += " GetAgentStateRes. Result[" + MakeResult(data.result) + "]\n";
						log += " GetAgentStateRes. check!!!!!!!!!!!![" + data.voipagentstate + "]\n";
						
						g_AgentState = data.voipagentstate;
						
						// 로그인시 상담원 상태셋팅
	                    switch (g_AgentState) {
		                    case 50: 
								$("#stateView").text("통화중");
								disEnable(0, 0);
								break; // Busy
		                }
						break;
					case ipron.APIMethod.SETAFTCALLSTATE_RES: // set aft state
						log += " SetAftCallStateRes. Result[" + MakeResult(data.result) + "]";
//						log += " State [" + MakeAgentStateString(data.agentstate) + "]";
						log += " State Sub [" + data.agentstatesub + "]";
						break;
					case ipron.APIMethod.SETAFTCALLSTATE_EX_RES: // set aft state Ex
						log += " SetAftCallStateExRes. Result[" + MakeResult(data.result) + "]";
						log += " State Inbound [" + MakeAgentStateString(data.inboundagentstate) + "]";
						log += " State Sub Inbound [" + data.inboundagentstatesub + "]";
						log += " State Outbound [" + MakeAgentStateString(data.outboundagentstate) + "]";
						log += " State Sub Outbound [" + data.outboundagentstatesub + "]";
						break;
					case ipron.APIMethod.SETSKILL_ENABLE_RES: // set skill enable
						log += " SetSkillEnableRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.FORCE_SETAGTSTATE_RES: // force set agent state
						log += " ForceSetAgentStateRes. Result[" + MakeResult(data.result) + "]";
						log += " State [" + MakeAgentStateString(data.agentstate) + "]";
						log += " State Sub [" + data.agentstatesub + "]";
						break;
					case ipron.APIMethod.GETGROUPLIST_RES: // get group list
						log += " GetGroupListRes. Result[" + MakeResult(data.result) + "]";
						ReportPage.GroupList(data.extensionhandle);
						break;
					case ipron.APIMethod.GETQUEUELIST_RES: // get queue list
						log += " GetQueueListRes. Result[" + MakeResult(data.result) + "]";
						ReportPage.QueueList(data.extensionhandle);
						break;
					case ipron.APIMethod.GETAGENTLIST_RES: // get agent list
						log += " GetAgentListRes. Result[" + MakeResult(data.result) + "]";
						
						console.log("GetAgentList 정보 : " + JSON.stringify(data.extensiondata));
						
						var handle = data.extensionhandle;
						var i = 0, j = 0;
						var nRecord = 0; nField = 0;
						var strKey, strValue;
						var chkIdVal = 0; chkDnVal = 0; 
						
						if(handle == undefined) {
							ipron.AgentLogin(g_Device_DN, g_Agent_Id, g_Password, g_Tenant_Name, 40, 3, 0, 4, g_MediaType);
						}else {
								
							nRecord = ipron.EXTGetRecordCount(handle);

							for (i = 0; i < nRecord; i++) {
								nField = ipron.EXTGetValueCountForRecord(handle, i);

								//ID
								strKey = ipron.EXTGetKey(handle, i);

								for (j = 0; j < nField; j++) {
									strValue = ipron.EXTGetValueForRecord(handle, i, j);
									console.log("로그인 시 기입한 g_Agent_Id : "+ g_Agent_Id + " / g_Device_DN : " + g_Device_DN);
									switch (j) {
										case 0: 
											//$("#agentId").text(strValue); 
											if(strValue == g_Agent_Id) {
												$("#infoModalTitle").text("로그인 오류");
												$("#infoModalBody").text("사용 중인 ID입니다.");
												$('#infoModal').modal({backdrop: 'static', keyboard: false}, 'show');	
												
												chkIdVal = 0;
												ipron.Unregister(g_Device_DN, g_Tenant_Name);
											}else {
												chkIdVal = 1;
											}
										break;  // 할당 DN
										case 1: 
											//$("#agentDn").text(strValue); 
											if(strValue == g_Device_DN) {
												$("#infoModalTitle").text("로그인 오류");
												$("#infoModalBody").text("사용 중인 내선번호입니다.");
												$('#infoModal').modal({backdrop: 'static', keyboard: false}, 'show');	
												
												chkDnVal = 0;
												ipron.Unregister(g_Device_DN, g_Tenant_Name);
											}else {
												chkDnVal = 1;
											}
										break;  // Login ID
										//case 2: $("#agentName").text(strValue); break;  // Login Name
										//case 3: str += "상태 : " + topPage.MakeAgentStateString(Number(strValue)) + " | "; break;  // State
										//case 4: str += "부가코드 : " + strValue + " | "; break;   // State Subcode
										//case 5: str += "상태 유지 시간 : " + strValue + " | "; break;
										//case 6: str += "IN/OUT : " + GetInout(Number(strValue)) + " | "; break;
										//case 7: str += "Skill Level : " + strValue; break;
										default: str += "|Unknown : " + strValue; break;
									}
								}
								if(chkIdVal == 1 && chkDnVal == 1){
									ipron.AgentLogin(g_Device_DN, g_Agent_Id, g_Password, g_Tenant_Name, 40, 3, 0, 4, g_MediaType);
								}
							}
						}
						
						break;
					case ipron.APIMethod.GETAGENTINFO_RES: // get agent info
						log += " GetAgentInfoRes. Result[" + MakeResult(data.result) + "]";
						console.log("GetAgentInfo 체크 : "+JSON.stringify(data));
						
						if(data.result == 0){
							$("#agentId").text(data.destagentid); 
							$("#agentDn").text(data.destdn); 
							$("#agentName").text(data.agentname);
						} else {
							$("#infoModalTitle").text("오류");
							$("#infoModalBody").text("상담원의 정보를 가져올 수 없습니다.");
							$('#infoModal').modal({backdrop: 'static', keyboard: false}, 'show');	
						}
						/*
						var str = "";
						str += "Tenant Name : " + data.tenantname + "\n";
						str += "상태 : \n";
						str += "Voice State [" + MakeAgentStateString(data.voipagentstate) + "] ";
						str += "Voice State Sub [" + data.voipagentstatesub + "]\n";
						str += "Chat State [" + MakeAgentStateString(data.chatagentstate) + "] ";
						str += "Chat State Sub [" + data.chatagentstatesub + "]\n";
						str += "VVoice State [" + MakeAgentStateString(data.vvoiceagentstate) + "] ";
						str += "VVoice State Sub [" + data.vvoiceagentstatesub + "]\n";
						str += "VChat State [" + MakeAgentStateString(data.vchatagentstate) + "] ";
						str += "VChat State Sub [" + data.vchatagentstatesub + "]\n";
						str += "email State [" + MakeAgentStateString(data.emailagentstate) + "] ";
						str += "email State Sub [" + data.emailagentstatesub + "]\n";
						str += "FAX State [" + MakeAgentStateString(data.faxagentstate) + "] ";
						str += "FAX State Sub [" + data.faxagentstatesub + "]\n";
						str += "MVOIP State [" + MakeAgentStateString(data.mvoipagentstate) + "] ";
						str += "MVOIP State Sub [" + data.mvoipagentstatesub + "]\n";
						str += "SMS State [" + MakeAgentStateString(data.smsagentstate) + "] ";
						str += "SMS State Sub [" + data.smsagentstatesub + "]\n";
						str += "조회 대상 DN : " + data.destdn + "\n";
						str += "조회 대상 ID : " + data.destagentid + "\n";
						str += "이름 : " + data.agentname + "\n";
						str += "Agent Position : " + data.agentposition + "\n";
						str += "Agent Level : " + data.agentlevel + "\n";
						*/
						
						break;
					case ipron.APIMethod.GETAGENTINFO_EX_RES: // get agent info Ex
						log += " GetAgentInfoExRes. Result[" + MakeResult(data.result) + "]";
						if (ReportPage != null) {
							var str = "";
							str += "Tenant Name : " + data.tenantname + "\n";
							str += "상태 : \n";
							str += "Voice State [" + MakeAgentStateString(data.voipagentstate) + "] ";
							str += "Voice State Sub [" + data.voipagentstatesub + "]\n";
							str += "Chat State [" + MakeAgentStateString(data.chatagentstate) + "] ";
							str += "Chat State Sub [" + data.chatagentstatesub + "]\n";
							str += "VVoice State [" + MakeAgentStateString(data.vvoiceagentstate) + "] ";
							str += "VVoice State Sub [" + data.vvoiceagentstatesub + "]\n";
							str += "VChat State [" + MakeAgentStateString(data.vchatagentstate) + "] ";
							str += "VChat State Sub [" + data.vchatagentstatesub + "]\n";
							str += "email State [" + MakeAgentStateString(data.emailagentstate) + "] ";
							str += "email State Sub [" + data.emailagentstatesub + "]\n";
							str += "FAX State [" + MakeAgentStateString(data.faxagentstate) + "] ";
							str += "FAX State Sub [" + data.faxagentstatesub + "]\n";
							str += "MVOIP State [" + MakeAgentStateString(data.mvoipagentstate) + "] ";
							str += "MVOIP State Sub [" + data.mvoipagentstatesub + "]\n";
							str += "SMS State [" + MakeAgentStateString(data.smsagentstate) + "] ";
							str += "SMS State Sub [" + data.smsagentstatesub + "]\n";
							str += "조회 대상 DN : " + data.destdn + "\n";
							str += "조회 대상 ID : " + data.destagentid + "\n";
							str += "이름 : " + data.agentname + "\n";
							str += "Agent Position : " + data.agentposition + "\n";
							str += "Agent Level : " + data.agentlevel + "\n";
							str += "Agent Alias : " + data.agentalias + "\n";
							switch (data.agentpwdencryptkind) {
								case 1:
									str += "Agent PwdEncryptType : SHA-1 \n";
									break;
								case 2:
									str += "Agent PwdEncryptType : SHA-256 \n";
									break;
								case 5:
									str += "Agent PwdEncryptType : SHA-512 \n";
									break;
							}
							str += "Agent PwdChgDate : " + data.agentpwdchgdate + "\n";
							ReportPage.AddReportOutput(str);
						}
						break;
					case ipron.APIMethod.GETCATEGORYLIST_RES: // get category list
						ReportPage.CategoryList(data.extensionhandle);
						break;
					case ipron.APIMethod.GETCATEGORYINFO_RES: // get category info
						ReportPage.CategoryInfo(data);
						break;
					case ipron.APIMethod.GETAGENT_SKILLLIST_RES: // get agent skill list
						log += " GetAgentSkillListRes. Result[" + MakeResult(data.result) + "]";
						ReportPage.AgentSkillList(data.extensionhandle);
						break;
					case ipron.APIMethod.GETAGENT_QUEUELIST_RES: // get agent queue list
						log += " GetAgentQueueListRes. Result[" + MakeResult(data.result) + "]";
						ReportPage.AgentQueueList(data.extensionhandle);
						break;
					case ipron.APIMethod.BSR_RES: // bsr
						log += " BsrRes. Result[" + MakeResult(data.result) + "]";
						ReportPage.BsrList(data.thisdn, data.queuedn, data.destdn, data.nodeid, data.bsrvalue, data.bsrprefix);
						break;
					case ipron.APIMethod.GETQUEUETRAFFIC_RES: // get queue traffic
						log += " GetQueueTrafficRes. Result[" + MakeResult(data.result) + "]";
						ReportPage.QueueTraffic(data.svclvltime, data.svclevel, data.waitcount, data.allagentcount, data.loginagentcount, data.readyagentcount, data.inbusyagentcount, data.outbusyagentcount,
												data.aftworkagentcount, data.notreadyagentcount, data.ringingcount, data.inboundtotal, data.accepttotal, data.abandontotal, data.transbackup,
												data.answercountavr, data.talktimecountavr, data.waittime, data.maxwaittime, data.minwaittime, data.waittimeavr, data.waittimesum, data.distributewaitcount);
						break;
					case ipron.APIMethod.GETQUEUEORDER_RES: // get queue order
						log += " GetQueueOrderRes. Result[" + MakeResult(data.result) + "]";
						ReportPage.GetQueueOrder(data.waitcount);
						break;
					case ipron.APIMethod.AGENT_REPORT_RES: // agent report
						log += " AgentReportRes. Result[" + MakeResult(data.result) + "]";
						
						if(data.result == 0){
							
							var nr_seconds = data.notreadytime;
							var c_seconds = data.intalktime + data.outtalktime;
							
							console.log("nr_seconds -> " + nr_seconds);
							console.log("c_seconds -> " + c_seconds);
							
							if(nr_seconds > 0) secToTime(nr_seconds.toString(), "nr");
							if(c_seconds > 0) secToTime(c_seconds.toString(), "c");
							
							AgentReport(data.intotal, data.insuccess, data.intalktime, data.outtotal, data.outsuccess, data.outtalktime, data.transfercalls, data.logintime,
											   data.logouttime, data.inintsuc, data.inextsuc, data.inconsuc, data.outintsuc, data.outextsuc, data.outconsuc, data.ringingtime, data.dialingtime,
											   data.readytime, data.notreadytime, data.acwtime);
						} else {
							$("#infoModalTitle").text("오류");
							$("#infoModalBody").text("상담원의 정보를 가져올 수 없습니다.");
							$('#infoModal').modal({backdrop: 'static', keyboard: false}, 'show');	
						}
						
						break;
					case ipron.APIMethod.GROUP_REPORT_RES: // group report
						log += " GroupReportRes. Result[" + MakeResult(data.result) + "]";
						ReportPage.GroupReport(data);
						break;
					case ipron.APIMethod.QUEUE_REPORT_RES: // queue report
						log += " QueueReportRes. Result[" + MakeResult(data.result) + "]";
						ReportPage.QueueReport(data);
						break;
					case ipron.APIMethod.TENANT_REPORT_RES: // tenant report
						log += " TenantReportRes. Result[" + MakeResult(data.result) + "]";
						ReportPage.TenantReport(data);
						break;
					case ipron.APIMethod.DNIS_REPORT_RES: // dnis report
						log += " DnisReportRes. Result[" + MakeResult(data.result) + "]";
						ReportPage.DnisReport(data.inboundtotal, data.abandontotal, data.agttry, data.agttryabandon, data.rejecttotal, data.accepttotal, data.nonsvctotal, data.ivrsvccount, data.waitcount, data.inbusyagentcount, data.ivragtconfcount)
						break;
					case ipron.APIMethod.MEDIA_ATTACH_RES: // media attach
						log += " MediaAttachtRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.MEDIA_DEATTACH_RES: // media detach
						log += " MediaDetachRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.MEDIA_PLAY_RES: // media play
						log += " MediaPlayRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.MEDIA_COLLECT_RES: // media collect
						log += " MediaCollectRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.CREATE_VIRTUAL_MEDIA_RES: // create virtual media
						log += " CreateVirtualMediaRes. Result[" + MakeResult(data.result) + "]";
						log += " Virtual Media ID [" + data.virtualmediaid + "]";
						log += " UCID [" + data.ucid + "]";
						//FeaturePage.TextUCID.value = data.ucid;
						break;
					case ipron.APIMethod.DELETE_VIRTUAL_MEDIA_RES: // delete virtual media
						log += " DeleteVirtualMediaRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.AGENT_SUBSCRIBE_RES: // agent subscribe
						log += " AgentSubscribeRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.GROUP_SUBSCRIBE_RES: // group subscribe
						log += " GroupSubscribeRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.QUEUE_SUBSCRIBE_RES: // queue subscribe
						log += " QueueSubscribeRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.TENANT_SUBSCRIBE_RES: // tenant subscribe
						log += " TenantSubscribeRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.DNIS_SUBSCRIBE_RES: // dnis subscribe
						log += " DnisSubscribeRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.CLOSE_SUBSCRIBE_RES: // close subscribe
						log += " CloseSubscribeRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.GETAGENTLIST_EX_RES: // get agent list ex
						log += " AdGetAgentListRes. Result[" + MakeResult(data.result) + "]";
						AdvanceListPage.SetList(data.method, data.advanceListHandle);
						break;
					case ipron.APIMethod.GETGROUPLIST_EX_RES: // get group list ex
						log += " AdGetGroupListRes. Result[" + MakeResult(data.result) + "]";
						AdvanceListPage.SetList(data.method, data.advanceListHandle);
						break;
					case ipron.APIMethod.GETQUEUELIST_EX_RES: // get queue list ex
						log += " AdGetQueueListRes. Result[" + MakeResult(data.result) + "]";
						AdvanceListPage.SetList(data.method, data.advanceListHandle);
						break;
					case ipron.APIMethod.GETAGENT_SKILLLIST_EX_RES: // get agent skill list ex
						log += " AdGetAgentSkillListRes. Result[" + MakeResult(data.result) + "]";
						AdvanceListPage.SetList(data.method, data.advanceListHandle);
						break;
					case ipron.APIMethod.GETAGENT_QUEUELIST_EX_RES: // get agent queue list ex
						log += " AdGetAgentQueueListRes. Result[" + MakeResult(data.result) + "]";
						AdvanceListPage.SetList(data.method, data.advanceListHandle);
						break;
					case ipron.APIMethod.DTMF_PLAY_RES: // Dtmf Play
						log += " DtmfPlayRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.VIRTUAL_QUEUE_RES:
						log += " VirtualQueueRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.SET_CALLBACK_RES:
						log += " SetCallbackRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.MEDIA_DND_RES:
						log += " MediaDndRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.RESERVED_AGENT_STATE_RES:
						log += " ReservedAgentStateRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.SEND_GLOBAL_EVENT_RES:
						log += " SendGlobalEventRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.AGENTCALL_RES:
						log += " AgentCallRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.GET_MEDIA_ACTIVATE_RES:
						log += " GetMediaRes. Result[" + MakeResult(data.result) + "]" + "\n";
						log += " Chat Activate : " + data.chatactivate;
						log += " VVoice Activate : " + data.vvoiceactivate;
						log += " VChat Activate : " + data.vchatactivate;
						log += " Email Activate : " + data.emailactivate;
						log += " Fax Activate : " + data.faxactivate;
						log += " Voip Activate : " + data.voipactivate;
						log += " MVoip Activate : " + data.mvoipactivate;
						log += " SMS Activate : " + data.smsactivate;
						break;
					case ipron.APIMethod.GETROUTEPOLICY_RES:
						log += "GetRoutePolicy. Result[" + MakeResult(data.result) + "]" + "\n";
						switch (data.routepolicy) {
							case 0:
								log += "정책적으로 호 분배가 가능하지 않음";
								break;
							case 1:
								log += "정책적으로 호 분배가 가능하고 현재 즉시 수신 가능한 상태";
								break;
							case 2:
								log += "정책적으로 호 분배가 가능하지만 현재는 수신 할 수 없는 상태";
								break;
						}
						break;
					case ipron.APIMethod.SET_MEDIAREADY_STATE_RES:
						log += " SetMediaReadyStateRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.GET_MEDIAREADY_STATE_RES:
						log += " GetMediaReadyStateRes. Result[" + MakeResult(data.result) + "] AgentID[" + data.agentid + "] MediaType["
						 + data.mediatype + "] MediaReady [" + data.mediaready + "]";
						break;
					case ipron.APIMethod.GET_USER_CDR_RES:
						log += " GetUserCdrRes. Result[" + MakeResult(data.result) + "] Conn ID[" + data.connectionid + "] UserCdr[" + data.usercdr + "] PrivateData[" + data.privatedata + "]";
						break;
					case ipron.APIMethod.SET_USER_CDR_RES:
						log += " GetUserCdrRes. Result[" + MakeResult(data.result) + "] Conn ID[" + data.connectionid + "] UserCdr[" + data.usercdr + "] PrivateData[" + data.privatedata + "]";
						break;
					case ipron.APIMethod.GET_USER_CDR_EX_RES:
						log += " GetUserCdrExRes. Result[" + MakeResult(data.result) + "] Conn ID[" + data.connectionid + "] UserCdr[" + data.usercdr + "] PrivateData[" + data.privatedata + "]";
						break;
					case ipron.APIMethod.SET_USER_CDR_EX_RES:
						log += " SetUserCdrExRes. Result[" + MakeResult(data.result) + "] Conn ID[" + data.connectionid + "] UserCdr[" + data.usercdr + "] PrivateData[" + data.privatedata + "]";
						break;
					case ipron.APIMethod.SET_MUTE_ENABLE_RES:
						log += " SetDeviceMuteEnableRes. Result[" + MakeResult(data.result) + "] This DN [" + data.thisdn + "] Conn ID[" + data.connectionid + "] PrivateData[" + data.privatedata;
						log += "] Media Type [" + data.mediatype + "] Enable [" + data.enable + "]";
						break;
					case ipron.APIMethod.RESERVE_IR_ATTR_RES:
						log += " ReserveIrAttrRes. Result[" + MakeResult(data.result) + "] Ani[" + data.aninumber + "] PrivateData[" + data.privatedata;
						log += "] Media Type [" + data.mediatype + "]";
						break;
					case ipron.APIMethod.FIND_WAIT_IR_RES:
						log += " FindWaitIrRes. Result[" + MakeResult(data.result) + "] Ani [" + data.aninumber + "] PrivateData[" + data.privatedata + "]";
						break;
					case ipron.APIMethod.GETCONNECTION_EX_RES:
						log += " GetConnectionExRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.GETCALL_INFO_RES:
						log += " GetCallInfoRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.GETCATEGORY_LIST_RES:
						log += " GetCategoryListRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.GETCATEGORY_INFO_RES:
						log += " GetCategoryInfoRes. Result[" + MakeResult(data.result) + "]";
						break;
					case ipron.APIMethod.GETAGENT_MASTERQUEUEINFO_RES:
						log += " GetAgentMasterQueueInfo. Result[" + MakeResult(data.result) + "] QueueDN [" + data.queuedn + "] QueueId [" + data.queueid + "] QueueName [" + data.queuename + "] SkillId [" + data.skillid + "] SkillName [" + data.skillname + "]";
						break;
				}
				break;
			default:
				break;
		}

		AddResponse(log);




//            // test
//            switch (data.messagetype) {
//                case ipron.MsgType.AjaxResponse:
//                    if (data.method == ipron.Request.OpenServer && data.result == ipron.JSONValue.True) {
//                        api.CloseServer();
//                        api.Register2('6820DBC0-5A55-431A-8357-395FF610A60B');
//                        api.Heartbeat2('6820DBC0-5A55-431A-8357-395FF610A60B');
//                        api.Register2('6820DBC0-5A55-431A-8357-395FF610A60B');
//                        api.Heartbeat2('6820DBC0-5A55-431A-8357-395FF610A60B');
//                        api.Register2('6820DBC0-5A55-431A-8357-395FF610A60B');
//                        api.Heartbeat2('6820DBC0-5A55-431A-8357-395FF610A60B');
//                    }
//                    if (data.method == ipron.Request.CloseServer) {
//                        sleep(10);
//                        api.OpenServer("Auto Connect", CBFuncEvent, CBFuncResponse);
//                    }
//            }



	}


function MakeResult(result) {
            var str;

            switch (result) {
            case 0: str = "성공"; break;
            case 1001: str = "이미 사용중"; break;
            case 1002: str = "발견하지 못함"; break;
            case 1003: str = "라이센스 초과"; break;
            case 1004: str = "여유공간 초과"; break;
            case 1005: str = "유효하지 않은 상태"; break;
            case 1006: str = "이미 처리중"; break;
            case 1007: str = "이미 할당됨"; break;
            case 1008: str = "부정확한 정보"; break;
            case 2000: str = "IC Server와 Version 정보가 일치 하지 않습니다"; break;
            case 2001: str = "사용중인 Device"; break;
            case 2002: str = "사용중인 사용자"; break;
            case 2003: str = "비 수신대기인 사용자"; break;
            case 2004: str = "통화중인 Device"; break;
            case 2101: str = "Device  찾을 수 없음"; break;
            case 2102: str = "App ID 찾을 수 없음"; break;
            case 2103: str = "Tenant 찾을 수 없음"; break;
            case 2104: str = "Mornitor ID 찾을 수 없음"; break;
            case 2105: str = "사용자 찾을 수 없음"; break;
            case 2106: str = "Group 찾을 수 없음"; break;
            case 2107: str = "Queue 찾을 수 없음"; break;
            case 2108: str = "Skill 찾을 수 없음"; break;
            case 2109: str = "사유코드 찾을 수 없음"; break;
            case 2110: str = "Connection 찾을 수 없음"; break;
            case 2111: str = "Call 찾을 수 없음"; break;
            case 2112: str = "DNIS 찾을 수 없음"; break;
            case 2112: str = "UCID 찾을 수 없음"; break;
            case 2112: str = "Media ID 찾을 수 없음"; break;
            case 2201: str = "시스템 라이선스 Full"; break;
            case 2202: str = "Tenant 라이선스 Full"; break;
            case 2203: str = "Connection 개수 Full"; break;
            case 2301: str = "Device 개수 초과"; break;
            case 2302: str = "UserData 허용 크기 초과"; break;
            case 2303: str = "Virtual Media 허용 크기 초과"; break;
            case 2304: str = "UserCdr 허용 크기 초과"; break;
            case 2401: str = "유효하지 않는 App ID"; break;
            case 2402: str = "유효하지 않는 사용자 상태"; break;
            case 2403: str = "유효하지 않는 Device 상태"; break;
            case 2404: str = "유효하지 않는 사유 코드"; break;
            case 2405: str = "유효하지 않는 Connection"; break;
            case 2406: str = "유효하지 않는 UCID"; break;
            case 2407: str = "유효하지 않는 Option"; break;
            case 2501: str = "올바르지 않은 범위"; break;
            case 2502: str = "올바르지 않은 패스워드"; break;
            case 2503: str = "올바르지 않은 Device"; break;
            case 2504: str = "올바르지 않은 사용자"; break;
            case 2505: str = "올바르지 않은 상태코드"; break;
            case 2506: str = "올바르지 않은 Call	"; break;
            case 2601: str = "지원하지 않는 Media Type"; break;
            case 2701: str = "MCS Unknown Consult 실패"; break;
            case 2702: str = "MCS Busy Consult 실패"; break;
            case 2703: str = "MCS NoAnswer Consult 실패"; break;
            case 2704: str = "MCS Select Consult 실패"; break;
            case 2705: str = "MCS UserAbort Consult 실패"; break;
            case 2706: str = "MCS Reconnect 실패"; break;
            case 2707: str = "MCS Transfer 실패"; break;
            case 2708: str = "MCS Unknown SGTransfer 실패"; break;
            case 2709: str = "MCS Busy SGTransfer 실패"; break;
            case 2710: str = "MCS NoAnswer SGTransfer 실패"; break;
            case 2711: str = "MCS Select SGTransfer 실패"; break;
            case 2712: str = "MCS UserAbort SGTransfer 실패"; break;
            case 2713: str = "MCS Unknown Reroute 실패"; break;
            case 2714: str = "MCS Busy Reroute 실패"; break;
            case 2715: str = "MCS NoAnswer Reroute 실패"; break;
            case 2716: str = "MCS Select Reroute 실패"; break;
            case 2717: str = "MCS UserAbort Reroute 실패"; break;
            case -1: str = "Register 된 DN를 찾지 못하였습니다"; break;
            case -2: str = "Socket 연결이 끊겼습니다"; break;
            case -3: str = "Out형 변수의 값이 NULL 입니다"; break;
            case -4: str = "DN 값이 잘못된 형식입니다.(DN 은 0~9, *, # 문자만 가능합니다"; break;
            case -5: str = "Password 암호화 실패"; break;
            case -6: str = "소켓 에러"; break;
            case -7: str = "데이터 전송 실패"; break;
            case -8: str = "Event 대기 실패"; break;
            case -9: str = "Response 실패"; break;
            case -10: str = "Thread 생성 실패"; break;
            case -11: str = "이미 연결 되어 있음"; break;
            case -12: str = "핸들값 에러"; break;
            case -13: str = "Extension Data 처리 오류"; break;
            case -14: str = "데이터 전송 실패"; break;
            case -15: str = "Thread Stop 실패"; break;
            case -16: str = "대기 시간 초과"; break;
            case -17: str = "Memory 할당 실패"; break;
            case -18: str = "보내려는 패킷크기가 너무 큽니다"; break;
            case -19: str = "재접속 시도중입니다"; break;
            case -20: str = "OpenServer 최대 개수 초과"; break;
            case -21: str = "입력값 중에 NULL값 또는 잘못된 데이터가 있습니다"; break;
            case -22: str = "이미 연결되어 있는 Socket 의 IP와 지금 연결 하려는 IP 정보가 다릅니다"; break;
            case -23: str = "OCX의 Event 를 전달 받을 HWND 핸들이 없습니다"; break;
            case -24: str = "IC Server 와 Interface Version 이 다릅니다"; break;
                default: str = "알수 없는 에러 코드 : [" + result.toString() + "]"; break;
            }

            return str;
        }

        function MakeOpenServerResult(result) {
            var str;

            switch (result) {
                case -24: str = "IC Server 와 Interface Version 이 다릅니다."; break;
                case -23: str = "Win32 OCX Error. OCX의 Event 를 전달 받을 HWND 핸들이 없습니다. InitAPI() 함수 호출 후 사용"; break;
                case -22: str = "이미 연결되어 있는 Socket 의 IP와 지금 연결 하려는 IP 정보가 다릅니다"; break;
                case -21: str = "입력값 중에 NULL값 또는 잘못된 데이터가 있습니다"; break;
                case -20: str = "OpenServer 최대 개수 초과"; break;
                case -19: str = "재접속 시도중입니다"; break;
                case -18: str = "보내려는 패킷크기가 너무 큽니다."; break;
                case -17: str = "Memory 할당 실패"; break;
                case -16: str = "대기 시간 초과"; break;
                case -15: str = "Thread Stop 실패"; break;
                case -14: str = "데이터 전송 실패"; break;
                case -13: str = "Extension Data 처리 오류"; break;
                case -12: str = "핸들값 에러"; break;
                case -11: str = "이미 연결 되어 있음"; break;
                case -10: str = "Thread 생성 실패"; break;
                case -9: str = "Response 실패"; break;
                case -8: str = "Event 대기 실패"; break;
                case -7: str = "데이터 전송 실패"; break;
                case -6: str = "소켓 에러"; break;
                case -5: str = "Password 암호화 실패"; break;
                case -4: str = "DN 값이 잘못된 형식입니다.(DN 은 0~9, *, # 문자만 가능합니다)"; break;
                case -3: str = "Out형 변수의 값이 NULL 입니다."; break;
                case -2: str = "Socket 연결이 끊겼습니다."; break;
                case -1: str = "Register 된 DN를 찾지 못하였습니다"; break;
                default: str = "알수 없는 에러 코드 : [" + result + "]"; break;
            }

            return str;
        }

        function MakeICConnectionState(state)
        {
            var str;
            switch(state){
            case 0: str = "Null"; break;
            case 1: str = "Initiated"; break;
            case 2: str = "Alerting"; break;
            case 3: str = "Connected"; break;
            case 4: str = "Hold"; break;
            case 5: str = "Queued"; break;
            case 6: str = "Failed"; break;
            case 7: str = "Deleted"; break;
            default: str = "알수 없는 코드"; break;
            }
            return str;
        }
	