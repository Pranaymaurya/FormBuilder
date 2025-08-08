import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download } from 'lucide-react'
import axios from 'axios'

export default function ResponsesPage() {
  const { id } = useParams()
  const [form, setForm] = useState(null)
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFormAndResponses()
  }, [id])

  const fetchFormAndResponses = async () => {
    try {
      const [formResponse, responsesResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/forms/${id}`),
        axios.get(`http://localhost:5000/api/forms/${id}/responses`)
      ])
      
      setForm(formResponse.data)
      setResponses(responsesResponse.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportResponses = () => {
    // Simple CSV export
    const csvContent = responses.map(response => {
      const answers = Object.values(response.answers).map(answer => {
        if (typeof answer === 'object') {
          return JSON.stringify(answer)
        }
        return answer
      })
      return answers.join(',')
    }).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${form?.title || 'form'}-responses.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading responses...</p>
        </div>
      </div>
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
            <h1 className="text-xl font-semibold">Form Responses</h1>
          </div>
          <Button onClick={exportResponses} disabled={responses.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">{form?.title}</h2>
          <p className="text-gray-600">{responses.length} responses collected</p>
        </div>

        {responses.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">No responses yet</h3>
              <p className="text-gray-600 mb-6">Share your form to start collecting responses</p>
              <Button onClick={() => {
                const shareUrl = `${window.location.origin}/forms/${id}/fill`
                navigator.clipboard.writeText(shareUrl)
                alert("Share link copied to clipboard!")
              }}>
                Copy Share Link
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {responses.map((response, index) => (
              <Card key={response._id}>
                <CardHeader>
                  <CardTitle>Response #{index + 1}</CardTitle>
                  <p className="text-sm text-gray-600">
                    Submitted on {new Date(response.createdAt).toLocaleString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(response.answers).map(([questionId, answer]) => {
                      const question = form?.questions.find(q => q.id === questionId)
                      return (
                        <div key={questionId} className="border-l-4 border-blue-200 pl-4">
                          <h4 className="font-medium mb-2">
                            {question?.title || `Question ${questionId}`}
                          </h4>
                          <div className="text-sm text-gray-700">
                            {typeof answer === 'object' ? (
                              <pre className="whitespace-pre-wrap">
                                {JSON.stringify(answer, null, 2)}
                              </pre>
                            ) : (
                              <p>{answer}</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
