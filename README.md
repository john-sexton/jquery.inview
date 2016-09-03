# jquery.inview
Lightweight jQuery plugin for detecting when an element is scrolled into view.

*Based on:* https://github.com/zuk/jquery.inview

I modified this code to be a jQuery plugin, so I could pass in an offest via JS, not via a `data-` attribute.

## Configuration Defaults
```js
$(".thing").inview({
    offset: 0,               
    onIn: function(visible_part, $element){
		//when element is in view
		//============================== 
		//visible_part = top/bottom/both
		//$element = access to the jQuery elment you're working with
    },
    onOut: function($el){
		//when element is out of view
		//==============================
		//$element = access to the jQuery elment you're working with   
    }
});
```

## Usage

### Basic
Change background color when element is in view. 
```js
$(".promo-1").inview({             
    onIn:function(vp,$el){
    	//element is visible		
		$el.css({"background-color": "black"});
    }
});
```

### Fully Visible
Element is fully visible, both top and bottom, change text color. 
```js
$(".promo-1").inview({             
    onIn:function(vp,$el){
    	//full element is visible		
		if(vp=="both"){
			$el.css({"color": "red"});
		};
    }
});
```

### Offest
200px before the top of the element is in view, fire a lazy load. 
```js
$(".promo-1").inview({
    offset: 200,               
    onIn:function(vp,$el){
        if(vp=="top"){
        	//200px before element is visible
			var lazySrc = $el.data("lazy-src")
			$el.attr("src", lazySrc);
		};
    }
});
```

### Negative Offest
200px of the top of the element is in view, so fire an animation. 
```js
$(".promo-1").inview({
    offset: -200,               
    onIn:function(vp,$el){
        if(vp=="top"){
        	//top of element, minus 200px (offest) is visible			
			$el.fadeIn(500);
		};
    }
});
```