import { Module } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { FormsModule } from './forms/forms.module';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from './mailer/mailer.module';
import { CommentsModule } from './comments/comments.module';
import { TestsModule } from './tests/tests.module';
import { HistoryModule } from './history/history.module';
import { AnswersModule } from './answers/answers.module';

@Module({
    imports: [
        FormsModule,
        DatabaseModule,
        UsersModule,
        AuthModule,
        MailerModule,
        CommentsModule,
        TestsModule,
        AnswersModule,
        HistoryModule,
    ],
    providers: [DatabaseService],
    controllers: [AppController],
})
export class AppModule {}
