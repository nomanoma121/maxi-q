export type CreateAnswerParams = {
	content: string;
};

export type Answer = {
	id: string;
	questionId: string;
	content: string;
	answeredAt: string;
	updatedAt: string;
};
