'use strict';

function getNumDays(month){
    // returns number of days in month, [jan =0]
    month = (month+12) % 12; // handle negative
    return (month in [0,2,4,6,7,9,11])? 31 :30;
}
function range(start, end) {
    return (new Array(end - start + 1)).fill(undefined).map((_, i) => i + start);
}
function generateGrid(id,startDay, days, fixedDate){
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

    var Months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var grid = `<table class="calendar" id="${id}Calendar"$>
                    <tr>
                        <th colspan="7" >
                        <div class="button-left button-year-left"></div>
                        <div class="button-left button-month-left"></div> 
                        <span class="year" month=${Months[fixedDate.month]} year=${fixedDate.year}></span>
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

function DatePicker(id, callback){
    // valid date selected - invoke callback
    function callbackWrapper(cell, table, event){
        var numToMonths = {"Jan":1,"Feb":2,"Mar":3,"Apr":4,"May":5,"Jun":6,"Jul":7,"Aug":8,"Sep":9,"Oct":10,"Nov":11,"Dec":12}
        console.log(cell.innerHTML);
        var row1 = table.rows[0].cells[0].getElementsByTagName("span")[0];  
        // console.log(table.rows[0].cells[0].innerHTML,table.rows[0].cells[0].attributes);
        // console.log(table.rows[0].cells[0].getElementsByTagName("span"));
        // console.log(table.rows[0].cells[0].getElementsByTagName("span")[0]);
        console.log(table.rows[0].cells[0].getElementsByTagName("span")[0].getAttribute("month"));
        console.log(table.rows[0].cells[0].getElementsByTagName("span")[0].getAttribute("year"));

        var clickedDate = {'month':numToMonths[row1.getAttribute("month")],
                        'day':cell.innerHTML,
                        'year':row1.getAttribute("year")
                        }; 

        callback(id,clickedDate);
        event.stopPropagation();
    }   

    DatePicker.prototype.render = function(date){
        // display calendar
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
        var element = document.getElementById(id);
        element.innerHTML = generateGrid(id,startDay, days, fixedDate);
        
        // callback on click - event listener added per cell
        var calendarElement = document.getElementById(`${id}Calendar`);
        for (var i=2; i<calendarElement.rows.length; i++){
            for(var j=0; j<calendarElement.rows[i].cells.length; j++){
                var cell = calendarElement.rows[i].cells[j];
                if (cell.classList.contains("curMonth")){
                    cell.onclick=function(){callbackWrapper(cell, calendarElement, event)};            
                }
            }
        }
    };

}

