import answerDto from "../../answers/entities/answerDto"

export default interface ITest {
    id: number
    question: string
    formId: number
    answers: answerDto[]
    historyAnswers: []
}