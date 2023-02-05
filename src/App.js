import React from 'react';
import { Collection } from './Collection';
import './index.scss';

const cats = [
	{ "name": "Все" },
	{ "name": "Море" },
	{ "name": "Горы" },
	{ "name": "Архитектура" },
	{ "name": "Города" }
];

function App() {
	const [categoryId, setCategoryId] = React.useState(0);
	const [page, setPage] = React.useState(1);
	const [isLoading, setIsLoading] = React.useState(true);
	const [searchValue, setSearchValue] = React.useState('');
	const [collections, setCollections] = React.useState([]);

	React.useEffect(() => {
		setIsLoading(true);

		const category = categoryId ? `category=${categoryId}` : '';
		const limit = 3;

		fetch(`https://63dfcd43a76cfd410589171d.mockapi.io/photo_collections?page=${page}&limit=${limit}&${category}`)
			.then(res => res.json())
			.then(json => {
				setCollections(json);
			})
			.catch(err => {
				console.warn(err);
				alert('Ошибка при получении данных');
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [categoryId, page]);

	return (
		<div className="App">
			<h1>Моя коллекция фотографий</h1>
			<div className="top">
				<ul className="tags">
					{cats.map((obj, index) => (
						<li
							onClick={() => {
								setCategoryId(index);
								setPage(1);
							}}
							className={categoryId === index ? 'active' : ''}
							key={obj.name}>
							{obj.name}
						</li>
					))}
				</ul>
				<input
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					className="search-input"
					placeholder="Поиск по названию"
				/>
			</div>
			<div className="content">
				{isLoading ? (
					<h2>Идет загрузка...</h2>
				) : (
					collections
						.filter(obj => obj.name.toLowerCase().includes(searchValue.toLowerCase()))
						.map((obj, index) => (
							<Collection
								key={index}
								name={obj.name}
								images={obj.photos}
							/>
						))
				)}
			</div>
			<ul className="pagination">
				{[...Array(5)].map((_, index) => (
					<li
						className={page === (index + 1) ? 'active' : ''}
						onClick={() => setPage(index + 1)}
					>
						{index + 1}
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;
