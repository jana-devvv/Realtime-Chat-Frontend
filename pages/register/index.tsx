import React, { useContext, useEffect, useState } from "react";
import { API_URL } from "../../constants";
import { useRouter } from "next/router";
import { AuthContext } from "../../modules/auth_provider";

const index = () => {
    const [username, setUsername] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { authenticated } = useContext(AuthContext)

  const router = useRouter()

  useEffect(() => {
    if(authenticated) {
      router.push('/')
      return
    }
  }, [authenticated])

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, email, password}),
      }) 

      router.push('/login')
      return 
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex items-center justify-center min-w-full min-h-screen">
      <form className="flex flex-col md:w-1/5">
        <div className="text-3xl font-bold text-center">
          <span className="text-blue-400">
            WELCOME TO <b className="text-black">JD</b>CHAT
          </span>
        </div>
        <input
          type="text"
          placeholder="Your username"
          className="p-3 mt-8 rounded-md border-2 border-gray-200 focus:outline-none focus:border-blue-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Your email"
          className="p-3 mt-8 rounded-md border-2 border-gray-200 focus:outline-none focus:border-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Your password"
          className="p-3 mt-8 rounded-md border-2 border-gray-200 focus:outline-none focus:border-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="p-3 mt-6 rounded-md bg-blue-500 font-bold text-white" type="submit" onClick={submitHandler}>
          Register
        </button>
      </form>
    </div>
  );
};

export default index;
