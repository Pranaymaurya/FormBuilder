import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CategorizeQuestion } from "@/components/questions/CategorizeQuestion"
import { ClozeQuestion } from "@/components/questions/ClozeQuestion"
import { ComprehensionQuestion } from "@/components/questions/ComprehensionQuestion"
import { MultipleChoiceQuestion } from "@/components/questions/MultipleChoiceQuestion"
import { CheckCircle } from 'lucide-react'
import axios from 'axios'

export default function FillFormPage() {
  const { id } = useParams()
  const [form, setForm] = useState(null)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetchForm()
  }, [id])

  const fetchForm = async () => {
    try {
      const response = await axios.get(`https://formbuilder-td9t.onrender.com/api/forms/${id}/public`)
      setForm(response.data)
    } catch (error) {
      console.error("Error fetching form:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await axios.post(`https://formbuilder-td9t.onrender.com/api/forms/${id}/responses`, { answers })
      setSubmitted(true)
    } catch (error) {
      alert("Error submitting form")
    } finally {
      setSubmitting(false)
    }
  }

  const renderQuestion = (question, index) => {
    const commonProps = {
      question,
      questionNumber: index + 1,
      onAnswer: (answer) => handleAnswer(question.id, answer)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading form...</p>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">Form Not Found</h2>
            <p className="text-gray-600">The form you're looking for doesn't exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Thank You!</h2>
            <p className="text-gray-600">Your response has been submitted successfully.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader className="text-center">
            {form.headerImage && (
              <img
                src={form.headerImage || "/placeholder.svg"}
                alt="Form header"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <CardTitle className="text-2xl">{form.title}</CardTitle>
            {form.description && (
              <p className="text-gray-600 mt-2">{form.description}</p>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {form.questions.map((question, index) => renderQuestion(question, index))}
            </div>
            
            <div className="mt-8 text-center">
              <Button 
                onClick={handleSubmit} 
                disabled={submitting}
                size="lg"
                className="px-8"
              >
                {submitting ? "Submitting..." : "Submit Form"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
