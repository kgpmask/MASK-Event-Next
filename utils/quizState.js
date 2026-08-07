import { questionTime, serverQuestionTime } from "./questionTiming.js";

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
		clientDurationSeconds: null,
		durationSeconds: null,
		lastQuestionNo: 0,
		cachedRecords: [],
		flushTimer: null,
		respondents: new Map(),

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
			this.clientDurationSeconds = questionTime(type, difficulty);
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
			this.clientDurationSeconds = null;
			this.durationSeconds = null;
		},

		/**
		 * Records a distinct respondent for the given question.
		 * @param {string} userId The respondent's user id.
		 * @param {number} questionNo The question number they responded to.
		 */
		addRespondent(userId, questionNo) {
			if (!this.respondents.has(questionNo)) {
				this.respondents.set(questionNo, new Set());
			}
			this.respondents.get(questionNo).add(String(userId));
		},

		/**
		 * Returns the number of respondents for the given question.
		 * @param {number} questionNo The question number to look up.
		 * @returns {number} The respondent count, or 0 if unknown.
		 */
		respondentCount(questionNo) {
			return this.respondents.get(questionNo)?.size ?? 0;
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
		 * Computes the participant answer time remaining from the server clock.
		 * The longer server duration is only a buffer for processing responses.
		 * @returns {number} The client-visible time remaining, clamped at 0.
		 */
		clientTimeRemaining() {
			if (!this.isQuestionRunning) return 0;
			const clientDuration =
				this.clientDurationSeconds ??
				questionTime(this.questionType, this.questionDifficulty);
			const remainingMs =
				this.startedAt + clientDuration * 1000 - Date.now();
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
				clientDurationSeconds: this.clientDurationSeconds,
				durationSeconds: this.durationSeconds,
				lastQuestionNo: this.lastQuestionNo,
				timeRemaining: this.timeRemaining(),
				clientTimeRemaining: this.clientTimeRemaining(),
				respondentCounts: Object.fromEntries(
					[...this.respondents].map(([questionNo, ids]) => [
						questionNo,
						ids.size,
					])
				),
			};
		},
	};

	return quizState;
};

export const quizState = globalThis[GLOBAL_KEY] || createQuizState();
globalThis[GLOBAL_KEY] = quizState;
