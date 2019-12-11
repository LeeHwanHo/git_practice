(function (module, global) {

    function GetBrowser() {
        var script;
        var browser = navigator.userAgent.toLowerCase();
        if (-1 != browser.indexOf('chrome')) {
            return "chrome";
        }
        else if (-1 != browser.indexOf('msie')) {
            return "msie";
        }
        else {
            return "unknown"
        }
    }

    function ImportJQuery(browser) {
        if (browser == "msie") {
            script = "<script src = 'js/jquery-1.11.2.min.js'></script>";
            script += "<script src = 'js/jquery.xdomainrequest.min.js'></script>";
        }
        else {
            script = "<script src = 'js/jquery-2.1.3.min.js'></script>";
        }
        document.write(script);
    }

    ImportJQuery(GetBrowser());

    var ipron = module;

    // Variable
    var Version = '4.2.0.9.0';
    var baseURL = '/ic/';
    var arrAjax = new Array();
    var protocol = 'https';
    var ErrCnt = 0;
    ipron.SessionKey = '';
    ipron.Handle = -1;

    // Connect State
    ServerConnectState = {
        Null: 0,
        Trying_1st: 1,
        Trying_2nd: 2,
        Connected: 3,
        Disconnected: 4,
        Error: 5
    }
    var ConnectedState = ServerConnectState.Null;

    // Message Type
    ipron.MsgType = {
        Null: 0,
        AjaxResponse: 1,
        ICResponse: 2,
        ICEvent: 3,
        Heartbeat: 4
    }

    // Request
    ipron.Request = {
        Heartbeat: "heartbeat",
        OpenServer: "openserver",
        CloseServer: "closeserver",
        Register: "register",
        Unregister: "unregister",
        GroupRegister: "groupregister",
        GroupUnregister: "groupunregister",
        AnswerCall: "answercall",
        ClearCall: "clearcall",
        MakeCall: "makecall",
        GroupPickup: "grouppickup",
        HoldCall: "holdcall",
        HoldCallEx: "holdcallex",
        RetrieveCall: "retrievecall",
        SinglestepTransfer: "singlesteptransfer",
        MuteTransfer: "mutetransfer",
        SinglestepConference: "singlestepconference",
        JoinCall: "joincall",
        Conference: "conference",
        DeflectCall: "deflectcall",
        GetConnection: "getconnection",
        GetConnectionEx: "getconnectionex",
        GetCallInfo: "getcallinfo",
        GetConnState: "getconnstate",
        GetStateSubcode: "getstatesubcode",
        AgentLogin: "agentlogin",
        AgentLogout: "agentlogout",
        GetGroupList: "getgrouplist",
        GetQueueList: "getqueuelist",
        GetAgentSkillList: "getagentskilllist",
        GetAgentQueueList: "getagentqueuelist",
        GetAgentList: "getagentlist",
        GetAgentInfo: "getagentinfo",
        GetRouteable: "getrouteable",
        SetAFTCallState: "setaftcallstate",
        SetAFTCallStateEx: "setaftcallstateex",
        SetAgentState: "setagentstate",
        ForceSetAgentState: "forcesetagentstate",
        GetAgentState: "getagentstate",
        GetUserdata: "getuserdata",
        UpdateUserdata: "updateuserdata",
        DeleteKeyUserdata: "deletekeyuserdata",
        DeleteAllUserdata: "deletealluserdata",
        SendUserEvent: "senduserevent",
        SetANIUserdata: "setaniuserdata",
        SetUCIDUserdata: "setuciduserdata",
        GetQueueTraffic: "getqueuetraffic",
        GetQueueOrder: "getqueueorder",
        Banishment: "banishment",
        SetSkillEnable: "setskillenable",
        AgentReport: "agentreport",
        GroupReport: "groupreport",
        QueueReport: "queuereport",
        TenantReport: "tenantreport",
        DNISReport: "dnisreport",
        QueuePickup: "queuepickup",
        MediaAttach: "mediaattach",
        MediaDeattach: "mediadeattach",
        MediaPlay: "mediaplay",
        MediaCollect: "mediacollect",
        CreateVirtualMedia: "createvirtualmedia",
        DeleteVirtualMedia: "deletevirtualmedia",
        MCSConsultCall: "mcsconsultcall",
        MCSReconnectCall: "mcsreconnectcall",
        MCSTransferCall: "mcstransfercall",
        MCSOnestepTransferCall: "mcsonesteptransfercall",
        MCSReroute: "mcsreroute",
        BSR: "bsr",
        EASGetAuthKey: "easgetauthkey",
        EASSetAuthKey: "eassetauthkey",
        EASRegister: "easregister",
        EASUnregister: "easunregister",
        EASGroupRegister: "easgroupregister",
        EASGroupUnregister: "easgroupunregister",
        EASAgentLogin: "easagentlogin",
        GetAgentSkillListEx: "getagentskilllistex",
        GetAgentQueueListEx: "getagentqueuelistex",
        GetAgentListEx: "getagentlistex",
        GetGroupListEx: "getgrouplistex",
        GetQueueListEx: "getqueuelistex",
        AgentRptSubscribe: "agentrptsubscribe",
        GroupRptSubscribe: "grouprptsubscribe",
        QueueRptSubscribe: "queuerptsubscribe",
        TenantRptSubscribe: "tenantrptsubscribe",
        DnisRptSubscribe: "dnisrptsubscribe",
        CloseSubscribe: "closesubscribe",
        GetAgentInfoEx: "getagentinfoex",
        DtmfPlay: "dtmfplay",
        VirtualQueueRouting: "virtualqueuerouting",
        SetCallback: "setcallback",
        MediaDnd: "mediadnd",
        ReservedAgentState: "reservedagentstate",
        SendGlobalEvent: "sendglobalevent",
        AgentCall: "agentcall",
        QueueReportEx: "queuereportex",
        GetMediaActivate: "getmediaactivate",
        GetRoutePolicy: "getroutepolicy",
        SetMediaReadyState: "setmediareadystate",
        GetMediaReadyState: "getmediareadystate",
        GetUserCdr: "getusercdr",
        SetUserCdr: "setusercdr",
        SetDeviceMuteEnable: "setdevicemuteenable",
        ReserveIrAttr: "reserveirattr",
        FindWaitIr: "findwaitir",
        GetUserCdrEx: "getusercdrex",
        SetUserCdrEx: "setusercdrex",
        AgentAdnLogin: "agentadnlogin",
        SetAgentStateData: "setagentstatedata",
        GetCategoryList: "getcategorylist",
        GetCategoryInfo: "getcategoryinfo",
        GetAgentMasterQueueInfo: "getagentmasterqueueinfo"
    }

    // Request Parameter
    ipron.Parameter = {
        Key: "key",
        Handle: "handle",
        ExtensionLen: "extensionlen",
        ExtensionData: "extensiondata",
        MessageType: "messagetype",
        Method: "method",
        Result: "result",
        Appid: "appid",
        MonitorId: "monitorid",
        AppName: "appname",
        AppPassword: "apppassword",
        StartDn: "startdn",
        EndDn: "enddn",
        TenantName: "tenantname",
        ThisDn: "thisdn",
        DestDn: "destdn",
        ObCallingDn: "obcallingdn",
        ConnectionId: "connectionid",
        SkillLevel: "skilllevel",
        Priority: "priority",
        RelationAgentDn: "relationagentdn",
        RelationAgentId: "relationagentid",
        RelationMethod: "relationmethod",
        RelationTimeout: "relationtimeout",
        RouteMethod: "routemethod",
        RouteSkillId: "routeskillid",
        RouteGroupId: "routegroupid",
        PartyType: "partytype",
        ConnectionCnt: "connectioncnt",
        ConnectionId1: "connectionid1",
        ConnectionId2: "connectionid2",
        ConnectionState: "connectionstate",
        AgentDn: "agentdn",
        AgentId: "agentid",
        AgentPassword: "agentpassword",
        AgentState: "agentstate",
        AgentStateSub: "agentstatesub",
        SubcodeCount: "subcodecount",
        ReasonCode: "reasoncode",
        GroupCount: "groupcount",
        QueueCount: "queuecount",
        DestAgentId: "destagentid",
        SkillCount: "skillcount",
        GroupId: "groupid",
        GroupIdSet: "groupidset",
        QueueDn: "queuedn",
        QueueDnSet: "queuednset",
        AgentCount: "agentcount",
        AgentName: "agentname",
        AgentPosition: "agentposition",
        AgentLevel: "agentlevel",
        AniNumber: "aninumber",
        Dnis: "dnis",
        SkillId: "skillid",
        SkillEnable: "skillenable",
        SvcLvlTime: "svclvltime",
        SvcLevel: "svclevel",
        WaitCount: "waitcount",
        AllAgentCount: "allagentcount",
        LoginAgentCount: "loginagentcount",
        ReadyAgentCount: "readyagentcount",
        InbusyAgentCount: "inbusyagentcount",
        IbIntBusyAgt: "ibintbusyagt",
        IbExtBusyAgt: "ibextbusyagt",
        OutbusyAgentCount: "outbusyagentcount",
        ObIntBusyAgt: "obintbusyagt",
        ObExtBusyAgt: "obextbusyagt",
        AftworkAgentCount: "aftworkagentcount",
        NotreadyAgentCount: "notreadyagentcount",
        RingingCount: "ringingcount",
        DaialingCount: "daialingcount",
        InboundTotal: "inboundtotal",
        AcceptTotal: "accepttotal",
        SvcAcceptTotal: "svcaccepttotal",
        AbandonTotal: "abandontotal",
        SvcAbandonTotal: "svcabandontotal",
        RejectTotal: "rejecttotal",
        NonSvcTotal: "nonsvctotal",
        TransBackup: "transbackup",
        AcceptRatio: "acceptratio",
        AcceptTalktimeSum: "accepttalktimesum",
        AnswerCountAvr: "answercountavr",
        TalktimeCountAvr: "talktimecountavr",
        WaitTime: "waittime",
        MaxWaitTime: "maxwaittime",
        MinWaitTime: "minwaittime",
        WaitTimeAvr: "waittimeavr",
        WaitTimeSum: "waittimesum",
        PriorityBound: "prioritybound",
        DateTime: "datetime",
        OtherLoginIpaddr: "otherloginipaddr",
        DistributeWaitCount: "distributewaitcount",
        SocketId: "socketid",
        MediaOption: "mediaoption",
        Hastate: "hastate",
        CallId: "callid",
        MediaId: "mediaid",
        Duration: "duration",
        TermDigits: "termdigits",
        MinDigits: "mindigits",
        MaxDigits: "maxdigits",
        InTotal: "intotal",
        InSuccess: "insuccess",
        InIntTot: "ininttot",
        InIntSuc: "inintsuc",
        InExtTot: "inexttot",
        InExtSuc: "inextsuc",
        InConSuc: "inconsuc",
        InTalkTime: "intalktime",
        InIntTalkTime: "ininttalktime",
        InExtTalkTime: "inexttalktime",
        OutTotal: "outtotal",
        OutSuccess: "outsuccess",
        OutIntTot: "outinttot",
        OutIntSuc: "outintsuc",
        OutExtTot: "outexttot",
        OutExtSuc: "outextsuc",
        OutConSuc: "outconsuc",
        OutTalkTime: "outtalktime",
        TransferCalls: "transfercalls",
        RingingTime: "ringingtime",
        DialingTime: "dialingtime",
        ReadyTime: "readytime",
        NotreadyTime: "notreadytime",
        AcwTime: "acwtime",
        LoginTime: "logintime",
        LogoutTime: "logouttime",
        AnsWaitAvr: "answaitavr",
        IvrTotal: "ivrtotal",
        IvrAbandon: "ivrabandon",
        IvrDodTrns: "ivrdodtrns",
        IvrIcqTrns: "ivricqtrns",
        IcqAccept: "icqaccept",
        IcqSvclvlAccept: "icqsvclvlaccept",
        IcqAbandon: "icqabandon",
        CiqSvclvlAbandon: "ciqsvclvlabandon",
        IcqReject: "icqreject",
        IcqAcceptRatio: "icqacceptratio",
        Ucid: "ucid",
        PrivateData: "privatedata",
        MediaType: "mediatype",
        Option: "option",
        Timeout: "timeout",
        AutoDelete: "autodelete",
        Distribute: "distribute",
        VirtualMediaId: "virtualmediaid",
        Gdn: "gdn",
        Hatimeout: "hatimeout",
        NodeId: "nodeid",
        BsrValue: "bsrvalue",
        BsrPrefix: "bsrprefix",
        AuthKey: "authkey",
        EnAuthKey: "enauthkey",
        MonitorId: "monitorid",
        CallId: "callid",
        CallState: "callstate",
        CallType: "calltype",
        CallCharacteristic: "callcharacteristic",
        ConnectionId: "connectionid",
        PrevconnId: "prevconnid",
        Ani: "ani",
        DnisSet: "dnisset",
        OtherDn: "otherdn",
        OtherQueue: "otherqueue",
        ThisDn: "thisdn",
        ThisQueue: "thisqueue",
        ThirdpartyDn: "thirdpartydn",
        LastDn: "lastdn",
        ServerName: "servername",
        DateTime: "datetime",
        UpdateDn: "updatedn",
        UpdateUserId: "updateuserid",
        SenderDn: "senderdn",
        SenderUserId: "senderuserid",
        EventDn: "eventdn",
        AgentId: "agentid",
        AgentDn: "agentdn",
        AgentState: "agentstate",
        AgentStateSub: "agentstatesub",
        ReasonCode: "reasoncode",
        ErrorCode: "errorcode",
        ErrorMessage: "errormessage",
        AddrType: "addrtype",
        RegMode: "regmode",
        TenantName: "tenantname",
        Ucid: "ucid",
        Hop: "hop",
        Digits: "digits",
        PasswdType: "passwdtype",
        SubscribeType: "subscribetype",
        SubscribeId: "subscribeid",
        PbxLoginDn: "pbxlogindn",
        PauseDuration: "pauseduration",
        PlayDigit: "playdigit",
        MediaSet: "mediaset",
        ChatWeight: "chatweight",
        ChatMax: "chatmax",
        ChatAcwtime: "chatacwtime",
        ChatActivate: "chatactivate",
        VvoiceWeight: "vvoiceweight",
        VvoiceMax: "vvoicemax",
        VvoiceAcwtime: "vvoiceacwtime",
        VvoiceActivate: "vvoiceactivate",
        VchatWeight: "vchatweight",
        VchatMax: "vchatmax",
        VchatAcwtime: "vchatacwtime",
        VchatActivate: "vchatactivate",
        EmailWeight: "emailweight",
        EmailMax: "emailmax",
        EmailAcwtime: "emailacwtime",
        EmailActivate: "emailactivate",
        FaxWeight: "faxweight",
        FaxMax: "faxmax",
        FaxAcwtime: "faxacwtime",
        FaxActivate: "faxactivate",
        VoipWeight: "voipweight",
        VoipMax: "voipmax",
        VoipAcwtime: "voipacwtime",
        VoipActivate: "voipactivate",
        MvoipWeight: "mvoipweight",
        MvoipMax: "mvoipmax",
        MvoipAcwtime: "mvoipacwtime",
        MvoipActivate: "mvoipactivate",
        WebWeight: "webweight",
        WebMax: "webmax",
        WebAcwtime: "webacwtime",
        WebActivate: "webactivate",
        Enable: "enable",
        Url: "url",
        SrcMediaType: "srcmediatype",
        DestMediaType: "destmediatype",
        DestInfo1: "destinfo1",
        DestInfo2: "destinfo2",
        DestInfo3: "destinfo3",
        UsePrevAgent: "useprevagent",
        UseDesignatedAgent: "usedesignatedagent",
        SrcNodeId: "srcnodeid",
        MediaReady: "mediaready",
        UserCdr: "usercdr",
        UserCdrIndex: "usercdrindex",
        CustomData1: "customdata1",
        CustomData2: "customdata2",
        CustomData3: "customdata3",
        CategoryId: "categoryid",
        QueueId: "queueid",
        QueueName: "queuename",
        SkillName: "skillname",
        InboundAgentState: "inboundagentstate",
        InboundAgentStateSub: "inboundagentstatesub",
        OutboundAgentState: "outboundagentstate",
        OutboundAgentStateSub: "outboundagentstatesub"
    }

    // ICAPI Method
    ipron.APIMethod = {
        OPENSERVER: 1000,
        OPENSERVER_RES: 1001,
        CLOSESERVER: 1002,
        CLOSESERVER_RES: 1003,
        REGIADDR: 1004,
        REGIADDR_RES: 1005,
        UNREGIADDR: 1006,
        UNREGIADDR_RES: 1007,
        ANSWERCALL: 1008,
        ANSWERCALL_RES: 1009,
        CLEARCALL: 1010,
        CLEARCALL_RES: 1011,
        MAKECALL: 1012,
        MAKECALL_RES: 1013,
        HOLDCALL: 1014,
        HOLDCALL_RES: 1015,
        RETRIEVECALL: 1016,
        RETRIEVECALL_RES: 1017,
        SINGLESTEP_TRANSFER: 1018,
        SINGLESTEP_TRANSFER_RES: 1019,
        MUTE_TRANSFER: 1020,
        MUTE_TRANSFER_RES: 1021,
        SINGLESTEP_CONFERENCE: 1022,
        SINGLESTEP_CONFERENCE_RES: 1023,
        CONFERENCE: 1024,
        CONFERENCE_RES: 1025,
        AGENTLOGIN: 1030,
        AGENTLOGIN_RES: 1031,
        AGENTLOGOUT: 1032,
        AGENTLOGOUT_RES: 1033,
        SETAGENTSTATE: 1034,
        SETAGENTSTATE_RES: 1035,
        GETAGENTSTATE: 1036,
        GETAGENTSTATE_RES: 1037,
        HEARTBEAT: 1038,
        HEARTBEAT_RES: 1039,
        GETSTATE_SUBCODE: 1040,
        GETSTATE_SUBCODE_RES: 1041,
        GETAGENTLIST: 1042,
        GETAGENTLIST_RES: 1043,
        GETAGENTINFO: 1044,
        GETAGENTINFO_RES: 1045,
        GETROUTEABLE: 1046,
        GETROUTEABLE_RES: 1047,
        SETAFTCALLSTATE: 1048,
        SETAFTCALLSTATE_RES: 1049,
        GETQUEUETRAFFIC: 1050,
        GETQUEUETRAFFIC_RES: 1051,
        ITMSG_SENDMSG: 1052,
        ITMSG_SENDMSG_RES: 1053,
        ITMSG_ARRIVED: 1054,
        ITMSG_ARRIVED_RES: 1055,
        GETGROUPLIST: 1056,
        GETGROUPLIST_RES: 1057,
        GETQUEUELIST: 1058,
        GETQUEUELIST_RES: 1059,
        GROUP_REGIADDR: 1061,
        GROUP_REGIADDR_RES: 1062,
        GROUP_UNREGIADDR: 1063,
        GROUP_UNREGIADDR_RES: 1064,
        UPDATE_USERDATA: 1065,
        UPDATE_USERDATA_RES: 1066,
        DELETE_KEY_USERDATA: 1067,
        DELETE_KEY_USERDATA_RES: 1068,
        DELETE_ALL_USERDATA: 1069,
        DELETE_ALL_USERDATA_RES: 1070,
        SEND_USEREVENT: 1071,
        SEND_USEREVENT_RES: 1072,
        GRPICKUP: 1073,
        GRPICKUP_RES: 1074,
        AGENT_REPORT: 1077,
        AGENT_REPORT_RES: 1078,
        JOINCALL: 1079,
        JOINCALL_RES: 1080,
        TENANT_REPORT: 1081,
        TENANT_REPORT_RES: 1082,
        DEFLECTCALL: 1083,
        DEFLECTCALL_RES: 1084,
        SETSKILL_ENABLE: 1085,
        SETSKILL_ENABLE_RES: 1086,
        GETAGENT_SKILLLIST: 1087,
        GETAGENT_SKILLLIST_RES: 1088,
        GETCONNECTION: 1089,
        GETCONNECTION_RES: 1090,
        GET_USERDATA: 1091,
        GET_USERDATA_RES: 1092,
        GETCONNSTATE: 1093,
        GETCONNSTATE_RES: 1094,
        FORCE_SETAGTSTATE: 1095,
        FORCE_SETAGTSTATE_RES: 1096,
        GROUP_REPORT: 1099,
        GROUP_REPORT_RES: 1100,
        GETAGENT_QUEUELIST: 1101,
        GETAGENT_QUEUELIST_RES: 1102,
        GETQUEUEORDER: 1103,
        GETQUEUEORDER_RES: 1104,
        SET_ANI_USERDATA: 1111,
        SET_ANI_USERDATA_RES: 1112,
        QUEUE_REPORT: 1117,
        QUEUE_REPORT_RES: 1118,
        DNIS_REPORT: 1119,
        DNIS_REPORT_RES: 1120,
        SEND_SOCKETID: 1139,
        QUEUE_PICKUP: 1140,
        QUEUE_PICKUP_RES: 1141,
        MEDIA_ATTACH: 1142,
        MEDIA_ATTACH_RES: 1143,
        MEDIA_DEATTACH: 1144,
        MEDIA_DEATTACH_RES: 1145,
        MEDIA_PLAY: 1146,
        MEDIA_PLAY_RES: 1147,
        MEDIA_COLLECT: 1148,
        MEDIA_COLLECT_RES: 1149,
        SET_UCID_USERDATA: 1150,
        SET_UCID_USERDATA_RES: 1151,
        CREATE_VIRTUAL_MEDIA: 1152,
        CREATE_VIRTUAL_MEDIA_RES: 1153,
        DELETE_VIRTUAL_MEDIA: 1154,
        DELETE_VIRTUAL_MEDIA_RES: 1155,
        MCS_CONSULTCALL: 1156,
        MCS_CONSULTCALL_RES: 1157,
        MCS_RECONNECTCALL: 1158,
        MCS_RECONNECTCALL_RES: 1159,
        MCS_TRANSFERCALL: 1160,
        MCS_TRANSFERCALL_RES: 1161,
        MCS_ONESTEP_TRANSFERCALL: 1162,
        MCS_ONESTEP_TRANSFERCALL_RES: 1163,
        MCS_REROUTE: 1164,
        MCS_REROUTE_RES: 1165,
        GETAGENTINFO_EX: 1166,
        GETAGENTINFO_EX_RES: 1167,
        BSR: 1170,
        BSR_RES: 1171,
        EAS_GETAUTHKEY: 1180,
        EAS_GETAUTHKEY_RES: 1181,
        EAS_SETAUTHKEY: 1182,
        EAS_SETAUTHKEY_RES: 1183,
        EAS_REGIADDR: 1184,
        EAS_REGIADDR_RES: 1185,
        EAS_UNREGIADDR: 1186,
        EAS_UNREGIADDR_RES: 1187,
        EAS_GROUP_REGIADDR: 1188,
        EAS_GROUP_REGIADDR_RES: 1189,
        EAS_GROUP_UNREGIADDR: 1190,
        EAS_GROUP_UNREGIADDR_RES: 1191,
        EAS_AGETN_LOGIN: 1192,
        EAS_AGENT_LOGIN_RES: 1193,
        AGENTCALL: 1194,
        AGENTCALL_RES: 1195,
        DTMF_PLAY: 1196,
        DTMF_PLAY_RES: 1197,

        GETAGENTLIST_EX: 1200,
        GETAGENTLIST_EX_RES: 1201,
        GETGROUPLIST_EX: 1202,
        GETGROUPLIST_EX_RES: 1203,
        GETQUEUELIST_EX: 1204,
        GETQUEUELIST_EX_RES: 1205,
        GETAGENT_SKILLLIST_EX: 1206,
        GETAGENT_SKILLLIST_EX_RES: 1207,
        GETAGENT_QUEUELIST_EX: 1208,
        GETAGENT_QUEUELIST_EX_RES: 1209,

        AGENT_SUBSCRIBE: 1220,
        AGENT_SUBSCRIBE_RES: 1221,
        GROUP_SUBSCRIBE: 1222,
        GROUP_SUBSCRIBE_RES: 1223,
        QUEUE_SUBSCRIBE: 1224,
        QUEUE_SUBSCRIBE_RES: 1225,
        TENANT_SUBSCRIBE: 1226,
        TENANT_SUBSCRIBE_RES: 1227,
        DNIS_SUBSCRIBE: 1228,
        DNIS_SUBSCRIBE_RES: 1229,
        CLOSE_SUBSCRIBE: 1230,
        CLOSE_SUBSCRIBE_RES: 1231,

        VIRTUAL_QUEUE: 1300,
        VIRTUAL_QUEUE_RES: 1301,
        SET_CALLBACK: 1302,
        SET_CALLBACK_RES: 1303,
        MEDIA_DND: 1304,
        MEDIA_DND_RES: 1305,
        RESERVED_AGENT_STATE: 1306,
        RESERVED_AGENT_STATE_RES: 1307,
        SEND_GLOBAL_EVENT: 1308,
        SEND_GLOBAL_EVENT_RES: 1309,
        GET_MEDIA_ACTIVATE: 1310,
        GET_MEDIA_ACTIVATE_RES: 1311,
        GETROUTEPOLICY: 1312,
        GETROUTEPOLICY_RES: 1313,
        SET_MEDIAREADY_STATE: 1314,
        SET_MEDIAREADY_STATE_RES: 1315,
        GET_MEDIAREADY_STATE: 1316,
        GET_MEDIAREADY_STATE_RES: 1317,
        GET_USER_CDR: 1318,
        GET_USER_CDR_RES: 1319,
        SET_USER_CDR: 1320,
        SET_USER_CDR_RES: 1321,
        SET_MUTE_ENABLE: 1322,
        SET_MUTE_ENABLE_RES: 1323,
        GETCATEGORY_LIST: 1324,
        GETCATEGORY_LIST_RES: 1325,
        GETCATEGORY_INFO: 1326,
        GETCATEGORY_INFO_RES: 1327,
        RESERVE_IR_ATTR: 1328,
        RESERVE_IR_ATTR_RES: 1329,
        FIND_WAIT_IR: 1330,
        FIND_WAIT_IR_RES: 1331,
        GETCONNECTION: 1332,
        GETCONNECTION_EX_RES: 1333,
        GETCALL_INFO: 1334,
        GETCALL_INFO_RES: 1335,
        GET_USER_CDR_EX: 1336,
        GET_USER_CDR_EX_RES: 1337,
        SET_USER_CDR_EX: 1338,
        SET_USER_CDR_EX_RES: 1339,
        ADNLOGIN: 1340,
        ADNLOGIN_RES: 1341,
        SETAGENTSTATE_DATA: 1342,
        SETAGENTSTATE_DATA_RES: 1343,
        HOLDCALL_EX: 1344,
        HOLDCALL_EX_RES: 1345,
        GETAGENT_MASTERQUEUEINFO: 1346,
        GETAGENT_MASTERQUEUEINFO_RES: 1347,
        SETAFTCALLSTATE_EX: 1348,
        SETAFTCALLSTATE_EX_RES: 1349
    }

    // ICAPI Event
    ipron.APIEvent = {
        RINGING: 2000,
        ESTABLISHED: 2001,
        RELEASED: 2002,
        DIALING: 2003,
        ABANDONED: 2004,
        DESTBUSY: 2005,
        HELD: 2006,
        RETRIEVED: 2007,
        PARTYADDED: 2008,
        PARTYCHANGED: 2009,
        PARTYDELETED: 2010,
        QUEUED: 2011,
        DIVERTED: 2012,
        ACDAGENT_LOGGEDON: 2013,
        ACDAGENT_LOGGEDOFF: 2014,
        ACDAGENT_NOTREADY: 2015,
        ACDAGENT_READY: 2016,
        ACDAGENT_WORKAFTCALL: 2017,
        AGENTLOGIN: 2018,
        AGENTLOGOUT: 2019,
        AGENTREADY: 2020,
        AGENTNOTREADY: 2021,
        AGENTACW: 2022,
        LINKCONNECTED: 2023,
        LINKDISCONNECTED: 2024,
        CTIDISCONNECTED: 2025,
        REGISTERED: 2026,
        UNREGISTERED: 2027,
        UPDATE_USERDATA: 2028,
        USEREVENT: 2029,
        INITIATED: 2030,
        AGENTINREADY: 2031,
        AGENTOUTREADY: 2032,
        MEDIAPLAY: 2033,
        MEDIACOLLECT: 2034,
        BANISHMENT: 2035,
        ACDAGENT_BUSY: 2036,
        FAILED: 2037,
        MCS_CONSULTED: 2041,
        MCS_RECONNECTED: 2042,
        MCS_TRANSFERRED: 2043,
        MCS_ONESTEP_TRANSFERRED: 2044,
        MCS_REROUTE: 2045,
        EAS_REGISTERED: 2051,
        EAS_UNREGISTERED: 2052,
        MEDIA_ENABLED: 2053,
        MEDIA_READY: 2054,
        DEVICE_DND: 2060,
        VIRTUAL_MEDIA_CREATE: 3000,
        VIRTUAL_MEDIA_DISTRIBUTE: 3001,
        VIRTUAL_MEDIA_DELETE: 3002,
        HASTATE_CHANGED: 3003,
        AGENT_SSCRIBE_PUSH: 3004,
        GROUP_SSCRIBE_PUSH: 3005,
        QUEUE_SSCRIBE_PUSH: 3006,
        TENANT_SSCRIBE_PUSH: 3007,
        DNIS_SSCRIBE_PUSH: 3008,
        NEW_NOTICE: 3009,
        CALLBACK_DISTRIBUTE: 3010,

        ACTIVE_TIMEOUT: 3100,
        OPENSRVSUCCESS: 3101,
        GLOBAL_EVENT: 3102,
        NODE_OUT_SERVICE: 3103,
        NODE_IN_SERVICE: 3104
    }

    // Event
    ipron.WebEvent = {
        ERR_OPENSERVER: 5000,
        ERR_HEARTBEAT: 5001,
        ERR_DISCONNECT: 5002
    }

    // Advance List Option Values
    ipron.ListOption = {
        ID: 0,
        DN: 1,
        LOGIN_ID: 2,
        NAME: 3,
        STATE: 4,
        STATE_SUB: 5,
        STATE_KEEP_TIME: 6,
        IN_OUT: 7,
        SKILL_LEVEL: 8,
        SKILL_ID: 9,
        SKILL_ENABLE: 10
    }

    // Subscribe Type Values
    ipron.SubscribeType = {
        PERIODIC: 0,
        SENSITIVE: 1
    }

    // JSON Key
    ipron.JSONKey = {
        Method: "method",
        Result: "result",
        key: "key"
    }

    // JSON Value
    ipron.JSONValue = {
        True: "true",
        False: "false"
    }

    // AppName
    ipron.app_name = '';

    // Heartbeat Info
    ipron.hbPeriod = 10; // sec
    ipron.hbErrCnt = 3;

    // Server 01 Info
    ipron.ip1 = '';
    ipron.port1 = '';

    // Server 02 Info
    ipron.ip2 = '';
    ipron.port2 = '';

    // Connected ServerInfo
    ipron.ConnectedServerIndex = -1;

    // Set Protocol
    ipron.SetProtocol = function (prt) {
        if (prt == "http") {
            protocol = "http";
        }
        else {
            protocol = "https";
        }
    }

    // Get WebAPI Version
    ipron.GetWebAPIVersion = function () {
        return Version;
    }

    // Set Heartbeat Info
    ipron.SetHeartbeatInfo = function (period, errCnt) {
        ipron.hbPeriod = period;
        ipron.hbErrCnt = errCnt;
    }

    // Set Server Info
    ipron.SetServerInfo = function (ip1, port1, ip2, port2) {
        ipron.ip1 = ip1;
        ipron.port1 = port1;
        ipron.ip2 = ip2;
        ipron.port2 = port2;
    }

    // Heartbeat
    ipron.Heartbeat = function () {
        ipron.SendData(baseURL + ipron.Request.Heartbeat + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey, 'GET');
    }

    // OpenServer
    ipron.OpenServer = function (name, cb_evt, cb_res) {
        if (ConnectedState != ServerConnectState.Connected && ConnectedState != ServerConnectState.Trying_1st) {
            if (ConnectedState != ServerConnectState.Trying_2nd) {
                ConnectedState = ServerConnectState.Trying_1st;
            }
			ipron.app_name = name;
			
            if (ipron.ConnectedServerIndex < 0) {
                var now = new Date();
                if (now.getMilliseconds() % 2 == 0) {
                    ipron.ConnectedServerIndex = 2;
                }
                else {
                    ipron.ConnectedServerIndex = 1;
                }
            }

            ipron.cb_evt = cb_evt;
            ipron.cb_res = cb_res;
            var data = baseURL + ipron.Request.OpenServer + '?' + ipron.Parameter.AppName + '=' + name;
            ipron.SendData(encodeURI(data));
        }
    }

    // CloseServer
    ipron.CloseServer = function () {
        if (ipron.IsConnected()) {
            var data = baseURL + ipron.Request.CloseServer + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle;
            ipron.SendData(encodeURI(data));

            ipron.SessionKey = '';
            ConnectedState = ServerConnectState.Disconnected;
        }
    }

    // Register
    ipron.Register = function (dn, tenant) {
        if (ipron.IsConnected()) {
            var data = baseURL + ipron.Request.Register + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            ipron.Parameter.ThisDn + '=' + dn + '&' +
            ipron.Parameter.TenantName + '=' + tenant;
            ipron.SendData(encodeURI(data));
        }
    }

    // Unregister
    ipron.Unregister = function (dn, tenant) {
        if (ipron.IsConnected()) {
            var data = baseURL + ipron.Request.Unregister + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            ipron.Parameter.ThisDn + '=' + dn + '&' +
            ipron.Parameter.TenantName + '=' + tenant;
            ipron.SendData(encodeURI(data));
        }
    }

    // Group Register
    ipron.GroupRegister = function (startDn, endDn, tenant) {
        if (ipron.IsConnected()) {
            var data = baseURL + ipron.Request.GroupRegister + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            ipron.Parameter.StartDn + '=' + startDn + '&' +
            ipron.Parameter.EndDn + '=' + endDn + '&' +
            ipron.Parameter.TenantName + '=' + tenant;
            ipron.SendData(encodeURI(data));
        }
    }

    // Group Unregister
    ipron.GroupUnregister = function (startDn, endDn, tenant) {
        if (ipron.IsConnected()) {
            var data = baseURL + ipron.Request.GroupUnregister + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            ipron.Parameter.StartDn + '=' + startDn + '&' +
            ipron.Parameter.EndDn + '=' + endDn + '&' +
            ipron.Parameter.TenantName + '=' + tenant;
            ipron.SendData(encodeURI(data));
        }
    }

    ipron.AnswerCall = function (dn, connectionId, extension, mediaType) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + dn + '&';
            data += ipron.Parameter.ConnectionId + '=' + connectionId + '&';
            data += ipron.Parameter.MediaType + '=' + mediaType;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.AnswerCall + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.ClearCall = function (dn, connectionId, extension, mediaType) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + dn + '&';
            data += ipron.Parameter.ConnectionId + '=' + connectionId + '&';
            data += ipron.Parameter.MediaType + '=' + mediaType;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.ClearCall + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.MakeCall = function (thisDn, destDn, obCallingDn, skillLevel, priority, relationAgentDn, relationAgentId,
    relationMethod, routeMethod, routeSkillId, routeGroupId, Ucid, extension, mediaType, usePrevAgent, useDesignatedAgent,
    relationTimeout) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + thisDn + '&';
            data += ipron.Parameter.DestDn + '=' + destDn + '&';
            data += ipron.Parameter.ObCallingDn + '=' + obCallingDn + '&';
            data += ipron.Parameter.SkillLevel + '=' + skillLevel + '&';
            data += ipron.Parameter.Priority + '=' + priority + '&';
            data += ipron.Parameter.RelationAgentDn + '=' + relationAgentDn + '&';
            data += ipron.Parameter.RelationAgentId + '=' + relationAgentId + '&';
            data += ipron.Parameter.RelationMethod + '=' + relationMethod + '&';
            data += ipron.Parameter.RouteMethod + '=' + routeMethod + '&';
            data += ipron.Parameter.RouteSkillId + '=' + routeSkillId + '&';
            data += ipron.Parameter.RouteGroupId + '=' + routeGroupId + '&';
            data += ipron.Parameter.Ucid + '=' + Ucid + '&';
            data += ipron.Parameter.MediaType + '=' + mediaType + '&';
            data += ipron.Parameter.UsePrevAgent + '=' + usePrevAgent + '&';
            data += ipron.Parameter.UseDesignatedAgent + '=' + useDesignatedAgent + '&';
            data += ipron.Parameter.RelationTimeout + '=' + relationTimeout;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.MakeCall + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.HoldCall = function (dn, connectionId, extension, mediaType) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + dn + '&';
            data += ipron.Parameter.ConnectionId + '=' + connectionId + '&';
            data += ipron.Parameter.MediaType + '=' + mediaType;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.HoldCall + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.HoldCallEx = function (dn, connectionId, extension, mediaType, mediaOption) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + dn + '&';
            data += ipron.Parameter.ConnectionId + '=' + connectionId + '&';
            data += ipron.Parameter.MediaType + '=' + mediaType + '&';
            data += ipron.Parameter.MediaOption + '=' + mediaOption;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.HoldCallEx + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.RetrieveCall = function (dn, connectionId, extension, mediaType) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + dn + '&';
            data += ipron.Parameter.ConnectionId + '=' + connectionId + '&';
            data += ipron.Parameter.MediaType + '=' + mediaType;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.RetrieveCall + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GroupPickup = function (dn, extension, mediaType) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + dn + '&';
            data += ipron.Parameter.MediaType + '=' + mediaType;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.GroupPickup + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.QueuePickup = function (dn, callId, extension) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + dn + '&';
            data += ipron.Parameter.CallId + '=' + callId;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.QueuePickup + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.JoinCall = function (thisDn, destDn, partyType, extension, mediaType) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + thisDn + '&';
            data += ipron.Parameter.DestDn + '=' + destDn + '&';
            data += ipron.Parameter.PartyType + '=' + partyType + '&';
            data += ipron.Parameter.MediaType + '=' + mediaType;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.JoinCall + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.SinglestepTransfer = function (thisDn, connectionId, destDn, obCallingDn, skillLevel, priority, relationAgentDn,
    relationAgentId, relationMethod, routeMethod, routeSkillId, routeGroupId, extension, mediaType, usePrevAgent, useDesignatedAgent,
    relationTimeout) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + thisDn + '&';
            data += ipron.Parameter.DestDn + '=' + destDn + '&';
            data += ipron.Parameter.ObCallingDn + '=' + obCallingDn + '&';
            data += ipron.Parameter.ConnectionId + '=' + connectionId + '&';
            data += ipron.Parameter.SkillLevel + '=' + skillLevel + '&';
            data += ipron.Parameter.Priority + '=' + priority + '&';
            data += ipron.Parameter.RelationAgentDn + '=' + relationAgentDn + '&';
            data += ipron.Parameter.RelationAgentId + '=' + relationAgentId + '&';
            data += ipron.Parameter.RelationMethod + '=' + relationMethod + '&';
            data += ipron.Parameter.RouteMethod + '=' + routeMethod + '&';
            data += ipron.Parameter.RouteSkillId + '=' + routeSkillId + '&';
            data += ipron.Parameter.RouteGroupId + '=' + routeGroupId + '&';
            data += ipron.Parameter.MediaType + '=' + mediaType + '&';
            data += ipron.Parameter.UsePrevAgent + '=' + usePrevAgent + '&';
            data += ipron.Parameter.UseDesignatedAgent + '=' + useDesignatedAgent + '&';
            data += ipron.Parameter.RelationTimeout + '=' + relationTimeout;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.SinglestepTransfer + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.MuteTransfer = function (thisDn, connectionId, destDn, extension, mediaType) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + thisDn + '&';
            data += ipron.Parameter.DestDn + '=' + destDn + '&';
            data += ipron.Parameter.ConnectionId + '=' + connectionId + '&';
            data += ipron.Parameter.MediaType + '=' + mediaType;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.MuteTransfer + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.SinglestepConference = function (thisDn, connectionId, destDn, obCallingDn, partyType, extension, mediaType) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + thisDn + '&';
            data += ipron.Parameter.DestDn + '=' + destDn + '&';
            data += ipron.Parameter.ObCallingDn + '=' + obCallingDn + '&';
            data += ipron.Parameter.ConnectionId + '=' + connectionId + '&';
            data += ipron.Parameter.PartyType + '=' + partyType + '&';
            data += ipron.Parameter.MediaType + '=' + mediaType;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.SinglestepConference + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.Conference = function (thisDn, connectionId, destDn, obCallingDn, partyType, extension, mediaType) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + thisDn + '&';
            data += ipron.Parameter.DestDn + '=' + destDn + '&';
            data += ipron.Parameter.ObCallingDn + '=' + obCallingDn + '&';
            data += ipron.Parameter.ConnectionId + '=' + connectionId + '&';
            data += ipron.Parameter.PartyType + '=' + partyType + '&';
            data += ipron.Parameter.MediaType + '=' + mediaType;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.Conference + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.DeflectCall = function (thisDn, connectionId, destDn, obCallingDn, skillLevel, priority, relationAgentDn,
    relationAgentId, relationMethod, routeMethod, routeSkillId, routeGroupId, mediaOption, extension, mediaType, usePrevAgent,
    useDesignatedAgent, relationTimeout) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + thisDn + '&';
            data += ipron.Parameter.DestDn + '=' + destDn + '&';
            data += ipron.Parameter.ObCallingDn + '=' + obCallingDn + '&';
            data += ipron.Parameter.ConnectionId + '=' + connectionId + '&';
            data += ipron.Parameter.SkillLevel + '=' + skillLevel + '&';
            data += ipron.Parameter.Priority + '=' + priority + '&';
            data += ipron.Parameter.RelationAgentDn + '=' + relationAgentDn + '&';
            data += ipron.Parameter.RelationAgentId + '=' + relationAgentId + '&';
            data += ipron.Parameter.RelationMethod + '=' + relationMethod + '&';
            data += ipron.Parameter.RouteMethod + '=' + routeMethod + '&';
            data += ipron.Parameter.RouteSkillId + '=' + routeSkillId + '&';
            data += ipron.Parameter.RouteGroupId + '=' + routeGroupId + '&';
            data += ipron.Parameter.MediaOption + '=' + mediaOption + '&';
            data += ipron.Parameter.MediaType + '=' + mediaType + '&';
            data += ipron.Parameter.UsePrevAgent + '=' + usePrevAgent + '&';
            data += ipron.Parameter.UseDesignatedAgent + '=' + useDesignatedAgent + '&';
            data += ipron.Parameter.RelationTimeout + '=' + relationTimeout;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.DeflectCall + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.AgentLogin = function (agentDn, agentId, agentPassword, tenantName, agentState, agentStateSub, extension, passwdType, mediaSet) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.AgentDn + '=' + agentDn + '&';
            data += ipron.Parameter.AgentId + '=' + agentId + '&';
            data += ipron.Parameter.AgentPassword + '=' + agentPassword + '&';
            data += ipron.Parameter.AgentState + '=' + agentState + '&';
            data += ipron.Parameter.AgentStateSub + '=' + agentStateSub + '&';
            data += ipron.Parameter.PasswdType + '=' + passwdType + '&';
            data += ipron.Parameter.MediaSet + '=' + mediaSet;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.AgentLogin + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.AgentLogout = function (agentDn, agentId, tenantName, extension) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.AgentDn + '=' + agentDn + '&';
            data += ipron.Parameter.AgentId + '=' + agentId;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.AgentLogout + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.SetAFTCallState = function (agentId, tenantName, agentState, agentStateSub, mediaSet) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.AgentId + '=' + agentId + '&';
            data += ipron.Parameter.AgentState + '=' + agentState + '&';
            data += ipron.Parameter.AgentStateSub + '=' + agentStateSub + '&';
            data += ipron.Parameter.MediaSet + '=' + mediaSet;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.SetAFTCallState + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.SetAFTCallStateEx = function (agentId, tenantName, inboundAgentState, inboundAgentStateSub, outboundAgentState, outboundAgentStateSub, mediaSet) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.AgentId + '=' + agentId + '&';
            data += ipron.Parameter.InboundAgentState + '=' + inboundAgentState + '&';
            data += ipron.Parameter.InboundAgentStateSub + '=' + inboundAgentStateSub + '&';
            data += ipron.Parameter.OutboundAgentState + '=' + outboundAgentState + '&';
            data += ipron.Parameter.OutboundAgentStateSub + '=' + outboundAgentStateSub + '&';
            data += ipron.Parameter.MediaSet + '=' + mediaSet;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.SetAFTCallStateEx + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.SetAgentState = function (agentId, tenantName, agentState, agentStateSub, extension, mediaSet) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.AgentId + '=' + agentId + '&';
            data += ipron.Parameter.AgentState + '=' + agentState + '&';
            data += ipron.Parameter.AgentStateSub + '=' + agentStateSub + '&';
            data += ipron.Parameter.MediaSet + '=' + mediaSet;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.SetAgentState + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.ForceSetAgentState = function (agentId, tenantName, agentState, agentStateSub, extension, mediaSet) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.AgentId + '=' + agentId + '&';
            data += ipron.Parameter.AgentState + '=' + agentState + '&';
            data += ipron.Parameter.AgentStateSub + '=' + agentStateSub + '&';
            data += ipron.Parameter.MediaSet + '=' + mediaSet;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.ForceSetAgentState + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.AgentReport = function (agentId, tenantName, mediaSet) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.AgentId + '=' + agentId + '&';
            data += ipron.Parameter.MediaSet + '=' + mediaSet;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.AgentReport + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GroupReport = function (tenantName, groupIdSet, mediaSet) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.GroupIdSet + '=' + groupIdSet + '&';
            data += ipron.Parameter.MediaSet + '=' + mediaSet;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.GroupReport + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.QueueReport = function (tenantName, queueDnSet, mediaSet) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.QueueDnSet + '=' + queueDnSet + '&';
            data += ipron.Parameter.MediaSet + '=' + mediaSet;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.QueueReport + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.TenantReport = function (tenantName, mediaSet) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.MediaSet + '=' + mediaSet;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.TenantReport + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.DNISReport = function (dnisSet, privateData) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.DnisSet + '=' + dnisSet + '&';
            data += ipron.Parameter.PrivateData + '=' + privateData;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.DNISReport + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.SetSkillEnable = function (agentId, skillId, skillEnable) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.AgentId + '=' + agentId + '&';
            data += ipron.Parameter.SkillId + '=' + skillId + '&';
            data += ipron.Parameter.SkillEnable + '=' + skillEnable;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.SetSkillEnable + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GetGroupList = function (tenantName, privateData) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.PrivateData + '=' + privateData;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.GetGroupList + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GetQueueList = function (tenantName, privateData) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.PrivateData + '=' + privateData;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.GetQueueList + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GetAgentList = function (tenantName, groupIdSet, queueDnSet, privateData, agentState, mediaType) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.AgentState + '=' + agentState + '&';
            data += ipron.Parameter.GroupIdSet + '=' + groupIdSet + '&';
            data += ipron.Parameter.QueueDnSet + '=' + queueDnSet + '&';
            data += ipron.Parameter.MediaType + '=' + mediaType + '&';
            data += ipron.Parameter.PrivateData + '=' + privateData;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.GetAgentList + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GetAgentInfo = function (tenantName, destAgentId, privateData) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.DestAgentId + '=' + destAgentId + '&';
            data += ipron.Parameter.PrivateData + '=' + privateData;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.GetAgentInfo + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GetRouteable = function (tenantName, destAgentId, extension, mediaType) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.DestAgentId + '=' + destAgentId + '&';
            data += ipron.Parameter.MediaType + '=' + mediaType;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.GetRouteable + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GetAgentState = function (tenantName, destAgentId, privateData, extension, mediaSet) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.DestAgentId + '=' + destAgentId + '&';
            data += ipron.Parameter.PrivateData + '=' + privateData + '&';
            data += ipron.Parameter.MediaSet + '=' + mediaSet;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.GetAgentState + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GetQueueTraffic = function (tenantName, queueDn, skillId, privateData, extension, mediaSet) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.QueueDn + '=' + queueDn + '&';
            data += ipron.Parameter.SkillId + '=' + skillId + '&';
            data += ipron.Parameter.PrivateData + '=' + privateData + '&';
            data += ipron.Parameter.MediaSet + '=' + mediaSet;

            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.GetQueueTraffic + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GetStateSubcode = function (tenantName, agentState) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.AgentState + '=' + agentState;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.GetStateSubcode + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GetAgentSkillList = function (tenantName, destAgentId) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.DestAgentId + '=' + destAgentId;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.GetAgentSkillList + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GetConnection = function (destDn, extension) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.DestDn + '=' + destDn;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.GetConnection + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GetAgentQueueList = function (tenantName, destAgentId) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.DestAgentId + '=' + destAgentId;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.GetAgentQueueList + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GetQueueOrder = function (tenantName, queueDn, skillId, priorityBound, privateData, extension, mediaType) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.QueueDn + '=' + queueDn + '&';
            data += ipron.Parameter.SkillId + '=' + skillId + '&';
            data += ipron.Parameter.PriorityBound + '=' + priorityBound + '&';
            data += ipron.Parameter.PrivateData + '=' + privateData + '&';
            data += ipron.Parameter.MediaType + '=' + mediaType;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.GetQueueOrder + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.UpdateUserdata = function (agentDn, tenantName, connectionId, extension) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.ConnectionId + '=' + connectionId + '&';
            data += ipron.Parameter.AgentDn + '=' + agentDn;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.UpdateUserdata + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.DeleteKeyUserdata = function (agentDn, tenantName, connectionId, extension) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.ConnectionId + '=' + connectionId + '&';
            data += ipron.Parameter.AgentDn + '=' + agentDn;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.DeleteKeyUserdata + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.DeleteAllUserdata = function (agentDn, tenantName, connectionId) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.ConnectionId + '=' + connectionId + '&';
            data += ipron.Parameter.AgentDn + '=' + agentDn;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.DeleteAllUserdata + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.SendUserEvent = function (agentDn, tenantName, destDn, extension) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.DestDn + '=' + destDn + '&';
            data += ipron.Parameter.AgentDn + '=' + agentDn;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.SendUserEvent + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GetUserdata = function (tenantName, thisDn, connectionId, extension) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.ThisDn + '=' + thisDn + '&';
            data += ipron.Parameter.ConnectionId + '=' + connectionId;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.GetUserdata + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GetConnState = function (thisDn, connectionId, extension) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + thisDn + '&';
            data += ipron.Parameter.ConnectionId + '=' + connectionId;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.GetConnState + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.SetANIUserdata = function (agentDn, aniNumber, extension) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.AgentDn + '=' + agentDn + '&';
            data += ipron.Parameter.AniNumber + '=' + aniNumber;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.SetANIUserdata + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.SetUCIDUserdata = function (agentDn, ucid, extension) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.AgentDn + '=' + agentDn + '&';
            data += ipron.Parameter.Ucid + '=' + ucid;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.SetUCIDUserdata + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.MediaAttach = function (thisDn, callId, extension) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + thisDn + '&';
            data += ipron.Parameter.CallId + '=' + callId;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.MediaAttach + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.MediaDeattach = function (thisDn, callId, extension) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + thisDn + '&';
            data += ipron.Parameter.CallId + '=' + callId;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.MediaDeattach + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.MediaPlay = function (thisDn, callId, mediaId, duration, extension) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + thisDn + '&';
            data += ipron.Parameter.CallId + '=' + callId + '&';
            data += ipron.Parameter.MediaId + '=' + mediaId + '&';
            data += ipron.Parameter.Duration + '=' + duration;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.MediaPlay + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.MediaCollect = function (thisDn, callId, mediaId, duration, termDigits, minDigits, maxDigits, extension) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + thisDn + '&';
            data += ipron.Parameter.CallId + '=' + callId + '&';
            data += ipron.Parameter.MediaId + '=' + mediaId + '&';
            data += ipron.Parameter.Duration + '=' + duration + '&';
            data += ipron.Parameter.TermDigits + '=' + termDigits + '&';
            data += ipron.Parameter.MinDigits + '=' + minDigits + '&';
            data += ipron.Parameter.MaxDigits + '=' + maxDigits;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.MediaCollect + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.CreateVirtualMedia = function (queueDn, aniNumber, dnis, ucid, mediaType, option, timeout, autoDelete, distribute, extension) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.QueueDn + '=' + queueDn + '&';
            data += ipron.Parameter.AniNumber + '=' + aniNumber + '&';
            data += ipron.Parameter.Dnis + '=' + dnis + '&';
            data += ipron.Parameter.Ucid + '=' + ucid + '&';
            data += ipron.Parameter.MediaType + '=' + mediaType + '&';
            data += ipron.Parameter.Option + '=' + option + '&';
            data += ipron.Parameter.Timeout + '=' + timeout + '&';
            data += ipron.Parameter.AutoDelete + '=' + autoDelete + '&';
            data += ipron.Parameter.Distribute + '=' + distribute;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.CreateVirtualMedia + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.DeleteVirtualMedia = function (ucid, extension) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.Ucid + '=' + ucid;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.DeleteVirtualMedia + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.MCSConsultCall = function (thisDn, destDn, obCallingDn, connectionId, extension) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + thisDn + '&';
            data += ipron.Parameter.DestDn + '=' + destDn + '&';
            data += ipron.Parameter.ObCallingDn + '=' + obCallingDn + '&';
            data += ipron.Parameter.ConnectionId + '=' + connectionId;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.MCSConsultCall + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.MCSReconnectCall = function (thisDn, connectionId) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + thisDn + '&';
            data += ipron.Parameter.ConnectionId + '=' + connectionId;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.MCSReconnectCall + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.MCSTransferCall = function (thisDn, connectionId) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + thisDn + '&';
            data += ipron.Parameter.ConnectionId + '=' + connectionId;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.MCSTransferCall + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.MCSOnestepTransferCall = function (thisDn, destDn, obCallingDn, connectionId) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + thisDn + '&';
            data += ipron.Parameter.DestDn + '=' + destDn + '&';
            data += ipron.Parameter.ObCallingDn + '=' + obCallingDn + '&';
            data += ipron.Parameter.ConnectionId + '=' + connectionId;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.MCSOnestepTransferCall + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.MCSReroute = function (thisDn, destDn, obCallingDn, connectionId, virtualMediaId, failRouteDn, extension) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + thisDn + '&';
            data += ipron.Parameter.DestDn + '=' + destDn + '&';
            data += ipron.Parameter.ObCallingDn + '=' + obCallingDn + '&';
            data += ipron.Parameter.ConnectionId + '=' + connectionId + '&';
            data += ipron.Parameter.VirtualMediaId + '=' + virtualMediaId + '&';
            data += ipron.Parameter.Gdn + '=' + failRouteDn;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.MCSReroute + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.BSR = function (thisDn, queueDn) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + thisDn + '&';
            data += ipron.Parameter.QueueDn + '=' + queueDn;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.BSR + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.AdGetAgentSkillList = function (tenantName, destAgentId) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.DestAgentId + '=' + destAgentId;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.GetAgentSkillListEx + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.AdGetAgentQueueList = function (tenantName, destAgentId) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.DestAgentId + '=' + destAgentId;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.GetAgentQueueListEx + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.AdGetAgentList = function (tenantName, groupIdSet, queueDnSet, privateData, agentState, media_type) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.AgentState + '=' + agentState + '&';
            data += ipron.Parameter.GroupIdSet + '=' + groupIdSet + '&';
            data += ipron.Parameter.QueueDnSet + '=' + queueDnSet + '&';
            data += ipron.Parameter.MediaType + '=' + media_type + '&';
            data += ipron.Parameter.PrivateData + '=' + privateData;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.GetAgentListEx + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }

    }

    ipron.AdGetGroupList = function (tenantName, privateData) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.PrivateData + '=' + privateData;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.GetGroupListEx + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.AdGetQueueList = function (tenantName, privateData) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.PrivateData + '=' + privateData;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.GetQueueListEx + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.AgentRptSubscribe = function (tenantName, agentId, duration, subscribeType, mediaSet) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.AgentId + '=' + agentId + '&';
            data += ipron.Parameter.Duration + '=' + duration + '&';
            data += ipron.Parameter.SubscribeType + '=' + subscribeType + '&';
            data += ipron.Parameter.MediaSet + '=' + mediaSet;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.AgentRptSubscribe + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GroupRptSubscribe = function (tenantName, groupIdSet, duration, subscribeType, mediaSet) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.GroupIdSet + '=' + groupIdSet + '&';
            data += ipron.Parameter.Duration + '=' + duration + '&';
            data += ipron.Parameter.SubscribeType + '=' + subscribeType + '&';
            data += ipron.Parameter.MediaSet + '=' + mediaSet;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.GroupRptSubscribe + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.QueueRptSubscribe = function (tenantName, queueDnSet, duration, subscribeType, mediaSet) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.QueueDnSet + '=' + queueDnSet + '&';
            data += ipron.Parameter.Duration + '=' + duration + '&';
            data += ipron.Parameter.SubscribeType + '=' + subscribeType + '&';
            data += ipron.Parameter.MediaSet + '=' + mediaSet;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.QueueRptSubscribe + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.TenantRptSubscribe = function (tenantName, duration, subscribeType, mediaSet) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.Duration + '=' + duration + '&';
            data += ipron.Parameter.SubscribeType + '=' + subscribeType + '&';
            data += ipron.Parameter.MediaSet + '=' + mediaSet;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.TenantRptSubscribe + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.DNISRptSubscribe = function (dnisSet, privateData, duration, subscribeType) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.DnisSet + '=' + dnisSet + '&';
            data += ipron.Parameter.PrivateData + '=' + privateData + '&';
            data += ipron.Parameter.Duration + '=' + duration + '&';
            data += ipron.Parameter.SubscribeType + '=' + subscribeType;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.DnisRptSubscribe + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.CloseSubscribe = function (subscribeId) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.SubscribeId + '=' + subscribeId;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.CloseSubscribe + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GetAgentInfoEx = function (tenantName, destAgentId, destDn, pbxLoginDn, privateData) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.DestAgentId + '=' + destAgentId + '&';
            data += ipron.Parameter.DestDn + '=' + destDn + '&';
            data += ipron.Parameter.PbxLoginDn + '=' + pbxLoginDn + '&';
            data += ipron.Parameter.PrivateData + '=' + privateData;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.GetAgentInfoEx + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.DtmfPlay = function (thisDn, callId, duration, pauseDuration, playDigit, extension) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + thisDn + '&';
            data += ipron.Parameter.CallId + '=' + callId + '&';
            data += ipron.Parameter.Duration + '=' + duration + '&';
            data += ipron.Parameter.PauseDuration + '=' + pauseDuration + '&';
            data += ipron.Parameter.PlayDigit + '=' + playDigit;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.DtmfPlay + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.VirtualQueueRouting = function (destDn, connectionId, callId, privateData, mediaType, extension) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.DestDn + '=' + destDn + '&';
            data += ipron.Parameter.ConnectionId + '=' + connectionId + '&';
            data += ipron.Parameter.PrivateData + '=' + privateData + '&';
            data += ipron.Parameter.MediaType + '=' + mediaType;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.VirtualQueueRouting + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.SetCallback = function (tenantName, agentId, groupId, skillId, dateTime, ucid, srcMediaType, destMediaType,
    destInfo1, destInfo2, destInfo3) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.AgentId + '=' + agentId + '&';
            data += ipron.Parameter.GroupId + '=' + groupId + '&';
            data += ipron.Parameter.SkillId + '=' + skillId + '&';
            data += ipron.Parameter.DateTime + '=' + dateTime + '&';
            data += ipron.Parameter.Ucid + '=' + ucid + '&';
            data += ipron.Parameter.SrcMediaType + '=' + srcMediaType + '&';
            data += ipron.Parameter.DestMediaType + '=' + destMediaType + '&';
            data += ipron.Parameter.DestInfo1 + '=' + destInfo1 + '&';
            data += ipron.Parameter.DestInfo2 + '=' + destInfo2 + '&';
            data += ipron.Parameter.DestInfo3 + '=' + destInfo3;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.SetCallback + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.MediaDndReq = function (tenantName, agentId, mediaType, distribute) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.AgentId + '=' + agentId + '&';
            data += ipron.Parameter.MediaType + '=' + mediaType + '&';
            data += ipron.Parameter.Distribute + '=' + distribute;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.MediaDnd + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.ReservedAgentState = function (tenantName, agentId, agentState, agentStateSub, mediaSet) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.AgentId + '=' + agentId + '&';
            data += ipron.Parameter.AgentState + '=' + agentState + '&';
            data += ipron.Parameter.AgentStateSub + '=' + agentStateSub + '&';
            data += ipron.Parameter.MediaSet + '=' + mediaSet;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.ReservedAgentState + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.SendGlobalEvent = function (agentDn, ucid, extension) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.AgentDn + '=' + agentDn + '&';
            data += ipron.Parameter.Ucid + '=' + ucid;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.SendGlobalEvent + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.AgentCall = function (thisDn, destDn, obCallingDn, skillLevel, priority, relationAgentDn, relationAgentId,
    relationMethod, routeMethod, routeSkillId, routeGroupId, ucid, extension, mediaType, usePrevAgent, useDesignatedAgent,
    relationTimeout) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + thisDn + '&';
            data += ipron.Parameter.DestDn + '=' + destDn + '&';
            data += ipron.Parameter.ObCallingDn + '=' + obCallingDn + '&';
            data += ipron.Parameter.SkillLevel + '=' + skillLevel + '&';
            data += ipron.Parameter.Priority + '=' + priority + '&';
            data += ipron.Parameter.RelationAgentDn + '=' + relationAgentDn + '&';
            data += ipron.Parameter.RelationAgentId + '=' + relationAgentId + '&';
            data += ipron.Parameter.RelationMethod + '=' + relationMethod + '&';
            data += ipron.Parameter.RouteMethod + '=' + routeMethod + '&';
            data += ipron.Parameter.RouteSkillId + '=' + routeSkillId + '&';
            data += ipron.Parameter.RouteGroupId + '=' + routeGroupId + '&';
            data += ipron.Parameter.Ucid + '=' + ucid + '&';
            data += ipron.Parameter.MediaType + '=' + mediaType + '&';
            data += ipron.Parameter.UsePrevAgent + '=' + usePrevAgent + '&';
            data += ipron.Parameter.UseDesignatedAgent + '=' + useDesignatedAgent + '&';
            data += ipron.Parameter.RelationTimeout + '=' + relationTimeout;
            data = encodeURI(data);
            if (IsValidExtHdl(extension)) {
                data += '&' + ipron.Parameter.ExtensionData + '=' + encodeURIComponent(ipron.GetExtensionData(extension));
            }

            ipron.SendData(baseURL + ipron.Request.AgentCall + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GetMediaActivate = function () {
        if (ipron.IsConnected()) {
            var data = '';
            ipron.SendData(baseURL + ipron.Request.GetMediaActivate + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GetRoutePolicy = function (tenantName, destDn, destAgentId, queueDn, skillId, mediaType, privateData) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.DestDn + '=' + destDn + '&';
            data += ipron.Parameter.DestAgentId + '=' + destAgentId + '&';
            data += ipron.Parameter.QueueDn + '=' + queueDn + '&';
            data += ipron.Parameter.SkillId + '=' + skillId + '&';
            data += ipron.Parameter.MediaType + '=' + mediaType + '&';
            data += ipron.Parameter.PrivateData + '=' + privateData;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.GetRoutePolicy + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.SetMediaReadyState = function (tenantName, agentId, mediaType, mediaReady) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.AgentId + '=' + agentId + '&';
            data += ipron.Parameter.MediaType + '=' + mediaType + '&';
            data += ipron.Parameter.MediaReady + '=' + mediaReady;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.SetMediaReadyState + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GetMediaReadyState = function (tenantName, agentId, mediaType) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.AgentId + '=' + agentId + '&';
            data += ipron.Parameter.MediaType + '=' + mediaType;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.GetMediaReadyState + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GetUserCdr = function (connectionId, privateData) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ConnectionId + '=' + connectionId + '&';
            data += ipron.Parameter.PrivateData + '=' + privateData;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.GetUserCdr + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.SetUserCdr = function (connectionId, userCdr, privateData) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ConnectionId + '=' + connectionId + '&';
            data += ipron.Parameter.UserCdr + '=' + userCdr + '&';
            data += ipron.Parameter.PrivateData + '=' + privateData;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.SetUserCdr + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.SetDeviceMuteEnable = function (thisDn, connectionId, privateData, mediaType, enable) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ThisDn + '=' + thisDn + '&';
            data += ipron.Parameter.ConnectionId + '=' + connectionId + '&';
            data += ipron.Parameter.PrivateData + '=' + privateData + '&';
            data += ipron.Parameter.MediaType + '=' + mediaType + '&';
            data += ipron.Parameter.Enable + '=' + enable;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.SetDeviceMuteEnable + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.ReserveIrAttr = function (privateData, aniNumber, skillLevel, priority, usePrevAgent, useDesignatedAgent,
        relationAgentDn, relationAgentId, relationMethod, relationTimeout, routeMethod, routeSkillId, routeGroupId,
        mediaType) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.PrivateData + '=' + privateData + '&';
            data += ipron.Parameter.AniNumber + '=' + aniNumber + '&';
            data += ipron.Parameter.SkillLevel + '=' + skillLevel + '&';
            data += ipron.Parameter.Priority + '=' + priority + '&';
            data += ipron.Parameter.UsePrevAgent + '=' + usePrevAgent + '&';
            data += ipron.Parameter.UseDesignatedAgent + '=' + useDesignatedAgent + '&';
            data += ipron.Parameter.RelationAgentDn + '=' + relationAgentDn + '&';
            data += ipron.Parameter.RelationAgentId + '=' + relationAgentId + '&';
            data += ipron.Parameter.RelationMethod + '=' + relationMethod + '&';
            data += ipron.Parameter.RelationTimeout + '=' + relationTimeout + '&';
            data += ipron.Parameter.RouteMethod + '=' + routeMethod + '&';
            data += ipron.Parameter.RouteSkillId + '=' + routeSkillId + '&';
            data += ipron.Parameter.RouteGroupId + '=' + routeGroupId + '&';
            data += ipron.Parameter.MediaType + '=' + mediaType;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.ReserveIrAttr + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.FindWaitIr = function (privateData, aniNumber) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.PrivateData + '=' + privateData + '&';
            data += ipron.Parameter.AniNumber + '=' + aniNumber;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.FindWaitIr + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GetConnectionEx = function (destDn) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.DestDn + '=' + destDn;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.GetConnectionEx + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GetCallInfo = function (callId) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.CallId + '=' + callId;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.GetCallInfo + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GetUserCdrEx = function (connectionId, userCdrIndex, privateData) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ConnectionId + '=' + connectionId + '&';
            data += ipron.Parameter.UserCdrIndex + '=' + userCdrIndex + '&';
            data += ipron.Parameter.PrivateData + '=' + privateData;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.GetUserCdrEx + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.SetUserCdrEx = function (connectionId, userCdrIndex, userCdr, privateData) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.ConnectionId + '=' + connectionId + '&';
            data += ipron.Parameter.UserCdrIndex + '=' + userCdrIndex + '&';
            data += ipron.Parameter.UserCdr + '=' + userCdr + '&';
            data += ipron.Parameter.PrivateData + '=' + privateData;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.SetUserCdrEx + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.AgentAdnLogin = function (tenantName, agentDn, pbxLoginDn, agentId, agentPassword, passwdType, agentState, agentStateSub, mediaSet) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.AgentDn + '=' + agentDn + '&';
            data += ipron.Parameter.PbxLoginDn + '=' + pbxLoginDn + '&';
            data += ipron.Parameter.AgentId + '=' + agentId + '&';
            data += ipron.Parameter.AgentPassword + '=' + agentPassword + '&';
            data += ipron.Parameter.PasswdType + '=' + passwdType + '&';
            data += ipron.Parameter.AgentState + '=' + agentState + '&';
            data += ipron.Parameter.AgentStateSub + '=' + agentStateSub + '&';
            data += ipron.Parameter.MediaSet + '=' + mediaSet;
            data = encodeURI(data);
            
            ipron.SendData(baseURL + ipron.Request.AgentAdnLogin + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.SetAgentStateData = function (tenantName, agentId, agentState, agentStateSub, mediaSet, customData1, customData2, customData3) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.AgentId + '=' + agentId + '&';
            data += ipron.Parameter.AgentState + '=' + agentState + '&';
            data += ipron.Parameter.AgentStateSub + '=' + agentStateSub + '&';
            data += ipron.Parameter.MediaSet + '=' + mediaSet + '&';
            data += ipron.Parameter.CustomData1 + '=' + customData1 + '&';
            data += ipron.Parameter.CustomData2 + '=' + customData2 + '&';
            data += ipron.Parameter.CustomData3 + '=' + customData3;
            data = encodeURI(data);
            
            ipron.SendData(baseURL + ipron.Request.SetAgentStateData + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GetCategoryList = function (tenantName, privateData) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.PrivateData + '=' + privateData;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.GetCategoryList + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GetCategoryInfo = function (tenantName, privateData, categoryId) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.PrivateData + '=' + privateData + '&';
            data += ipron.Parameter.CategoryId + '=' + categoryId;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.GetCategoryInfo + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    ipron.GetAgentMasterQueueInfo = function (tenantName, destDn, destAgentId, privateData, mediaType) {
        if (ipron.IsConnected()) {
            var data = '';
            data += ipron.Parameter.TenantName + '=' + tenantName + '&';
            data += ipron.Parameter.DestDn + '=' + destDn + '&';
            data += ipron.Parameter.DestAgentId + '=' + destAgentId + '&';
            data += ipron.Parameter.PrivateData + '=' + privateData + '&';
            data += ipron.Parameter.MediaType + '=' + mediaType;
            data = encodeURI(data);

            ipron.SendData(baseURL + ipron.Request.GetAgentMasterQueueInfo + '?' + ipron.Parameter.Key + '=' + ipron.SessionKey + '&' +
            ipron.Parameter.Handle + '=' + ipron.Handle + '&' +
            data);
        }
    }

    // Common Function - SendData
    ipron.SendData = function (url, type) {
        //console.log("SendData[" + url + "]");

        if (ipron.ConnectedServerIndex == 1) {
            url = protocol + '://' + ipron.ip1 + ':' + ipron.port1 + url;
        }
        else if (ipron.ConnectedServerIndex == 2) {
            url = protocol + '://' + ipron.ip2 + ':' + ipron.port2 + url;
        }
        else {
            return;
        }

        var nTimeout = 0;
        if (type == undefined) { // Request
            type = 'POST';
            nTimeout = 3000;
        }
        else { // Heartbeat
            nTimeout = (ipron.hbPeriod * 1000) + 2000;
        }

        $.support.cors = true;
        var ajax = $.ajax({
            cache: false,
            crossDomain: true,
            url: url,
            type: type,
            dataType: 'json',
            data: '',
            timeout: nTimeout,
            success: CBAJAXSucc,
            failure: function (data) {
                //console.log("ajax failure. data[" + data + "]");
                CBAJAXErr(data);
            },
            error: function (data, temp, error) {
                //console.log(data);

                DeleteAllAjaxRequest();

                if (type == 'GET') {
                    if (data.statusText == 'abort') {
                    }
                    else {
                        ErrCnt = ErrCnt + 1;
                        if (ErrCnt >= ipron.hbErrCnt) {
                            ErrCnt = 0;
                            CBAJAXErr(data, error);
                            return;
                        }

                        if (data.statusText == 'timeout') {
                            ipron.Heartbeat();
                        }
                        else if (data.statusText == 'error') {
                            setTimeout("ipron.Heartbeat()", ipron.hbPeriod * 1000);
                        }
                    }
                }
                else if (type == 'POST') {
                    var cbResult = {};
                    cbResult.method = GetRequest(url);
                    if (cbResult.method == ipron.Request.OpenServer) {
                        CBAJAXErr(data, error);
                        return;
                    }

                    cbResult.messagetype = ipron.MsgType.AjaxResponse;
                    cbResult.result = ipron.JSONValue.False;
                    ipron.cb_res(cbResult);

                    if (data.statusText == 'abort') {
                    }
                    else {
                        if (data.statusText == 'timeout') {
                            ipron.Heartbeat();
                        }
                        else if (data.statusText == 'error') {
                            setTimeout("ipron.Heartbeat()", ipron.hbPeriod * 1000);
                        }
                    }
                }
            }
        });

        arrAjax.push(ajax);
    }

    // AJAX Success Callback Function
    CBAJAXSucc = function (data) {
        //console.log(data);
        ErrCnt = 0;

        switch (data.messagetype) {
            case ipron.MsgType.AjaxResponse:
                AjaxResponseProcess(data);
                break;
            case ipron.MsgType.ICResponse:
                ICResponseProcess(data);
                break;
            case ipron.MsgType.ICEvent:
                ICEventProcess(data);
                break;
            case ipron.MsgType.Heartbeat:
                ipron.Heartbeat();
                break;
            default:
                break;
        }
    }

    AjaxResponseProcess = function (data) {
        if (data.method == ipron.Request.OpenServer) {
            if (data.result == ipron.JSONValue.True) {

                ipron.SessionKey = data.key;
                ConnectedState = ServerConnectState.Connected;
                ipron.Handle = data.handle;

                //console.log("ipron.Handle[" + ipron.Handle + "]");

                ipron.Heartbeat();
            }
            else {
                ConnectedState = ServerConnectState.Disconnected;
            }
        }

        if (data.method == ipron.Request.CloseServer && data.result == ipron.JSONValue.True) {
            ipron.SessionKey = '';
            ConnectedState = ServerConnectState.Disconnected;
            DeleteAllAjaxRequest();
        }
        ipron.cb_res(data);
    }

    ICResponseProcess = function (data) {
        // Extension
        if (data.extensiondata != undefined) {
            data.extensionhandle = SetExtensionData(data.extensiondata);
        }
        ipron.Heartbeat();

        // Advance List
        var extHandle = data.extensionhandle;
        var adLstHandle = 0;

        if (data.method == ipron.APIMethod.GETAGENTLIST_EX_RES) {
            adLstHandle = AdLstCreateList();
            for (var i = 0; i < ipron.EXTGetRecordCount(extHandle); i++) {
                var id = ipron.EXTGetKey(extHandle, i);
                var loginId, dn, name, state, stateSub, stateKeepTime, inOut, skillLevel;

                for (var j = 0; j < ipron.EXTGetValueCountForRecord(extHandle, i); j++) {
                    switch (j) {
                        case 0: loginId = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                        case 1: dn = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                        case 2: name = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                        case 3: state = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                        case 4: stateSub = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                        case 5: stateKeepTime = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                        case 6: inOut = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                        case 7: skillLevel = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                    }
                }

                AdLstAddRow(adLstHandle, id, dn, loginId, name, state, stateSub, stateKeepTime, inOut, skillLevel, "", "");
            }
            data.advanceListHandle = adLstHandle;
        }
        else if (data.method == ipron.APIMethod.GETGROUPLIST_EX_RES) {
            adLstHandle = AdLstCreateList();
            for (var i = 0; i < ipron.EXTGetRecordCount(extHandle); i++) {
                var id = ipron.EXTGetKey(extHandle, i);
                var name;

                for (var j = 0; j < ipron.EXTGetValueCountForRecord(extHandle, i); j++) {
                    switch (j) {
                        case 0: name = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                    }
                }

                AdLstAddRow(adLstHandle, id, "", "", name, "", "", "", "", "", "", "");
            }
            data.advanceListHandle = adLstHandle;
        }
        else if (data.method == ipron.APIMethod.GETQUEUELIST_EX_RES) {
            adLstHandle = AdLstCreateList();
            for (var i = 0; i < ipron.EXTGetRecordCount(extHandle); i++) {
                var id = ipron.EXTGetKey(extHandle, i);
                var dn, name;

                for (var j = 0; j < ipron.EXTGetValueCountForRecord(extHandle, i); j++) {
                    switch (j) {
                        case 0: dn = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                        case 1: name = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                    }
                }

                AdLstAddRow(adLstHandle, id, dn, "", name, "", "", "", "", "", "", "");
            }
            data.advanceListHandle = adLstHandle;
        }
        else if (data.method == ipron.APIMethod.GETAGENT_SKILLLIST_EX_RES) {
            adLstHandle = AdLstCreateList();
            for (var i = 0; i < ipron.EXTGetRecordCount(extHandle); i++) {
                var id = ipron.EXTGetKey(extHandle, i);
                var name, skillEnable;

                for (var j = 0; j < ipron.EXTGetValueCountForRecord(extHandle, i); j++) {
                    switch (j) {
                        case 0: name = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                        case 1: skillEnable = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                    }
                }

                AdLstAddRow(adLstHandle, id, "", "", name, "", "", "", "", "", "", skillEnable);
            }
            data.advanceListHandle = adLstHandle;
        }
        else if (data.method == ipron.APIMethod.GETAGENT_QUEUELIST_EX_RES) {
            adLstHandle = AdLstCreateList();
            for (var i = 0; i < ipron.EXTGetRecordCount(extHandle); i++) {
                var id = ipron.EXTGetKey(extHandle, i);
                var name, dn, skillId;

                for (var j = 0; j < ipron.EXTGetValueCountForRecord(extHandle, i); j++) {
                    switch (j) {
                        case 0: name = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                        case 1: dn = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                        case 2: skillId = ipron.EXTGetValueForRecord(extHandle, i, j); break;
                    }
                }

                AdLstAddRow(adLstHandle, id, dn, "", name, "", "", "", "", "", skillId, "");
            }
            data.advanceListHandle = adLstHandle;
        }

        ipron.cb_res(data);
    }

    ICEventProcess = function (data) {
        if (data.method == ipron.APIEvent.ACTIVE_TIMEOUT) {
            ConnectedState = ServerConnectState.Disconnected;
        }
        else {
            // Extension
            if (data.extensiondata != undefined) {
                data.extensionhandle = SetExtensionData(data.extensiondata);
            }
            ipron.Heartbeat();
        }
        ipron.cb_evt(data);
    }

    // AJAX Error Callback Function
    CBAJAXErr = function (data, error) {
        DeleteAllAjaxRequest();

        if (error != "abort") {
            if (ipron.ConnectedServerIndex == 1)
                ipron.ConnectedServerIndex = 2;
            else
                ipron.ConnectedServerIndex = 1;

            if (ConnectedState == ServerConnectState.Connected) {
                ConnectedState = ServerConnectState.Disconnected;
                data.method = ipron.WebEvent.ERR_DISCONNECT;
                ipron.cb_evt(data);
            }
            else if (ConnectedState == ServerConnectState.Trying_1st) {
                ConnectedState = ServerConnectState.Trying_2nd;
                ipron.OpenServer(ipron.app_name, ipron.cb_evt, ipron.cb_res);
            }
            else if (ConnectedState == ServerConnectState.Trying_2nd) {
                ConnectedState = ServerConnectState.Disconnected;
                data.method = ipron.WebEvent.ERR_OPENSERVER;
                ipron.cb_evt(data);
            }
        }
    }

    // Delete All Ajax Request
    DeleteAllAjaxRequest = function () {
        for (var i = 0; i < arrAjax.length; i++) {
            arrAjax[i].abort();
        }
        arrAjax.length = 0;
    }

    // Check Connect State
    ipron.IsConnected = function () {
		if (ConnectedState == ServerConnectState.Connected) {
            return true;
        }
        else {
            return false;
        }
    }

    // --- Extension Function ---
    var arrExt = {};
    var extensionIndex = 0;
    function SetExtensionData(data) {
        var handle = ipron.EXTCreateExtension();
        arrExt[handle] = data;
        return handle;
    }
    function IsValidExtHdl(handle) {
        if (handle > 0 && handle < 101)
            return true;
        else
            return false;
    }
    ipron.EXTCreateExtension = function () {
        extensionIndex++;
        if (extensionIndex > 100) {
            extensionIndex = 1;
        }
        arrExt[extensionIndex] = {};
        return extensionIndex;
    }
    ipron.EXTDeleteExtension = function (handle) {
        arrExt[handle] = {};
    }
    ipron.GetExtensionData = function (handle) {
        return JSON.stringify(arrExt[handle]);
    }
    ipron.EXTAddRecord = function (handle, key, value) {
        var extension = arrExt[handle];
        if (extension == undefined) {
            extension = {};
        }
        if (extension["" + key] == undefined) {
            extension["" + key] = value;
        }
        else {
            if (isArray(extension["" + key])) {
                extension["" + key].push(value);
            }
            else {
                var arr = new Array();
                arr.push(extension["" + key]);
                arr.push(value);

                extension["" + key] = arr;
            }
        }
        arrExt[handle] = extension;
        //console.log(extension);
    }
    ipron.EXTDeleteRecord = function (handle, key) {
        var extension = arrExt[handle];
        if (extension["" + key] == undefined) {
        }
        else {
            delete extension["" + key];
        }
        arrExt[handle] = extension;
        //console.log(extension);
    }
    ipron.EXTDeleteValue = function (handle, key, value) {
        var extension = arrExt[handle];
        if (Array.isArray(extension["" + key])) {
            extension["" + key] = extension["" + key].filter(function (x) { return x != value; });
            if (extension["" + key].length == 0) {
                delete extension["" + key];
            }
        }
        else {
            delete extension["" + key];
        }
        arrExt[handle] = extension;
        //console.log(extension);
    }
    ipron.EXTGetRecordCount = function (handle) {
        if (handle == undefined || handle == 0)
            return 0;
        var extension = arrExt[handle];

        if (Object.keys) {
            return Object.keys(extension).length;
        }
        else {
            var cnt = 0;
            for (var i in extension) {
                cnt++;
            }
            return cnt;
        }
    }
    ipron.EXTGetValueCountForRecord = function (handle, record) {
        return ipron.EXTGetValueCountForKey(handle, ipron.EXTGetKey(handle, record));
    }
    ipron.EXTGetValueCountForKey = function (handle, key) {
        var extension = arrExt[handle];
        if (isArray(extension["" + key])) {
            return extension["" + key].length;
        }
        else {
            if (extension["" + key] == undefined) {
                return 0;
            }
            else {
                return 1;
            }
        }
    }
    ipron.EXTGetKey = function (handle, record) {
        var extension = arrExt[handle];

        if (Object.keys) {
            return Object.keys(extension)[record];
        }
        else {
            var cnt = 0;
            for (var i in extension) {
                if (cnt == record) {
                    return i;
                }
                cnt++;
            }
            return cnt;
        }


        return Object.keys(extension)[record];
    }
    ipron.EXTGetValueForRecord = function (handle, record, field) {
        return ipron.EXTGetValueForKey(handle, ipron.EXTGetKey(handle, record), field);
    }
    ipron.EXTGetValueForKey = function (handle, key, field) {
        var extension = arrExt[handle];
        if (isArray(extension["" + key])) {
            return extension["" + key][field];
        }
        else {
            if (field == 0) {
                return extension["" + key];
            }
            else {
                return undefined;
            }
        }
    }

    // Advance List
    //var listOptionCnt = 11;
    var arrAdList = {};
    var adListIndex = 0; // 1 ~ 512
    function AdLstCreateList() {
        adListIndex++;
        if (adListIndex > 512) {
            adListIndex = 1;
        }
        arrAdList[adListIndex] = {};
        return adListIndex;
    }
    function AdLstAddRow(handle, id, dn, loginId, name, state, stateSub, stateKeepTime, inOut, skillLevel, skillId, skillEnable) {
        var adList = arrAdList[handle];
        if (adList == undefined) {
            adList = {};
        }

        var rowArr = new Array(id, dn, loginId, name, state, stateSub, stateKeepTime, inOut, skillLevel, skillId, skillEnable);

        var cnt = AdLstGetCount(handle);
        if (cnt != undefined) {
            adList[cnt] = rowArr;
        }
    }
    function AdLstAddRowArray(handle, arr) {
        var adList = arrAdList[handle];
        if (adList == undefined) {
            adList = {};
        }

        var cnt = AdLstGetCount(handle);
        if (cnt != undefined) {
            adList[cnt] = arr;
        }
    }
    function AdLstGetRow(handle, row) {
        var adList = arrAdList[handle];
        return adList[row];
    }
    function AdLstGetCount(handle) {
        if (handle == undefined || handle == 0)
            return;

        var rowArr = arrAdList[handle];
        if (Object.keys) {
            return Object.keys(rowArr).length;
        }
        else {
            var cnt = 0;
            for (var i in rowArr) {
                cnt++;
            }
            return cnt;
        }
    }
    ipron.GetListItem = function (listId, listIndex, listOption) {
        var adList = arrAdList[listId];
        var rowArr = adList[listIndex];
        return rowArr[listOption];
    }
    ipron.GetListItemFilter = function (listId, listOption, listFilter) {
        if (!((typeof listFilter == "string") && (listFilter.length > 0))) {
            return;
        }

        var filterHandle = 0;
        var filterLen = listFilter.length;
        var firstString = listFilter[0];
        var lastString = listFilter[filterLen - 1];
        var existData = false;

        if (firstString == "%" && lastString != "%") {
            var filterStr = listFilter.substring(1, filterLen);
            for (var i = 0; i < AdLstGetCount(listId); i++) {
                var listItem = ipron.GetListItem(listId, i, listOption);
                if (listItem.lastIndexOf(filterStr) >= 0) {
                    if (listItem.lastIndexOf(filterStr) + filterStr.length == listItem.length) {
                        if (existData == false) {
                            filterHandle = AdLstCreateList();
                            existData = true;
                        }
                        var rowArr = AdLstGetRow(listId, i);
                        AdLstAddRowArray(filterHandle, rowArr);
                    }
                }
            }
        }
        else if (firstString != "%" && lastString == "%") {
            var filterStr = listFilter.substring(0, filterLen - 1);
            for (var i = 0; i < AdLstGetCount(listId); i++) {
                var listItem = ipron.GetListItem(listId, i, listOption);
                if (listItem.indexOf(filterStr) == 0) {
                    if (existData == false) {
                        filterHandle = AdLstCreateList();
                        existData = true;
                    }
                    var rowArr = AdLstGetRow(listId, i);
                    AdLstAddRowArray(filterHandle, rowArr);
                }
            }
        }
        else if (firstString == "%" && lastString == "%") {
            var filterStr = listFilter.substring(1, filterLen - 1);
            for (var i = 0; i < AdLstGetCount(listId); i++) {
                var listItem = ipron.GetListItem(listId, i, listOption);
                if (listItem.indexOf(filterStr) != -1) {
                    if (existData == false) {
                        filterHandle = AdLstCreateList();
                        existData = true;
                    }
                    var rowArr = AdLstGetRow(listId, i);
                    AdLstAddRowArray(filterHandle, rowArr);
                }
            }
        }
        else if (firstString != "%" && lastString != "%") {
            var filterStr = listFilter;
            for (var i = 0; i < AdLstGetCount(listId); i++) {
                var listItem = ipron.GetListItem(listId, i, listOption);
                if (listItem == filterStr) {
                    if (existData == false) {
                        filterHandle = AdLstCreateList();
                        existData = true;
                    }
                    var rowArr = AdLstGetRow(listId, i);
                    AdLstAddRowArray(filterHandle, rowArr);
                }
            }
        }

        return filterHandle;
    }
    ipron.GetListItemCnt = function (listId) {
        return AdLstGetCount(listId);
    }

    function isArray(value) {
        return Object.prototype.toString.call(value) === "[object Array]";
    }

    function GetRequest(url) {
        var nStart = url.indexOf('/ic/');
        var nLast = url.indexOf('?');
        return url.substring(nStart + 4, nLast);
    }
})((this.ipron = {}), this);