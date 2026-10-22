import axios from 'axios'
import { createContext, useEffect, useState } from 'react'

const host = "http://localhost:7002"

export const MyContainer = createContext()

export default function MyContext({ children }) {
  const [user, setUser] = useState(null)
  const getUser = async () => {
    const token = localStorage.getItem("UserToken")
    if (!token) {
      setUser(null)
      return
    }
    try {
      const res = await axios.get(`${host}/User/ViewUser`, {
        headers: { "auth-token": token }
      })
      console.log("Fetched user:", res.data.User)
      setUser(res.data.User)
    } catch (err) {
      console.log("Error fetching user:", err)
    }
  }
  useEffect(() => {
    getUser()
  }, [])

  return (
    <MyContainer.Provider value={{ user, setUser, getUser }}>
      {children}
    </MyContainer.Provider>
  )
}
