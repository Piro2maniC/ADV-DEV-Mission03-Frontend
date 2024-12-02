import { useState } from 'react';
import styles from "../../../../../styles/HomePageInterviewModel.module.css";

function InterviewModel() { 
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const startInterview = async () => {
    if (!jobTitle.trim()) {
      setError('Please enter a job title');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/api/gemini/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobTitle }),
      });

      if (!response.ok) {
        throw new Error('Failed to start interview');
      }

      const data = await response.json();
      setResponse(data.response);
      setQuestionCount(data.questionCount);
      setInterviewStarted(true);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateResponse = async () => {
    if (!prompt.trim()) {
      setError('Please enter your response');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/api/gemini/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, jobTitle, questionCount }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const data = await response.json();
      setResponse(data.response);
      setQuestionCount(data.questionCount);
      setIsComplete(data.isComplete);
      setPrompt(''); // Clear the prompt for the next response
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!interviewStarted) {
      startInterview();
    } else {
      generateResponse();
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>AI Interview Practice</h2>
      
      {!interviewStarted ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="jobTitle" className={styles.label}>Job Title</label>
            <input
              id="jobTitle"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Enter the position you're applying for..."
              className={styles.input}
              disabled={loading}
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading ? 'Processing...' : 'Start Interview'}
          </button>
        </form>
      ) : (
        <div className={styles.interviewSection}>
          {!isComplete && (
            <div className={styles.progress}>
              Question {questionCount} of 6
            </div>
          )}

          {response && (
            <div className={styles.responseContainer}>
              <h3>{isComplete ? 'Interview Feedback:' : 'AI Interviewer:'}</h3>
              <div className={styles.response}>{response}</div>
            </div>
          )}

          {!isComplete && (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="prompt" className={styles.label}>Your Response</label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your response to the interviewer..."
                  className={styles.textarea}
                  rows={4}
                  disabled={loading}
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className={styles.button}
              >
                {loading ? 'Processing...' : 'Send Response'}
              </button>
            </form>
          )}
        </div>
      )}
      
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}

export default InterviewModel;