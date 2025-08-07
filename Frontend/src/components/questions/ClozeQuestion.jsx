import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import PropTypes from 'prop-types'

export function ClozeQuestion({ question, questionNumber, onAnswer }) {
  // Extract answers from underlined text
  const extractAnswersFromText = (text) => {
    const matches = text.match(/<u>(.*?)<\/u>/g)
    if (!matches) return []
    return matches.map(match => match.replace(/<\/?u>/g, ''))
  }

  const correctAnswers = extractAnswersFromText(question.content.text)
  const [answers, setAnswers] = useState(new Array(correctAnswers.length).fill(""))
  const [draggedWord, setDraggedWord] = useState(null)

  // Shuffle the correct answers for drag options
  const [dragOptions] = useState(() => {
    const shuffled = [...correctAnswers]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  })

  const handleDragStart = (word) => {
    setDraggedWord(word)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, blankIndex) => {
    e.preventDefault()
    if (draggedWord) {
      const newAnswers = [...answers]
      
      // Remove the word from its current position if it exists
      const currentIndex = newAnswers.indexOf(draggedWord)
      if (currentIndex !== -1) {
        newAnswers[currentIndex] = ""
      }
      
      // Place the word in the new position
      newAnswers[blankIndex] = draggedWord
      
      setAnswers(newAnswers)
      onAnswer(newAnswers)
      setDraggedWord(null)
    }
  }

  const handleWordClick = (word) => {
    // Find the first empty blank and fill it
    const emptyIndex = answers.findIndex(answer => answer === "")
    if (emptyIndex !== -1) {
      const newAnswers = [...answers]
      newAnswers[emptyIndex] = word
      setAnswers(newAnswers)
      onAnswer(newAnswers)
    }
  }

  const handleBlankClick = (blankIndex) => {
    // Clear the blank
    if (answers[blankIndex]) {
      const newAnswers = [...answers]
      newAnswers[blankIndex] = ""
      setAnswers(newAnswers)
      onAnswer(newAnswers)
    }
  }

  const getAvailableWords = () => {
    return dragOptions.filter(word => !answers.includes(word))
  }

  const renderTextWithBlanks = () => {
    let text = question.content.text
    let blankIndex = 0
    
    // Replace underlined text with drop zones
    const parts = text.split(/(<u>.*?<\/u>)/g)
    
    return parts.map((part, index) => {
      if (part.match(/<u>.*?<\/u>/)) {
        const currentBlankIndex = blankIndex
        blankIndex++
        return (
          <div
            key={index}
            className={`inline-block min-w-[120px] mx-2 p-2 border-2 border-dashed rounded-md text-center cursor-pointer transition-colors ${
              answers[currentBlankIndex] 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 hover:border-blue-400 bg-gray-50'
            }`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, currentBlankIndex)}
            onClick={() => handleBlankClick(currentBlankIndex)}
          >
            {answers[currentBlankIndex] ? (
              <Badge 
                variant="default" 
                className="cursor-pointer hover:bg-blue-600"
                draggable
                onDragStart={() => handleDragStart(answers[currentBlankIndex])}
              >
                {answers[currentBlankIndex]}
              </Badge>
            ) : (
              <span className="text-gray-400 text-sm">Drop here</span>
            )}
          </div>
        )
      } else {
        // Remove any remaining HTML tags and return clean text
        return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question {questionNumber}: {question.title}</CardTitle>
        <p className="text-sm text-gray-600">Drag the words below into the correct blanks</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Text with blanks */}
        <div className="text-lg leading-relaxed p-4 bg-gray-50 rounded-lg">
          {renderTextWithBlanks()}
        </div>

        {/* Available words to drag */}
        <div>
          <h4 className="font-medium mb-3">Available Words:</h4>
          <div className="flex flex-wrap gap-2 p-4 border-2 border-dashed border-gray-200 rounded-lg min-h-[60px]">
            {getAvailableWords().length > 0 ? (
              getAvailableWords().map((word, index) => (
                <Badge
                  key={`${word}-${index}`}
                  variant="secondary"
                  className="cursor-move p-2 hover:bg-gray-200 select-none"
                  draggable
                  onDragStart={() => handleDragStart(word)}
                  onClick={() => handleWordClick(word)}
                >
                  {word}
                </Badge>
              ))
            ) : (
              <span className="text-gray-400 text-sm">All words have been used</span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Drag words to blanks or click a word to fill the next empty blank. Click filled blanks to remove words.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="text-sm text-gray-600">
          Progress: {answers.filter(answer => answer !== "").length} / {correctAnswers.length} blanks filled
        </div>
      </CardContent>
    </Card>
  )
}

ClozeQuestion.propTypes = {
  question: PropTypes.object.isRequired,
  questionNumber: PropTypes.number.isRequired,
  onAnswer: PropTypes.func.isRequired
}
