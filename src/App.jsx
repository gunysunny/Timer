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
      justifyContent: "center"
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

  // 단축키 설정 (Q/W/E 예시)
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

  // 닫기 버튼 기능(Electron 환경에서만 동작)
  function handleClose() {
    if (window.electronAPI && window.electronAPI.closeWindow) {
      window.electronAPI.closeWindow();
    }
  }

  return (
    <div
      style={{
        maxWidth: 350,
        margin: "40px auto",
        padding: 20,
        borderRadius: 16,
        background: "rgba(255,255,255,0.80)", // 반투명 흰색
        textAlign: "center",
        boxShadow: "0 2px 12px #0002",
        userSelect: "none",
        position: "relative"
      }}
    >
      {/* 드래그 가능한 타이틀 바 */}
      <div
        style={{
          width: "100%",
          height: 30,
          position: "absolute",
          top: 0,
          left: 0,
          WebkitAppRegion: "drag",
          zIndex: 0,
          background: "transparent",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      ></div>
      {/* 닫기 버튼 */}
      <button
        style={{
          position: "absolute",
          top: 6,
          right: 12,
          background: "#ff4444",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: 26,
          height: 26,
          fontWeight: "bold",
          fontSize: 18,
          cursor: "pointer",
          zIndex: 10,
          WebkitAppRegion: "no-drag", // 닫기버튼은 드래그 불가
        }}
        onClick={handleClose}
        title="닫기"
      >×</button>

      {/* 메인 타이틀 */}
      <h1 style={{
        fontSize: "1.4rem",
        fontWeight: "bold",
        marginBottom: 20,
        color: "black",
        textAlign: "center",
        marginTop: 16,
        letterSpacing: "1px"
      }}>
        파티 버프 타이머
      </h1>

      {/* 버프 타이머 리스트 */}
      {members.map((m, idx) => (
        <BuffTimer
          key={m.name}
          name={m.name}
          timeLeft={timers[idx]}
          onStart={() => handleStart(idx)}
          hotkey={["Q", "W", "E"][idx]}
        />
      ))}

      <div style={{
        marginTop: 16,
        fontSize: "0.97rem",
        color: "black",
        textAlign: "center"
      }}>
        각 파티원에 버프를 사용하면 <b>버프시작</b> 버튼 또는 <b>Q/W/E</b> 단축키로 타이머를 시작하세요.<br />
        (버프 유지시간: {BUFF_DURATION / 60}분)
      </div>
    </div>
  );
}