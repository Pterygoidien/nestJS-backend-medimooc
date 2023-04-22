import { Entity } from "typeorm";
import { Column, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from 'class-transformer';

@Entity()
class User {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ unique: true })
    public email: string;

    @Column()
    @Exclude()
    public password: string;
}
export default User;