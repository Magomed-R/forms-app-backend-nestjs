import { Prisma } from '@prisma/client';

export default interface authDto extends Prisma.UserCreateInput {
    code: string;
}
