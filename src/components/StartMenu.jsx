import React, { useState } from 'react';
import styles from '../styles/StartMenu.module.css'

export default function StartMenu({hanleSetTime}) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const handleHoursChange = (event) => {
    setHours(parseInt(event.target.value));
  };

  const handleMinutesChange = (event) => {
    setMinutes(parseInt(event.target.value));
  };

  const handleSecondsChange = (event) => {
    setSeconds(parseInt(event.target.value));
  };

  const handleCheck = () => {
    const s = hours * 60 * 60 + minutes * 60 + seconds;
    if (s > 0) {
      hanleSetTime(s)
    }
  }

  return (
    <div className={styles['modal-container']}>
      <div className={styles['modal-content']}>
        <div>
          <h2>Установите таймер</h2>
          <label>
            Часы:
            <select value={hours} onChange={handleHoursChange}>
              {Array.from({ length: 24 }, (_, index) => (
                <option key={index} value={index}>{index}</option>
              ))}
            </select>
          </label>
          <br />
          <label>
            Минуты:
            <select value={minutes} onChange={handleMinutesChange}>
              {Array.from({ length: 60 }, (_, index) => (
                <option key={index} value={index}>{index}</option>
              ))}
            </select>
          </label>
          <br />
          <label>
            Секунды:
            <select value={seconds} onChange={handleSecondsChange}>
              {Array.from({ length: 60 }, (_, index) => (
                <option key={index} value={index}>{index}</option>
              ))}
            </select>
          </label>
          <br />
          <button onClick={() => handleCheck()}>Установить</button>
        </div>
      </div>
    </div>
  );
}
