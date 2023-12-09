function beginner_start_game() {
	game = true
	playing_field = []
	playing_field_open_close = []
	coords_mines = []

	canvas.height = 700

	m = 8
	n = 8
	number_of_mines = 10
	count_mines_for_display = 10
	step = Math.floor(canvas.height / m)

	canvas.height = m * step
	canvas.width = n * step
	context.fillStyle = '#c2c2c2'
	context.fillRect(0, 0, canvas.width, canvas.height)

	game_stats.style.display = 'flex'

	create_playing_field()
	draw_playing_field()
	update_display_count_mines()
}

function amateur_start_game() {
	game = true
	playing_field = []
	playing_field_open_close = []
	coords_mines = []

	canvas.height = 700

	m = 16
	n = 16
	number_of_mines = 40
	count_mines_for_display = 40
	step = Math.floor(canvas.height / m)

	canvas.height = m * step
	canvas.width = n * step
	context.fillStyle = '#c2c2c2'
	context.fillRect(0, 0, canvas.width, canvas.height)

	game_stats.style.display = 'flex'

	create_playing_field()
	draw_playing_field()
	update_display_count_mines()
}

function professional_start_game() {
	game = true
	playing_field = []
	playing_field_open_close = []
	coords_mines = []

	canvas.height = 700

	m = 16
	n = 30
	number_of_mines = 99
	count_mines_for_display = 99
	step = Math.floor(canvas.height / m)

	canvas.height = m * step
	canvas.width = n * step
	context.fillStyle = '#c2c2c2'
	context.fillRect(0, 0, canvas.width, canvas.height)

	game_stats.style.display = 'flex'

	create_playing_field()
	draw_playing_field()
	update_display_count_mines()
}

function create_playing_field() {
	let coords_mines = create_mines()

	for (let i = 0; i < m; i++) {
		let row = []
		let close_row = []
		let flag_row = []
		for (let j = 0; j < n; j++) {
			if (find_array_in_matrix(coords_mines, [i, j])) {
				row.push(0)
			} else {
				row.push(1)
			}
			close_row.push(1)
			flag_row.push(0)
		}
		playing_field.push(row)
		playing_field_open_close.push(close_row)
		flag_on_field.push(flag_row)
	}
}

function find_array_in_matrix(matrix, element) {
	for (let i = 0; i < matrix.length; i++) {
		if (element.join('') == matrix[i].join('')) {
			return true
		}
	}
	return false
}

function create_mines() {
	if (coords_mines.length != number_of_mines) {
		x_index = Number(Math.floor(Math.random() * n))
		y_index = Number(Math.floor(Math.random() * m))

		if (find_array_in_matrix(coords_mines, [y_index, x_index])) {
			return create_mines()
		} else {
			coords_mines.push([y_index, x_index])
			return create_mines()
		}
	} else {
		return coords_mines
	}
}

function check_mines_around_cell(num_c, num_r) {
	let count_mines = 0

	coord_for_check = [
		[num_r - 1, num_c - 1],
		[num_r - 1, num_c],
		[num_r - 1, num_c + 1],
		[num_r, num_c - 1],
		[num_r, num_c + 1],
		[num_r + 1, num_c - 1],
		[num_r + 1, num_c],
		[num_r + 1, num_c + 1],
	]

	for (let i = 0; i < coord_for_check.length; i++) {
		let row_in_range = coord_for_check[i][0] >= 0 && coord_for_check[i][0] < m
		let column_in_range =
			coord_for_check[i][1] >= 0 && coord_for_check[i][1] < n

		if (row_in_range && column_in_range) {
			if (playing_field[coord_for_check[i][0]][coord_for_check[i][1]] == 0) {
				count_mines++
			}
		}
	}
	return count_mines
}

function check_click(number_column, number_row) {
	if (playing_field[number_row][number_column] == 0) {
		cell_is_bomb(number_column, number_row)
	} else {
		open_field(number_column, number_row)
	}

	let count_close_cell = 0
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < m; j++) {
			if (playing_field_open_close[i][j] == 1) {
				count_close_cell++
			}
		}
	}

	if (count_close_cell == number_of_mines) {
		game_win()
	}
}

