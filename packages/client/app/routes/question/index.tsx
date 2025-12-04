import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { css } from "styled-system/css";
import { useQuestionPage } from "~/hooks/use-question-pages";
import ErrorMessage from "../../components/error-message";

export default function QuestionDetailPage() {
	const { id } = useParams();

	const {
		question,
		answers,
		answerContent,
		setAnswerContent,
		loading,
		submitting,
		error,
		answersError,
		fetchAll,
		submitAnswer,
	} = useQuestionPage(id);

	useEffect(() => {
		fetchAll();
	}, [fetchAll]);

	if (loading) return <div>Loading...</div>;

	// 質問取得のエラー
	if (error) return <ErrorMessage message={error} />;

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

			{answersError && (
				<div
					className={css({
						color: "red",
						marginBottom: "12px",
						fontSize: "14px",
					})}
				>
					{answersError}
				</div>
			)}

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
					id="answer"
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
