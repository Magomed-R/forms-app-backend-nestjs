import historyAnswerDto from '../../forms/entities/historyAnswerDto';

export default interface historyDto {
    id?: number;
    guest?: string;
    userId?: number;
    formId: number;
    answers: historyAnswerDto[];
}
