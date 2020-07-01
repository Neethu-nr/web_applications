'use strict';

function getNumDays(month){
    // returns number of days in month, [jan =0]
    month = (month+12) % 12; // handle negative
    return (month in [0,2,4,6,7,9,11])? 31 :30;
}
function range(start, end) {
    // returns array of continues numbers in range
    return (new Array(end - start + 1)).fill(undefined).map((_, i) => i + start);
}
function generateGrid(id,startDay, days, fixedDate){
    // generates grid in html
    var gridTemplate = ``;
    for(var i=0; i< (days.length/7); i++){
        gridTemplate += `<tr >`;
        for (var j=0; j<7; j++){    
            var dayIdx = i*7+j;
            if (dayIdx >= days.length){ 
                // past cur month
                break;
            }
            if (dayIdx < startDay){
                // prev month
                gridTemplate += `<th class="prevMonth">${days[dayIdx]}</th>`;
            }
            else if (days[dayIdx] === fixedDate.day) {
                // selected date
                gridTemplate += `<th class="curMonth selected" >${days[dayIdx]}</th>`;
                
            } else {
                // cur month
                gridTemplate += `<th class="curMonth">${days[dayIdx]}</th>`;                
            }
        }
        gridTemplate += `</tr>`;
    }

    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var grid = `<table class="calendar" id="${id}Calendar"$>
                    <tr>
                        <th colspan="7" >
                        <div class="button-left button-year-left"></div>
                        <div class="button-left button-month-left"></div> 
                        <span class="year" month=${months[fixedDate.month]} year=${fixedDate.year}></span>
                        <div class="button-right button-month-right"></div>
                        <div class="button-right button-year-right"></div>
                        </th>
                    </tr>
                    <tr>
                        <th>Su</th>
                        <th>Mo</th>
                        <th>Tu</th>
                        <th>We</th>
                        <th>Th</th>
                        <th>Fr</th>
                        <th>Sa</th>
                    </tr>
                    ${gridTemplate}
                </table>`;
    return grid;
    
}

// DatePicker class displays clickable calendar widget
function DatePicker(id, callback){
    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var monthToNum = {"Jan":1,"Feb":2,"Mar":3,"Apr":4,"May":5,"Jun":6,"Jul":7,"Aug":8,"Sep":9,"Oct":10,"Nov":11,"Dec":12};
    var element = document.getElementById(id);
    var table;

    function callbackWrapper(cell, event){
        // when cells of table are clicked, highlights correct cell and calls callback
        var row = table.rows[0].cells[0].getElementsByTagName("span")[0];  
        var clickedDate = {'month':monthToNum[row.getAttribute("month")],
                        'day':cell.innerHTML,
                        'year':row.getAttribute("year")
                        }; 
        callback(id,clickedDate);

        // highlight correct cell
        table.getElementsByClassName("selected")[0].classList.remove("selected");
        cell.classList.add("selected");
        event.stopPropagation();
    }   


    function displayDate(date){
        // display calendar month with given date
        var fixedDate = {'month':date.getMonth(),
                        'day':date.getDate(),
                        'year':date.getFullYear()
                        };      
        
        // Generate month numbers
        date.setDate(1);
        var startDay = date.getDay();
        var prevNumDays = getNumDays(fixedDate.month-1);           // number of days in prev month
        var days = [...range(prevNumDays-startDay+1, prevNumDays), // prev month
                    ...range(1, getNumDays(fixedDate.month))     // cur month
                    ];

        // convert to grid display
        element.innerHTML = generateGrid(id,startDay, days, fixedDate);
        table = document.getElementById(`${id}Calendar`);
    }

    function addListeners(){
        // Makes the calendar functional
        // Event listener added per cell
        for (var i=2; i<table.rows.length; i++){
            for(var j=0; j<table.rows[i].cells.length; j++){
                var cell = table.rows[i].cells[j];
                if (cell.classList.contains("curMonth")){
                    cell.onclick=function(){
                            callbackWrapper(this, event)
                        };            
                }
            }
        }

        // buttons to change year and month
        element.getElementsByClassName("button-year-left")[0].onclick = function(){
            updateYear(-1,event)};
        element.getElementsByClassName("button-year-right")[0].onclick = function(){
            updateYear(1,event)};
        element.getElementsByClassName("button-month-left")[0].onclick = function(){
            updateMonth(-1,event)};
        element.getElementsByClassName("button-month-right")[0].onclick = function(){
            updateMonth(1,event)};    
    }

    function updateMonth(delta, event){
        // changes month on calendar
        var row = table.getElementsByClassName("year")[0];
        var month = delta + monthToNum[row.getAttribute("month")]-1;
        month = (month + 12) %12 + 1;
        row.setAttribute("month", months[month-1]);
        
        // update days
        var day = element.getElementsByClassName("selected")[0].innerHTML
        var year = row.getAttribute("year");
        displayDate(new Date(`${month}/${day}/${year}`));
        addListeners();
        event.stopPropagation();
    }

    function updateYear(delta, event){
        // changes year on calendar
        var row =table.getElementsByClassName("year")[0];
        var year = delta + Number(row.getAttribute("year"));
        row.setAttribute("year", year); 

        // update days
        var day = element.getElementsByClassName("selected")[0].innerHTML
        var month = row.getAttribute("month");
        displayDate(new Date(`${month}/${day}/${year}`));
        addListeners();
        event.stopPropagation();
    }

    DatePicker.prototype.render = function(date){
        displayDate(date);
        addListeners();
    };
}

