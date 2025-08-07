import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Grid3X3, FileText, BookOpen, CheckCircle } from 'lucide-react'
import PropTypes from 'prop-types'

export function QuestionPalette({ onAddQuestion }) {
  const questionTypes = [
    {
      type: "categorize",
      name: "Categorize",
      description: "Drag items into categories",
      icon: Grid3X3,
      color: "text-blue-600"
    },
    {
      type: "cloze",
      name: "Cloze",
      description: "Fill in the blanks",
      icon: FileText,
      color: "text-green-600"
    },
    {
      type: "comprehension",
      name: "Comprehension",
      description: "Reading passage with questions",
      icon: BookOpen,
      color: "text-purple-600"
    },
    {
      type: "multiple-choice",
      name: "Multiple Choice",
      description: "Select one option",
      icon: CheckCircle,
      color: "text-orange-600"
    }
  ]

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Question Types</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {questionTypes.map((type) => (
          <Button
            key={type.type}
            variant="outline"
            className="w-full justify-start h-auto p-3"
            onClick={() => onAddQuestion(type.type)}
          >
            <div className="flex items-start space-x-3">
              <type.icon className={`h-5 w-5 mt-0.5 ${type.color}`} />
              <div className="text-left">
                <p className="font-medium">{type.name}</p>
                <p className="text-xs text-gray-500">{type.description}</p>
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}

QuestionPalette.propTypes = {
  onAddQuestion: PropTypes.func.isRequired
}
