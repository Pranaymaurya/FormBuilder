import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import PropTypes from 'prop-types'

export function MultipleChoiceQuestion({ question, questionNumber, onAnswer }) {
  const [selectedOption, setSelectedOption] = useState("")

  const handleAnswerChange = (value) => {
    setSelectedOption(value)
    onAnswer(parseInt(value))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question {questionNumber}: {question.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-lg">{question.content.question}</p>
          <RadioGroup value={selectedOption} onValueChange={handleAnswerChange}>
            {question.content.options.map((option, index) => (
              <div key={index} className={`flex items-center space-x-2 p-2 rounded transition-colors ${
                selectedOption === index.toString() ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
              }`}>
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1">
                  {String.fromCharCode(65 + index)}. {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}

MultipleChoiceQuestion.propTypes = {
  question: PropTypes.object.isRequired,
  questionNumber: PropTypes.number.isRequired,
  onAnswer: PropTypes.func.isRequired
}
