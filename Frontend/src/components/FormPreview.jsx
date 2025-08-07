import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from 'lucide-react'
import { CategorizeQuestion } from "@/components/questions/CategorizeQuestion"
import { ClozeQuestion } from "@/components/questions/ClozeQuestion"
import { ComprehensionQuestion } from "@/components/questions/ComprehensionQuestion"
import { MultipleChoiceQuestion } from "@/components/questions/MultipleChoiceQuestion"
import PropTypes from 'prop-types'

export function FormPreview({ title, description, headerImage, questions, onClose }) {
  const renderQuestion = (question, index) => {
    const commonProps = {
      question,
      questionNumber: index + 1,
      onAnswer: () => {} // Preview mode - no actual answering
    }

    switch (question.type) {
      case "categorize":
        return <CategorizeQuestion key={question.id} {...commonProps} />
      case "cloze":
        return <ClozeQuestion key={question.id} {...commonProps} />
      case "comprehension":
        return <ComprehensionQuestion key={question.id} {...commonProps} />
      case "multiple-choice":
        return <MultipleChoiceQuestion key={question.id} {...commonProps} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Form Preview</h1>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close Preview
          </Button>
        </div>
      </header>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader className="text-center">
            {headerImage && (
              <img
                src={headerImage || "/placeholder.svg"}
                alt="Form header"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <CardTitle className="text-2xl">{title || "Untitled Form"}</CardTitle>
            {description && (
              <p className="text-gray-600 mt-2">{description}</p>
            )}
          </CardHeader>
          <CardContent>
            {questions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No questions added yet</p>
              </div>
            ) : (
              <div className="space-y-8">
                {questions.map((question, index) => renderQuestion(question, index))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

FormPreview.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  headerImage: PropTypes.string,
  questions: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired
}
