import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { css } from "styled-system/css";
import type { Answer } from "~/types/answer";
import type { Question } from "~/types/question";
import { serverFetch } from "~/utils/fetch";
import ErrorMessage from "../../components/ErrorMessage";
import { usePost } from "../../hooks/use-post";

export default function PostDetail() {
	const { id } = useParams();
	const [question, setQuestion] = useState<Question | null>(null);
	const [answers, setAnswers] = useState<Answer[]>([]);
	const [answerContent, setAnswerContent] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { post } = usePost();

	// 質問取得
	const fetchQuestion = useCallback(async () => {
		if (!id) return;

		try {
			const res = await serverFetch(`/questions/${id}`);
			if (!res.ok) throw new Error("Failed to fetch question");
			setQuestion(await res.json());
		} catch (e) {
			console.error(e);
			setError("質問の取得に失敗しました。");
		}
	}, [id]);

	// 回答取得
	const fetchAnswers = useCallback(async () => {
		if (!id) return;

		try {
			const res = await serverFetch(`/questions/${id}/answers`);
			if (!res.ok) throw new Error("Failed to fetch answers");
			setAnswers(await res.json());
		} catch (e) {
			console.error(e);
			setError("回答一覧の取得に失敗しました。");
		}
	}, [id]);

	// 初期ロード
	useEffect(() => {
		setError(null);
		fetchQuestion();
		fetchAnswers();
	}, [fetchQuestion, fetchAnswers]);

	// 回答投稿
	const submitAnswer = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!answerContent.trim()) return;

		setSubmitting(true);
		setError(null);

		const { ok } = await post(`/questions/${id}/answers`, {
			content: answerContent,
		});

		if (ok) {
			setAnswerContent("");
			await fetchAnswers();
		} else {
			setError("回答の投稿に失敗しました。");
		}

		setSubmitting(false);
	};

	if (!id) {
		return <ErrorMessage message="エラー: 投稿IDが指定されていません。" />;
	}

	// エラー UI
	if (error) {
		return (
			<ErrorMessage message={error} onRetry={() => window.location.reload()} />
		);
	}

	return (
		<div
			className={css({
				maxWidth: "800px",
				margin: "0 auto",
				padding: "16px",
			})}
		>
			{question && (
				<div
					className={css({
						padding: "16px",
						borderRadius: "8px",
						border: "1px solid #ddd",
						marginBottom: "20px",
					})}
				>
					<h1
						className={css({
							fontSize: "24px",
							fontWeight: "bold",
							marginBottom: "8px",
						})}
					>
						{question.title}
					</h1>

					<p
						className={css({
							fontSize: "16px",
							lineHeight: "1.6",
						})}
					>
						{question.content}
					</p>
				</div>
			)}

			<h2
				className={css({
					fontSize: "20px",
					marginBottom: "8px",
				})}
			>
				Answers
			</h2>

			<div
				className={css({
					display: "flex",
					flexDirection: "column",
					gap: "12px",
					marginBottom: "24px",
				})}
			>
				{answers.length === 0 ? (
					<p>No answers yet.</p>
				) : (
					answers.map((ans) => (
						<div
							key={ans.id}
							className={css({
								padding: "12px",
								border: "1px solid #ddd",
								borderRadius: "6px",
							})}
						>
							<p>{ans.content}</p>
							<p
								className={css({
									fontSize: "12px",
									color: "gray",
									marginTop: "4px",
								})}
							>
								{new Date(ans.answeredAt).toLocaleString()}
							</p>
						</div>
					))
				)}
			</div>

			<form
				onSubmit={submitAnswer}
				className={css({
					display: "flex",
					flexDirection: "column",
					gap: "12px",
				})}
			>
				<label
					htmlFor="answer"
					className={css({
						fontWeight: "bold",
						fontSize: "14px",
					})}
				>
					あなたの回答
				</label>

				<textarea
					id="answer" // ← label と紐付け
					className={css({
						padding: "12px",
						border: "1px solid #ccc",
						borderRadius: "6px",
						height: "120px",
						resize: "vertical",
					})}
					value={answerContent}
					onChange={(e) => setAnswerContent(e.target.value)}
					placeholder="Write your answer..."
				/>

				<button
					type="submit"
					disabled={submitting}
					aria-disabled={submitting}
					className={css({
						padding: "12px",
						backgroundColor: submitting ? "gray.400" : "blue.500",
						color: "white",
						borderRadius: "6px",
						cursor: submitting ? "not-allowed" : "pointer",
						fontSize: "16px",
						fontWeight: "bold",
					})}
				>
					{submitting ? "Posting..." : "Post Answer"}
				</button>
			</form>
		</div>
	);
}
