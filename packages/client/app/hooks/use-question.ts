import { usePost } from "~/hooks/use-post";
import type { CreateQuestionParams } from "~/types/question";

export function usePostQuestion() {
	const { post } = usePost();

	const postQuestion = async (params: CreateQuestionParams) => {
		return await post("/questions", params);
	};

	return { postQuestion };
}
