const data = [
	{ id: 1, title: "The Shawshank Redemption", year: 1994, votes: 678790, rating: 9.2, rank: 1 },
	{ id: 2, title: "The Godfather", year: 1972, votes: 511495, rating: 10, rank: 2 },
	{ id: 3, title: "The Godfather: Part II", year: 1974, votes: 319352, rating: 9.0, rank: 3 },
	{ id: 4, title: "The Good, the Bad and the Ugly", year: 1966, votes: 213030, rating: 8.9, rank: 4 },
	{ id: 6, title: "12 Angry Men", year: 1957, votes: 164558, rating: 4.9, rank: 6 },
	{ id: 5, title: "My Fair Lady", year: 1964, votes: 533848, rating: 7.9, rank: 5 }
];

document.addEventListener("DOMContentLoaded", () => {
	// обработка нажатия на кнопку "сортировать"
	document.getElementById("sort_btn").addEventListener("click", () => {
		let sortedData = sortByRating(data);
		refresh(sortedData);
	});

	// обработка нажатия "обновить"
	document.getElementById("refresh_btn").addEventListener("click", () => {
		refresh(data);
	});

	// первичное отображение данных
	refresh(data)
});

// функция обновления данных в контейнере
function refresh(data) {
	clear()

	data.forEach(item => {
		document.getElementById('films').appendChild(createElement(item))
	});
}

// функция сортировки фильмов по году
function sortByRating(data, sortBy = "year") {
	const sortedData = [...data] //JSON.parse(JSON.stringify(data));
	const sortedDataCheck = (data, element, sortBy) => data[element][sortBy] < data[element + 1][sortBy];

	// сортировка data по полю rating
	for (let i = 0; i < sortedData.length; i++) {
		for (let j = 0; j < sortedData.length - 1; j++) {
			if (sortedDataCheck(sortedData, j, sortBy)) {
				const [swapItemA, swapItemB] = swap(sortedData[j], sortedData[j + 1]);
				sortedData[j] = swapItemA;
				sortedData[j + 1] = swapItemB;
			}
		}
	}

	return sortedData;
}

function swap(elementA, elementB) {
	return [elementA, elementB] = [elementB, elementA];
}

// функция очищения контейнера фильмов
function clear() {
	document.getElementById('films').innerHTML = '';
}

// создание html представления фильма
function createElement(item) {
	// ячейка названия фильма
	const divTitle = document.createElement('div');
	divTitle.className = "item-title";
	divTitle.innerHTML = item.title;

	// ячейка год выхода фильма
	const divYear = document.createElement('div');
	divYear.className = "item-year";
	divYear.innerHTML = item.year;

	// ячейка рейтинга фильма
	const divRating = document.createElement('div');
	divRating.className = "item-rating";
	divRating.innerHTML = item.rating;
	divRating.style.backgroundColor = colorFilmRating(item.rating);

	// строка фильма
	var divItemContainer = document.createElement('div');
	divItemContainer.className = "row item disable-selection";
	divItemContainer.appendChild(divTitle);
	divItemContainer.appendChild(divYear);
	divItemContainer.appendChild(divRating);
	divItemContainer.id = 'film_' + item.id;

	return divItemContainer;
}

function colorFilmRating(colorItem) {
	let getColor = "";

	switch (true) {
		case colorItem < 5:
			getColor = "red";
			break;
		case colorItem <= 9:
			getColor = "orange";
			break;
		case colorItem > 9:
			getColor = "green";
			break;
	}

	return getColor;
}