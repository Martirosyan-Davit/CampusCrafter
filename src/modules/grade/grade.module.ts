import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradeController } from './grade.controller';
import { GradeService } from './grade.service';
import { GradeEntity } from './grade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GradeEntity])],
  controllers: [GradeController],
  exports: [GradeService],
  providers: [GradeService],
})
export class GradeModule {}
