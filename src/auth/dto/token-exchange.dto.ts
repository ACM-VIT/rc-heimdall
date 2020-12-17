import { IsJWT, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class TokenExchangeDTO {
  /** name of the team  */
  @IsJWT()
  @IsNotEmpty()
  @ApiProperty({
    description: 'old JWT Token',
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmQ5YTY4MzRlN2JhNzAwMTc5NTY3NGEiLCJuYW1lIjoiWWFzaCBWZXJtYSIsImVtYWlsIjoieWsudmVybWEyMDAwQGdtYWlsLmNvbSIsImdvb2dsZUlkIjoiMTE3ODAyMTA4Njg3ODIxODQ3OTI0IiwiaWF0IjoxNjA4MDk5NDU5LCJleHAiOjE2MDgxODU4NTl9.ij62cerAAiptw_0swbAQKSBNKgzUevuAzm1pE7twwaI',
    required: true,
    minLength: 6,
  })
  token: string;
}
