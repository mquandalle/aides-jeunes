const mongoose = require("mongoose")
const find = require("lodash/find")
const validator = require("validator")

const { SendSmtpEmail, sendEmail } = require("../lib/send-in-blue")
const utils = require("../lib/utils")

const renderInitial = require("../lib/mes-aides/emails/initial").render
const renderSurvey = require("../lib/mes-aides/emails/survey").render

const SurveySchema = new mongoose.Schema(
  {
    _id: { type: String },
    createdAt: { type: Date, default: Date.now },
    messageId: { type: String },
    repliedAt: { type: Date },
    error: { type: Object },
    answers: [
      {
        id: String,
        value: String,
        comments: String,
      },
    ],
    type: { type: String },
  },
  { minimize: false, id: false }
)

SurveySchema.virtual("returnPath").get(function () {
  return "/suivi?token=" + this._id
})

const FollowupSchema = new mongoose.Schema(
  {
    answers: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
    },
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: "{VALUE} n'est pas un email valide",
        isAsync: false,
      },
    },
    createdAt: { type: Date, default: Date.now },
    sentAt: { type: Date },
    messageId: { type: String },
    surveySentAt: { type: Date },
    benefits: { type: Object },
    surveyOptin: { type: Boolean, default: false },
    surveys: {
      type: [SurveySchema],
      default: [],
    },
    error: { type: Object },
    _id: { type: String },
  },
  { minimize: false, id: false }
)

FollowupSchema.methods.postInitialEmail = function (messageId) {
  this.sentAt = Date.now()
  this.messageId = messageId
  if (!this.surveyOptin) {
    this.email = undefined
  }
  this.error = undefined
  return this.save()
}

FollowupSchema.methods.renderInitialEmail = function () {
  return renderInitial(this)
}

FollowupSchema.methods.sendInitialEmail = function () {
  const followup = this
  return this.renderInitialEmail()
    .then((render) => {
      const email = new SendSmtpEmail()
      email.to = [{ email: followup.email }]
      email.subject = render.subject
      email.textContent = render.text
      email.htmlContent = render.html
      email.tags = ["initial"]
      return sendEmail(email)
    })
    .then((response) => {
      return followup.postInitialEmail(response.messageId)
    })
    .catch((err) => {
      console.log("error", err)
      followup.error = JSON.stringify(err, null, 2)
      return followup.save()
    })
}

FollowupSchema.methods.renderSurveyEmail = function (survey) {
  return renderSurvey(this, survey)
}

FollowupSchema.methods.createSurvey = function (type) {
  const followup = this
  return utils.generateToken().then(function (token) {
    return followup.surveys.create({
      _id: token,
      type: type,
    })
  })
}

FollowupSchema.methods.sendSurvey = function () {
  const followup = this
  return this.createSurvey("initial").then((survey) => {
    return this.renderSurveyEmail(survey)
      .then((render) => {
        const email = new SendSmtpEmail()
        email.to = [{ email: followup.email }]
        email.subject = render.subject
        email.textContent = render.text
        email.htmlContent = render.html
        email.tags = ["survey"]
        return sendEmail(email)
          .then((response) => {
            return response.messageId
          })
          .then((messageId) => {
            survey.messageId = messageId
            return survey
          })
      })
      .catch((err) => {
        console.log("error", err)
        survey.error = err
        return survey
      })
      .then((survey) => {
        const surveys = Array.from(followup.surveys)
        surveys.push(survey)

        followup.surveys = surveys
        return followup.save()
      })
  })
}

FollowupSchema.methods.mock = function () {
  const followup = this
  return this.createSurvey("initial").then((survey) => {
    const surveys = Array.from(followup.surveys)
    surveys.push(survey)
    followup.surveys = surveys
    return followup.save()
  })
}

FollowupSchema.methods.updateSurvey = function (id, answers) {
  const surveys = Array.from(this.surveys)
  const survey = find(surveys, function (s) {
    return s._id === id
  })

  Object.assign(survey, { answers: answers, repliedAt: Date.now() })
  this.surveys = surveys
  return this.save()
}

FollowupSchema.pre("save", function (next) {
  if (!this.isNew) {
    return next()
  }
  const followup = this
  utils
    .generateToken()
    .then(function (token) {
      followup._id = token
    })
    .then(next)
    .catch(next)
})

FollowupSchema.virtual("returnPath").get(function () {
  return "/followups/" + this._id
})

mongoose.model("Followup", FollowupSchema)
