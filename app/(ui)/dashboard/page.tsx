"use client"
import React from "react"
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation"

const Dashboard = () => {
  const handleLogout = () => {
    signOut();
    redirect("/auth")
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Log out</button>
    </div>
  )
};

export default Dashboard