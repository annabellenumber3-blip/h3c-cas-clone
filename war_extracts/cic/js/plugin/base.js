var baseHref = "";
var childwindow = window;
var i =0;
while(childwindow.parent){
	var iframe = childwindow.parent.document.getElementById("pluginIframe");
	if(iframe){
		baseHref = iframe.getAttribute("value");
		break;
	}
	childwindow = childwindow.parent;
	i++;
	if(i>9){
		break;
	}
}
var base = document.createElement('base');
base.setAttribute("href",baseHref);
var head = document.head;
var nodes = head.childNodes;
var first = nodes[0];
head.insertBefore(base,first);