function open_field(num_c, num_r) {
	if (num_c >= 0 && num_c < n && num_r >= 0 && num_r < m) {
		if (playing_field_open_close[num_r][num_c] == 1) {
			if (check_mines_around_cell(num_c, num_r) == 0) {
				open_cell(num_c, num_r)
				open_field(num_c - 1, num_r - 1)
				open_field(num_c, num_r - 1)
				open_field(num_c + 1, num_r - 1)
				open_field(num_c - 1, num_r)
				open_field(num_c + 1, num_r)
				open_field(num_c - 1, num_r + 1)
				open_field(num_c, num_r + 1)
				open_field(num_c + 1, num_r + 1)
			} else {
				open_cell(num_c, num_r)
			}
		}
	}
}

function game_over() {
	game = false
}

function game_win() {
	game_over()

	smile.src = 'images/smile_win.png'

	context.lineWidth = 2
	context.fillStyle = '#969696'
	context.strokeStyle = '#5e5e5e'

	for (let i = 0; i < coords_mines.length; i++) {
		context.beginPath()
		context.rect(
			coords_mines[i][1] * step,
			coords_mines[i][0] * step,
			step,
			step
		)
		context.closePath()
		context.fill()
		context.stroke()

		let bomb_img = new Image()

		bomb_img.onload = function () {
			context.drawImage(
				bomb_img,
				coords_mines[i][1] * step,
				coords_mines[i][0] * step,
				step,
				step
			)
		}
		bomb_img.src = 'images/mine.png'
	}
}

function cell_is_bomb(num_c, num_r) {
	context.lineWidth = 2
	context.fillStyle = '#f00'
	context.strokeStyle = '#5e5e5e'

	context.beginPath()
	context.rect(num_c * step, num_r * step, step, step)
	context.closePath()
	context.fill()
	context.stroke()

	let bomb_img = new Image()

	bomb_img.onload = function () {
		context.drawImage(bomb_img, num_c * step, num_r * step, step, step)
	}

	bomb_img.src = 'images/mine.png'
	for (let i = 0; i < coords_mines.length; i++) {
		if (coords_mines[i][1] == num_c && coords_mines[i][0] == num_r) {
			continue
		} else {
			context.beginPath()
			context.rect(
				coords_mines[i][1] * step,
				coords_mines[i][0] * step,
				step,
				step
			)
			context.closePath()
			context.fillStyle = '#969696'
			context.fill()
			context.stroke()

			bomb_img = new Image()

			bomb_img.onload = function () {
				context.drawImage(
					bomb_img,
					coords_mines[i][1] * step,
					coords_mines[i][0] * step,
					step,
					step
				)
			}
			bomb_img.src = 'images/mine.png'
		}
	}

	smile.src = 'images/smile_death.png'
	game_over()
}

function draw_close_cell(x, y, line_width) {
	context.fillStyle = '#b0b0b0'
	context.fillRect(x * step, y * step, step, step)

	context.strokeStyle = '#ebebeb'

	context.beginPath()
	context.moveTo(x * step + line_width / 2, y * step)
	context.lineTo(x * step + line_width / 2, y * step + step)
	context.stroke()

	context.moveTo(x * step + line_width / 2, y * step + line_width / 2)
	context.lineTo(x * step + step, y * step + line_width / 2)
	context.closePath()
	context.stroke()

	context.strokeStyle = '#7f7f7f'
	context.beginPath()
	context.moveTo(x * step + step - line_width / 2, y * step)
	context.lineTo(x * step + step - line_width / 2, y * step + step)
	context.stroke()

	context.moveTo(x * step + step, y * step - line_width / 2 + step)
	context.lineTo(x * step, y * step - line_width / 2 + step)
	context.closePath()
	context.stroke()

	context.fillStyle = '#ebebeb'

	context.beginPath()
	context.moveTo(x * step + step, y * step)
	context.lineTo(x * step + step - line_width, y * step + line_width)
	context.lineTo(x * step + step - line_width, y * step)
	context.closePath()
	context.fill()

	context.beginPath()
	context.moveTo(x * step, y * step + step - line_width)
	context.lineTo(x * step + line_width, y * step + step - line_width)
	context.lineTo(x * step, y * step + step)
	context.closePath()
	context.fill()
}

