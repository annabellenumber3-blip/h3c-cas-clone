/**
* @ngdoc overview
* @name ui.bootstrap.carousel
*
* @description
* AngularJS version of an image carousel.
*
*/
angular.module('ui.bootstrap.carouselform', ['ui.bootstrap.transition'])
.controller('CarouselFormController', ['$scope', '$timeout', '$transition', function ($scope, $timeout, $transition) {
  var self = this,
    slides = self.slides = $scope.slides = [],
    currentIndex = -1;
  $scope.currentSlide=self.currentSlide = null;
  $scope.liwidth={"margin-left":"10px", width:'20%'};
  var destroyed = false;
  /* direction: "prev" or "next" */
  self.select = $scope.select = function(nextSlide, direction) {
    var nextIndex = slides.indexOf(nextSlide);
    //Decide direction if it's not given
    if (direction === undefined) {
      direction = nextIndex > currentIndex ? 'next' : 'prev';
    }
    if (direction == "prev" && $("#prevbutton").css("display") == "none") {
    	return;
    }
    if (nextSlide && nextSlide !== self.currentSlide) {
	  if (angular.isObject($scope.$parent.preCallBack) && direction == 'prev') {
		   for (var key in $scope.$parent.preCallBack) {
			   if (key == nextIndex) {
				   var cbr = $scope.$parent.preCallBack[key]();
				   if (cbr == false) {
					   return;
				   }
			   }
		   }
//			$scope.$parent.nextCallBack.apply();
	   }
	  
	  
	//-----------------------------给按钮栏增加插件 end----------------------------
	  if (angular.isObject($scope.$parent.nextCallBack) && direction == 'next') {
		   var  flag = true;
		   for (var key in $scope.$parent.nextCallBack) {
			   if (key == nextIndex) {
				   flag = false;
				   var cbr = $scope.$parent.nextCallBack[key]();
				   if (angular.isObject(cbr) && angular.isFunction(cbr.then)) { //promise 对象
					   cbr.then(function(result){
						   if (result.success == true) {
							   startGoNext();
				   }
					   })
				   } else if (cbr !== false){
					   startGoNext();
			   }
		   }
		   }  
		   if (flag == true) {
			   startGoNext();
	   }
      } else {
		  startGoNext();
      }
    }
    //-----------------------------给按钮栏增加插件 start----------------------------
    if (angular.isObject($scope.$parent.addPlug)) {
        var plug;
        if ($scope.$parent.formPluginId) {
            plug = $('#'+$scope.$parent.formPluginId).find('#footerPlugin');
        } else {
            plug = $('#footerPlugin');
        }

        for (var key in $scope.$parent.addPlug) {
            if (key == nextIndex) {
                var plugEle = $scope.$parent.addPlug[key]();
                var children = plug.children();
                if (children.length == 0) {
                   plug.append(plugEle); 
                }
            } else {
                plug.empty();
            }
        }
    }
    function startGoNext() {
    	 if ($scope.$currentTransition) {
    	        $scope.$currentTransition.cancel();
    	        //Timeout so ng-class in template has time to fix classes for finished slide
    	        $timeout(goNext);
    	 } else {
    	        goNext();
    	 }
    }
    function goNext() {
      // Scope has been destroyed, stop here.
      if (destroyed) { return; }
      //If we have a slide to transition from and we have a transition type and we're allowed, go
      if (self.currentSlide && angular.isString(direction) && !$scope.noTransition && nextSlide.$element) {
        //We shouldn't do class manip in here, but it's the same weird thing bootstrap does. need to fix sometime
    	  nextSlide.$element.parent().css("overflow","hidden");
        nextSlide.$element.addClass(direction);
        var reflow = nextSlide.$element[0].offsetWidth; //force reflow

        //Set all other slides to stop doing their stuff for the new transition
        angular.forEach(slides, function(slide) {
          angular.extend(slide, {direction: '', entering: false, leaving: false, active: false});
        });
        angular.extend(nextSlide, {direction: direction, active: true, entering: true});
        angular.extend(self.currentSlide||{}, {direction: direction, leaving: true});

        $scope.$currentTransition = $transition(nextSlide.$element, {});
        //We have to create new pointers inside a closure since next & current will change
        (function(next,current) {
          $scope.$currentTransition.then(
            function(){ transitionDone(next, current); },
            function(){ transitionDone(next, current); }
          );
        }(nextSlide, self.currentSlide));
      } else {
        transitionDone(nextSlide, self.currentSlide);
      }
      self.currentSlide = nextSlide;
      currentIndex = nextIndex;
    }
    function transitionDone(next, current) {
      angular.extend(next, {direction: '', active: true, leaving: false, entering: false});
      angular.extend(current||{}, {direction: '', active: false, leaving: false, entering: false});
      $scope.$currentTransition = null;
      next.$element.parent().css("overflow","visible");
    }
  };
  self.setGoNextTag = function(slide,valid){
	  slide.goNextTag=valid;
  }
  $scope.getGoNextTag = function() {
	  if(currentIndex!=undefined ){
	  	  if(slides[currentIndex]!=undefined)
		      return slides[currentIndex].goNextTag;
		  return false;
	  }
	 
  };
  $scope.$on('$destroy', function () {
    destroyed = true;
  });

  /* Allow outside people to call indexOf on slides array */
  self.indexOfSlide = function(slide) {
    return slides.indexOf(slide);
  };
  
  $scope.getCurIndex = function() {return currentIndex;};
  //监听点击下一步的事件
  $scope.$on('onnext', function(event, msg) {	   
	    $scope.next(msg);
	});
  //监听点击上一步的事件
  $scope.$on('onprev', function(event, msg) {
	    $scope.prev(msg);
	});
  $scope.next = function(steps) {
	 var stepLength = 1;
	  if (angular.isDefined(steps) && angular.isObject(steps) && steps.stepLength) {
		  stepLength = steps.stepLength;
	  }
	if(currentIndex<slides.length-1){
		var newIndex = (currentIndex + stepLength);

		//Prevent this user-triggered transition from occurring if there is already one in progress
		if (!$scope.$currentTransition) {
		    return self.select(slides[newIndex], 'next');
		}
	}
  };

  $scope.prev = function(steps) {
	  var stepLength = 1;
	  if (angular.isDefined(steps) && angular.isObject(steps) && steps.stepLength) {
		  stepLength = steps.stepLength;
	  }
	  if(currentIndex>0){
		  var newIndex = currentIndex - stepLength;
          //Prevent this user-triggered transition from occurring if there is already one in progress
		  if (!$scope.$currentTransition) {
		     return self.select(slides[newIndex], 'prev');
		  }
	  }
   
  };
  //add by 10191 额外增加的按钮是否显示
  $scope.addbtnIsShow = function() {
	  var flag = false;
	  if ($scope.btntext) {
		  if ($scope.btnshowindex) {
			  if ($scope.btnshowindex == currentIndex) {
				  flag = true;
			  }
		  } else {
			  flag = true;
		  }
			  
	  }
	  return  flag;
  };
  //add by 10191 额外增加的按钮的事件
  $scope.dosome = function() { 
	  $scope.$emit(constant.onCarouselExtraBtnClick);
  }
  $scope.isActive = function(slide) {
     return self.currentSlide === slide;
  };
  $scope.isShowActive = function(slide) {
	  var index = slides.indexOf(slide);
	  return currentIndex >=index;
	  
  };
  $scope.isClickActive = function(slide){
	  if($scope.isShowActive(slide)){
		  //如果点击的slide是已经变绿色的slide，那么可以直接点击选择
		  if (angular.isDefined(slide.canActivate)) {
			  return slide.canActivate == 'true';
		  } else {
			  var index = slides.indexOf(slide);
			  if(slides[currentIndex] != undefined && currentIndex -index >= 1){
				  //点击的slide之前的slide都要验证通过
				  var result = true;
				  for(var i = currentIndex-1 ; i > index ; i--){
					  if (slides[i].canActivate == 'false') {
						  result = false;
						  break;
		  }
				  }
				  return result;
			  } else {
				  return true; 
			  }
		  }
	  }else{
		  //如果是点击当前slide后面的slide,那么要判断当前到点击的silde之间的slides是否都验证通过
		  var index = slides.indexOf(slide);
		  //要验证的最后一个slide的标记为index-1
		  if(slides[currentIndex]!=undefined&&index-currentIndex>=1){
			  //点击的slide之前的slide都要验证通过
			  var result = true;
			  for(var i = currentIndex ; i < index ; i++){
				  result = result&&slides[i].valid;
			  }
			  return result;
		  }
	  }
	  //其他情况，点击无效
	  return false;
  }
  $scope.allSlidesValid = function () {
      var length = slides.length;
      var allValid = true;
      for (var i = 0; i < length; i++) {
          allValid = allValid && slides[i].valid;
      }
      return allValid;
  }
  $scope.isPrevBtnShow = function() {
      if (currentIndex == 0) {
          return false;
      }
      var slide = slides[currentIndex];
      if (angular.isDefined(slide.$$prevSibling.canActivate)) {
          return slide.$$prevSibling.canActivate == 'true';
      } else {
          return true;
      }
  }
  self.addSlide = function(slide, element, index) {
    slide.$element = element;
    if (angular.isUndefined(index)) {
    	slides.push(slide);
    } else {
    	slides.splice(index, 0, slide);
    }
    //if this is the first slide or the slide is set to active, select it
    if(slides.length === 1 || slide.active) {
      self.select(slides[slides.length-1]);
      if (slides.length == 1) {
        //$scope.play();
      }
    } else {
      slide.active = false;
    }
    $timeout(function() {	//设置延迟加载步骤栏，解决第二次打开窗口时步骤栏界面混乱问题  by ckf6302
		var parent = slide.$element.parent();
		if (parent && parent[0] && parent[0].clientWidth > 0) {
			if (slides.length <= 2) {
				$scope.liwidth={width: "38%","margin-left":"2px"};
			} else {
				 $scope.liwidth={"margin-left":"10px",width:(parent[0].clientWidth)/(slides.length + 1) + "px"};
			}
		} else {
			if(slides.length == 1){
				$scope.liwidth = {width:'38%', "margin-left":"31%"};
			} else if (slides.length == 2) {
				$scope.liwidth={width: "38%","margin-left":"2px"};
			} else {
				$scope.liwidth={"margin-left":"10px",width:100/(slides.length + 1) + "%"};
			}
		}
    });
  };
  
  self.removeAllSlide = function() {
	  	slides = [];
	  	currentIndex = -1;
	  	$scope.currentSlide=self.currentSlide = null;
	    $scope.liwidth={"margin-left":"10px", width:'20%'};
  };

  self.removeSlide = function(slide) {
    //get the index of the slide inside the carousel
    var index = slides.indexOf(slide);
    if (index >= 0) {
    	slides.splice(index, 1);
        if (slides.length > 0 && slide.active) {
          if (index >= slides.length) {
            self.select(slides[index-1]);
          } else {
            self.select(slides[index]);
          }
        } else if (currentIndex > index) {
          currentIndex--;
        }
    	var parent = slide.$element.parent();
    	if (parent && parent[0] && parent[0].clientWidth > 0) {
    		if(slides.length == 1){
				$scope.liwidth = {width:'38%', "margin-left":"31%"};
			} else if (slides.length == 2) {
    			$scope.liwidth={width: "38%","margin-left":"2px"};
    		} else {
    			$scope.liwidth={"margin-left":"10px",width:(parent[0].clientWidth)/(slides.length + 1) + "px"};
    		}
    	} else {
    		if(slides.length == 1){
				$scope.liwidth = {width:'38%', "margin-left":"31%"};
			} else if (slides.length == 2) {
    			$scope.liwidth={width: "38%","margin-left":"2px"};
    		} else {
    			$scope.liwidth={"margin-left":"10px",width:100/(slides.length + 1) + "%"};
    		}
    	}
    }
  };
}])
.directive('carouselForm', [function() {
  return {
    restrict: 'EA',
    transclude: true,
    replace: true,
    controller: 'CarouselFormController',
    require: 'carouselForm',
    templateUrl: 'html/template/carouselform/carousel.html',
    scope: {
      noTransition: '=',
      titles:'=',
      confirmclose:'=',
      cancel:'&',
      btntext :'@', /**额外增加按钮的文本**/
      btnshowindex :'@', /**按钮在哪个slide展示，默认都展示**/
      extraConfirmBtn : '@'
    },
    link:function(scope,element,attrs,carouselCtrl){
    	//when the scope is destroyed then remove the slide from the current slides array
    	scope.$on('$destroy', function() {
    		carouselCtrl.removeAllSlide();
    	});
    }
  };
}])
.directive('slideForm', function() {
  return {
    require: '^carouselForm',
    restrict: 'EA',
    transclude: true,
    replace: true,
    templateUrl: 'html/template/carouselform/slide.html',
    scope: {
      active: '=?',
      valid: '=',
      isAdd:'=',
      tabIndex:'=',
      canActivate:'@'
    },
    link: function (scope, element, attrs, carouselCtrl) {
    	if (angular.isUndefined(scope.isAdd)) {
    		carouselCtrl.addSlide(scope, element);
    	}
    	
    	//when the scope is destroyed then remove the slide from the current slides array
//    	scope.$on('$destroy', function() {
//    		carouselCtrl.removeSlide(scope);
//    	});
      
    	scope.$watch('isAdd', function(isAdd) {
    		if (angular.isDefined(scope.isAdd)) {
    			if (isAdd) {
    				if (scope.tabIndex < 0) {
    					return;
    				}
    				carouselCtrl.addSlide(scope, element, scope.tabIndex);
    			} else {
    				carouselCtrl.removeSlide(scope);
    			}
    		}
    	});
      
    	scope.$watch('active', function(active) {
    		if (active) {
    			carouselCtrl.select(scope);
    		}
    	});
    	scope.$watch('valid', function(valid) {
            	carouselCtrl.setGoNextTag(scope,valid);
    	});
    }
  };
});