var Chapters = require("../Chapters")

function chapters(currentPath, journey) {
  const cleanPath = currentPath
    .replace(/\/sommaire$/, "")
    .replace(/\/en_savoir_plus$/, "")
  const activeJourney = journey.filter((s) => s.isActive)
  const activeChaptersNames = activeJourney
    .map((c) => c.chapter)
    .filter((value, index, self) => self.indexOf(value) === index)
  const currentStep = journey.find((item) => item.path == cleanPath)
  const activeChapters = Chapters.default
    .getSommaireChapters()
    .filter((c) => activeChaptersNames.includes(c.name))
  let isCurrentChapter
  let passedChapter = true
  return activeChapters.map((chapter) => {
    isCurrentChapter = chapter.name === (currentStep && currentStep.chapter)
    passedChapter = isCurrentChapter ? false : passedChapter
    chapter.done = passedChapter
    chapter.current = isCurrentChapter
    chapter.root = activeJourney.find(
      (item) => item.chapter == chapter.name
    ).path
    return chapter
  })
}

function current(currentPath, journey) {
  return journey.find((item) => item.path == currentPath)
}

function next(current, journey) {
  const activeJourney = journey.filter((s) => s.isActive)

  let matches = activeJourney
    .map((element, index) => {
      return { element, index }
    })
    .filter((item) => item.element.path == (current.path || current))
  if (matches.length) {
    return activeJourney[matches[matches.length - 1].index + 1]
  } else {
    const test = current.path || current.fullPath || current
    throw new Error("Logic missing for " + test)
  }
}

module.exports = {
  next,
  chapters,
  current,
}
