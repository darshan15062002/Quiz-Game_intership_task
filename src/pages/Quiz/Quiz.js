import React, { useEffect, useState } from 'react'
import './Quiz.scss'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
const Quiz = () => {
    const [quiz, setQuiz] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [count, setCount] = useState(0)
    const [selected, setSelected] = useState()
    const [point, setPoint] = useState(0)
    console.log(questions);
    const [open, setOpen] = useState(false)
    console.log(quiz);
    useEffect(() => {
        const getQuiz = async () => {
            const unsub = await getDocs(collection(db, "quiz"));
            let a = []
            unsub.forEach((doc) => {

                a.push(doc.data())

            });
            setQuiz(a)

            return () => {
                unsub();
            };
        };

        getQuiz();
    }, []);


    const handlePlay = (quizTitle) => {
        setOpen(true)
        const filterData = quiz.filter((doc) => doc.quizTitle === quizTitle)
        setQuestions(filterData[0].quiz)
    }

    const handleNext = () => {
        if (selected === questions[count].isCorrect) {
            setPoint(point + 1)

        }
        if (count === questions.length - 1) return setCount(0)
        setCount(count + 1)

    }
    return (
        <div className='formContainer'>
            {quiz?.map((item, index) => (
                <div className="formWrapper" style={{ width: '50%' }}>

                    <span className="logo">{item.quizTitle}</span>
                    <button className="button" onClick={() => handlePlay(item.quizTitle)}>Play</button>

                </div>
            ))}
            {
                open === true ? (<div className='formWrapper' style={{ position: 'absolute', height: '60%', width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <h1>{questions[count].question}</h1>
                    <div className="answer">

                        {
                            questions[count].options.split(",").map((item, index) => (
                                <>
                                    <input type="radio" name="answer" id="answer" value={questions[count].isCorrect} onClick={(e) => setSelected(e.target.value)} />
                                    <div key={index}>{item}</div>
                                </>
                            ))
                        }



                    </div>
                    <button onClick={() => handleNext()}>Next</button>
                </div>) : null
            }


        </div>
    )
}

export default Quiz