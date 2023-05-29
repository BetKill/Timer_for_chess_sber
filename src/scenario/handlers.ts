import { SaluteHandler, SaluteRequest } from '@salutejs/scenario';


export const runAppHandler: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    res.setPronounceText("Приветствую вас. Скажите, на какое время установить таймер.")
};

export const noMatchHandler: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    res.setPronounceText("Скажите или нажмите на кнопку помощь")
};

export const closeAppHander: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    res.setPronounceText("Всего хорошего")
};

export const start: SaluteHandler = ({ req, res }) => {
    
};

export const winner: SaluteHandler<SaluteRequest> = ({ req, res }) => {

};

export const restart: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    res.appendCommand({ type: 'RESET' })
    res.setPronounceText("Скажите, на какое время установить таймер.")
};

export const setTime: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    const { hours, minutes, seconds } = req.variables
    const s: number =
        (hours !== undefined ? Number(hours) * 60 * 60 : 0) +
        (minutes !== undefined ? Number(minutes) * 60 : 0) +
        (seconds !== undefined ? Number(seconds) : 0);
    if (s === 0) {
        res.setPronounceText('Поставить все параметры таймера на 0 не получится');
    }
    else {
        res.appendCommand({type: 'SETTIME', time: s})
    }
};