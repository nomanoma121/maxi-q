import { useRef, useState } from "react";
import { css } from "styled-system/css";
import { usePostQuestion } from "../hooks/use-question";

export default function QuestionsPage() {
	const formRef = useRef<HTMLFormElement>(null);
	const { postQuestion } = usePostQuestion();

	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (isSubmitting) return;

		const formData = new FormData(e.currentTarget);
		const title = formData.get("title");
		const content = formData.get("content");

		if (typeof title !== "string" || typeof content !== "string") return;

		setIsSubmitting(true);

		try {
			const newQuestion = await postQuestion({ title, content });

			console.log("Question created!", newQuestion);

			formRef.current?.reset();
		} catch (err) {
			console.error("質問投稿に失敗しました", err);
		} finally {
			setIsSubmitting(false);
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
			<h1 className={css({ fontSize: "24px", marginBottom: "16px" })}>質問投稿</h1>

			<form
				ref={formRef}
				onSubmit={handleSubmit}
				className={css({ display: "flex", flexDirection: "column", gap: "16px" })}
			>
				<label
					className={css({ display: "flex", flexDirection: "column", gap: "4px" })}
				>
					タイトル:
					<input
						type="text"
						name="title"
						required
						maxLength={100}
						className={css({ border: "1px solid #000", padding: "8px", borderRadius: "4px" })}
					/>
				</label>

				<label
					htmlFor="content"
					className={css({ display: "flex", flexDirection: "column", gap: "4px" })}
				>
					内容:
					<textarea
						id="content"
						name="content"
						required
						maxLength={5000}
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
					disabled={isSubmitting}
					className={css({
						padding: "10px 16px",
						background: isSubmitting ? "#999" : "#333",
						color: "white",
						borderRadius: "4px",
						cursor: isSubmitting ? "not-allowed" : "pointer",
						_hover: { background: isSubmitting ? "#999" : "#555" },
					})}
				>
					{isSubmitting ? "投稿中..." : "質問を投稿"}
				</button>
			</form>
		</div>
	);
}
