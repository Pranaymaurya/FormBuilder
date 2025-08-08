import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Eye, Users, Calendar, LogOut, ExternalLink, Copy } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

export default function DashboardPage() {
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()

  useEffect(() => {
    fetchForms()
  }, [])

  const fetchForms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/forms')
      console.log('Fetched forms:', response.data)
      setForms(response.data)
    } catch (error) {
      console.error("Error fetching forms:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyShareLink = (formId) => {
    const shareUrl = `${window.location.origin}/forms/${formId}/fill`
    navigator.clipboard.writeText(shareUrl)
    alert("Share link copied to clipboard!")
  }

  const togglePublishStatus = async (formId, currentStatus) => {
    try {
      // First get the form data
      const formResponse = await axios.get(`http://localhost:5000/api/forms/${formId}`)
      const formData = formResponse.data
      
      // Update the published status
      await axios.put(`http://localhost:5000/api/forms/${formId}`, {
        ...formData,
        isPublished: !currentStatus
      })
      
      // Refresh the forms list
      fetchForms()
    } catch (error) {
      console.error('Error updating form status:', error)
      alert('Failed to update form status')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">FormCraft</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
            <Link to="/forms/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Form
              </Button>
            </Link>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your forms and view responses</p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : forms.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No forms yet</h3>
              <p className="text-gray-600 mb-6">Create your first form to get started</p>
              <Link to="/forms/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Form
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <Card key={form._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{form.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={form.isPublished ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => togglePublishStatus(form._id, form.isPublished)}
                      >
                        {form.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </div>
                  {form.description && (
                    <CardDescription>{form.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {form.responses} responses
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(form.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {/* Share Link Section */}
                  {form.isPublished && (
                    <div className="mb-4 p-2 bg-green-50 rounded border border-green-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-700 font-medium">Form is live!</span>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyShareLink(form._id)}
                            className="h-6 px-2 text-green-700 hover:text-green-800"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Link 
                            to={`/forms/${form._id}/fill`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-green-700 hover:text-green-800"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <Link to={`/forms/${form._id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Edit
                      </Button>
                    </Link>
                    <Link to={`/forms/${form._id}/responses`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
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
