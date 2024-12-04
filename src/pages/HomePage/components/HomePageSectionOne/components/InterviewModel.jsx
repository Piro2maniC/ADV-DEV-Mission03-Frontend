import React, { useState } from 'react';
import styles from '../../../../../styles/HomePageInterviewModel.module.css';

const InterviewModel = () => {
    const [jobTitle, setJobTitle] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [questionCount, setQuestionCount] = useState(0);
    const [interviewStarted, setInterviewStarted] = useState(false);
    const [interviewComplete, setInterviewComplete] = useState(false);
    const [interviewHistory, setInterviewHistory] = useState([]);

    const handleStartInterview = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:4000/api/gemini/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jobTitle }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to start interview');
            }

            setCurrentQuestion(data.response);
            setQuestionCount(data.questionCount);
            setInterviewHistory(data.interviewHistory || []);
            setInterviewStarted(true);
        } catch (err) {
            console.error('Error starting interview:', err);
            setError(err.message || 'Failed to start interview. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitResponse = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const apiResponse = await fetch('http://localhost:4000/api/gemini/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: response,
                    jobTitle,
                    questionCount,
                    interviewHistory
                }),
            });

            const data = await apiResponse.json();
            
            if (!apiResponse.ok) {
                throw new Error(data.error || 'Failed to generate response');
            }

            setCurrentQuestion(data.response);
            setQuestionCount(data.questionCount);
            setInterviewHistory(data.interviewHistory || []);
            setInterviewComplete(data.isComplete);
            setResponse('');
        } catch (err) {
            console.error('Error generating response:', err);
            setError(err.message || 'Failed to process response. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderFeedback = () => {
        if (!interviewHistory.length) return null;
        
        return (
            <div className={styles.feedbackContainer}>
                <h2 className={styles.feedbackTitle}>Interview Feedback</h2>
                {interviewHistory.map((item, index) => (
                    item && <div key={index} className={styles.questionFeedback}>
                        <h3>Question {item.questionNumber}</h3>
                        <div className={styles.questionContent}>
                            <p><strong>Q:</strong> {item.question}</p>
                            {item.answer && <p><strong>A:</strong> {item.answer}</p>}
                        </div>
                        {item.feedback && (
                            <div className={styles.feedbackDetails}>
                                <div className={styles.strength}>
                                    <p><strong>Strength:</strong> {item.feedback.strength}</p>
                                </div>
                                <div className={styles.improvement}>
                                    <p><strong>Area for Improvement:</strong> {item.feedback.improvement}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {interviewComplete && (
                    <div className={styles.finalFeedback}>
                        <h3>Overall Feedback</h3>
                        <div className={styles.finalFeedbackContent}>
                            {currentQuestion}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>AI Interview Assistant</h1>
            
            {error && <div className={styles.error}>{error}</div>}
            
            {!interviewStarted ? (
                <form onSubmit={handleStartInterview} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="jobTitle" className={styles.label}>
                            Enter the job title you're interviewing for:
                        </label>
                        <input
                            type="text"
                            id="jobTitle"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className={styles.button}
                        disabled={loading || !jobTitle.trim()}
                    >
                        {loading ? 'Starting Interview...' : 'Start Interview'}
                    </button>
                </form>
            ) : (
                <div className={styles.interviewSection}>
                    {!interviewComplete && (
                        <div className={styles.progress}>
                            Question {questionCount} of 6
                        </div>
                    )}
                    
                    {!interviewComplete && (
                        <div className={styles.responseContainer}>
                            <h3>Interviewer:</h3>
                            <p>{currentQuestion}</p>
                        </div>
                    )}

                    {!interviewComplete && (
                        <form onSubmit={handleSubmitResponse} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="response" className={styles.label}>
                                    Your Response:
                                </label>
                                <textarea
                                    id="response"
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                    className={styles.textarea}
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                className={styles.button}
                                disabled={loading || !response.trim()}
                            >
                                {loading ? 'Processing...' : 'Submit Response'}
                            </button>
                        </form>
                    )}

                    {(questionCount > 1 || interviewComplete) && renderFeedback()}
                </div>
            )}
        </div>
    );
};

export default InterviewModel;