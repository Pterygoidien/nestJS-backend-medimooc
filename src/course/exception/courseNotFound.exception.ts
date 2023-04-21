import { NotFoundException } from '@nestjs/common';

class CourseNotFoundException extends NotFoundException {
    constructor(courseId: string) {
        super(`Course with ID ${courseId} not found`);
    }
}