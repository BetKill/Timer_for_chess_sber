import React, { useState } from 'react';
import styles from '../styles/StartMenu.module.css'

export default function StartMenu({ hanleSetTime }) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const handleHoursChange = (event) => {
    if (parseInt(event.target.value) >= 23) {
      setHours(parseInt(event.target.value) % 24);
    }
    else {
      setHours(parseInt(event.target.value))
    }
  };

  const handleMinutesChange = (event) => {
    if (parseInt(event.target.value) >= 60) {
      setMinutes(parseInt(event.target.value) % 60);
    }
    else {
      setMinutes(parseInt(event.target.value))
    }
  };

  const handleSecondsChange = (event) => {
    if (parseInt(event.target.value) >= 60) {
      setSeconds(parseInt(event.target.value) % 60);
    }
    else {
      setSeconds(parseInt(event.target.value))
    }
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
            <input type="number"
              value={hours}
              min='0'
              onChange={handleHoursChange}
              onKeyDown={(e) => e.preventDefault()}></input>
          </label>
          <br />
          <label>
            Минуты:
            <input type="number"
              min='0'
              value={minutes}
              onChange={handleMinutesChange}
              onKeyDown={(e) => e.preventDefault()}></input>
          </label>
          <br />
          <label>
            Секунды:
            <input type="number"
              min='0'
              value={seconds}
              onChange={handleSecondsChange}
              onKeyDown={(e) => e.preventDefault()}></input>
          </label>
          <br />
          <button onClick={() => handleCheck()}>Установить</button>
        </div>
      </div>
    </div>
  );
}
