import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Switch,
  FormControlLabel,
  Divider,
  Grid,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';

interface Question {
  id: string;
  type: 'multiple_choice' | 'multiple_select' | 'true_false' | 'fill_blank' | 'short_answer';
  question: string;
  options: string[];
  correctAnswer: string;
  correctAnswers: string[];
  points: number;
  explanation: string;
}

const questionTypes = [
  { value: 'multiple_choice', label: 'Multiple Choice (Single Answer)' },
  { value: 'multiple_select', label: 'Multiple Choice (Multiple Answers)' },
  { value: 'true_false', label: 'True/False' },
  { value: 'fill_blank', label: 'Fill in the Blank' },
  { value: 'short_answer', label: 'Short Answer' },
];

export default function QuizEditor() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(quizId);

  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    hasTimeLimit: true,
    passingScore: 70,
    maxAttempts: 3,
    shuffleQuestions: false,
    showCorrectAnswers: true,
  });

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      type: 'multiple_choice',
      question: 'What is React?',
      options: ['A JavaScript library', 'A programming language', 'A database', 'An operating system'],
      correctAnswer: 'A JavaScript library',
      correctAnswers: [],
      points: 10,
      explanation: 'React is a JavaScript library for building user interfaces.',
    },
  ]);

  const [selectedQuestion, setSelectedQuestion] = useState<string>('1');

  const currentQuestion = questions.find(q => q.id === selectedQuestion);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'multiple_choice',
      question: '',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctAnswer: '',
      correctAnswers: [],
      points: 10,
      explanation: '',
    };
    setQuestions([...questions, newQuestion]);
    setSelectedQuestion(newQuestion.id);
  };

  const deleteQuestion = (id: string) => {
    if (questions.length <= 1) return;
    const newQuestions = questions.filter(q => q.id !== id);
    setQuestions(newQuestions);
    if (selectedQuestion === id) {
      setSelectedQuestion(newQuestions[0].id);
    }
  };

  const duplicateQuestion = (id: string) => {
    const question = questions.find(q => q.id === id);
    if (!question) return;
    const newQuestion = { ...question, id: Date.now().toString() };
    const index = questions.findIndex(q => q.id === id);
    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, newQuestion);
    setQuestions(newQuestions);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => (q.id === id ? { ...q, ...updates } : q)));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    const newOptions = [...question.options];
    newOptions[optionIndex] = value;
    updateQuestion(questionId, { options: newOptions });
  };

  const addOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    updateQuestion(questionId, { options: [...question.options, `Option ${question.options.length + 1}`] });
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = questions.find(q => q.id === questionId);
    if (!question || question.options.length <= 2) return;
    const newOptions = question.options.filter((_, i) => i !== optionIndex);
    updateQuestion(questionId, { options: newOptions });
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate(-1)}>
          <BackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={700}>
            {isEditing ? 'Edit Quiz' : 'Create Quiz'}
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<SaveIcon />} sx={{ mr: 1 }}>
          Save Draft
        </Button>
        <Button variant="contained">
          Save Quiz
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Question List */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Questions ({questions.length})
                </Typography>
                <IconButton size="small" onClick={addQuestion}>
                  <AddIcon />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {questions.map((q, index) => (
                  <Box
                    key={q.id}
                    onClick={() => setSelectedQuestion(q.id)}
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: selectedQuestion === q.id ? 'primary.main' : 'grey.200',
                      bgcolor: selectedQuestion === q.id ? 'primary.light' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <DragIcon sx={{ color: 'grey.400', fontSize: 18 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        Q{index + 1}: {q.question || 'Untitled Question'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {q.points} pts • {questionTypes.find(t => t.value === q.type)?.label.split(' ')[0]}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Button
                fullWidth
                startIcon={<AddIcon />}
                onClick={addQuestion}
                sx={{ mt: 2 }}
              >
                Add Question
              </Button>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Total Points:</Typography>
                <Typography variant="body2" fontWeight={600}>{totalPoints}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Question Editor */}
        <Grid size={{ xs: 12, md: 6 }}>
          {currentQuestion && (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Question {questions.findIndex(q => q.id === currentQuestion.id) + 1}
                  </Typography>
                  <Box>
                    <IconButton size="small" onClick={() => duplicateQuestion(currentQuestion.id)}>
                      <CopyIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => deleteQuestion(currentQuestion.id)}
                      disabled={questions.length <= 1}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 8 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Question Type</InputLabel>
                      <Select
                        value={currentQuestion.type}
                        label="Question Type"
                        onChange={(e) => updateQuestion(currentQuestion.id, { type: e.target.value as Question['type'] })}
                      >
                        {questionTypes.map(type => (
                          <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Points"
                      type="number"
                      value={currentQuestion.points}
                      onChange={(e) => updateQuestion(currentQuestion.id, { points: parseInt(e.target.value) || 0 })}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Question"
                      multiline
                      rows={3}
                      value={currentQuestion.question}
                      onChange={(e) => updateQuestion(currentQuestion.id, { question: e.target.value })}
                      placeholder="Enter your question here..."
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Options for Multiple Choice */}
                {(currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'multiple_select') && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Answer Options
                    </Typography>
                    {currentQuestion.type === 'multiple_choice' ? (
                      <RadioGroup
                        value={currentQuestion.correctAnswer}
                        onChange={(e) => updateQuestion(currentQuestion.id, { correctAnswer: e.target.value })}
                      >
                        {currentQuestion.options.map((option, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Radio value={option} />
                            <TextField
                              fullWidth
                              size="small"
                              value={option}
                              onChange={(e) => updateOption(currentQuestion.id, index, e.target.value)}
                            />
                            <IconButton
                              size="small"
                              onClick={() => removeOption(currentQuestion.id, index)}
                              disabled={currentQuestion.options.length <= 2}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                      </RadioGroup>
                    ) : (
                      <FormGroup>
                        {currentQuestion.options.map((option, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Checkbox
                              checked={currentQuestion.correctAnswers.includes(option)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  updateQuestion(currentQuestion.id, {
                                    correctAnswers: [...currentQuestion.correctAnswers, option],
                                  });
                                } else {
                                  updateQuestion(currentQuestion.id, {
                                    correctAnswers: currentQuestion.correctAnswers.filter(a => a !== option),
                                  });
                                }
                              }}
                            />
                            <TextField
                              fullWidth
                              size="small"
                              value={option}
                              onChange={(e) => updateOption(currentQuestion.id, index, e.target.value)}
                            />
                            <IconButton
                              size="small"
                              onClick={() => removeOption(currentQuestion.id, index)}
                              disabled={currentQuestion.options.length <= 2}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                      </FormGroup>
                    )}
                    <Button size="small" startIcon={<AddIcon />} onClick={() => addOption(currentQuestion.id)}>
                      Add Option
                    </Button>
                  </Box>
                )}

                {/* True/False */}
                {currentQuestion.type === 'true_false' && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Correct Answer
                    </Typography>
                    <RadioGroup
                      value={currentQuestion.correctAnswer}
                      onChange={(e) => updateQuestion(currentQuestion.id, { correctAnswer: e.target.value })}
                    >
                      <FormControlLabel value="True" control={<Radio />} label="True" />
                      <FormControlLabel value="False" control={<Radio />} label="False" />
                    </RadioGroup>
                  </Box>
                )}

                {/* Fill in the Blank */}
                {currentQuestion.type === 'fill_blank' && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Correct Answer
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={currentQuestion.correctAnswer}
                      onChange={(e) => updateQuestion(currentQuestion.id, { correctAnswer: e.target.value })}
                      placeholder="Enter the correct answer..."
                      helperText="Use | to separate multiple acceptable answers (e.g., React|react|ReactJS)"
                    />
                  </Box>
                )}

                {/* Short Answer */}
                {currentQuestion.type === 'short_answer' && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Sample Answer (for grading reference)
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      value={currentQuestion.correctAnswer}
                      onChange={(e) => updateQuestion(currentQuestion.id, { correctAnswer: e.target.value })}
                      placeholder="Enter sample answer for manual grading..."
                    />
                  </Box>
                )}

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Explanation (shown after submission)
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={currentQuestion.explanation}
                  onChange={(e) => updateQuestion(currentQuestion.id, { explanation: e.target.value })}
                  placeholder="Explain the correct answer..."
                />
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Quiz Settings */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ position: 'sticky', top: 80 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Quiz Settings
              </Typography>

              <TextField
                fullWidth
                label="Quiz Title"
                value={quizData.title}
                onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={quizData.description}
                onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                sx={{ mb: 2 }}
              />

              <Divider sx={{ my: 2 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={quizData.hasTimeLimit}
                    onChange={(e) => setQuizData({ ...quizData, hasTimeLimit: e.target.checked })}
                  />
                }
                label="Time Limit"
              />

              {quizData.hasTimeLimit && (
                <TextField
                  fullWidth
                  size="small"
                  label="Time Limit (minutes)"
                  type="number"
                  value={quizData.timeLimit}
                  onChange={(e) => setQuizData({ ...quizData, timeLimit: parseInt(e.target.value) || 0 })}
                  sx={{ mt: 1, mb: 2 }}
                />
              )}

              <TextField
                fullWidth
                size="small"
                label="Passing Score (%)"
                type="number"
                value={quizData.passingScore}
                onChange={(e) => setQuizData({ ...quizData, passingScore: parseInt(e.target.value) || 0 })}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                size="small"
                label="Max Attempts"
                type="number"
                value={quizData.maxAttempts}
                onChange={(e) => setQuizData({ ...quizData, maxAttempts: parseInt(e.target.value) || 1 })}
                sx={{ mb: 2 }}
              />

              <Divider sx={{ my: 2 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={quizData.shuffleQuestions}
                    onChange={(e) => setQuizData({ ...quizData, shuffleQuestions: e.target.checked })}
                  />
                }
                label="Shuffle Questions"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={quizData.showCorrectAnswers}
                    onChange={(e) => setQuizData({ ...quizData, showCorrectAnswers: e.target.checked })}
                  />
                }
                label="Show Correct Answers"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
