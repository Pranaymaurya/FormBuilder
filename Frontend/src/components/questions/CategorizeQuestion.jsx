import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import PropTypes from 'prop-types'

export function CategorizeQuestion({ question, questionNumber, onAnswer }) {
  const [draggedItem, setDraggedItem] = useState(null)
  const [categorizedItems, setCategorizedItems] = useState({})

  const handleDragStart = (item) => {
    setDraggedItem(item)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, category) => {
    e.preventDefault()
    if (draggedItem) {
      const newCategorizedItems = { ...categorizedItems }
      
      // Remove item from all categories first
      Object.keys(newCategorizedItems).forEach(cat => {
        newCategorizedItems[cat] = newCategorizedItems[cat]?.filter(item => item !== draggedItem) || []
      })
      
      // Add to new category
      if (!newCategorizedItems[category]) {
        newCategorizedItems[category] = []
      }
      newCategorizedItems[category].push(draggedItem)
      
      setCategorizedItems(newCategorizedItems)
      onAnswer(newCategorizedItems)
      setDraggedItem(null)
    }
  }

  const getUncategorizedItems = () => {
    const categorized = Object.values(categorizedItems).flat()
    return question.content.items.filter(item => !categorized.includes(item))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question {questionNumber}: {question.title}</CardTitle>
        <p className="text-sm text-gray-600">Drag items into the correct categories</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Uncategorized Items */}
          <div>
            <h4 className="font-medium mb-3">Items to Categorize:</h4>
            <div className="flex flex-wrap gap-2">
              {getUncategorizedItems().map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="cursor-move p-2 hover:bg-gray-200"
                  draggable
                  onDragStart={() => handleDragStart(item)}
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="grid md:grid-cols-2 gap-4">
            {question.content.categories.map((category) => (
              <div
                key={category}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[120px] hover:border-blue-400 transition-colors"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, category)}
              >
                <h4 className="font-medium mb-3">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {(categorizedItems[category] || []).map((item) => (
                    <Badge
                      key={item}
                      variant="default"
                      className="cursor-move"
                      draggable
                      onDragStart={() => handleDragStart(item)}
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

CategorizeQuestion.propTypes = {
  question: PropTypes.object.isRequired,
  questionNumber: PropTypes.number.isRequired,
  onAnswer: PropTypes.func.isRequired
}
