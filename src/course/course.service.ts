import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Course from './entities/course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) { }

  findAll() {
    return this.courseRepository.find();
  }

  async findOne(id: string) {
    const course = await this.courseRepository.findOne({
      where: {
        id
      }
    });
    if (!course) throw new Error('Course not found');
    return course;
  }

  async createCourse(course: CreateCourseDto) {
    const newCourse = await this.courseRepository.create(course);
    await this.courseRepository.save(newCourse);
    return newCourse;
  }

  async updateCourse(id: string, course: UpdateCourseDto) {
    const updatedCourse = await this.courseRepository.update(id, course);
    if (updatedCourse.affected === 0) throw new Error('Course not found');
    return await updatedCourse;
  }
  async deleteCourse(id: string) {
    const deletedCourse = await this.courseRepository.delete(id);
    if (deletedCourse.affected === 0) throw new Error('Course not found');
    return deletedCourse;
  }
}
