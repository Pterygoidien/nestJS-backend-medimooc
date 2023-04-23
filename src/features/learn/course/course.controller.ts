import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';
import FindOneParams from 'src/utils/findOneParams';
import { PaginationWithStartIdDto } from 'src/utils/dto/pagination-with-start-id.dto';
import RequestWithUser from 'src/authentication/interface/requestWithUser.interface';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async create(
    @Body() course: CreateCourseDto,
    @Req() req: RequestWithUser
  ) {
    return this.courseService.createCourse(course, req.user);
  }

  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @Get('search')
  async getCourses(@Query('query') query: string, @Query() { offset, limit, startId }: PaginationWithStartIdDto) {
    if (query) return this.courseService.searchForCourses(query, offset, limit, startId);
    return this.courseService.findAll();
  }

  @Get(':id')
  findOne(@Param() { id }: FindOneParams) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.updateCourse(id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.deleteCourse(id);
  }
}
