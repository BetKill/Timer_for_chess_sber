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
  winner: null
};

const reducer = (state: any, action: any) => {
  console.log(action);
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
  const [character, setCharacter] = useState('sber' as CharacterId);
  const assistantStateRef = useRef<AssistantAppState>({});
  const assistantRef = useRef<ReturnType<typeof createAssistant>>();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initializeAssistant = () => {
      return createAssistant({
        getState: () => assistantStateRef.current,
      });

      // return createSmartappDebugger({
      //     token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJjODBiNjU3My1lNmNkLTRmNjEtYmZkOS01ZDY5ZTg2MWU4ODQiLCJzdWIiOiI0ZjQ2MzcyZDQ5MzAxZTkyOTU4ZTAwMDUyZmU5YmFkYjQyNjI4MjJjMDgxZGVkZGFjMmUzNWU3YzYwZmZiOWRhNTM5YmU5MjcwMDQyNjI5OCIsImlzcyI6IktFWU1BU1RFUiIsImV4cCI6MTY4NTQ0MDg0MCwiYXVkIjoiVlBTIiwiaWF0IjoxNjg1MzU0NDMwLCJ0eXBlIjoiQmVhcmVyIiwic2lkIjoiYWZkNmRhNTQtMTMzZC00NTM0LWJiMGUtMmI5NjM2ZGExYWIzIn0.ANhJEbWKQm_pt3yrri-nowD5aJXNq7E3IcfhVrEbo21iDQEatsAB3RlSM36b-senXBgecz6Z2Ks9NN6__eRaRkWRYduZoeg6KO-9OXUD18WTHckyalFF9BLypb5Lm0xJAffqof8u0v634Bbxlh-ETchp51LTxp-dCR5MAXSoRyrBCqen7COpokEUk6ID1GrQI8YCc8r9OW39Va8RLrbU8TSOiMWBJjQU0cHsYsZVwDBKuxLJ4ZmenE3h_nQjpkpUI9SaU_vDKPzfXVje2Vi88wWEw6yoEcupEmogcGAactVvtIqMtq4MVYSNEQYTMtyvZZ6b8WrzMbg2PoafjCmO4BmY5lFciM8Hf9IW3p9pxgs5-IigjRG4K1ipPtqg4A4MFx9Dpr8Wx8If-ZmxooczFcAmlomKnKQ054e8Q41CcvDx-yjjhDxvXpFcP5QlJro73u7iF84X76mw5h9lGaZz0IXWb6ERftHJlluEzSo4lZNowvV6oUcfZ67UKAi_pKoPI3Vcecr6ZPcmxMwflGoAorpSwe16BSeVK_X6h9xjq07zAkJvwbUZhUkEUa44Z6SRkgQGH8KFssoSTxaJK_Iddqkj-m23QmEUaPme2hxBQIdD_UHh4gUI6y_o8XPmhP2XpIVqTUoQuQ5f-5E9PhG0-V2oQ6s2VSkzTG0WafELtXA',
      //     initPhrase: 'Запусти таймер для шахмат',
      //     getState: () => assistantStateRef.current,
      //     nativePanel: {
      //         defaultText: 'Покажи что-нибудь',
      //         screenshotMode: false,
      //         tabIndex: -1,
      //     },
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
