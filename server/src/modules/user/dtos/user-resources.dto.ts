import { IsOptional } from "class-validator";
export class UserResourcesDto {
    @IsOptional()
	username: string;

    @IsOptional()
    picture: string;
}