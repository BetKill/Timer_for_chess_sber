import React, { useReducer, useEffect } from "react";
import StartMenu from '../components/StartMenu.jsx';
import ResultMenu from '../components/ResultMenu.jsx';
import styles from '../styles/Index.module.css'


const initialState = {
  topTimer: 10,
  bottomTimer: 10,
  isTopTimerRunning: false,
  isBottomTimerRunning: false,
  startMenu: true,
  winner: null
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "SETTIME":
      return {
        ...state,
        topTimer: action.time,
        bottomTimer: action.time,
        startMenu: false,
      }
    case "START":
      if (action.timer === "top") {
        return { ...state, isBottomTimerRunning: true, isTopTimerRunning: false };
      } else {
        return { ...state, isTopTimerRunning: true, isBottomTimerRunning: false };
      }
    case "RESET":
      return { ...initialState };
    case "TICK":
      if (state.isTopTimerRunning > 0) {
        return {
          ...state,
          topTimer: state.topTimer > 0 ? state.topTimer - 1 : 0,
        };
      } else if (state.isBottomTimerRunning) {
        return {
          ...state,
          bottomTimer: state.bottomTimer > 0 ? state.bottomTimer - 1 : 0,
        };
      }
      return state;
    case 'RESULT':
      if (state.topTimer === 0 || state.bottomTimer === 0) {
        return {
          ...state,
          resultMenu: true,
          isTopTimerRunning: false,
          isBottomTimerRunning: false,
          winner: action.winner
        }
      }
      return state;
    default:
      return state;
  }
};

const Timer = (props: any) => {
  const { timerName, time, isMirrored, handleStart } = props;
  const formatTime = (time: any) => {
    const hours = Math.floor(time / 3600).toString().padStart(2, "0");
    const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    if (hours === "00") {
      return `${minutes}:${seconds}`
    }
    else
      return `${hours}:${minutes}:${seconds}`;
  };


  const timerStyle = {
    transform: isMirrored ? "rotate(180deg)" : "none",
    width: "100%",
    fontSize: "50px",
    fontWeight: "bold",
    backgroundColor: "#5F9EA0",
    // color: "white", ----------------------------------------------------------------
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    Color: "#BA553F"
  };

  const divStyle = {
    display: "flex",
    justifyContent: "center",
    height: "100%",
  }

  return (
    <div style={divStyle}>
      <button style={timerStyle} onClick={() => handleStart(timerName)}>{formatTime(time)}</button>
    </div>
  );
};

const ChessTimer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let timer: any;
    if (state.isTopTimerRunning || state.isBottomTimerRunning) {
      timer = setInterval(() => {
        dispatch({ type: "TICK" });
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [state.isTopTimerRunning, state.isBottomTimerRunning]);

  useEffect(() => {
    if (state.topTimer === 0 || state.bottomTimer === 0) {
      const winner = state.topTimer === 0 ? '1 Player' : '2 Player'
      dispatch({ type: "RESULT", winner: winner })
    }
  }, [state.topTimer, state.bottomTimer])

  const handleStart = (timer: any) => {
    dispatch({ type: "START", timer: timer });
  };

  const handleReset = () => {
    dispatch({ type: "RESET" });
  };

  const hanleSetTime = (time: any) => {
    dispatch({ type: "SETTIME", time: time });
  }

  return (
    <div className={styles.container}>
      {state.startMenu && <StartMenu hanleSetTime={hanleSetTime} />}
      {state.winner && <ResultMenu handleReset={handleReset} winner={state.winner} />}
      <div className={styles['timer-wrapper']}>
        <Timer timerName="top" time={state.topTimer} isMirrored={true} handleStart={handleStart} />
      </div>
      <div className={styles.buttonContainer}>
        <button onClick={handleReset} className={styles.resetButton}>
          <img className={styles.icon} src="./restart.svg" alt="Restart" />
        </button>
        <button className={styles.resetButton}>
          <img className={styles.icon} src="./question.svg" alt="Help" />
        </button>
      </div>
      <div className={styles['timer-wrapper']}>
        <Timer timerName="bottom" time={state.bottomTimer} handleStart={handleStart} />
      </div>
    </div>
  );
};

export default ChessTimer;
