import type { CreateAnswerParams } from "~/types/answer";
import { postFetch } from "~/utils/fetch";
import type { Answer } from "~/types/answer";
import { useCallback, useState, useEffect } from "react";
import { serverFetch } from "~/utils/fetch";

export function usePostAnswer() {
  const postAnswer = async (questionId: string, params: CreateAnswerParams): Promise<Answer> => {
    return await postFetch<Answer>(`/questions/${questionId}/answers`, params);
  };

  return { postAnswer };
}

export function useAnswers(questionId?: string) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { postAnswer } = usePostAnswer();

  // 回答取得
  const fetchAnswers = useCallback(async () => {
    if (!questionId) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await serverFetch(`/questions/${questionId}/answers`);
      if (!res.ok) throw new Error("Failed to fetch answers");

      setAnswers(await res.json());
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, [questionId]);

  // 回答投稿
  const submitAnswer = useCallback(
    async (content: string) => {
      if (!questionId || !content.trim()) return;
      setIsPending(true);
      setError(null);

      try {
        await postAnswer(questionId, { content });
        await fetchAnswers();
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsPending(false);
      }
    },
    [questionId, fetchAnswers, postAnswer]
  );

  useEffect(() => {
    fetchAnswers();
  }, [fetchAnswers]);

  return { answers, isLoading, error, isPending, submitAnswer, refetch: fetchAnswers };
}