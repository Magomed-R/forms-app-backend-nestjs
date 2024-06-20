import { Module } from '@nestjs/common';
import { TestsService } from './tests.service';

@Module({
  providers: [TestsService]
})
export class TestsModule {}
