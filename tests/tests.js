(function() {

	var $fixture = $( "#qunit-fixture" ),
		pager;
	
	if($fixture.length === 0) {
		$("body").append("<div id='qunit-fixture'></div>");
		$fixture = $( "#qunit-fixture" );
	}
	
	
	var render = function(){
		
		// HTML
		dust.render(
			"sendlo.flexpager", 
			{
				items: [{tagA:"SmTag", tagB: "SmTag2"}, {tagA:"Very Long Tag Here", tagB: "Col 2 - Tag B"}, {tagA:"Col 3 - Tag A", tagB: "Col 3 - Tag B"}, {tagA:"Col 4 - Tag A", tagB: "Col 4 - Tag B"}, {tagA:"Col 5 - Tag A", tagB: "Col 5 - Tag B"}, {tagA:"Col 6 - Tag A", tagB: "Col 6 - Tag B"}, {tagA:"Col 7 - Tag A", tagB: "Col 7 - Tag B"}, {tagA:"Col 8 - Tag A", tagB: "Col 8 - Tag B"}]
			}, 
			function(err, out) {$fixture.append('<div style="width:300px">' + out + '</div>');}
		);

		pager = $(".flxPgr");
		
	}
	
	module("Flex Pager - Multiple Pages", {
		
		setup: render
		
	});
	
	test('With default settings', function () {

		ok(!pager.flexpager("_move"), "Calling method before initializing component was ignored.");
		pager.flexpager();
		ok(!pager.flexpager("_move"), "Invalid (or private) method didn't break anything");
		
		var items = $("li",pager);
		equal($(".fpCtrls", pager).css("visibility"),"visible", "Pagination is visible");
		equal(items.eq(0).attr("data-flxpgrstart"), "true", "First item marked as a page start: " + items.eq(0).attr("data-flxpgrstart"));
		ok(items.eq(1).attr("data-flxpgrstart") !== "true", "Second item not marked as a page start: " + items.eq(1).attr("data-flxpgrstart"));
		
	});
	
	test('Update tests', function () {

		var nextText = "Test Next",
			pagesCallbackCalled = false,
			movedCallbackCalled = false,
			pagesCB = function(){pagesCallbackCalled=true;},
			movedCB = function(){movedCallbackCalled=true;};
			
		render(); // not called in module because we don't want to re-render after each test
		pager.flexpager();
		pager.flexpager({pgTxt:{n:nextText}}); // Creation called twice
		equal($(".flxN", pager).attr("title"), nextText, "Text on Next control is updated: " + $(".flxN", pager).attr("title"));

		pager.flexpager("update", {setPagesCB:pagesCB, movedCB:movedCB}); // update called directly
		ok(pagesCallbackCalled, "Callback called after pages were set");
		
		$(".flxN", pager).trigger("click");
		stop(); // Pause the test 
	    setTimeout(function() {
	    	ok(movedCallbackCalled, "Callback called after pagination triggered");
	    	start();
	    }, 1000);	
	    
	    
		
	});

	
	module("Flex Pager - Pagination controls")
		
	test('Next button', function () {

		render(); // not called in module because we don't want to re-render after each test
		pager.flexpager();

		var ul = $(".flxPgrUl",pager),
			leftVal;
		
		$(".flxN", pager).trigger("click");
		stop(); // Pause the test 
	    setTimeout(function() {
	    	leftVal = ul.css("left").replace("px","");
	    	ok(leftVal < 0, "Pager has moved after click on Next: " + leftVal);
	    	start();
	    }, 1000);
		
	});
	
	test('Previous button', function () {

		var ul = $(".flxPgrUl",pager),
			leftVal;
		
		$(".flxP", pager).trigger("click");
		stop(); // Pause the test 
	    setTimeout(function() {
	    	leftVal = ul.css("left").replace("px","");
	    	equal(leftVal, "0", "Pager moved back after click on Previous: " + leftVal);
	    	start();
	    }, 1000);
		
	});
	
	module("Flex Pager - Single Page");
	
	test('Pagination supression', function () {

		// HTML
		dust.render(
			"sendlo.flexpager", 
			{
				items: [{tagA:"1", tagB: "2"}]
			}, 
			function(err, out) {$fixture.append('<div style="width:300px">' + out + '</div>');}
		);

		pager = $(".flxPgr");
		
		pager.flexpager();
		equal($(".fpCtrls", pager).size(),0, "Pagination not added");
		
		
	});
	
})();

