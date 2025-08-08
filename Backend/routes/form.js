const express = require('express')
const Form = require('../models/form')
const Response = require('../models/Response')
const auth = require('../middleware/auth')

const router = express.Router()

// Get all forms for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const forms = await Form.find({ createdBy: req.userId })
      .sort({ createdAt: -1 })
      .select('title description createdAt isPublished')

    // Add response count for each form
    const formsWithCounts = await Promise.all(
      forms.map(async (form) => {
        const responseCount = await Response.countDocuments({ formId: form._id })
        return {
          ...form.toObject(),
          responses: responseCount
        }
      })
    )

    res.json(formsWithCounts)
  } catch (error) {
    console.error('Get forms error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Create new form
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, headerImage, questions, isPublished = false } = req.body

    console.log('Creating form with data:', { title, description, isPublished, questionsCount: questions?.length })

    const form = new Form({
      title,
      description,
      headerImage,
      questions: questions || [],
      createdBy: req.userId,
      isPublished: Boolean(isPublished)
    })

    await form.save()
    console.log('Form created successfully:', form._id)
    res.status(201).json(form)
  } catch (error) {
    console.error('Create form error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get form by ID (for editing)
router.get('/:id', auth, async (req, res) => {
  try {
    const form = await Form.findOne({
      _id: req.params.id,
      createdBy: req.userId
    })

    if (!form) {
      return res.status(404).json({ error: 'Form not found' })
    }

    res.json(form)
  } catch (error) {
    console.error('Get form error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get public form (for filling) - FIXED VERSION
router.get('/:id/public', async (req, res) => {
  try {
    console.log('Fetching public form with ID:', req.params.id)
    
    const form = await Form.findById(req.params.id)
      .select('title description headerImage questions isPublished')

    console.log('Found form:', form ? {
      id: form._id,
      title: form.title,
      isPublished: form.isPublished,
      questionsCount: form.questions?.length
    } : 'null')

    if (!form) {
      console.log('Form not found in database')
      return res.status(404).json({ error: 'Form not found' })
    }

    if (!form.isPublished) {
      console.log('Form exists but is not published')
      return res.status(404).json({ error: 'Form not published' })
    }

    res.json(form)
  } catch (error) {
    console.error('Get public form error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Update form
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, headerImage, questions, isPublished } = req.body

    console.log('Updating form:', req.params.id, { title, isPublished })

    const form = await Form.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.userId },
      { 
        title, 
        description, 
        headerImage, 
        questions: questions || [], 
        isPublished: Boolean(isPublished) 
      },
      { new: true }
    )

    if (!form) {
      return res.status(404).json({ error: 'Form not found' })
    }

    console.log('Form updated successfully')
    res.json(form)
  } catch (error) {
    console.error('Update form error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Submit form response
router.post('/:id/responses', async (req, res) => {
  try {
    const { answers } = req.body

    console.log('Submitting response for form:', req.params.id)

    // Verify form exists and is published
    const form = await Form.findById(req.params.id)
    if (!form) {
      console.log('Form not found for response submission')
      return res.status(404).json({ error: 'Form not found' })
    }

    if (!form.isPublished) {
      console.log('Form not published for response submission')
      return res.status(404).json({ error: 'Form not available' })
    }

    // Process answers
    const processedAnswers = {}
    
    if (form.questions && form.questions.length > 0) {
      form.questions.forEach(question => {
        const answer = answers[question.id]
        if (answer !== undefined && answer !== null) {
          switch (question.type) {
            case 'categorize':
              processedAnswers[question.id] = typeof answer === 'object' ? answer : {}
              break
            case 'cloze':
              processedAnswers[question.id] = Array.isArray(answer) ? answer : []
              break
            case 'comprehension':
              processedAnswers[question.id] = typeof answer === 'object' ? answer : {}
              break
            case 'multiple-choice':
              processedAnswers[question.id] = typeof answer === 'number' ? answer : parseInt(answer) || 0
              break
            default:
              processedAnswers[question.id] = answer
          }
        }
      })
    }

    const response = new Response({
      formId: req.params.id,
      answers: processedAnswers,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    })

    await response.save()
    console.log('Response saved successfully')
    
    res.json({ 
      message: 'Response submitted successfully',
      responseId: response._id 
    })
  } catch (error) {
    console.error('Submit response error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get form responses
router.get('/:id/responses', auth, async (req, res) => {
  try {
    // Verify user owns the form
    const form = await Form.findOne({
      _id: req.params.id,
      createdBy: req.userId
    })

    if (!form) {
      return res.status(404).json({ error: 'Form not found' })
    }

    const responses = await Response.find({ formId: req.params.id })
      .sort({ createdAt: -1 })

    res.json(responses)
  } catch (error) {
    console.error('Get responses error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
