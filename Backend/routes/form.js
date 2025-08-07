const express = require('express')
const Form = require('../models/form')
const Response = require('../models/response')
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
    const { title, description, headerImage, questions } = req.body

    const form = new Form({
      title,
      description,
      headerImage,
      questions,
      createdBy: req.userId,
      isPublished: false
    })

    await form.save()
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

// Get public form (for filling)
router.get('/:id/public', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id)
      .select('title description headerImage questions isPublished')

    if (!form || !form.isPublished) {
      return res.status(404).json({ error: 'Form not found' })
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

    const form = await Form.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.userId },
      { title, description, headerImage, questions, isPublished },
      { new: true }
    )

    if (!form) {
      return res.status(404).json({ error: 'Form not found' })
    }

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

    // Verify form exists and is published
    const form = await Form.findById(req.params.id)
    if (!form || !form.isPublished) {
      return res.status(404).json({ error: 'Form not found' })
    }

    const response = new Response({
      formId: req.params.id,
      answers,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    })

    await response.save()
    res.json({ message: 'Response submitted successfully' })
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
