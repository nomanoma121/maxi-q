import { useRef } from "react";
import { css } from "styled-system/css";
import type { CreateQuestionParams } from "~/types/question";
import { serverFetch } from "~/utils/fetch";

export default function QuestionsPage() {
	const formRef = useRef<HTMLFormElement>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const params: CreateQuestionParams = {
			title: formData.get("title") as string,
			content: formData.get("content") as string,
		};

		try {
			const response = await serverFetch("/questions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(params),
			});

			if (!response.ok) throw new Error("Failed to create question");

			formRef.current?.reset();
		} catch (error) {
			console.error("Error creating question:", error);
		}
	};

	return (
		<div
			className={css({
				maxWidth: "600px",
				margin: "0 auto",
				padding: "20px",
				fontSize: "16px",
			})}
		>
			<h1 className={css({ fontSize: "24px", marginBottom: "16px" })}>
				質問投稿
			</h1>

			<form
				ref={formRef}
				onSubmit={handleSubmit}
				className={css({
					display: "flex",
					flexDirection: "column",
					gap: "16px",
				})}
			>
				<label
					className={css({
						display: "flex",
						flexDirection: "column",
						gap: "4px",
					})}
				>
					タイトル:
					<input
						name="title"
						required
						className={css({
							border: "1px solid #000",
							padding: "8px",
							borderRadius: "4px",
						})}
					/>
				</label>

				<label
					className={css({
						display: "flex",
						flexDirection: "column",
						gap: "4px",
					})}
				>
					内容:
					<textarea
						name="content"
						required
						className={css({
							border: "1px solid #000",
							padding: "8px",
							borderRadius: "4px",
							minHeight: "120px",
						})}
					/>
				</label>

				<button
					type="submit"
					className={css({
						padding: "10px 16px",
						background: "#333",
						color: "white",
						borderRadius: "4px",
						cursor: "pointer",
						_hover: { background: "#555" },
					})}
				>
					質問を投稿
				</button>
			</form>
		</div>
	);
}
