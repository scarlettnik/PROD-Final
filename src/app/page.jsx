"use client";

import React, { useState } from "react";
import Header from '@/components/Header';
import HabitTracker from "@/components/HabitTracker";
import Shop from "@/components/Shop";
import Statistic from "@/components/Statistic";
import Groups from "@/components/Groups";
import Maraphones from "@/components/Maraphones";
import useAuthentication from "../hooks/useAuthentication";


export default function Home() {
  useAuthentication();
  const [view, setView] = useState("habittracker");
  return (
    <>
      <Header view={view} setView={setView} />
      {view === "habittracker" && <HabitTracker setView={setView} />}
      {view === "shop" && <Shop setView={setView} />}
      {view === "statistic" && <Statistic setView={setView} />}
      {view === "groups" && <Groups setView={setView} />}
      {view === "maraphones" && <Maraphones setView={setView} />}
    </>
  );
}
