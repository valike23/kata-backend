import { IsString } from 'class-validator';

export class KataDto {
    @IsString()
    name!: string;


}

export class EntryDto {
    @IsString()
    name!: string;
    @IsString()
    club!: string;
}