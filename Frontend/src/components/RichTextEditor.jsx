import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Underline, Type, Eye } from 'lucide-react'
import PropTypes from 'prop-types'

export function RichTextEditor({ value, onChange, placeholder }) {
  const textareaRef = useRef(null)
  const [showPreview, setShowPreview] = useState(false)

  const handleUnderline = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)

    if (selectedText) {
      const newValue = 
        value.substring(0, start) + 
        `<u>${selectedText}</u>` + 
        value.substring(end)
      
      onChange(newValue)
      
      // Restore cursor position
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + 3, end + 3)
      }, 0)
    }
  }

  const removeFormatting = () => {
    const cleanText = value.replace(/<\/?u>/g, '')
    onChange(cleanText)
  }

  const renderDragDropPreview = () => {
    const parts = value.split(/(<u>.*?<\/u>)/g)
    let blankIndex = 0
    
    return (
      <div className="space-y-4">
        <div className="text-lg leading-relaxed">
          {parts.map((part, index) => {
            if (part.match(/<u>.*?<\/u>/)) {
              blankIndex++
              return (
                <span 
                  key={index} 
                  className="inline-block w-24 h-8 border-2 border-dashed border-blue-300 mx-1 text-center text-xs text-blue-600 rounded bg-blue-50 flex items-center justify-center"
                >
                  [{blankIndex}]
                </span>
              )
            } else {
              return <span key={index}>{part}</span>
            }
          })}
        </div>
        
        <div className="border-t pt-3">
          <p className="text-sm font-medium mb-2 text-gray-700">Words available for dragging:</p>
          <div className="flex flex-wrap gap-2">
            {value.match(/<u>(.*?)<\/u>/g)?.map((match, index) => {
              const word = match.replace(/<\/?u>/g, '')
              return (
                <span 
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                >
                  {word}
                </span>
              )
            }) || <span className="text-gray-500 text-sm">No words underlined yet</span>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 mb-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUnderline}
          className="flex items-center space-x-1"
        >
          <Underline className="h-4 w-4" />
          <span>Underline Selected</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={removeFormatting}
          className="flex items-center space-x-1"
        >
          <Type className="h-4 w-4" />
          <span>Remove Formatting</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center space-x-1"
        >
          <Eye className="h-4 w-4" />
          <span>{showPreview ? 'Edit' : 'Preview'}</span>
        </Button>
      </div>

      {showPreview ? (
        <div className="border rounded p-4 bg-gray-50 min-h-[150px]">
          {renderDragDropPreview()}
        </div>
      ) : (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="font-mono text-sm"
        />
      )}

      <p className="text-xs text-gray-500">
        Select text and click "Underline Selected" to mark it as a fillable blank. 
        Users will drag these words into the correct positions.
      </p>
    </div>
  )
}

RichTextEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string
}
