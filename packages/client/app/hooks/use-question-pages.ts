import { useCallback, useState } from "react";
import { serverFetch } from "~/utils/fetch";
import type { Answer } from "../types/answer";
import type { Question } from "../types/question";

export function useQuestionPage(questionId: string | undefined) {
	const [question, setQuestion] = useState<Question | null>(null);
	const [answers, setAnswers] = useState<Answer[]>([]);
	const [answerContent, setAnswerContent] = useState("");
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	const [error, setError] = useState<string | null>(null);
	const [answersError, setAnswersError] = useState<string | null>(null); // ←追加

	// 質問取得
	const fetchQuestion = useCallback(async () => {
		if (!questionId) return;

		try {
			const res = await serverFetch(`/questions/${questionId}`);
			if (!res.ok) throw new Error("Failed to fetch question");

			setQuestion(await res.json());
		} catch (err) {
			console.error(err);
			setError("質問の読み込みに失敗しました。");
		}
	}, [questionId]);

	// 回答取得
	const fetchAnswers = useCallback(async () => {
		if (!questionId) return;

		try {
			const res = await serverFetch(`/questions/${questionId}/answers`);
			if (!res.ok) throw new Error("Failed to fetch answers");

			setAnswers(await res.json());
			setAnswersError(null);
		} catch (err) {
			console.error(err);
			setAnswersError("回答の読み込みに失敗しました。");
		}
	}, [questionId]);

	// 初回ロード
	const fetchAll = useCallback(async () => {
		setLoading(true);
		setError(null);
		setAnswersError(null);

		await Promise.all([fetchQuestion(), fetchAnswers()]);

		setLoading(false);
	}, [fetchQuestion, fetchAnswers]);

	// 回答投稿
	const submitAnswer = useCallback(async () => {
		if (!questionId || !answerContent.trim()) return;
		setSubmitting(true);

		try {
			const res = await serverFetch(`/questions/${questionId}/answers`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: answerContent }),
			});

			if (!res.ok) throw new Error("回答投稿に失敗しました");

			setAnswerContent("");
			await fetchAnswers();
		} catch (err) {
			console.error(err);
			setAnswersError("回答の投稿に失敗しました。");
		} finally {
			setSubmitting(false);
		}
	}, [questionId, answerContent, fetchAnswers]);

	return {
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
	};
}
