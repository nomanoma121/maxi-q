export type CreateUserParams = {
	displayId: string;
	name: string;
	email: string;
	password: string;
};

export type User = {
	id: string;
	displayId: string;
	name: string;
	email: string;
	createdAt: Date;
};
