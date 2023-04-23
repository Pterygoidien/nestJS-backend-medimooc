import User from "src/features/user/entities/user.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

@Entity()
class Course {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column()
    public name: string;

    @Column()
    public description: string;

    @ManyToOne(() => User, (user: User) => user.courses)
    public author: User;

}

export default Course;