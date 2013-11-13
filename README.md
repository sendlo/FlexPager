#FlexPager

An accessible jQuery plugin to create a horizontal list carousel with pagination that reconfigures to handle irregular sized elements and any container size.

##Installation

Include the [flexpager.js][https://github.com/sendlo/FlexPager/src/flexpager.js] and flexpager.css[https://github.com/sendlo/FlexPager/src/flexpager.css] files in your project.

##Usage
1. Create the following html structure on your page. Add any list items you want in the carousel.

    <div class="flxPgr"><ul class="flxPgrUl"> {your list items here} </ul></div>

2. Set a height to the flxPgr container and the list items.

3. Call the plugin:

    $(".flxPgr").flexpager();

##Options

The following options are available to you when initializing or updating the component:

1. setPagesCB: A function called after the pages have been identified and configured.

2. movedCB: A function called every time pagination is triggered.

3. pgFlag: The name of the data parameter used to identify the first item of every page.

4. pgTxt: An object containing all alt text for the pagination controls. Available for localization.

##Demo

See the demo folder.

