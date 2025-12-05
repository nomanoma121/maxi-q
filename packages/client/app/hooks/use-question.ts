import type { CreateQuestionParams } from "~/types/question";
import { postFetch } from "~/utils/fetch";
import { useCallback, useState, useEffect } from "react";
import { serverFetch } from "~/utils/fetch";
import type { Question } from "../types/question";

export function usePostQuestion() {
  const postQuestion = async (params: CreateQuestionParams): Promise<Question> => {
    return await postFetch<Question>("/questions", params);
  };

  return { postQuestion };
}

export function useQuestion(questionId: string | undefined) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchQuestion = useCallback(async () => {
    if (!questionId) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await serverFetch(`/questions/${questionId}`);
      if (!res.ok) throw new Error("Failed to fetch question");

      setQuestion(await res.json());
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, [questionId]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  return { question, isLoading, error, refetch: fetchQuestion };
}
