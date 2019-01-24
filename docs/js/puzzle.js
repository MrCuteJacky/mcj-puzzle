var puzzle;
var space;
var level = 0;
var picture = [
	['第一關(魯夫)', 'LV-1.jpg'],
	['第二關(索隆)', 'LV-2.jpg'],
	['第三關(娜美)', 'LV-3.jpg'],
	['第四關(騙人布)', 'LV-4.jpg'],
	['第五關(香吉士)', 'LV-5.jpg'],
	['第六關(喬巴)', 'LV-6.jpg'],
	['第七關(羅賓)', 'LV-7.jpg']
];

$(document).ready(function() {
	makePuzzle();
	showSelect();
	draw();
	
	$('body').keydown(function() {
		if (window.event.keyCode >= 37 && window.event.keyCode <= 40) {
			changePuzzle(window.event.keyCode);
			showSelect();
			draw();
			if (checkWin()) {
				setTimeout(() => {
					level = level + 1 == picture.length ? 0 : level + 1;
					makePuzzle();
					showSelect();
					alert('you win!');
					draw();
				}, 50);
			}
		}
	});
});

function makePuzzle() {
	var id = 1;
	
	puzzle = new Array(level + 4);
	
	for (var i = 0 ; i < level + 4 ; i++) {
		puzzle[i] = new Array(level + 4);
		for (var j = 0 ; j < level + 4 ; j++) {
			puzzle[i][j] = id++;
		}
	}
	puzzle[level + 3][level + 3] = 0;
	space = [level + 3, level + 3];

	/*
	for (var i = 0; i < level + 4; i++) {
		for (var j = 0; j < level + 4; j++) {
			if (i != level + 2 && j != level + 2) {
				var x = Math.floor(Math.random() * (level + 2));
				var y = Math.floor(Math.random() * (level + 2));
				
				var temp = puzzle[i][j];
				
				puzzle[i][j] = puzzle[x][y];
				puzzle[x][y] = temp;
				if (i == space[0] && j == space[1]) {
					space = [x, y];
				}
			}
		}
	}
	*/
}

function showSelect() {
	$('#level').html(picture[level][0]);
}

function checkWin() {
	var win = true;
	for (var i = 0; i < puzzle.length; i++) {
		for (var j = 0; j < puzzle[i].length; j++) {
			if (puzzle[i][j] == i * puzzle.length + j + 1) {
				win = win && true;
			} else {
				if (i == puzzle.length - 1 && j == puzzle[i].length - 1 && puzzle[i][j] == 0) {
					win = win && true;
				} else {
					win = false;
				}
			}
		}
	}
	
	return win;
}

function changePuzzle(keyCode) {
	switch(keyCode) {
	case 37:
		if (space[1] + 1 < puzzle[space[0]].length) {
			puzzle[space[0]][space[1]] = puzzle[space[0]][space[1] + 1];
			puzzle[space[0]][space[1] + 1] = 0;
			space = [space[0], space[1] + 1];
		}
		break;
	case 38:
		if (space[0] + 1 < puzzle.length) {
			puzzle[space[0]][space[1]] = puzzle[space[0] + 1][space[1]];
			puzzle[space[0] + 1][space[1]] = 0;
			space = [space[0] + 1, space[1]];
		}
		break;
	case 39:
		if (space[1] - 1 >= 0) {
			puzzle[space[0]][space[1]] = puzzle[space[0]][space[1] - 1];
			puzzle[space[0]][space[1] - 1] = 0;
			space = [space[0], space[1] - 1];
		}
		break;
	case 40:
		if (space[0] - 1 < puzzle.length) {
			puzzle[space[0]][space[1]] = puzzle[space[0] - 1][space[1]];
			puzzle[space[0] - 1][space[1]] = 0;
			space = [space[0] - 1, space[1]];
		}
		break;
	}
}

function clickBlock(x, y) {
	var changed = false;
	if (space[0] == x) {
		if (space[1] == y - 1 || space[1] == y + 1) {
			puzzle[space[0]][space[1]] = puzzle[x][y];
			space[1] = y;
			puzzle[x][y] = 0;
			changed = true;
		}
	} else if (space[1] == y) {
		if (space[0] == x - 1 || space[0] == x + 1) {
			puzzle[space[0]][space[1]] = puzzle[x][y];
			space[0] = x;
			puzzle[x][y] = 0;
			changed = true;
		}
	}
	if (changed) {
		showSelect();
		draw();
		if (checkWin()) {
			setTimeout(() => {
				level = level + 1 == picture.length ? 0 : level + 1;
				makePuzzle();
				showSelect();
				alert('you win!');
				draw();
			}, 50);
		}
	}
}

function draw() {
	var html = '';
	html += '<center>';
	html += '<table class="table">';
	for (var i = 0 ; i < puzzle.length ; i++) {
		html += '<tr>';
		for (var j = 0 ; j < puzzle[i].length ; j++) {
			html += '<td style="' + getStytle(level + 4, puzzle[i][j]) + '" onclick="clickBlock('+ i + ', ' + j + ')"></td>';
		}
		html += '</tr>';
	}
	html += '</table>';
	html += '</center>';
	$('mcj-pizzle').html(html);
	$('mcj-pizzle').find('td').hover(event => {
		$(event.currentTarget).css('filter', 'opacity(0.5)');
	}, event => {
		$(event.currentTarget).css('filter', 'none');
	});
}

function getStytle(size, id) {

	var screenW = document.body.clientWidth;
	var screenH = document.body.clientHeight;

	var w = screenW < screenH ? screenW : screenH;
	var c = w / size;

	var style = '';
	if (id != 0) {
		var x = (id - 1) % puzzle.length;
		var y = Math.floor((id - 1) / puzzle.length);
		style += 'background-color: #000000;';
		style += 'width: ' + c + 'px;';
		style += 'height: ' + c + 'px;';
		style += 'background-image:URL(pic/' + picture[level][1] + ');';
		style += 'background-size: ' + (c * size) + 'px ' + (c * size) + 'px;';
		style += 'background-position: -' + x * c + 'px -' + y * c + 'px;';
		style += 'border: 5px solid white;';
	}
	
	return style;
}