import React from 'react'
import styles from '../styles/ResultMenu.module.css'

export default function ResultMenu({handleReset, winner}) {
    return (
        <div>
            <div className={styles['modal-container']}>
                <div className={styles['modal-content']}>
                    <h2>Победитель</h2>
                    <p>{winner}</p>
                    <button onClick={handleReset}>Закрыть</button>
                </div>
            </div>
        </div>
    )
}
