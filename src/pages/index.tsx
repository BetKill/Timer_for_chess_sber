import React, { useReducer, useEffect, useState, useRef } from "react";
import StartMenu from '../components/StartMenu.jsx';
import ResultMenu from '../components/ResultMenu.jsx';
import styles from '../styles/Index.module.css'
import {
  AssistantAppState,
  AssistantClientCommand,
  createAssistant,
  createSmartappDebugger,
  CharacterId
} from '@salutejs/client'


const initialState = {
  topTimer: 10,
  bottomTimer: 10,
  isTopTimerRunning: false,
  isBottomTimerRunning: false,
  startMenu: true,
  winner: null,
  screen: 'Start'
};


const Timer = (props: any) => {
  const { timerName, time, isMirrored, handleStart, color } = props;
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
    backgroundColor: `${color}`,
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
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

  const reducer = (state: any, action: any) => {
    switch (action.type) {
      case "SETTIME":
        if (state.screen === 'Start') {
          return {
            ...state,
            topTimer: action.time,
            bottomTimer: action.time,
            startMenu: false,
            screen: 'Middle'
          }
        }
        else {
          return state;
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
          assistantRef.current?.sendAction({ type: "result", payload: { "winner": state.topTimer === 0 ? 'Победил розовый' : 'Победил голубой' } })
          return {
            ...state,
            resultMenu: true,
            isTopTimerRunning: false,
            isBottomTimerRunning: false,
            winner: action.winner,
            screen: "END"
          }
        }
        return state;
      case 'HELP':
        assistantRef.current?.sendAction({ type: "help", payload: { "screen": state.screen } })
        return state;
      case 'MOVE':
        if (state.isBottomTimerRunning) {
          return {
            ...state,
            isBottomTimerRunning: false,
            isTopTimerRunning: true,
          }
        }
        else {
          return {
            ...state,
            isBottomTimerRunning: true,
            isTopTimerRunning: false,
          }
        }
      default:
        return state;
    }
  };

  const [character, setCharacter] = useState('sber' as CharacterId);
  const assistantStateRef = useRef<AssistantAppState>({});
  const assistantRef = useRef<ReturnType<typeof createAssistant>>();
  const [portrait, setIsPortrait] = useState(false)
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initializeAssistant = () => {
      return createAssistant({
        getState: () => assistantStateRef.current,
      });

      // return createSmartappDebugger({
      //   token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI1YWQ5YTRkZC0zNDJhLTQ0YmMtYTcyYi0zMzU3MTU4NzYxN2EiLCJzdWIiOiI0ZjQ2MzcyZDQ5MzAxZTkyOTU4ZTAwMDUyZmU5YmFkYjQyNjI4MjJjMDgxZGVkZGFjMmUzNWU3YzYwZmZiOWRhNTM5YmU5MjcwMDQyNjI5OCIsImlzcyI6IktFWU1BU1RFUiIsImV4cCI6MTY4NjE1MTcxNiwiYXVkIjoiVlBTIiwiaWF0IjoxNjg2MDY1MzA2LCJ0eXBlIjoiQmVhcmVyIiwic2lkIjoiMDNjNDVlYTUtMGJmZi00OTY4LTk2NDMtMDAwOWRmMGI2NjhmIn0.tV4EjopDrf1PNqCP4iPjIYrmOjpTzH_h7f-jtk_ZrVQZfCKy_7EIC5mQswYK-0j_zDIkRIxhQ9QLrOD7Mvw4zF2A608mPEdydaBkzJpV-86KmzNSmKyQYjhs1O7CDQ7lhTA7zEe_s1jKeaNhq9q1qyvsvD5BuJI4l2d8KRJqKPMd6R1ABM3ytGZy7H1AMhT_eqPX5oE14p0gJKORn-8UXkSLHAjxddLJYX-vbgsuVe4bAtczPWsMTazuJBzaLh3wz9eVR4LEX9b99bona6kgwox2ombY5dnFilyzR0wn7LEuWsPZnSPPJRiX6_VA5gNVtUiuEas05BgxfHAG9i4lc3sFnaBHlH1zLK9NdPV6uTgDV5FqJTzdjKIoqmCyH_8doUnAyMnQvvZpIHNCX8ReuYDN8fXmzZJx-bCjP9GfMFnj2JP0_aA01DkNx9Fs8nfzKv_hPdcp0MmJweOXcKA9qIO4wfTyOLYDVvJh-rVc9OUaiMfkRXD8wM0h2jwnF_ul_FPahNTC218mtDLyNyYChbm_sCgtkBjgaxJXFA0KseaRQ6gDLtYx8XY_nTCCLg4rcV7qUB2a0lMurJBVqrZ-KYZwyfqO0lnVmr7Vp08t1IDJsUpMnvStt9G3NjLF0MTOtf1u34JJybEqOxu29lu-tC3dOpo0xRGlVgAWj7twmUo',
      //   initPhrase: 'Запусти Таймер для шахмат',
      //   getState: () => assistantStateRef.current,
      //   surface: "STARGATE"
      // });
    };

    const assistant = initializeAssistant();
    assistant.on('data', (command: AssistantClientCommand) => {
      switch (command.type) {
        case 'smart_app_data':
          dispatch(command.smart_app_data)
          break;
        case 'character':
          setCharacter(command.character.id);
          break;
        default:
          break;
      }
    });
    assistantRef.current = assistant;
  }, []);

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
      const winner = state.topTimer === 0 ? 'Победил розовый' : 'Победил голубой'
      dispatch({ type: "RESULT", winner: winner })
    }
  }, [state.topTimer, state.bottomTimer])

  const checkOrientation = () => {
    if (window.matchMedia("(orientation: landscape)").matches) {
      setIsPortrait(false)
    }
    else {
      setIsPortrait(true)
    }
  };

  useEffect(() => {
    window.addEventListener("resize", checkOrientation, false);
  }, []);

  const handleStart = (timer: any) => {
    dispatch({ type: "START", timer: timer });
  };

  const handleReset = () => {
    dispatch({ type: "RESET" });
  };

  const hanleSetTime = (time: any) => {
    dispatch({ type: "SETTIME", time: time });
  }

  const handleHelp = () => {
    assistantRef.current?.sendAction({ type: "help", payload: { "screen": state.screen } })
  }

  return (
    <div className={styles.container}>
      {state.startMenu && <StartMenu hanleSetTime={hanleSetTime} />}
      {state.winner && <ResultMenu handleReset={handleReset} winner={state.winner} />}
      <div className={styles['timer-wrapper']}>
        <Timer timerName="top" time={state.topTimer} isMirrored={portrait} handleStart={handleStart} color={"#33cdc7"} />
      </div>
      <div className={styles.buttonContainer}>
        <button onClick={handleReset} className={styles.resetButton}>
          <img className={styles.icon} src="./restart.svg" alt="Restart" />
        </button>
        <button onClick={handleHelp} className={styles.resetButton}>
          <img className={styles.icon} src="./question.svg" alt="Help" />
        </button>
      </div>
      <div className={styles['timer-wrapper']}>
        <Timer timerName="bottom" time={state.bottomTimer} handleStart={handleStart} color={"#e567b1b3"} />
      </div>
    </div>
  );
};

export default ChessTimer;
