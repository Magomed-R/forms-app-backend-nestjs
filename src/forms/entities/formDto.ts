import historyDto from '../../history/entities/historyDto';
import ITest from '../../tests/entities/testDto';
import commentDto from '../../comments/entities/commentDto';

export default interface formDto {
    id?: number;
    title: string;
    authorId: number;
    tests?: ITest[];
    open?: boolean;
    ready?: boolean;
    createdAt?: Date;
    history?: historyDto[];
    comments?: commentDto[];
}
