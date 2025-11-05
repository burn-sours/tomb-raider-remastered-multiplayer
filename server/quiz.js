const QUIZZES = [
    {
        questions: [
            { question: "How many crumble tiles are in Tomb of Qualopec?", answer: "6" },
            { question: "Which TR1/TR2 level has no water?", answer: "Caves" },
            { question: "How many bears appear in TR1?", answer: "Three" },
            { question: "How many Pierre encounters are there if you always shoot him?", answer: "9" },
            { question: "Who created Boing% and Multiplayer?", answer: "Burn_Sours" },
            { question: "What's the first obtainable weapon in TR2? (Excluding starting guns)", answer: "Grenade Launcher" },
            { question: "How many levels in TR2 have drivable vehicles?", answer: "Three" },
            { question: "What is on the back of Pierre's jacket?", answer: "A woman in a bikini" },
            { question: "How many sets of clang-clang doors appear in TR1?", answer: "10" },
            { question: "Which TR1/TR2 level has the most kills? (Monks excluded)", answer: "Opera House" },
            { question: "Which TR1/TR2 level has the fewest kills?", answer: "Natla's Mines" },
            { question: "Which are more numerous in Barkhang Monastery: monks or human enemies?", answer: "Human Enemies" },
            { question: "How many raptors are there in TR1?", answer: "9" },
            { question: "Which level is the last level you see a croc in TR1?", answer: "Obelisk of Khamoon" }
        ]
    },
    {
        questions: [
            { question: "How many TR1 levels end with item pickups?", answer: "2" },
            { question: "How many levels in TR1 have spikes?", answer: "8" },
            { question: "How many enemy species are in the Venice levels?", answer: "3" },
            { question: "What's the minimum kill count for a TR1 glitchless run?", answer: "4" },
            { question: "How many levels in TR2 end with a cut scene/FMV starting?", answer: "8" },
            { question: "How many different items contain the word 'key' in their name in TR1?", answer: "9" },
            { question: "How many sharks are in TR2?", answer: "8" },
            { question: "How many levels in TR3 have drivable vehicles?", answer: "6" },
            { question: "How many TR2 enemies have health bars?", answer: "6" },
            { question: "How many total levels in TR1-3? (Including bonuses/DLCs)", answer: "113" },
            { question: "Which level in TR1 has only one lever in the entire level?", answer: "Lost Valley" },
            { question: "Which 3 levels in TR2 don't have any human enemies to kill?", answer: "Great Wall, Ice Palace, Temple of Xian" },
            { question: "Which level has the most secrets in TR1?", answer: "Lost Valley" },
            { question: "What's the dying monk's name in Diving Area?", answer: "Brother Chen" },
            { question: "Which level in TR1 has the first boulder?", answer: "Tomb of Qualopec" },
            { question: "What two items does Lara start with in Home Sweet Home?", answer: "Shotgun and Flares" },
            { question: "What food did Pierre eat before St Francis Folly?", answer: "Beans" },
            { question: "In TR3, which level has the least amount of kills?", answer: "City" },
            { question: "What's the TR3 all secrets bonus level called?", answer: "All Hallows" },
            { question: "Which has the most pickups: TR1, 2 or 3?", answer: "TR2" }
        ]
    },
    {
        questions: [
            { question: "How many crumble tiles are in Tomb of Qualopec?", answer: "10" },
            { question: "Where's the first Uzi ammo pickup in TR1?", answer: "3rd secret in City of Vilcabamba" },
            { question: "How many TR1 levels need no pickups?", answer: "Two" },
            { question: "How many wolves are dead on the Peru loading screen?", answer: "3" },
            { question: "Name the 4 artifacts that you pick up in Obelisk of Khamoon?", answer: "Eye of Horus, Scarab, Seal of Anubis, Ankh" },
            { question: "How many single-tile pillars in Palace Midas lever room?", answer: "6" },
            { question: "Which level in TR1 has the most save crystals?", answer: "Palace Midas" },
            { question: "Which has more: gorillas in Palace Midas or wolves in Vilcabamba?", answer: "Gorillas (17-11)" },
            { question: "How many TR2 levels have spiked tiles? (not glass/spikey balls)", answer: "5" },
            { question: "How many Clang Clang Doors are there in Barkhang Monastery?", answer: "5" },
            { question: "What's the color order of keycards in Offshore Rig?", answer: "Yellow, Red, Green" },
            { question: "In TR2, how many ziplines are there?", answer: "5" },
            { question: "Which level is alphabetically last in TR2?", answer: "Wreck of the Maria Doria" },
            { question: "Which level is alphabetically first in TR3?", answer: "Aldwych" },
            { question: "How many flares per pickup in TR3?", answer: "8" }
        ]
    }
];

const QUESTION_INTERVAL = 120000;
const ANSWER_DELAY = 20000;
const MAX_MESSAGE_LENGTH = 50;
const INTRO_MESSAGE_DELAY = 1500;

class QuizChat {
    constructor(sendMessageFn) {
        this.sendMessage = sendMessageFn;
        this.optedOut = new Map();
        this.receivedIntro = new Map();
        this.currentQuizIndex = 0;
        this.currentQuestionIndex = 0;
        this.showingAnswer = false;
        this.timer = null;
    }

    start() {
        this.scheduleNextQuestion();
    }

    stop() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    handleOptOut(playerId) {
        this.optedOut.set(playerId, true);
    }

    isOptedOut(playerId) {
        return this.optedOut.get(playerId) === true;
    }

    cleanupPlayer(playerId) {
        this.optedOut.delete(playerId);
        this.receivedIntro.delete(playerId);
    }

    scheduleNextQuestion() {
        this.timer = setTimeout(() => {
            this.askQuestion();
        }, QUESTION_INTERVAL);
    }

    askQuestion() {
        this.currentQuizIndex = Math.floor(Math.random() * QUIZZES.length);
        const currentQuiz = QUIZZES[this.currentQuizIndex];
        this.currentQuestionIndex = Math.floor(Math.random() * currentQuiz.questions.length);
        const currentQuestion = currentQuiz.questions[this.currentQuestionIndex];

        this.broadcastQuizMessage(currentQuestion.question);
        this.showingAnswer = true;

        setTimeout(() => {
            if (this.showingAnswer) {
                this.broadcastQuizMessage(`Answer: ${currentQuestion.answer}`);
                this.showingAnswer = false;
            }
        }, ANSWER_DELAY);

        this.scheduleNextQuestion();
    }

    broadcastQuizMessage(text) {
        this.sendMessage("Quiz", text, (playerId) => {
            if (this.isOptedOut(playerId)) return false;

            if (!this.receivedIntro.get(playerId)) {
                this.receivedIntro.set(playerId, true);
                this.sendMessage("Quiz", "Credits to @joef93 - Type /quizoff to stop", () => true, playerId, 0);
                return INTRO_MESSAGE_DELAY;
            }

            return true;
        });
    }
}

module.exports = { QuizChat, MAX_MESSAGE_LENGTH };
