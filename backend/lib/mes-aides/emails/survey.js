const fs = require("fs")
const path = require("path")
const mustache = require("consolidate").mustache
const config = require("../../../config")

const { mjml } = require(".")

const textTemplate = fs.readFileSync(
  path.join(__dirname, "templates/survey.txt"),
  "utf8"
)
const mjmlTemplate = fs.readFileSync(
  path.join(__dirname, "templates/survey.mjml"),
  "utf8"
)

function renderAsText(followup, survey) {
  const data = {
    ctaLink: `${config.baseURL}${survey.returnPath}`,
    returnURL: `${config.baseURL}${followup.surveyPath}`,
  }

  return mustache.render(textTemplate, data)
}

function renderAsHtml(followup, survey) {
  const data = {
    ctaLink: `${config.baseURL}${survey.returnPath}`,
    baseURL: config.baseURL,
    returnURL: `${config.baseURL}${followup.returnPath}`,
  }

  return mustache.render(mjmlTemplate, data).then(function (templateString) {
    const output = mjml(templateString)
    return {
      html: output.html,
    }
  })
}

function render(followup, survey) {
  return Promise.all([
    renderAsText(followup, survey),
    renderAsHtml(followup, survey),
  ]).then(function (values) {
    return {
      subject: `[${
        followup.answers._id || followup.answers
      }] Votre simulation sur 1jeune1solution.gouv.fr vous a-t-elle été utile ?`,
      text: values[0],
      html: values[1].html,
    }
  })
}

exports.render = render
