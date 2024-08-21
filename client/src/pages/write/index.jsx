import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import axios from "axios";
import moment from "moment";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Write = () => {
	const state = useLocation().state;
	const [title, setTitle] = useState(state?.title || "");
	const [description, setDescription] = useState(state?.description || "");
	const [file, setFile] = useState(null);
	const [category, setCategory] = useState(state?.category || "");

	const navigate = useNavigate()

	const upload = async () => {
		try {
			const formData = new FormData();
			formData.append("file", file);
			const res = await axios.post("/upload", formData);
			return res.data;
		} catch (err) {
			console.log(err);
		}
	};

	const handleClick = async (e) => {
		e.preventDefault();
		const imgUrl = await upload();

		try {
			const postData = {
				title,
				description,
				category,
				img: imgUrl || null,
			};

			if (state) {
				await axios.put(`/posts/${state.id}`, postData);
			} else {
				await axios.post(`/posts/`, {
					...postData,
					date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
				});
			}
			navigate("/");
		} catch (err) {
			console.error("Failed to save post:", err);
		}
	};

	return (
		<div className="add">
			<div className="content">
				<input
					type="text"
					placeholder="Title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>

				<div className="editorContainer">
					<ReactQuill
						className="editor"
						theme="snow"
						value={description}
						onChange={setDescription}
					/>
				</div>
			</div>

			<div className="menu">
				<div className="item">
					<h1>Publish</h1>

					<span>
						<b>Status: </b> Draft
					</span>

					<span>
						<b>Visibility: </b> Public
					</span>

					<input
						style={{ display: "none" }}
						type="file"
						id="file"
						name=""
						onChange={(e) => setFile(e.target.files[0])}
					/>

					<label className="file" htmlFor="file">Upload Image</label>

					<div className="buttons">
						<button>Save as a draft</button>

						<button onClick={handleClick}>Publish</button>
					</div>
				</div>

				<div className="item">
					<h1>Category</h1>

					{["art", "science", "technology", "cinema", "design", "food"].map((cat) => (
						<div className="category" key={cat}>
							<input
								type="radio"
								checked={category === cat}
								name="category"
								value={cat}
								id={cat}
								onChange={(e) => setCategory(e.target.value)}
							/>
							<label htmlFor={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</label>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Write;
