import { type Constructor } from '../types';

export function UseDto(dtoClass: Constructor | undefined): ClassDecorator {
  return (ctor) => {
    // FIXME make dtoClass function returning dto

    if (!dtoClass) {
      throw new Error('UseDto decorator requires dtoClass');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    ctor.prototype.dtoClass = dtoClass;
  };
}
