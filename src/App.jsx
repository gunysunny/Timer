import React, { useState, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

const BUFF_DURATION = 120;
const defaultMembers = [
  { name: "U1" }, // 이름도 짧게
  { name: "U2" },
  { name: "U3" },
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
      gap: "6px",
      marginBottom: "2px",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.85rem",
      height: 28,
    }}>
      <span style={{ width: 34, color: "black", textAlign: "center" }}>{name}</span>
      <span style={{
        width: 38,
        fontFamily: "monospace",
        fontSize: "0.95rem",
        color: "black",
        textAlign: "center"
      }}>{format(timeLeft)}</span>
      <button
        style={{
          padding: "0 8px",
          background: "#fff",
          color: "black",
          border: "1px solid #222",
          borderRadius: 4,
          fontWeight: 500,
          fontSize: "0.8rem",
          height: 20,
        }}
        onClick={onStart}
      >
        ▶
      </button>
      <span style={{
        color: "#444",
        fontSize: "0.78rem",
        textAlign: "center",
        width: 22,
        opacity: 0.75
      }}>{hotkey}</span>
    </div>
  );
}

export default function App() {
  const [members] = useState(defaultMembers);
  const [timers, setTimers] = useState(Array(members.length).fill(0));
  const timerRef = useRef();

  // 단축키(QWE)
  useHotkeys('q', () => handleStart(0), [timers]);
  useHotkeys('w', () => handleStart(1), [timers]);
  useHotkeys('e', () => handleStart(2), [timers]);

  React.useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimers(prev => prev.map(sec => (sec > 0 ? sec - 1 : 0)));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  function handleStart(idx) {
    setTimers(prev => prev.map((sec, i) => (i === idx ? BUFF_DURATION : sec)));
  }

  // 닫기 버튼(Electron 환경)
  function handleClose() {
    if (window.electronAPI && window.electronAPI.closeWindow) {
      window.electronAPI.closeWindow();
    }
  }

  return (
    <div
      style={{
        width: 170,
        minHeight: 100,
        overflow: "hidden",
        margin: 0,
        padding: "6px 6px 4px 6px",
        borderRadius: 10,
        background: "rgba(255,255,255,0.42)",
        textAlign: "center",
        boxShadow: "0 2px 8px #0001",
        userSelect: "none",
        position: "relative"
      }}
    >
      {/* 드래그 영역 */}
      <div
        style={{
          width: "100%",
          height: 18,
          position: "absolute",
          top: 0,
          left: 0,
          WebkitAppRegion: "drag",
          zIndex: 0,
          background: "transparent",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      ></div>
      {/* 닫기 버튼 */}
      <button
        style={{
          position: "absolute",
          top: 2,
          right: 4,
          background: "#ff4444",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 18,
          height: 18,
          fontWeight: 700,
          fontSize: 13,
          cursor: "pointer",
          zIndex: 10,
          lineHeight: "18px",
          padding: 0,
          WebkitAppRegion: "no-drag",
        }}
        onClick={handleClose}
        title="닫기"
      >×</button>
      {/* 타이머 리스트 */}
      <div style={{ marginTop: 12 }}>
        {members.map((m, idx) => (
          <BuffTimer
            key={m.name}
            name={m.name}
            timeLeft={timers[idx]}
            onStart={() => handleStart(idx)}
            hotkey={["Q", "W", "E"][idx]}
          />
        ))}
      </div>
    </div>
  );
}