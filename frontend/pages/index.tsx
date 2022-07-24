import type { NextPage } from "next";

import { request } from "graphql-request";
import { useState } from "react";
import jwt from "jsonwebtoken";

interface IUser {
  username: string;
  email: string;
}
const qlEndpoint = "http://localhost:3000/graphql";

const Home: NextPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [inputUsername, setInputUsername] = useState<string>("");
  const [newUsername, setNewUsername] = useState<string>("");
  async function fetchUsers() {
    const query = `
      query {
        Users {
          username
          email
        }
      }
    `;
    const res = await request(qlEndpoint, query);
    setUsers(res.Users);
  }
  async function updateUsername(inputUsername: string, newUsername: string) {
    const query = `
      mutation {
        UpdateUsername(username: "${inputUsername}", newUsername: "${newUsername}") {
          username
          email
        }
      }
    `;
    const token = jwt.sign(
      {
        username: "frontend-admin",
        role: "admin",
      },
      "colorfulLife"
    );
    const res = await request(qlEndpoint, query, undefined, {
      Authorization: token,
    });
    console.log(res.UpdateUsername);
    setUsers(res.UpdateUsername);
  }
  return (
    <>
      <h1>Fetch user section</h1>
      <button onClick={() => fetchUsers()}>Fetch users</button>
      <div>
        {users.map((user, key) => (
          <div key={key}>
            {user.username} {user.email}
          </div>
        ))}
      </div>
      <hr></hr>
      <h1>Update username</h1>
      <input
        type="text"
        onChange={(evt) => setInputUsername(evt.target.value)}
        value={inputUsername}
        placeholder="current username"
      />
      <input
        type="text"
        onChange={(evt) => setNewUsername(evt.target.value)}
        placeholder="new username"
      />
      <button onClick={() => updateUsername(inputUsername, newUsername)}>
        Submit
      </button>
    </>
  );
};

export default Home;
