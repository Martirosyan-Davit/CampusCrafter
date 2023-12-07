import { applyDecorators, Version as NestVersion } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

import { ApiVersionEnum } from '../constants';

export function ApiVersion(...versions: ApiVersionEnum[]): MethodDecorator {
  return applyDecorators(
    NestVersion(versions),
    ApiHeader({
      name: 'X-API-Version',
      enum: ApiVersionEnum,
      description:
        'The "X-API-Version" is used to know type of requested user.',
      required: true,
    }),
  );
}
