'use strict';
function removeOuterBracketts(cell){
	var reBeg = /\{\{.*/;
	var reEnd = /.*\}\}/;
	var found = false;
	if (reBeg.test(cell) && reEnd.test(cell)){
		found = true;
	}
	cell = cell.substring(2, cell.length - 2); 
	return [found, cell];
};

class TableTemplate{
	static fillIn(id, info, columnName){
		var table = document.getElementById(id);
		var header = table.rows[0].cells;
		var rows = table.rows;

		// replace column names that match {{XX}} to XX 
		for (var i=0; i< header.length; i++){
			var value = removeOuterBracketts(header[i].innerHTML)[1];
			header[i].innerHTML = info[value] || value;
		}

		// replace column content from dictionary
		for (i=0; i< header.length; i++){
			if(! columnName || header[i].innerHTML === columnName){
				console.log(`${id} column to be replaced: ${columnName} was found`);
				for(var j=1; j<rows.length; j++){
					var [found, key] = removeOuterBracketts(rows[j].cells[i].innerHTML);
					if (found && info[key]){
						rows[j].cells[i].innerHTML = info[key];
					}
				}
			}
		}
		console.log(table);
		table.style.visibility="visible";
	}
}