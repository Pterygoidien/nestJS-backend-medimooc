import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import Course from './entities/course.entity';
import { CourseSearchBody } from './types/courseSearchBody.interface';

@Injectable()
export class CourseSearchService {
    index = 'courses';

    constructor(
        private readonly elasticSearchService: ElasticsearchService,
    ) { }

    async indexCourse(course: Course) {
        return this.elasticSearchService.index<CourseSearchBody>({
            index: this.index,
            document: {
                id: course.id,
                name: course.name,
                description: course.description,
            }
        });
    }

    async count(query: string, fields: string[]) {
        const { count } = await this.elasticSearchService.count({
            index: this.index,
            body: {
                query: {
                    multi_match: {
                        query,
                        fields,
                    },
                },
            },
        });
        return count;
    }

    async search(text: string, offset?: number, limit?: number, startId = 0) {
        let separateCount = 0;
        if (startId) {
            separateCount = await this.count(text, ['name', 'description']);

        }
        const { hits } = await this.elasticSearchService.search<CourseSearchBody>({
            index: this.index,
            from: offset,
            size: limit,
            query: {
                bool: {
                    should:
                    {
                        multi_match: {
                            query: text,
                            fields: ['name', 'description'],
                        },
                    },
                    filter: {
                        range: {
                            id: {
                                gt: startId,
                            },
                        },
                    },
                },
            },
        });
        const count = hits.total;
        const results = hits.hits.map((hit) => hit._source);
        return { count, results };
    }
}
