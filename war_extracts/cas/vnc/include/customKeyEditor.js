/**
 * 自定义键编辑器
 * author: h14520
 * 2017.9.14 首次创建。易用性需求, 需要noVnc控制台提供发送自定义键功能
 * 
 * 使用方法：
 * 1.调用，recordKeydown(event) 传入一个KeyBoardEvent，可以记录按下的键. 
 * 当为组合键时, 允许先按一个控制键，再按第二个键。
 * 2.当释放键时，调用recordKeyup();
 * 3.用户按下的键，最后可以通过keySyms属性得到，按下键的keySyms, 可以发送给noVnc
 * 4.reset()可以重置按下的键。
 * 
 * 
 * 依赖：
 * keysym.js
 * keyboard.js
 * keysymdef.js
 * keynames.js
 * 
 * 修改记录:
 * 2017.10.23 h14520 KeyboardEvent.key属性在chrome 41以及以下版本，不存在。为了兼容更低版本浏览器，不能依赖该属性，改为使用keyCode.
 */

// add by h14520 2017.9.11 记录下来的自定义按键 -这是一个class
function CustomKeyEditor() {
        this.lastKey = null; // 记录上次在自定义按键文本框里按下的单个键 - modify by h14520 2017.10.23 为了兼容更低版本浏览器，现在存放的是上个键的keyCode
        this.lastModifiers = 0; // 记录上次按下的键的控制键ctrl alt shift meta 1 1 1 1分别按位来 8表示ctrl, 4表示alt, 2表示shift, 1表示meta
        this.keyCodes = [];  // keycode RFG扩展协议支持，但是本版本中不使用
        this.keySyms = [];   // keysym 用于发送给终端RFB
        this.keyText = "";   // 自定义键对应的文本
        
        //函数声明
        this.reset = reset;
        this.resetLastKey = resetLastKey;
        
        this.getKeyModifiers = getKeyModifiers;
        this.isModifierKey = isModifierKey;
        this.hasCtrl = hasCtrl;
        this.hasAlt = hasAlt;
        this.hasShift = hasShift;
        this.hasMeta = hasMeta;
        this.getModifiersText = getModifiersText;
        this.getModifiersKeyCodes = getModifiersKeyCodes;
        this.getModifiersKeySyms = getModifiersKeySyms;
        
        this.getKeyCodes = getKeyCodes;
        this.getKeySyms = getKeySyms;
        this.getKeyText = getKeyText;
        
        this.recordKeydown = recordKeydown;
        this.recordKeyup = recordKeyup;
        
        // 重置
        function reset() {
        	this.lastKey = null;
        	this.lastModifiers = 0;
        	this.keyCodes = [];
        	this.keySyms = [];
        	this.keyText = "";
        }

        // 重置lastKey
        function resetLastKey() {
        	this.lastKey = null;
        }
        
     // 计算key的modifiers的flag, 结果为二级制位的标记
        // 记录上次按下的键的控制键ctrl alt shift meta 1 1 1 1分别按位来 8表示ctrl, 4表示alt, 2表示shift, 1表示meta
        // 例如按下了ctrl + alt ， 则二进制为 1100，返回8+4=12
        function getKeyModifiers(e) {
            if (e) {
                return (e.ctrlKey ? 8 : 0) + (e.altKey ? 4 : 0) + (e.shiftKey ? 2 : 0)
                        + (  (e.metaKey || e.keyCode==91) ? 1 : 0); //firefox下当按下Windows键时,认为是OsKey, e.metaKey=false,但可以识别出keyCode=91
            }
            return 0;
        }
        
        // 判断一个键是否是纯粹的modifier键（组合功能键，ctrl, alt, shift, meta）
        function isModifierKey(e) {
        	// add by h14520 2017.10.23 KeyboardEvent.key可能没有，兼容更低版本浏览器。当没有key属性时，采用e.ctrlKey或e.keyCode属性。
            if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) {
            	return true;
            }
        	
        	var key = e.key;
            if (key=="Control" || key=="Alt" || key=="Shift" || key=="Meta") {
                return true;
            }
                        
            // add by h14520 2017.10.23 兼容更低版本浏览器。
//          ctrl 17
//          alt 18
//          shift 16
//          meta 91
            var keyCode = e.keyCode;
            if (keyCode==17 || keyCode==18 || keyCode==16 || keyCode==91) {
            	return true;
            }
            
            return false;
        }
        
        function hasCtrl(modifiers) {
            return (modifiers & 8)>0;
        }
        
        function hasAlt(modifiers) {
            return (modifiers & 4)>0;
        }
        
        function hasShift(modifiers) {
            return (modifiers & 2)>0;
        }
        
        function hasMeta(modifiers) {
            return (modifiers & 1)>0;
        }
        
        function getModifiersText(modifiers) {
            var str = "";
            if ( hasCtrl(modifiers) ) {
                str = str + (str.length>0?"+":"") + "Ctrl";
            }
            
            if ( hasAlt(modifiers) ) {
                str = str + (str.length>0?"+":"") +"Alt";
            }
            
            if ( hasShift(modifiers) ) {
                str = str + (str.length>0?"+":"") + "Shift";
            }
            
            if ( hasMeta(modifiers) ) {
                str = str + (str.length>0?"+":"") + "Meta";
            }
            return str;
        }
        
        function getModifiersKeyCodes(modifiers) {
            var keycodes = [];
            
            // ctrl
            if ( hasCtrl(modifiers) ) {
                keycodes.push(17);
            }
            
            // alt
            if ( hasAlt(modifiers) ) {
                keycodes.push(18);
            }
            
            // shift
            if ( hasShift(modifiers) ) {
                keycodes.push(16);
            }
            
            // meta
            if ( hasMeta(modifiers) ) {
                keycodes.push(91);
            }
            return keycodes;
        }
        
        function getModifiersKeySyms(modifiers) {
            var keysyms = [];
            
            // ctrl
            if ( hasCtrl(modifiers) ) {
                keysyms.push(XK_Control_L);
            }
            
            // alt
            if ( hasAlt(modifiers) ) {
                keysyms.push(XK_Alt_L);
            }
            
            // shift
            if ( hasShift(modifiers) ) {
                keysyms.push(XK_Shift_L);
            }
            
            // meta
            if ( hasMeta(modifiers) ) {
                keysyms.push(XK_Meta_L);
            }
            return keysyms;
        }
                        
        // 获取输入件的keyCodes, 返回一个数组， 如果是组合键，返回值有多个元素
        function getKeyCodes(modifiers, e) {
            var keycodes = getModifiersKeyCodes(modifiers);
            if (e && e.keyCode) {
                   keycodes.push(e.keyCode);
            }
            return keycodes;
        }
        
        // 获取输入案件的keySyms, 返回一个数组， 如果是组合键，返回值有多个元素
        function getKeySyms(modifiers, e) {
            // 组合功能键的keysyms
            var keysyms = getModifiersKeySyms(modifiers);
            
            if (!e) {
                return keysyms;
            }
            
            // 按下的键，如果是组合键，则为最后一个键.
            // 例如按下 a，返回a
            // 例如按下 ctrl + a，返回a
            // 例如按下 ctrl，返回ctrl
            var keysym;
            
            // 一些键使用kbdUtil无法正确映射,需要特殊处理
            switch (e.keyCode) {
            case 61: //  61   =+  //firefox
            	//chrome上是187，可以正确映射
            	keysym = XK_equal; //XK_plus;  modify by h14520 2017.10.23
            	break;
            case 173: //  173  -_ //firefox  
            	//chrome上是189，可以正确映射
            	keysym = XK_minus;
            	break;
            case 186: // ;  186  Semicolon; //chrome
            case 59:  // ;  59  //firefox
                keysym = XK_semicolon;
                break;
            case 191: // /  191  Slash
                keysym = XK_slash;
                break;    
            case 192: // `  192  Backquote
                keysym = XK_grave;
                break;
            case 219: // [  219  BracketLeft
                keysym = XK_bracketleft;
                break;
            case 220: // \  220  Backslash
                keysym = XK_backslash;
                break;    
            case 221: // [  221  BracketRight
                keysym = XK_bracketright;
                break;
            case 222: // '  222  Quote
                keysym = XK_apostrophe;
                break;    
            default:
                var keysymObj = kbdUtil.getKeysym(e);
                if (keysymObj) {
                    keysym = keysymObj.keysym;

                    // 对字母键特殊处理，按下a键时，得到的keyCode始终是小写字母的keyCode, 其实我们一般想发送小写的a. (keynames里面也显示为小写字母)
                    // 如果一旦得到大写字母keysym, 需要将keySym变为其对应小写字母的keySym。
                    if (keysym>=XK_A && keysym<=XK_Z ){
                    	keysym = keysym + 32;
                    }
                    
                    // 如果前导键为shift，则需要将字母变为大写，因为rfb发送shift+a,并不会生成A,只有发送A的keysym才能生成A
                    if (hasShift(modifiers) && keysym>=XK_a && keysym<=XK_z ){
                    	keysym = keysym - 32;
                    }
                }
            }
            
            if (keysym) {
                keysyms.push(keysym);
            }
            
            return keysyms;
        }

        // 按键对应的文本
        function getKeyText(modifiers,e) {
            var str = getModifiersText(modifiers);
            if ( !e || isModifierKey(e) ) {
                return str;   
            }
            
//            var strKey = e.key; //键对应的文本(键名)
//            // 低版本浏览器没有e.key属性，采用其他方法。
//            if ( (e.key==undefined) && (e.keyCode != undefined) ) {
//            	strKey = keynames.fromKeyCode(e.keyCode);
//            }
            var strKey = keynames.fromKeyCode(e.keyCode);
            
            str = str + (str.length>0?"+":"") + strKey;
            return str;
        }
        
        // 传入一个KeyBoardEvent，可以记录按下的键. 
        // 当为组合键时, 允许先按一个控制键，再按第二个键。
        function recordKeydown(event) {
            var e = event; //事件
            // 有时候key只在e.originalEvent中才有
            if (!event.key) {
                e = event.originalEvent;
            }
            if (!e) {
                return;
            }
            
            // 抑制重复键的处理 
            // 不用e.repeat， 必须重复三次以上按同一个键，才会e.repeat = true
            var modifiers = getKeyModifiers(e);
            
            // modify by h14520 2017.10.23 为了兼容更低版本浏览器，没有key属性采用keyCode属性  {{
//            if ( this.lastKey == e.key) {
//                return;
//            } else {
//            	this.lastKey = e.key;
//            }
            if ( this.lastKey == e.keyCode) {
                return;
            } else {
            	this.lastKey = e.keyCode;
            }
            // }} end modify by h14520 2017.10.23 
            
            // 如果这次按下了组合键，记录下组合键，否则保留之前的组合键
            if ( modifiers != 0 ){
                this.lastModifiers = modifiers;
            }
            
            if ( isModifierKey(e) ) {
                e = undefined;
            }
            // 将按下的键，显示在输入框中
            this.keyText = getKeyText(this.lastModifiers, e);

            // 将输入的自定义按键保存起来 - 到jsp页面当前内存中
            
            // 参考资料：
            // https://www.ibm.com/developerworks/cn/web/wa-support-multiple-keyboard-layouts-in-web-based-vnc-apps-trs/index.html
            // http://novnc.com/info.html
            // Vnc协议客户端传入的键盘事件是keysym码, 扩展协议支持传入keycode，但本代码中还没有支持。
            // 例如ctrl键的keysym码是XK_Control_L = 0xffe3,   (keysym码表见keysym.js)
            //
            // 记录按下的键的keysym，便于传入RFB. 
            // 备注：得到的keysym是控制键左右不分的，例如不论按下左右ctrl都得到左边的XK_Control_L
            this.keyCodes = getKeyCodes(this.lastModifiers, e);
            this.keySyms = getKeySyms(this.lastModifiers, e);
        }
        
        // 键盘抬起时，重置上个按下的键
        function recordKeyup() {
            this.resetLastKey();
        }
}; 
    