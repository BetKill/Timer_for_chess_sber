import { SaluteHandler, SaluteRequest } from '@salutejs/scenario';


export const runAppHandler: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    res.setPronounceText("Приветствую вас. Скажите, на какое время установить таймер.")
    res.setEmotion('radost')
};

export const noMatchHandler: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    res.appendCommand({ type: 'HELP' })
    res.setEmotion('zainteresovannost')
};

export const closeAppHander: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    res.setPronounceText("Всего хорошего")
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
        res.appendCommand({ type: 'SETTIME', time: s })
    }
};

export const move: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    res.appendCommand({ type: "MOVE" })
};

export const help: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    const { screen } = req.variables;
    if (screen === 'Start') {
        res.setPronounceText('Скажите время, которое хотите установить на таймере');
    } else if (screen === 'Middle') {
        res.setPronounceText('Для начала нужно сказать кто начнет, и партия начнется. Дальше по игре вы можете сказать сходил, когда совершите ход')
    } else {
        res.setPronounceText('Скажите, заново если вы хотите начать игру сначала')
    }
};

export const preHelp: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    res.appendCommand({ type: 'HELP' })
};

export const result: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    const { winner } = req.variables;
    res.setPronounceText(`${winner}`)
};

export const chooseStart: SaluteHandler<SaluteRequest> = ({ req, res }) => {
    const { side } = req.variables;
    var start = side === 'нижний' ? 'top' : 'bottom';
    res.appendCommand({ type: "START", timer: start });
};