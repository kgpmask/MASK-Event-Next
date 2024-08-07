import React from 'react'
import Styles from '@/styles/MainBody.module.css'

function QuesOptions() {
  const [selectedOption, setSelectedOption] = React.useState('')
  const [isQuizStarted, setIsQuizStarted] = React.useState(false)
  const [isTypeOptions, setIsTypeOptions] = React.useState(true)
  const [isQuestionAnswered, setIsQuestionAnswered] = React.useState(false)
  const options = [{
    option: 'Shadow Clone Jutsu',
    numbering: 'A'
  }, {
    option: 'Substitution Jutsu',
    numbering: 'B'
  }, {
    option: 'Transformation Jutsu',
    numbering: 'C'
  }, {
    option: 'Rasengan',
    numbering: 'D'
  }]
  const handleStartQuiz = (e) => {
    // setSelectedOption(e.currentTarget.textContent)
    setIsQuizStarted(true)
  }
  const handleSubmission = () => {
    setIsQuestionAnswered(true)
  }
  return (
    <div className={Styles['container']}>
      <div className={Styles["card"]}>
        <div className={Styles["header"]}>
          <div className={Styles["round"]}>
            <h3>Round 2</h3>
            <h2 style={{ color: 'white' }}>Shiri Masu Ka?</h2>
            <h4>{!isQuestionAnswered ? 'Question' : 'Answer'} #5</h4>
          </div>
          {/* need to implement timer */}
          <div className={Styles["timer"]}>
            <h3>Round 2</h3>
            <h1>00:00</h1>
          </div>
        </div>
        <div className={Styles["content"]}>
          <p className={Styles['questions']}>
            In the anime &quot;Naruto,&quot; what is the name of Naruto&quot;s signature jutsu that creates multiple copies of himself?
          </p>
          {isQuizStarted ?
            (!isQuestionAnswered && (isTypeOptions ? <><div className={Styles["options"]}>
              {options.map((item, index) => (
                <button key={index} className={Styles['option-button']}>
                  <span className={Styles["option-numbering"]}>{item.numbering}</span>
                  {item.option}
                </button>
              ))}
            </div></> :
              <div className={Styles[""]}>
                <textarea className={Styles["text-area"]} placeholder="Type your answer here..."></textarea>
              </div>))
            :
            <div className={Styles['start-quiz']}>
              <button className={Styles['start-quiz-nav']}>
                Previous
              </button>
              <button className={Styles['start-quiz-button']} onClick={handleStartQuiz}>
                Start Quiz
              </button>
              <button className={Styles['start-quiz-nav']}>
                Next
              </button>
            </div>}
          {isQuestionAnswered && (isTypeOptions ? <div className={Styles['answered-option']}>
            <p className={Styles['option-button']} style={{ width: '100%', cursor: 'grab', color: 'black' }}>
              <span className={Styles["option-numbering"]}>{options[0].numbering}</span>
              {options[0].option}
            </p>
          </div> : <div className={Styles['answered-option']}>
            <p className={Styles['option-button']} style={{ width: '100%', cursor: 'grab', color: 'black', display:'flex' ,justifyContent:'center' }}>
              <span style={{marginRight:'20px'}}>Ans:</span>Naruto
            </p>
          </div>)
          }

          {isQuizStarted ? <div className={Styles["submit"]}>
            {!isQuestionAnswered && <button className={Styles["submit-btn"]} onClick={handleSubmission}>Submit</button>}
          </div> : <div className={Styles["submit"]}>
            <button className={Styles["submit-btn"]}>End Quiz</button>
          </div>}
        </div>
      </div>
    </div>
  )
}

export default QuesOptions
