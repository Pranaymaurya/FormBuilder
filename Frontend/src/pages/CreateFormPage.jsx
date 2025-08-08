import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Plus, Save, Eye } from 'lucide-react'
import { QuestionPalette } from "@/components/QuestionPalette"
import { QuestionEditor } from "@/components/QuestionEditor"
import { FormPreview } from "@/components/FormPreview"
import axios from 'axios'

export default function CreateFormPage() {
  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [headerImage, setHeaderImage] = useState("")
  const [isPublished, setIsPublished] = useState(true) // Default to published
  const [questions, setQuestions] = useState([])
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now().toString(),
      type,
      title: `New ${type} question`,
      content: getDefaultContent(type)
    }
    setQuestions([...questions, newQuestion])
    setSelectedQuestion(newQuestion.id)
  }

  const getDefaultContent = (type) => {
    switch (type) {
      case "categorize":
        return {
          items: ["Item 1", "Item 2"],
          categories: ["Category A", "Category B"]
        }
      case "cloze":
        return {
          text: "The quick brown fox jumps over the <u>lazy</u> dog and runs through the <u>forest</u>."
        }
      case "comprehension":
        return {
          passage: "Enter your passage here...",
          questions: [
            { question: "Sample question?", options: ["A", "B", "C", "D"], correct: 0 }
          ]
        }
      case "multiple-choice":
        return {
          question: "Your question here?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correct: 0
        }
      default:
        return {}
    }
  }

  const updateQuestion = (id, updates) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q))
  }

  const deleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id))
    if (selectedQuestion === id) {
      setSelectedQuestion(null)
    }
  }

  const saveForm = async () => {
    if (!formTitle.trim()) {
      alert("Please enter a form title")
      return
    }

    setSaving(true)
    try {
      const response = await axios.post('http://localhost:5000/api/forms', {
        title: formTitle,
        description: formDescription,
        headerImage,
        questions,
        isPublished // Include published status
      })

      console.log('Form created:', response.data)
      navigate(`/forms/${response.data._id}/edit`)
    } catch (error) {
      console.error('Save form error:', error)
      alert("Failed to save form")
    } finally {
      setSaving(false)
    }
  }

  if (showPreview) {
    return (
      <FormPreview
        title={formTitle}
        description={formDescription}
        headerImage={headerImage}
        questions={questions}
        onClose={() => setShowPreview(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Create Form</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setShowPreview(true)}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={saveForm} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Form"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Form Settings */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Form Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Form Title</Label>
                  <Input
                    id="title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Enter form title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Optional description"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="headerImage">Header Image URL</Label>
                  <Input
                    id="headerImage"
                    value={headerImage}
                    onChange={(e) => setHeaderImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                  />
                  <Label htmlFor="published">Publish immediately</Label>
                </div>
              </CardContent>
            </Card>

            <QuestionPalette onAddQuestion={addQuestion} />
          </div>

          {/* Questions List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Questions ({questions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {questions.length === 0 ? (
                  <p className="text-gray-500 text-sm">No questions added yet</p>
                ) : (
                  <div className="space-y-2">
                    {questions.map((question, index) => (
                      <div
                        key={question.id}
                        className={`p-3 rounded border cursor-pointer transition-colors ${
                          selectedQuestion === question.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedQuestion(question.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">Q{index + 1}</p>
                            <p className="text-xs text-gray-600 capitalize">{question.type}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteQuestion(question.id)
                            }}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            ×
                          </Button>
                        </div>
                        <p className="text-sm mt-1 truncate">{question.title}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Question Editor */}
          <div className="lg:col-span-2">
            {selectedQuestion ? (
              <QuestionEditor
                question={questions.find(q => q.id === selectedQuestion)}
                onUpdate={(updates) => updateQuestion(selectedQuestion, updates)}
              />
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <Plus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a question to edit
                    </h3>
                    <p className="text-gray-500">
                      Choose a question from the list or add a new one
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
