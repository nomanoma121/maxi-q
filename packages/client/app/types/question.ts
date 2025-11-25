export type CreateQuestionParams = {
	title: string;
	content: string;
};

export type Question = {
	id: string;
	title: string;
	content: string;
	createdAt: string;
};
