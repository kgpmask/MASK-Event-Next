import { serverQuestionTime } from "./questionTiming.js";

const GLOBAL_KEY = "__maskQuizState";

/**
 * Creates the singleton quiz state object holding the live quiz's runtime state.
 * @returns {object} The quiz state object with timer and question lifecycle helpers.
 */
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

		/**
		 * Starts a new question by clearing timers and setting its metadata.
		 * @param {object} params The question start payload.
		 * @param {number} params.questionNo The question number to start.
		 * @param {string} params.type The question type ("text", "mcq", or "mtf").
		 * @param {string} [params.difficulty] The question difficulty.
		 */
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

		/**
		 * Schedules a flush callback once the current question's duration elapses.
		 * @param {Function} callback Invoked after the question ends.
		 */
		scheduleFlush(callback) {
			flushTimer = setTimeout(() => {
				flushTimer = null;
				this.resetQuestionState();
				callback();
			}, this.durationSeconds * 1000);
		},

		/**
		 * Schedules a client-facing timeout event after the given duration.
		 * @param {Function} callback Invoked when the timeout fires.
		 * @param {number} [durationMs] Timeout delay in milliseconds.
		 */
		scheduleClientTimeout(callback, durationMs = this.durationSeconds * 1000) {
			clientTimer = setTimeout(() => {
				clientTimer = null;
				callback();
			}, durationMs);
		},

		/** Clears both the flush and client timers. */
		clearTimers() {
			if (flushTimer) clearTimeout(flushTimer);
			if (clientTimer) clearTimeout(clientTimer);
			flushTimer = null;
			clientTimer = null;
		},

		/** Resets the running-question fields without touching the quiz status. */
		resetQuestionState() {
			this.currentQuestionNo = null;
			this.questionType = null;
			this.questionDifficulty = null;
			this.startedAt = null;
			this.durationSeconds = null;
		},

		/** Stops the running question and clears all associated timers. */
		endQuestion() {
			this.clearTimers();
			this.resetQuestionState();
		},

		/** Ends the running question and marks the quiz as ended. */
		markEnded() {
			this.endQuestion();
			this.quizStatus = "ended";
		},

		/**
		 * Computes the seconds remaining for the running question.
		 * @returns {number} The remaining seconds, clamped at 0.
		 */
		timeRemaining() {
			if (!this.isQuestionRunning) return 0;
			const remainingMs =
				this.startedAt + this.durationSeconds * 1000 - Date.now();
			return Math.max(0, Math.ceil(remainingMs / 1000));
		},

		/**
		 * Returns a plain snapshot of the state safe for client consumption.
		 * @returns {object} The client-facing quiz state.
		 */
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

export const quizState = globalThis[GLOBAL_KEY] || createQuizState();
globalThis[GLOBAL_KEY] = quizState;
