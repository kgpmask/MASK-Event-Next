import { serverQuestionTime } from "./questionTiming.js";

const GLOBAL_KEY = "__maskQuizState";

const createQuizState = () => {
	let flushTimer = null;
	let clientTimer = null;

	const quizState = {
		quizId: process.env.QUIZ_ID,
		quizStatus: "idle",
		currentQuestionNo: null,
		questionType: null,
		questionDifficulty: null,
		startedAt: null,
		durationSeconds: null,
		lastQuestionNo: 0,
		cachedRecords: [],

		get isQuestionRunning() {
			return this.currentQuestionNo !== null;
		},

		startQuestion({ questionNo, type, difficulty }) {
			this.clearTimers();
			this.quizStatus = "running";
			this.currentQuestionNo = questionNo;
			this.questionType = type;
			this.questionDifficulty = difficulty;
			this.startedAt = Date.now();
			this.durationSeconds = serverQuestionTime(type, difficulty);
			this.lastQuestionNo = questionNo;
		},

		scheduleFlush(callback) {
			flushTimer = setTimeout(() => {
				flushTimer = null;
				this.resetQuestionState();
				callback();
			}, this.durationSeconds * 1000);
		},

		scheduleClientTimeout(callback, durationMs = this.durationSeconds * 1000) {
			clientTimer = setTimeout(() => {
				clientTimer = null;
				callback();
			}, durationMs);
		},

		clearTimers() {
			if (flushTimer) clearTimeout(flushTimer);
			if (clientTimer) clearTimeout(clientTimer);
			flushTimer = null;
			clientTimer = null;
		},

		resetQuestionState() {
			this.currentQuestionNo = null;
			this.questionType = null;
			this.questionDifficulty = null;
			this.startedAt = null;
			this.durationSeconds = null;
		},

		endQuestion() {
			this.clearTimers();
			this.resetQuestionState();
		},

		markEnded() {
			this.endQuestion();
			this.quizStatus = "ended";
		},

		timeRemaining() {
			if (!this.isQuestionRunning) return 0;
			const remainingMs =
				this.startedAt + this.durationSeconds * 1000 - Date.now();
			return Math.max(0, Math.ceil(remainingMs / 1000));
		},

		toClient() {
			return {
				quizId: this.quizId,
				quizStatus: this.quizStatus,
				currentQuestionNo: this.currentQuestionNo,
				questionType: this.questionType,
				questionDifficulty: this.questionDifficulty,
				startedAt: this.startedAt,
				durationSeconds: this.durationSeconds,
				lastQuestionNo: this.lastQuestionNo,
				timeRemaining: this.timeRemaining(),
			};
		},
	};

	return quizState;
};

globalThis[GLOBAL_KEY] = globalThis[GLOBAL_KEY] || createQuizState();

export default globalThis[GLOBAL_KEY];
