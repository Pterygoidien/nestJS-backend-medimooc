import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseSearchService } from './course-search.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Course from './entities/course.entity';
import { SearchModule } from 'src/features/search/search.module';

@Module({
  imports: [TypeOrmModule.forFeature([Course]), SearchModule],
  controllers: [CourseController],
  providers: [CourseService, CourseSearchService],
})
export class CourseModule { }