function draw_playing_field() {
	let line_width = Math.floor(step / 8)
	context.lineWidth = line_width
	for (let x = 0; x < n; x++) {
		for (let y = 0; y < m; y++) {
			draw_close_cell(x, y, line_width)
		}
	}
}

function open_cell(number_column, number_row) {
	const coord_x = number_column * step
	const coord_y = number_row * step

	context.fillStyle = '#969696'
	context.strokeStyle = '#5e5e5e'
	context.lineWidth = 2

	context.beginPath()
	context.rect(coord_x, coord_y, step, step)
	context.closePath()
	context.fill()
	context.stroke()

	let count_mines_around_cell = check_mines_around_cell(
		number_column,
		number_row
	)

	let colors_of_numbers = [
		'#0000ff',
		'#00ff00',
		'#f00',
		'#000075',
		'#822700',
		'#0ef',
		'#000',
		'#fff',
	]

	context.fillStyle = colors_of_numbers[count_mines_around_cell - 1]
	context.textBaseline = 'middle'
	context.textAlign = 'center'
	context.fillText(
		String(count_mines_around_cell),
		coord_x + step / 2,
		coord_y + step / 2
	)

	playing_field_open_close[number_row][number_column] = 0
}

function put_flag(num_c, num_r) {
	if (playing_field_open_close[num_r][num_c] == 1) {
		let flag_img = new Image()

		flag_img.onload = function () {
			context.drawImage(flag_img, num_c * step, num_r * step, step, step)
		}

		flag_img.src = 'images/flag.png'

		flag_on_field[num_r][num_c] = 1
		count_mines_for_display--
		update_display_count_mines()
	}
}

function delete_flag(num_c, num_r, line_width) {
	if (playing_field_open_close[num_r][num_c] == 0) {
		draw_close_cell(num_c, num_r, line_width)
		count_mines_for_display++
		update_display_count_mines()
	}
}

function update_display_count_mines() {
	if (count_mines_for_display > -100) {
		let text_for_display
		if (String(count_mines_for_display).length == 1) {
			text_for_display = `00${count_mines_for_display}`
		} else if (String(count_mines_for_display).length == 2) {
			text_for_display = `0${count_mines_for_display}`
		} else if (String(count_mines_for_display).length == 3) {
			text_for_display = String(count_mines_for_display)
		}
		display_count_mines.textContent = text_for_display
	}
}

let canvas = document.querySelector('canvas')
let context = canvas.getContext('2d')

let game

let first_click

let n, m, number_of_mines, step
let playing_field = []
let playing_field_open_close = []
let coords_mines = []
let count_mines_for_display
let flag_on_field = []
let time

const beginner_button = document.getElementById('beginner')
const amateur_button = document.getElementById('amateur')
const professional_button = document.getElementById('professional')

const game_stats = document.getElementById('data_stats')
const display_count_mines = document.getElementById('display_count_mines')

const smile = document.getElementById('smile')

beginner_button.addEventListener('click', beginner_start_game)
amateur_button.addEventListener('click', amateur_start_game)
professional_button.addEventListener('click', professional_start_game)

canvas.addEventListener('click', function (event) {
	if (game) {
		const x = event.clientX - canvas.offsetLeft
		const y = event.clientY - canvas.offsetTop

		const number_column = Math.floor(x / step)
		const number_row = Math.floor(y / step)

		check_click(number_column, number_row)
	}
})

canvas.addEventListener('contextmenu', function (event) {
	event.preventDefault()

	if (game) {
		const x = event.clientX - canvas.offsetLeft
		const y = event.clientY - canvas.offsetTop

		const number_column = Math.floor(x / step)
		const number_row = Math.floor(y / step)

		if (flag_on_field[number_row][number_column] == 0) {
			put_flag(number_column, number_row)
		} else {
			line_width = Math.floor(step / 8)
			context.lineWidth = line_width
			delete_flag(number_column, number_row, line_width)
		}
	}
})
