import { serverQuestionTime } from "./questionTiming.js";

const GLOBAL_KEY = "__maskQuizState";

/**
 * Creates the singleton quiz state object holding the live quiz's runtime state.
 * @returns {object} The quiz state object with timer and question lifecycle helpers.
 */
const createQuizState = () => {
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
		flushTimer: null,

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
		 * The callback also ends the question so a new one can be started.
		 * @param {Function} callback Invoked after the question ends.
		 */
		scheduleFlush(callback) {
			this.flushTimer = setTimeout(() => {
				this.flushTimer = null;
				this.resetQuestionState();
				callback();
			}, this.durationSeconds * 1000);
		},

		/** Clears the pending flush timer. */
		clearTimers() {
			if (this.flushTimer) clearTimeout(this.flushTimer);
			this.flushTimer = null;
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

		/** Marks the quiz as started, so late joiners land on the instructions page. */
		markStarted() {
			this.quizStatus = "started";
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
