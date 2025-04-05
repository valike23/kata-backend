import { IsString } from 'class-validator';

export class KataDto {
    @IsString()
    name!: string;


}