import { useCallback, useEffect, useState } from "react";
import { css } from "styled-system/css";
import type { CreateUserParams, User } from "~/types/user";
import { serverFetch } from "~/utils/fetch";

export default function RegisterPage() {
	const [_users, setUsers] = useState<User[]>([]);
	const fetchUsers = useCallback(async () => {
		try {
			const response = await serverFetch("/users");
			if (!response.ok) {
				throw new Error("Failed to fetch users");
			}
			const users = await response.json();
			setUsers(users);
		} catch (error) {
			console.error("Error fetching users:", error);
		}
	}, []);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const userParams: CreateUserParams = {
			displayId: formData.get("displayId") as string,
			name: formData.get("name") as string,
			email: formData.get("email") as string,
			password: formData.get("password") as string,
		};

		try {
			const response = await serverFetch("/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userParams),
			});
			if (!response.ok) {
				throw new Error("Failed to create user");
			}
			const newUser = await response.json();
			console.log("User created:", newUser);
			await fetchUsers();
		} catch (error) {
			console.error("Error creating user:", error);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	return (
		<div className={css({})}>
			<div
				className={css({
					margin: "100px auto",
					maxWidth: "700px",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					gap: "40px",
				})}
			>
				<form
					onSubmit={(e) => handleSubmit(e)}
					className={css({
						display: "flex",
						flexDirection: "column",
						gap: "8px",
						width: "400px",
					})}
				>
					<h2
						className={css({
							fontSize: "30px",
							fontWeight: "bold",
							textAlign: "center",
						})}
					>
						新規作成
					</h2>
					<div>ユーザーID</div>
					<input
						type="text"
						name="displayId"
						required
						className={css({
							padding: "8px",
							borderRadius: "4px",
							border: "1px solid #ccc",
						})}
					/>
					<div>氏名</div>
					<input
						type="text"
						name="name"
						required
						className={css({
							padding: "8px",
							borderRadius: "4px",
							border: "1px solid #ccc",
						})}
					/>
					<div>メールアドレス</div>
					<input
						type="email"
						name="email"
						placeholder="example@example.com"
						required
						className={css({
							padding: "8px",
							borderRadius: "4px",
							border: "1px solid #ccc",
						})}
					/>
					<div>パスワード</div>
					<input
						type="password"
						name="password"
						required
						className={css({
							padding: "8px",
							borderRadius: "4px",
							border: "1px solid #ccc",
						})}
					/>
				</form>
				<button
					type="submit"
					className={css({
						width: "400px",
						padding: "10px",
						borderRadius: "4px",
						border: "none",
						backgroundColor: "green.500",
						color: "white",
						cursor: "pointer",
					})}
				>
					作成
				</button>
			</div>
		</div>
	);
}
