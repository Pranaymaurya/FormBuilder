import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from 'lucide-react'
import { RichTextEditor } from './RichTextEditor'
import PropTypes from 'prop-types'

export function QuestionEditor({ question, onUpdate }) {
  const updateContent = (updates) => {
    onUpdate({ content: { ...question.content, ...updates } })
  }

  const renderCategorizeEditor = () => (
    <div className="space-y-4">
      <div>
        <Label>Items to Categorize</Label>
        <div className="space-y-2 mt-2">
          {question.content.items.map((item, index) => (
            <div key={index} className="flex space-x-2">
              <Input
                value={item}
                onChange={(e) => {
                  const newItems = [...question.content.items]
                  newItems[index] = e.target.value
                  updateContent({ items: newItems })
                }}
                placeholder={`Item ${index + 1}`}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newItems = question.content.items.filter((_, i) => i !== index)
                  updateContent({ items: newItems })
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateContent({ items: [...question.content.items, "New Item"] })}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <div>
        <Label>Categories</Label>
        <div className="space-y-2 mt-2">
          {question.content.categories.map((category, index) => (
            <div key={index} className="flex space-x-2">
              <Input
                value={category}
                onChange={(e) => {
                  const newCategories = [...question.content.categories]
                  newCategories[index] = e.target.value
                  updateContent({ categories: newCategories })
                }}
                placeholder={`Category ${index + 1}`}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newCategories = question.content.categories.filter((_, i) => i !== index)
                  updateContent({ categories: newCategories })
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateContent({ categories: [...question.content.categories, "New Category"] })}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>
    </div>
  )

  const renderClozeEditor = () => (
    <div className="space-y-4">
      <div>
        <Label>Text with Underlined Answers</Label>
        <div className="mt-2">
          <RichTextEditor
            value={question.content.text}
            onChange={(value) => updateContent({ text: value })}
            placeholder="Enter text and underline words that should become blanks"
          />
        </div>
      </div>

      <div>
        <Label>Drag & Drop Preview</Label>
        <div className="border rounded p-3 bg-gray-50 mt-2">
          <div className="text-lg leading-relaxed mb-4">
            {renderClozePreview(question.content.text)}
          </div>
          <div className="border-t pt-3">
            <p className="text-sm font-medium mb-2">Available words to drag:</p>
            <div className="flex flex-wrap gap-2">
              {extractAnswersFromText(question.content.text).map((answer, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                >
                  {answer}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label>Correct Answers</Label>
        <div className="space-y-2 mt-2">
          {extractAnswersFromText(question.content.text).map((answer, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-sm font-medium w-16">Blank {index + 1}:</span>
              <Input
                value={answer}
                readOnly
                className="flex-1 bg-gray-50"
              />
            </div>
          ))}
          {extractAnswersFromText(question.content.text).length === 0 && (
            <p className="text-sm text-gray-500">
              Underline text in the content above to create fillable blanks
            </p>
          )}
        </div>
      </div>
    </div>
  )

  // Helper function to render cloze preview
  const renderClozePreview = (text) => {
    const parts = text.split(/(<u>.*?<\/u>)/g)
    let blankIndex = 0
    
    return parts.map((part, index) => {
      if (part.match(/<u>.*?<\/u>/)) {
        blankIndex++
        return (
          <span 
            key={index} 
            className="inline-block w-24 h-8 border-2 border-dashed border-gray-300 mx-1 text-center text-xs text-gray-500 rounded bg-gray-100 flex items-center justify-center"
          >
            [{blankIndex}]
          </span>
        )
      } else {
        return <span key={index}>{part}</span>
      }
    })
  }

  // Helper function to extract answers from underlined text
  const extractAnswersFromText = (text) => {
    const matches = text.match(/<u>(.*?)<\/u>/g)
    if (!matches) return []
    return matches.map(match => match.replace(/<\/?u>/g, ''))
  }

  const renderComprehensionEditor = () => (
    <div className="space-y-4">
      <div>
        <Label>Reading Passage</Label>
        <Textarea
          value={question.content.passage}
          onChange={(e) => updateContent({ passage: e.target.value })}
          placeholder="Enter the reading passage here..."
          rows={6}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Questions</Label>
        <div className="space-y-4 mt-2">
          {question.content.questions.map((q, index) => (
            <Card key={index}>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <Label>Question {index + 1}</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newQuestions = question.content.questions.filter((_, i) => i !== index)
                        updateContent({ questions: newQuestions })
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    value={q.question}
                    onChange={(e) => {
                      const newQuestions = [...question.content.questions]
                      newQuestions[index].question = e.target.value
                      updateContent({ questions: newQuestions })
                    }}
                    placeholder="Enter question"
                  />
                  <div className="space-y-2">
                    {q.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newQuestions = [...question.content.questions]
                            newQuestions[index].options[optIndex] = e.target.value
                            updateContent({ questions: newQuestions })
                          }}
                          placeholder={`Option ${optIndex + 1}`}
                        />
                        <Button
                          variant={q.correct === optIndex ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const newQuestions = [...question.content.questions]
                            newQuestions[index].correct = optIndex
                            updateContent({ questions: newQuestions })
                          }}
                        >
                          {q.correct === optIndex ? "✓" : "○"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newQuestion = {
                question: "",
                options: ["", "", "", ""],
                correct: 0
              }
              updateContent({ questions: [...question.content.questions, newQuestion] })
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>
      </div>
    </div>
  )

  const renderMultipleChoiceEditor = () => (
    <div className="space-y-4">
      <div>
        <Label>Question</Label>
        <Input
          value={question.content.question}
          onChange={(e) => updateContent({ question: e.target.value })}
          placeholder="Enter your question"
          className="mt-2"
        />
      </div>

      <div>
        <Label>Options</Label>
        <div className="space-y-2 mt-2">
          {question.content.options.map((option, index) => (
            <div key={index} className="flex space-x-2">
              <Input
                value={option}
                onChange={(e) => {
                  const newOptions = [...question.content.options]
                  newOptions[index] = e.target.value
                  updateContent({ options: newOptions })
                }}
                placeholder={`Option ${index + 1}`}
              />
              <Button
                variant={question.content.correct === index ? "default" : "outline"}
                size="sm"
                onClick={() => updateContent({ correct: index })}
              >
                {question.content.correct === index ? "✓" : "○"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="capitalize">{question.type} Question</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="questionTitle">Question Title</Label>
          <Input
            id="questionTitle"
            value={question.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Enter question title"
          />
        </div>

        {question.type === "categorize" && renderCategorizeEditor()}
        {question.type === "cloze" && renderClozeEditor()}
        {question.type === "comprehension" && renderComprehensionEditor()}
        {question.type === "multiple-choice" && renderMultipleChoiceEditor()}
      </CardContent>
    </Card>
  )
}

QuestionEditor.propTypes = {
  question: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired
}
