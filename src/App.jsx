import React, { useState, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

const BUFF_DURATION = 120;

const defaultMembers = [
  { name: "User1" },
  { name: "User2" },
  { name: "User3" },
];

function format(sec) {
  if (sec <= 0) return "00:00";
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function BuffTimer({ name, timeLeft, onStart, hotkey }) {
  return (
    <div style={{
      display: "flex",
      gap: "12px",
      marginBottom: "8px",
      alignItems: "center",
      justifyContent: "center" // 센터 정렬
    }}>
      <span style={{ width: 70, color: "black", textAlign: "center" }}>{name}</span>
      <span style={{
        width: 60,
        fontFamily: "monospace",
        fontSize: "1.2rem",
        color: "black",
        textAlign: "center"
      }}>{format(timeLeft)}</span>
      <button
        style={{
          padding: "4px 16px",
          background: "#fff",
          color: "black",
          border: "1.5px solid #222",
          borderRadius: 5,
          fontWeight: "bold"
        }}
        onClick={onStart}
      >
        버프시작
      </button>
      <span style={{ color: "black", fontSize: "0.95rem", textAlign: "center" }}>({hotkey})</span>
    </div>
  );
}

export default function App() {
  const [members] = useState(defaultMembers);
  const [timers, setTimers] = useState(Array(members.length).fill(0));
  const timerRef = useRef();

  useHotkeys('alt+1', () => handleStart(0), [timers]);
  useHotkeys('alt+2', () => handleStart(1), [timers]);
  useHotkeys('alt+3', () => handleStart(2), [timers]);

  React.useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimers(prev => prev.map(sec => (sec > 0 ? sec - 1 : 0)));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  function handleStart(idx) {
    setTimers(prev => prev.map((sec, i) => (i === idx ? BUFF_DURATION : sec)));
  }

  return (
    <div style={{
      maxWidth: 350,
      margin: "40px auto",
      padding: 20,
      borderRadius: 12,
      boxShadow: "0 2px 12px #0001",
      background: "white",
      textAlign: "center" // 전체 센터 정렬
    }}>
      
      {members.map((m, idx) => (
        <BuffTimer
          key={m.name}
          name={m.name}
          timeLeft={timers[idx]}
          onStart={() => handleStart(idx)}
          hotkey={`Alt+${idx + 1}`}
        />
      ))}
      <div style={{
        marginTop: 16,
        fontSize: "0.97rem",
        color: "black",
        textAlign: "center"
      }}>

        (버프 유지시간: {BUFF_DURATION / 60}분)
      </div>
    </div>
  );
}