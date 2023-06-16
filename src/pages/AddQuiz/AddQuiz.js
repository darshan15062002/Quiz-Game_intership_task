import React, { useContext, useEffect, useRef, useState } from 'react';
import './AddQuiz.scss';
// import edit from '../../img/pencil.png';
// import { db, storage } from '../../firebase';
// import { BiArrowBack } from 'react-icons/bi';
// import Mic from '../../img/microphone-svgrepo-com.svg';
// import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
// import { Timestamp, arrayUnion, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
// import { AuthContext } from '../../context/AuthContext';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

const AddQuiz = () => {
    const navigate = useNavigate();
    const formRef = useRef(null);
    // const { currentUser } = useContext(AuthContext);

    // const [img, setImg] = useState();
    // const [img2, setImg2] = useState();
    const [quizTitle, setQuizTitle] = useState('');
    const [questions, setQuestions] = useState([{ _id: 1, question: '', options: '', correctAnswer: '' }]);
    // console.log(questions, "darshan");
    const [quiz, setQuiz] = useState([]);

    // Fetch quiz
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

    const handleUpdateQue = (quizTitle) => {
        console.log("darshan");
        const filterData = quiz.filter((doc) => doc.quizTitle === quizTitle)
        console.log(filterData[0].quiz);
        setQuizTitle(filterData[0].quizTitle)
        setQuestions(filterData[0].quiz)
    }




    const handleQuizTitleChange = (e) => {
        setQuizTitle(e.target.value);
    };

    const handleQuestionChange = (e, index) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].question = e.target.value;
        setQuestions(updatedQuestions);
    };

    const handleOptionsChange = (e, index) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].options = e.target.value;
        setQuestions(updatedQuestions);
    };

    const handleCorrectAnswerChange = (e, index) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].correctAnswer = e.target.value;
        setQuestions(updatedQuestions);
    };

    const handleAddQuestion = () => {
        const id = questions[questions.length - 1]._id
        setQuestions([...questions, { _id: id + 1, question: '', options: '', correctAnswer: '' }]);
    };

    const handleCreateQuiz = async (e) => {
        e.preventDefault();

        console.log('Quiz Title:', quizTitle);
        console.log('Questions:', questions);


        try {
            // Update Firestore document
            const res = await getDoc(doc(db, "quiz", quizTitle));
            if (!res.exists()) {
                await setDoc(doc(db, "quiz", quizTitle), { quizTitle, quiz: [] });
            }
            await updateDoc(doc(db, "quiz", quizTitle), {
                quiz: arrayUnion(
                    ...questions
                )
            });
            alert('Quizs are added succesfully');
            setQuestions([])
            setQuizTitle('')

        } catch (err) {
            console.log(err, "dars");
        }
    };

    return (
        <div className="formContainer">

            <div className="formWrapper formWrapper__col" style={{ gap: '60px', width: '70%' }}>



                <div className="addQuizContainer" style={{ width: '90%' }}>
                    <h1>Create Quiz</h1>

                    <form onSubmit={handleCreateQuiz}>
                        <label htmlFor="quizTitle">Quiz Title:</label>
                        <input type="text" id="quizTitle" value={quizTitle} onChange={handleQuizTitleChange} required />

                        <div className="questionsWrapper">
                            {questions.map((question, index) => (
                                <div key={index} className="questionContainer">
                                    <label htmlFor={`question${index}`}>Question {index + 1}:</label>
                                    <input
                                        type="text"
                                        id={`question${index}`}
                                        value={question.question}
                                        onChange={(e) => handleQuestionChange(e, index)}
                                        required
                                    />

                                    <label htmlFor={`options${index}`}>Options (comma-separated):</label>
                                    <input
                                        type="text"
                                        id={`options${index}`}
                                        value={question.options}
                                        onChange={(e) => handleOptionsChange(e, index)}
                                        required
                                    />

                                    <label htmlFor={`correctAnswer${index}`}>Correct Answer:</label>
                                    <input
                                        type="text"
                                        id={`correctAnswer${index}`}
                                        value={question.correctAnswer}
                                        onChange={(e) => handleCorrectAnswerChange(e, index)}
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: "20px" }}>
                            <button type="button" onClick={handleAddQuestion}>
                                Add Question
                            </button>

                            <button type="submit">Create Quiz</button>
                        </div>
                    </form>
                </div>

                <div className="right">
                    <h2>Previously added Quiz</h2>
                    <div className="service-list">
                        {quiz ? (
                            quiz?.map((item, index) => (
                                <div key={item?.quizTitle} className="service-card" onClick={() => handleUpdateQue(item.quizTitle)}>

                                    <div className="card-info">
                                        <h3>{item?.quizTitle}</h3>


                                    </div>

                                </div>
                            ))
                        ) : (
                            <h1>Loading....</h1>
                        )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddQuiz;
