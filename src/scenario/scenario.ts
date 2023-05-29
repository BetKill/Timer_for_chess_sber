import {
    createUserScenario,
    createSystemScenario,
    createSaluteRequest,
    createSaluteResponse,
    createScenarioWalker,
    createMatchers,
    SaluteRequest,
    NLPRequest,
    NLPResponse,
    createIntents,
} from '@salutejs/scenario';
import { SaluteMemoryStorage } from '@salutejs/storage-adapter-memory';
import { runAppHandler, noMatchHandler, closeAppHander, restart, setTime } from './handlers'

const { regexp, action } = createMatchers<SaluteRequest>();

const userScenario = createUserScenario({
    restart: {
        match: regexp(/^Заново$/i),
        handle: restart,
    },
    setTime: {
        match: regexp(/^Поставить(?: (?<hours>\d+) час)?(?: (?<minutes>\d+) минут.)?(?: (?<seconds>\d+) секунд.)?$/i, { normalized: true }),
        handle: setTime,
    },

});

const scenarioWalker = createScenarioWalker({
    systemScenario: createSystemScenario({
        RUN_APP: runAppHandler,
        NO_MATCH: noMatchHandler,
        CLOSE_APP: closeAppHander
    }),
    // recognizer: new SmartAppBrainRecognizer("9d144a19-7945-43c6-b79e-3f4f7f028a58"),
    userScenario,
});


const storage = new SaluteMemoryStorage();

export const handleNlpRequest = async (request: NLPRequest): Promise<NLPResponse> => {
    const req = createSaluteRequest(request);
    const res = createSaluteResponse(request);

    console.log(req.request);
    const sessionId = request.uuid.userId;
    const session = await storage.resolve(sessionId);

    await scenarioWalker({ req, res, session });
    await storage.save({ id: sessionId, session });
    return res.message;
};
