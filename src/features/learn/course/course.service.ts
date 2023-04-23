import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { CourseSearchService } from './course-search.service';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import Course from './entities/course.entity';
import User from 'src/features/user/entities/user.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly courseSearchService: CourseSearchService,
  ) { }

  findAll() {
    return this.courseRepository.find({
      relations: ['author'],
    });
  }

  async findOne(id: string) {
    const course = await this.courseRepository.findOne({
      where: {
        id
      },
      relations: ['author'],
    });
    if (!course) throw new Error('Course not found');
    return course;
  }

  async createCourse(course: CreateCourseDto, user: User) {
    const newCourse = await this.courseRepository.create({ ...course, author: user });
    await this.courseRepository.save(newCourse);
    await this.courseSearchService.indexCourse(newCourse);
    return newCourse;
  }

  async searchForCourses(text: string,
    offset?: number,
    limit?: number,
    startId?: number) {
    const { results, count } = await this.courseSearchService.search(
      text,
      offset,
      limit,
      startId,
    );

    const ids = results.map((result) => result.id);
    if (!ids.length) {
      return {
        items: [],
        count,
      };
    }
    const items = await this.courseRepository.find({
      where: { id: In(ids) },
    });
    return {
      items,
      count,
    };
  }
  async updateCourse(id: string, course: UpdateCourseDto) {
    const updatedCourse = await this.courseRepository.update(id, course);
    if (updatedCourse.affected === 0) throw new Error('Course not found');
    return await updatedCourse;
  }
  async deleteCourse(id: string) {
    const deletedCourse = await this.courseRepository.delete(id);
    if (deletedCourse.affected === 0) throw new Error('Course not found');
    await this.courseSearchService.remove(id);
    return deletedCourse;
  }
}
