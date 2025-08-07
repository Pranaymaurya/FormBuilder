import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import PropTypes from 'prop-types'

export function ComprehensionQuestion({ question, questionNumber, onAnswer }) {
  const [answers, setAnswers] = useState({})

  const handleAnswerChange = (questionIndex, optionIndex) => {
    const newAnswers = { ...answers, [questionIndex]: optionIndex }
    setAnswers(newAnswers)
    onAnswer(newAnswers)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question {questionNumber}: {question.title}</CardTitle>
        <p className="text-sm text-gray-600">Read the passage and answer the questions below</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Reading Passage */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-3">Reading Passage:</h4>
          <div className="prose prose-sm max-w-none">
            {question.content.passage.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-3 last:mb-0">{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {question.content.questions.map((q, qIndex) => (
            <div key={qIndex} className="border-l-4 border-blue-200 pl-4">
              <h5 className="font-medium mb-3">{qIndex + 1}. {q.question}</h5>
              <RadioGroup
                value={answers[qIndex]?.toString()}
                onValueChange={(value) => handleAnswerChange(qIndex, parseInt(value))}
              >
                {q.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center space-x-2">
                    <RadioGroupItem value={optIndex.toString()} id={`q${qIndex}-opt${optIndex}`} />
                    <Label htmlFor={`q${qIndex}-opt${optIndex}`} className="cursor-pointer">
                      {String.fromCharCode(65 + optIndex)}. {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

ComprehensionQuestion.propTypes = {
  question: PropTypes.object.isRequired,
  questionNumber: PropTypes.number.isRequired,
  onAnswer: PropTypes.func.isRequired
}
