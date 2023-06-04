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
          assistantRef.current?.sendAction({ type: "result", payload: { "winner": state.topTimer === 0 ?  'Победил розовый' : 'Победил голубой' } })
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
      return createAssistant({
        getState: () => assistantStateRef.current,
      });

      // return createSmartappDebugger({
      //   token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI3Nzk3MjU4MS02NDQ0LTQxOWEtOGQwMS1jZTcyZTUxMDJmYjMiLCJzdWIiOiI0ZjQ2MzcyZDQ5MzAxZTkyOTU4ZTAwMDUyZmU5YmFkYjQyNjI4MjJjMDgxZGVkZGFjMmUzNWU3YzYwZmZiOWRhNTM5YmU5MjcwMDQyNjI5OCIsImlzcyI6IktFWU1BU1RFUiIsImV4cCI6MTY4NTk2NjUyNCwiYXVkIjoiVlBTIiwiaWF0IjoxNjg1ODgwMTE0LCJ0eXBlIjoiQmVhcmVyIiwic2lkIjoiYjk0NDgxODgtZGQ3Yy00ZGM1LWFmMTUtNjQ1MDgyOWRiMDdkIn0.Rvop6NTT4dQAxQHXP29mJZeVc9RL1q8LHwhmitdfT1wMbB81iCFXIZbWrDTFJ2XmYWRtNwY-L4tYLWs-7QHMpu1USAPcT-FlmQsFl13vEgoPoJn4JSpnHapClCQpRR63SsVbtZ_jVj_LPy3iq4oam69rjvuTht4-w3a-qa_f7n5yP7SU-1AGggcEfRGyKSyfUlqRoemb7Lf4oF9B-ftt5BW0g5M_SHbZRUhWbVlNAKcz_rvNXk1VS6Pqi6VP6iEzLXRJbnJFVoEWzzp9OlheyzdzTvc-EMaibNummCRxwXCvyCOwO5welk49r4g3ypyc4rxOmMsYHFf6G0vYGsfWq-pJgIFVHtZIrht2uWX3dFQke2tBmi1GdevzwHPoGqUMRcS7BaO5SCLnZ_Q2XHFqnY_qhoYxA9h4a8XqxT_517NaY3yH1UY6pq88OyqUCebD1hyBoYGgjtQjBu3Z1CMNm_4tEcPHeyvyb42clkx7wGqlUuIWaVU_pSwmmHh6lQ2CJJX_EeZCOv8ib8mc6sixAT86u9PZlBcYmPPoHfimwIR8ik66yqWMf4tqvLH4pz-enYY3YZ0SRI_BgkW3a4zmK13U76kY8VvqUdy_uwWHTQ7OsscNb1Dwka3Bd2ve0S8npkYjuOnEbx8PF_3MY6SF_OjIQek-MDFyyzMb07bVTWo',
      //   initPhrase: 'Запусти таймер для шахмат',
      //   getState: () => assistantStateRef.current,
      //   nativePanel: {
      //     defaultText: 'Покажи что-нибудь',
      //     screenshotMode: false,
      //     tabIndex: -1,
      //   },
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
