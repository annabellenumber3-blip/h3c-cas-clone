angular.module('app.permissionservices',['ngResource','ui.bootstrap','ui.router','pascalprecht.translate','app.services'])
.factory('PermissionService', function($rootScope){
    return {
      setPermissions: function(permissions) {
    	$rootScope.permissions = permissions;
        $rootScope.$broadcast('permissionsChanged');
      },
      hasPermission: function (permission) {
        permission = permission.trim();
        var realPer = constant[permission];
        if (realPer) {
        	return $rootScope.permissions.contains(realPer);
        } else {
        	return false;
        }
      },
      parseExpression: function (value) {
  		var expres = [];
  	    var intCnt = 0,intGrace = 0;
  	    var strToken='',chrChar;
  	    while (intCnt < value.length) {
  	    	  chrChar = value.substr(intCnt, 1);
  	    	  switch (chrChar) {
  	    	  case '(':
  			      strToken='';
  	    		  intGrace++;
  	    		  expres.push(chrChar);
  	    		  intCnt++;
  	    		  break;
  	    	  case ')':
  	    		  intGrace--;
  	    		  if (strToken.length > 0) {
  	    			  expres.push(strToken);
  					  strToken='';
  	    		  }
  	    		  expres.push(chrChar);
  	    		  intCnt++;
  	    		  break;
  	    	  case '&':
  	    		  chrNext = value.substr(intCnt + 1, 1);
  	    		  if (chrNext != '&') {
  	    			  throw "Wrong Expression!";
  	    		  } else {
  	    			  if (strToken.length > 0) {
  	    				  expres.push(strToken);
  						  strToken='';
  	    			  }
  	    			  expres.push('&&');
  	    		  }
  	    		  intCnt += 2;
  	    		  break;
  	    	  case '|':
  	    		  chrNext = value.substr(intCnt + 1, 1);
  	    		  if (chrNext != '|') {
  	    			  throw "Wrong Expression!";
  	    		  } else {
  	    			  if (strToken.length > 0) {
  	    				  expres.push(strToken);
  						  strToken='';
  	    			  }
  	    			  expres.push('||');
  	    		  }
  	    		  intCnt += 2;
  	    		  break;
  			  case ' ':
  	    		  intCnt++;
  	    		  break;
  	    	  default:
  	    		  strToken += chrChar;
  				  intCnt++;
  				  if (intCnt == value.length)
  				  {
  					  expres.push(strToken);
  				  }
  	    	      break;
  	    	}
  	      }
  	      return expres;
       }
   };
});