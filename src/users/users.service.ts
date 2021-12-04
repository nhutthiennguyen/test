import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDto, Res, Response, User } from './users.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];
  async create(body: CreateDto): Promise<Res<User>> {
    try {
      const newUser: User = new User({
        id: uuidv4(),
        ...body,
      });
      this.users.push(newUser);
      return Response.get<User>(newUser);
    } catch (error) {
      throw Response.Error(error);
    }
  }

  async findAll(name?: string): Promise<Res<User[]>> {
    try {
      let users = this.users;
      if (name) {
        users = users.filter((x) => {
          return [x.firstname.toLowerCase()].includes(name.toLowerCase());
        });
      }

      return Response.get(
        users.sort((a, b) => {
          if (a.firstname < b.firstname) {
            return -1;
          } else {
            return 1;
          }
        }),
      );
    } catch (error) {
      throw Response.Error(error);
    }
  }

  async findOne(id: string): Promise<Res<User>> {
    try {
      const user = this.users.find((x) => x.id === id);

      if (!user) {
        throw Response.errorNotFound(Response.NOT_FOUND('User'));
      }

      return Response.get(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: string, body: CreateDto): Promise<Res<User>> {
    try {
      const user = this.users.find((x) => x.id === id);

      if (!user) {
        throw Response.errorNotFound(Response.NOT_FOUND('User'));
      }

      const newUser = new User({
        id: user.id,
        ...body,
      });

      const idx = this.users.findIndex((x) => x.id === id);

      this.users.fill(newUser, idx, idx + 1);

      return Response.get(newUser);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: string) {
    try {
      const idx = this.users.findIndex((x) => x.id === id);

      if (idx < 0) {
        throw Response.errorNotFound(Response.NOT_FOUND('User'));
      }

      this.users.splice(idx, 1);

      return Response.SUCCESSFULLY;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
