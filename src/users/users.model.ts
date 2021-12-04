import { NotFoundException, Query } from '@nestjs/common';
import { IsInt, IsString, Max, Min } from 'class-validator';

export class User {
  id: string;
  firstname: string;
  lastname: string;
  age: number;
  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}

export class CreateDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsInt()
  @Min(1)
  @Max(100)
  age: number;
}

export interface Res<T> {
  data?: T;
  message?: string;
  success?: boolean;
}

export class Response {
  static SUCCESSFULLY = {
    success: true,
    message: 'Success',
  };

  static ERROR = {
    success: false,
    message: 'Error',
  };

  static get<T>(data: T): Res<T> {
    return {
      ...this.SUCCESSFULLY,
      data,
    };
  }

  static NOT_FOUND(name: string) {
    return { message: `${name} not found` };
  }

  static errorNotFound(error?: any) {
    return new NotFoundException(error);
  }

  static Error(err) {
    return {
      ...this.ERROR,
      err,
    };
  }
}
