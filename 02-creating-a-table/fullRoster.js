/* Creating a table
 *
 * This script shall create a table from a tab-separated value text document.
 * Note that this file follows a template for D3.js files which this course 
 * will follow repeatedly for data driven controllers
 */

/* Positions hashmap for lookup */
var positions = { G: "Goalkeeper", D: "Defender", M: "Midfielder", F: "Forward" }

/* Part 1: Program variables
 * Store the data in an array. Starts off empty.
 * This is usually NOT global, but making global here for demonstration purposes.
 */
var data = [];

/*setting the columns names I want as an array*/
var columns = ["No", "Name", "Team", "Pos"];

/*adding variable for the team name drop-down (selector)*/
var teams = [];

/* Select the DIV in the document with the ID of "roster".
 * Append a <table class="table"></table> to the selected DIV.
 * The "table" class is a beautification measure via Bootstrap's CSS.
 * The resulting table element is stored in the variable "table."
 */
var table = d3.select('#roster')
    .append('table')
    .classed('table', true);

/* Append <thead><tr></tr></thead> to the above table.
 * The inner tr element is stored in the "thead" variable.
 */
var thead = table.append('thead').append('tr');

/* Append <tbody></tbody> to the table and store it in the "tbody" variable. */
var tbody = table.append('tbody');

/*adding in a selector to the page-title div*/
var teamSelector = d3.select('#page-title') /*get the div from the HTML*/
    .append('select') /*append a selector to it*/
    .attr('id', 'team-selector') /*give it an id of team-selector*/

/* Part 2: the reload function (where the data gets loaded and sorted)
 * Function to reload the data from the data file.
 * Call the redraw() function after the data is loaded to drive the drawing of the data.
 * We'll be filling this in during the lesson.
 */
var reload = function() {
    d3.tsv('eng2-rosters.tsv', function(rows) {
            data = rows;
            data.forEach(function(d) {
                d.Pos = positions[d.Pos];
                if (teams.indexOf(d.TeamID) < 0) {
                    teams.push(d.TeamID);
                    teams[d.TeamID] = d.Team;
                };
            }); /*map in the positions using the lookup to positions variable*/
            redraw();
        })
        /*console.log("Congrats!  You have loaded the data!");*/
};
/*note the console log to show the script has reached this stage
check the browser console for this message!
Also added in the tsv file using d3 tsv function, 
which then parses the file into an array of ordered maps for each record
The callback function then brings in the rows as a parameter
the function also redraws to bind each record to the DOM when implemented

NOTE: if you get the code wrong and the data doesn't load, clear the cache in the 
browser console by using window.location.reload(true)
This refreshes the page direct from the files and ignores any caching
LATER: reload() works just as well*/

/* Part 3: the redraw function (where the data gets bound and rendered)
 * Function to redraw the table.
 * It's good practice to keep the data input and drawing funcitons separate.
 * We'll be filling this in during the lesson.
 */
var redraw = function() {
    teamSelector.selectAll("option") /*only want to call the team list in for the selector when initialising */
        .data(teams) /*assign teams array as the data for teamSelector*/
        .enter() /*start an enter iterator*/
        .append("option") /*append an option tag...*/
        .attr("value", function(d) { return d; }) /*...with the value attribute of the current data value (teamID)*/
        .text(function(d) { return teams[d]; }) /*set the options text to the team name*/
        .sort(function(a, b) { return d3.ascending(a, b); }); /*sort the options in ascending order*/

    thead.selectAll("th") /*select virtual th elements*/
        .data(columns) /*map & assign the first record's keys (as in key:value) as their data*/
        .enter()
        .append("th") /*enter the th elements where there was no data before, i.e. all*/
        .text(function(d) { return d; }); /*with the appropriate text, as per chapter 1*/
    /*added the slice in there to take the first two columns off the header*/

    var rows = tbody.selectAll("tr")
        .data(data); /*select the virtual table row elements and assign the data*/

    rows.enter().append("tr"); /*for each row which doesn't already exist, i.e. all, create a tr element*/
    rows.exit().remove(); /*handle removing any unwanted rows on page reload, just in case*/

    var cells = rows.selectAll("td")
        .data(function(row) {
            var values = [];
            columns.forEach(function(d) { values.push(row[d]); });
            return values;
        });
    /*each tr row has its td cell elements selected and appended on enter
    note this is the alternate to the keys*/
    /*also note slice to take the first two columns off the td section too*/

    cells.enter().append("td");
    cells.text(function(d) { return d; });

    /*console.log("Congrats!  You have drawn the data!");*/
};
/*note the console log to show the script has reached this stage
check the browser console for this message to be sure it's working!*/

/* Finally we call the reload function on the page to get everything started (crank it up!)
 * Call reload() once the page and script have loaded to get the controller script started. */
reload();