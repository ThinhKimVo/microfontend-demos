import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormGroup,
  TextField,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import {
  Timer as TimerIcon,
  CheckCircle as CheckIcon,
  Cancel as WrongIcon,
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
} from '@mui/icons-material';
import { quizzes, courses } from '../data/mockData';

export default function QuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const quiz = quizzes.find(q => q.id === quizId);
  const course = courses.find(c => c.id === quiz?.courseId);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [timeLeft, setTimeLeft] = useState(quiz?.timeLimit ? quiz.timeLimit * 60 : 0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (quiz?.timeLimit && timeLeft > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quiz?.timeLimit, timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    if (!quiz) return;

    let correctCount = 0;
    quiz.questions.forEach(q => {
      const userAnswer = answers[q.id];
      if (q.type === 'multiple_choice' || q.type === 'true_false') {
        if (userAnswer === q.correctAnswer) correctCount++;
      } else if (q.type === 'multiple_select') {
        const correct = q.correctAnswers || [];
        const user = (userAnswer as string[]) || [];
        if (correct.length === user.length && correct.every(a => user.includes(a))) {
          correctCount++;
        }
      }
    });

    const calculatedScore = Math.round((correctCount / quiz.questions.length) * 100);
    setScore(calculatedScore);
    setIsSubmitted(true);
    setShowResults(true);
  };

  if (!quiz) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Quiz not found</Typography>
      </Box>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const isPassing = score >= quiz.passingScore;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" fontWeight={600}>{quiz.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {course?.title}
              </Typography>
            </Box>
            {quiz.timeLimit && !isSubmitted && (
              <Chip
                icon={<TimerIcon />}
                label={formatTime(timeLeft)}
                color={timeLeft < 60 ? 'error' : 'default'}
                variant="outlined"
              />
            )}
          </Box>

          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(progress)}% complete
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        </CardContent>
      </Card>

      {/* Question */}
      {!isSubmitted && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {question.question}
            </Typography>

            {question.type === 'multiple_choice' && (
              <RadioGroup
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              >
                {question.options?.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={option}
                    control={<Radio />}
                    label={option}
                    sx={{
                      my: 1,
                      p: 1.5,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: answers[question.id] === option ? 'primary.main' : 'grey.300',
                      bgcolor: answers[question.id] === option ? 'primary.light' : 'transparent',
                      width: '100%',
                      mx: 0,
                    }}
                  />
                ))}
              </RadioGroup>
            )}

            {question.type === 'multiple_select' && (
              <FormGroup>
                {question.options?.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={((answers[question.id] as string[]) || []).includes(option)}
                        onChange={(e) => {
                          const current = (answers[question.id] as string[]) || [];
                          if (e.target.checked) {
                            handleAnswerChange(question.id, [...current, option]);
                          } else {
                            handleAnswerChange(question.id, current.filter(a => a !== option));
                          }
                        }}
                      />
                    }
                    label={option}
                    sx={{
                      my: 1,
                      p: 1.5,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: ((answers[question.id] as string[]) || []).includes(option) ? 'primary.main' : 'grey.300',
                      bgcolor: ((answers[question.id] as string[]) || []).includes(option) ? 'primary.light' : 'transparent',
                      width: '100%',
                      mx: 0,
                    }}
                  />
                ))}
              </FormGroup>
            )}

            {question.type === 'true_false' && (
              <RadioGroup
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              >
                {['True', 'False'].map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio />}
                    label={option}
                    sx={{
                      my: 1,
                      p: 1.5,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: answers[question.id] === option ? 'primary.main' : 'grey.300',
                      bgcolor: answers[question.id] === option ? 'primary.light' : 'transparent',
                      width: '100%',
                      mx: 0,
                    }}
                  />
                ))}
              </RadioGroup>
            )}

            {question.type === 'fill_blank' && (
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your answer here..."
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                sx={{ mt: 2 }}
              />
            )}

            {question.type === 'short_answer' && (
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Type your answer here..."
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                sx={{ mt: 2 }}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      {!isSubmitted && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(prev => prev - 1)}
          >
            Previous
          </Button>

          {currentQuestion < quiz.questions.length - 1 ? (
            <Button
              variant="contained"
              endIcon={<NextIcon />}
              onClick={() => setCurrentQuestion(prev => prev + 1)}
            >
              Next
            </Button>
          ) : (
            <Button variant="contained" color="success" onClick={handleSubmit}>
              Submit Quiz
            </Button>
          )}
        </Box>
      )}

      {/* Results Dialog */}
      <Dialog open={showResults} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ textAlign: 'center' }}>
            {isPassing ? (
              <CheckIcon sx={{ fontSize: 64, color: 'success.main' }} />
            ) : (
              <WrongIcon sx={{ fontSize: 64, color: 'error.main' }} />
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {score}%
            </Typography>
            <Typography variant="h6" gutterBottom>
              {isPassing ? 'Congratulations! You Passed!' : 'Keep Practicing!'}
            </Typography>
            <Alert severity={isPassing ? 'success' : 'warning'} sx={{ mt: 2 }}>
              {isPassing
                ? `Great job! You scored above the passing threshold of ${quiz.passingScore}%.`
                : `You need ${quiz.passingScore}% to pass. You have ${quiz.maxAttempts - 1} attempts remaining.`}
            </Alert>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Correct Answers:</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {Math.round((score / 100) * quiz.questions.length)} / {quiz.questions.length}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Passing Score:</Typography>
                <Typography variant="body2" fontWeight={600}>{quiz.passingScore}%</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Time Taken:</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {quiz.timeLimit ? formatTime((quiz.timeLimit * 60) - timeLeft) : 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Back to Course
          </Button>
          {!isPassing && quiz.maxAttempts > 1 && (
            <Button
              variant="contained"
              onClick={() => {
                setIsSubmitted(false);
                setShowResults(false);
                setAnswers({});
                setCurrentQuestion(0);
                setTimeLeft(quiz.timeLimit ? quiz.timeLimit * 60 : 0);
              }}
            >
              Retry Quiz
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
