import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GradeController } from './grade.controller';
import { GradeEntity } from './grade.entity';
import { GradeService } from './grade.service';

@Module({
  imports: [TypeOrmModule.forFeature([GradeEntity])],
  controllers: [GradeController],
  exports: [GradeService],
  providers: [GradeService],
})
export class GradeModule {}
