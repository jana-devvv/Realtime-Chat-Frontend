import React, { useContext, useEffect, useState } from "react";
import { API_URL, WEBSOCKET_URL } from "../constants";
import { v4 as uuidv4 } from "uuid";
import { AuthContext } from "../modules/auth_provider";
import { WebsocketContext } from "../modules/websocket_provider";
import { useRouter } from "next/router";

const index = () => {
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [roomName, setRoomName] = useState("");
  const {user} = useContext(AuthContext)
  const {setConn} = useContext(WebsocketContext)

  const router = useRouter()

  const getRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/ws/getRooms`, {
        method: "GET"
      })

      const data = await res.json()
      if(res.ok) {
        setRooms(data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getRooms()
  }, [])

  const logoutHandler = async () => {
    try {
      const res = await fetch(`${API_URL}/logout`, {
        method: "GET",
      })

      if(res.ok) {
        localStorage.removeItem('user_info')
        router.push('/login')
        return
      }
    } catch (error) {
      console.log(error)
    }
  }

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    try {
      setRoomName("")
      const res = await fetch(`${API_URL}/ws/createRoom`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
          id: uuidv4(),
          name: roomName,
        })
      })

      if(res.ok) {
        getRooms()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const joinRoom = (roomId: string) => {
    const ws = new WebSocket(`${WEBSOCKET_URL}/ws/joinRoom/${roomId}?userId=${user.id}&username=${user.username}`)
    if(ws.OPEN) {
      setConn(ws)
      router.push('/app')
      return
    }
  }

  return (
    <div className="my-8 px-4 md:mx-32 w-full h-full">
      <div className="flex justify-center mt-3 p-5">
        <button className="bg-red-500 text-white rounded-md border p-2 md:mr-4" onClick={logoutHandler}>
          Logout
        </button>
        <input
          type="text"
          placeholder="Room Name"
          className="border border-gray-200 p-2 rounded-md focus:outline-none focus:border-blue-400"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button className="bg-blue-500 text-white rounded-md border p-2 md:ml-4" onClick={submitHandler}>
          Create
        </button>
      </div>
      <div className="mt-6">
        <div className="font-bold">Available Rooms</div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
          {rooms.map((room, index) => (
            <div
              key={index}
              className="border border-blue-400 p-4 flex items-center rounded-md w-full"
            >
              <div className="w-full">
                <div className="text-sm">Room</div>
                <div className="text-blue-500 font-bold text-lg">
                  {room.name}
                </div>
              </div>
              <div className="">
                <button className="px-4 text-white bg-blue-500 rounded-md" onClick={() => joinRoom(room.id)}>
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default index;
