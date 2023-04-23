import { Entity } from "typeorm";
import { Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Exclude } from 'class-transformer';
import Course from "src/features/learn/course/entities/course.entity";

@Entity()
class User {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ unique: true })
    public email: string;

    @Column()
    @Exclude()
    public password: string;

    @Column({ nullable: true })
    @Exclude()
    public currentHashedRefreshToken?: string;

    @OneToMany(() => Course, (course: Course) => course.author)
    public courses: Course[];

}
export default User;
