import React from 'react'
import Styles from '@/styles/Options.module.css'

function QuesOptions() {
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
  return (
    <div className={Styles['container']}>
      <div className={Styles["card"]}>
        <div className={Styles["header"]}>
          <div className={Styles["round"]}>
            <h3>Round 2</h3>
            <h2 style={{ color: 'white' }}>Shiri Masu Ka?</h2>
            <h4>Question #5</h4>
          </div>
          <div className={Styles["timer"]}>
            <h3>Round 2</h3>
            <h1>00:00</h1>
          </div>
        </div>
        <div className="content">
          <p className={Styles['questions']}>
            In the anime &quot;Naruto,&quot; what is the name of Naruto&quot;s signature jutsu that creates multiple copies of himself?
          </p>
          <div className={Styles["options"]}>
            {options.map((item, index) => (
              <button key={index} className={Styles['option-button']}>
                <span className={Styles["option-numbering"]}>{item.numbering}</span>
                {item.option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuesOptions
