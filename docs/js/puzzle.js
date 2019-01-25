var puzzle;
var level = 0;
var doRandom = false;

var games = [
	{title: 'MCJ', path: '01.png', size: 3},
	{title: 'MCJ', path: '02.png', size: 4}
];
var empty = {
	x: games[0].size - 1,
	y: games[0].size - 1
}

$(document).ready(function() {
	makePuzzle();
	showSelect();
	draw();
	
	$('body').keydown(function() {
		if (window.event.keyCode >= 37 && window.event.keyCode <= 40) {
			changePuzzle(window.event.keyCode);
			showSelect();
			draw();
			checkWin();
		}
	});
});

function makePuzzle() {

	var id = 1;
	puzzle = new Array(games[level].size);
	for (var i = 0; i < puzzle.length; i++) {
		puzzle[i] = new Array(games[level].size);
		for (var j = 0; j < puzzle[i].length; j++) {
			puzzle[i][j] = id++;
		}
	}
	empty.x = games[level].size - 1;
	empty.y = games[level].size - 1;
	puzzle[empty.x][empty.y] = 0;

	if (doRandom) {
		for (var i = 0; i < puzzle.length; i++) {
			for (var j = 0; j < puzzle[i].length; j++) {
				var x = Math.floor(Math.random() * (level + 2));
				var y = Math.floor(Math.random() * (level + 2));
				
				var temp = puzzle[i][j];
				
				puzzle[i][j] = puzzle[x][y];
				puzzle[x][y] = temp;
				if (i == empty.x && j == empty.y) {
					empty.x = x;
					empty.y = y;
				}
			}
		}
	}
}

function showSelect() {
	$('#title').html(games[level].title);
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

	if (win) {
		setTimeout(() => {
			level = level + 1 == games.length ? 0 : level + 1;
			makePuzzle();
			showSelect();
			// alert('you win!');
			$('#toast').toast('show');
			draw();
		}, 50);
	}
}

function changePuzzle(keyCode) {
	switch(keyCode) {
	case 37:
		if (empty.y + 1 < puzzle[empty.x].length) {
			puzzle[empty.x][empty.y] = puzzle[empty.x][empty.y + 1];
			puzzle[empty.x][empty.y + 1] = 0;
			empty.y++;
		}
		break;
	case 38:
		if (empty.x + 1 < puzzle.length) {
			puzzle[empty.x][empty.y] = puzzle[empty.x + 1][empty.y];
			puzzle[empty.x + 1][empty.y] = 0;
			empty.x++;
		}
		break;
	case 39:
		if (empty.y - 1 >= 0) {
			puzzle[empty.x][empty.y] = puzzle[empty.x][empty.y - 1];
			puzzle[empty.x][empty.y - 1] = 0;
			empty.y--;
		}
		break;
	case 40:
		if (empty.x - 1 >= 0) {
			puzzle[empty.x][empty.y] = puzzle[empty.x - 1][empty.y];
			puzzle[empty.x - 1][empty.y] = 0;
			empty.x--;
		}
		break;
	}
}

function clickBlock(x, y) {
	var changed = false;
	if (empty.x == x) {
		if (empty.y == y - 1 || empty.y == y + 1) {
			puzzle[empty.x][empty.y] = puzzle[x][y];
			empty.y = y;
			puzzle[x][y] = 0;
			changed = true;
		}
	} else if (empty.y == y) {
		if (empty.x == x - 1 || empty.x == x + 1) {
			puzzle[empty.x][empty.y] = puzzle[x][y];
			empty.x = x;
			puzzle[x][y] = 0;
			changed = true;
		}
	}
	if (changed) {
		showSelect();
		draw();
		checkWin();
	}
}

function draw() {
	var html = '';
	html += '<center>';
	html += '<table>';
	for (var i = 0 ; i < puzzle.length ; i++) {
		html += '<tr>';
		for (var j = 0 ; j < puzzle[i].length ; j++) {
			html += '<td style="' + getStytle(games[level].size, puzzle[i][j]) + '" onclick="clickBlock('+ i + ', ' + j + ')"></td>';
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

	var w = $('#content').width();
	var h = $('#content').height();
	var c = (w > h ? h : w) / size;

	var style = '';
	var x = (id - 1) % puzzle.length;
	var y = Math.floor((id - 1) / puzzle.length);
	style += 'background-color: #FFFFFF;';
	style += 'width: ' + c + 'px;';
	style += 'height: ' + c + 'px;';
	style += 'background-size: ' + (c * size) + 'px ' + (c * size) + 'px;';
	style += 'background-position: -' + x * c + 'px -' + y * c + 'px;';
	style += 'border: 5px solid white;';

	if (id != 0) {
		style += 'background-image:URL(images/' + games[level].path + ');';
	}
	
	return style;
}