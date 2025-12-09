import { useState } from "react";
import { css } from "styled-system/css";
import type { User } from "~/types/user";

// export function meta({}: Route.MetaArgs) {
//   return [
//     { title: "New React Router App" },
//     { name: "description", content: "Welcome to React Router!" },
//   ];
// }

export default function Home() {
	const [users, _setUsers] = useState<User[]>([]);

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
