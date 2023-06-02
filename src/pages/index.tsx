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
  const [character, setCharacter] = useState('sber' as CharacterId);
  const assistantStateRef = useRef<AssistantAppState>({});
  const assistantRef = useRef<ReturnType<typeof createAssistant>>();

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
          assistantRef.current?.sendAction({ type: "result", payload: { "winner": state.topTimer === 0 ? "Победили верхние" : "Победили нижние" } })
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

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initializeAssistant = () => {
      // return createAssistant({
      //   getState: () => assistantStateRef.current,
      // });

      return createSmartappDebugger({
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI2NDEwM2Q3NC0wM2RmLTQyZTYtOTgyMy0xMzZhYTI0OGY0NjAiLCJzdWIiOiI0ZjQ2MzcyZDQ5MzAxZTkyOTU4ZTAwMDUyZmU5YmFkYjQyNjI4MjJjMDgxZGVkZGFjMmUzNWU3YzYwZmZiOWRhNTM5YmU5MjcwMDQyNjI5OCIsImlzcyI6IktFWU1BU1RFUiIsImV4cCI6MTY4NTgxNjg0NywiYXVkIjoiVlBTIiwiaWF0IjoxNjg1NzMwNDM3LCJ0eXBlIjoiQmVhcmVyIiwic2lkIjoiYjE5NTkyYWUtNmNhZC00ZGY0LTg2MTktYTMxM2JjYmVlYjM3In0.LbWRAzXT6h7nXXt11dfcOgTKRZJPBi6y2u993mrxP4YSG4l9sNzHC8EOOqKCQdw_OFwPUwh0m3_DpV1B92Fcxj9ghnY8pVI-A-R2YppMDwQzayhf80_u_JzWJNi7J0uVC_JChdEVsrpSK8--3rbCRGHUNzd6g938Yyd9Qayvd-2fI014d6Gfa9vvRpyPPjTJwee3ru81F0-NjpLi58m2K88JwmYZ_ufqAR9EGYrbwSWoYWjlb6EbYFrPpsRfUDRaoteRRhL3JD1uSejUfLPcG1DrD8NvlfkJIAcAvtBGALOGeaI47XTqgzUcNRg-zCQYU9MU388q_aVLD8LPR9kwiymfKTv2ZLIwBP1O6sCcMreWMs3iRAVMDRKC2bWFM0JW8qgx-1qSrQgYKJgG8Nc3ho89KXVzpW0pb6R1BdkCa1Mwr5zlqf1N7gp2TFrzAm9eAPY8x68nFLIR3X2RsQAtquNMw8qFI_AWJn8ThQNgmN1uju2eAR_9m7tMu-oKsz3cQjA-cwUEK-Pd6SVRo6Qh0Mb8n11YfnJ21Dfng3pqvFDYUJraMmhNXDOyAuLW6Xe593EM7-dqj6jqrhBydM73YT8GVgKlSYeQ9DfNCs8ZQSw2bHYMsuHfXy_ifkW9VU9wB8HFHpDmvekPjdo1uu3jk48SO-0LP4zpBwz8ysh6Tjk',
        initPhrase: 'Запусти таймер для шахмат',
        getState: () => assistantStateRef.current,
        nativePanel: {
          defaultText: 'Покажи что-нибудь',
          screenshotMode: false,
          tabIndex: -1,
        },
      });
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
      const winner = state.topTimer === 0 ? 'Победили верхние' : 'Победили нижние'
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

  const handleHelp = () => {
    assistantRef.current?.sendAction({ type: "help", payload: { "screen": state.screen } })
  }

  return (
    <div className={styles.container}>
      {state.startMenu && <StartMenu hanleSetTime={hanleSetTime} />}
      {state.winner && <ResultMenu handleReset={handleReset} winner={state.winner} />}
      <div className={styles['timer-wrapper']}>
        <Timer timerName="top" time={state.topTimer} isMirrored={true} handleStart={handleStart} color={"#33cdc7"} />
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
