/**
 * keyCode 到 key的查找表, 根据KeyboardEvent.keyCode得到键名。
 * 键名不是完全同chrome的KeyboardEvent.key,为了查看便于阅读,有些有变化。仅适用于本项目noVnc自定义键
 * 
 * author: h14520
 * 2017.10.23 首次创建。易用性需求, 需要noVnc控制台提供发送自定义键功能
 * 
 * 使用方法：
 * 1.调用，keynames.fromKeycode(keycode) 传入一个keycode，可以返回对应的键名称. 
 *  
 * 参考：
 * http://www.cnblogs.com/cxxjohnson/p/5156320.html
 * 
 * 依赖：
 * 无
 */
var keynames = (function(){
    "use strict";
    var keynameMap = {
    	//控制键键码值(keyCode)
    	"1":'MouseLeftBtn',
    	"2":'MouseRightBtn',
    	"3":'Cancel',
    	"4":'MouseMidBtn',
    	"8":'Backspace',
    	"9":'Tab',
    	"12":'Clear', //---
    	"13":'Enter',
    	"16":'Shift',
    	"17":'Ctrl',
    	"18":'Alt',
    	"19":'Pause', //---
    	"20":'CapsLock',
    	"27":'Esc', //Escape
    	"32":'Space',
    	"33":'PageUp',
    	"34":'PageDown',
    	"35":'End',
    	"36":'Home',
    	"37":'LeftArrow',
    	"38":'UpArrow',
    	"39":'RightArrow',
    	"40":'DownArrow', 
    	"41":'Select', // ---
    	"42":'Print', // --- PrintScreen
    	"43":'Execute', // ---
    	"44":'Snapshot', //---
    	"45":'Insert',
    	"46":'Delete',
    	"47":'Help', // ---
    	
    	//字母和数字键的键码值(keyCode)
    	"48":'0',
    	"49":'1',
    	"50":'2',
    	"51":'3',
    	"52":'4',
    	"53":'5',
    	"54":'6',
    	"55":'7',
    	"56":'8',
    	"57":'9',
    	
    	"59":';', // ; firefox
    	"61":'=', // =+ firefox
    	
    	"65":'a',
    	"66":'b',
    	"67":'c',
    	"68":'d',
    	"69":'e',
    	"70":'f',
    	"71":'g',
    	"72":'h',
    	"73":'i',
    	"74":'j',
    	"75":'k',
    	"76":'l',
    	"77":'m',
    	"78":'n',
    	"79":'o',
    	"80":'p',
    	"81":'q',
    	"82":'r',
    	"83":'s',
    	"84":'t',
    	"85":'u',
    	"86":'v',
    	"87":'w',
    	"88":'x',
    	"89":'y',
    	"90":'z',
    	
    	"91":'Meta',//Windows键, firefox显示为OS, chrome显示为Meta
    	"93":'ContextMenu',//上下文菜单
    	"95":'Sleep', // 多媒体键，系统休眠
    	//数字键盘上的键的键码值(keyCode)
    	"96":'Num0',//
    	"97":'Num1',
    	"98":'Num2',
    	"99":'Num3',
    	"100":'Num4',
    	"101":'Num5',
    	"102":'Num6',
    	"103":'Num7',
    	"104":'Num8',
    	"105":'Num9',
    	"106":'Num*',
    	"107":'Num+',
    	"108":'NumEnter',
    	"109":'Num-',
    	"110":'Num.',
    	"111":'Num/',//
    	"112":'F1', //
    	"113":'F2',
    	"114":'F3',
    	"115":'F4',
    	"116":'F5',
    	"117":'F6',
    	"118":'F7',
    	"119":'F8',
    	"120":'F9',
    	"121":'F10',
    	"122":'F11',
    	"123":'F12', 
    	// F13~F24是扩展键，键盘上没有
    	"124":'F13',
    	"125":'F14',
    	"126":'F15',
    	"127":'F16',
    	"128":'F17',
    	"129":'F18',
    	"130":'F19',
    	"131":'F20',
    	"132":'F21',
    	"133":'F22',
    	"134":'F23',
    	"135":'F24',
    	
    	// 控制键
    	"144":'NumLock', //
    	"145":'ScrollLock',//
    	
    	"173":'-', //firefox -_
    	
    	"186":';', //;:
    	"187":'=', //=+
    	"188":',', //,<
    	"189":'-', //-_
    	"190":'.', //.>
    	"191":'/', // /?
    	"192":'`', // `~
    	"219":'[', //[{
    	"220":'\\', // \|
    	"221":']', //]}
    	"222":"'", // '"
    	
    	// 多媒体键,因为firefox和chrome关于Fn键的定义值非常不一致
    	// 均不支持Fn + Key
    };

    function fromKeyCode(keyCode) { return keynameMap[keyCode]?keynameMap[keyCode]:""; }
    return {
    	fromKeyCode : fromKeyCode
    };
})();
