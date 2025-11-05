import { css } from "styled-system/css";

// export function meta({}: Route.MetaArgs) {
//   return [
//     { title: "New React Router App" },
//     { name: "description", content: "Welcome to React Router!" },
//   ];
// }

export default function Home() {
  return <div>
    <p className={css({
      fontSize: "20px",
      fontWeight: "bold",
      color: "blue.500",
    })}>Welcome to the Home Page!</p>
  </div>
}
