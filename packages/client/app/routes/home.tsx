import { useCallback, useEffect, useState } from "react";
import { css } from "styled-system/css";
import type { CreateUserParams, User } from "~/types/user";
import { serverFetch } from "~/utils/fetch";

// export function meta({}: Route.MetaArgs) {
//   return [
//     { title: "New React Router App" },
//     { name: "description", content: "Welcome to React Router!" },
//   ];
// }

export default function Home() {
	const [users, setUsers] = useState<User[]>([]);
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
			const response = await serverFetch("/api/register", {
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
		<div>
			<p
				className={css({
					fontSize: "20px",
					fontWeight: "bold",
					color: "blue.500",
				})}
			>
				Welcome to the Home Page!
			</p>
			{/* User Create Form */}
			<div>
				<h2>Create User</h2>
				<form
					onSubmit={(e) => handleSubmit(e)}
					className={css({
						display: "flex",
						flexDirection: "column",
						gap: "8px",
						maxWidth: "300px",
					})}
				>
					<input
						type="text"
						name="displayId"
						placeholder="Display ID"
						required
						className={css({
							padding: "8px",
							borderRadius: "4px",
							border: "1px solid #ccc",
						})}
					/>
					<input
						type="text"
						name="name"
						placeholder="Name"
						required
						className={css({
							padding: "8px",
							borderRadius: "4px",
							border: "1px solid #ccc",
						})}
					/>
					<input
						type="email"
						name="email"
						placeholder="Email"
						required
						className={css({
							padding: "8px",
							borderRadius: "4px",
							border: "1px solid #ccc",
						})}
					/>
					<input
						type="password"
						name="password"
						placeholder="Password"
						required
						className={css({
							padding: "8px",
							borderRadius: "4px",
							border: "1px solid #ccc",
						})}
					/>
					<button
						type="submit"
						className={css({
							padding: "10px",
							borderRadius: "4px",
							border: "none",
							backgroundColor: "blue.500",
							color: "white",
							cursor: "pointer",
						})}
					>
						Create User
					</button>
				</form>
			</div>

			<h2>User List</h2>
			<ul>
				{users.map((user) => (
					<li key={user.id}>
						{user.displayId} - {user.name} - {user.email}
					</li>
				))}
			</ul>
		</div>
	);
}
