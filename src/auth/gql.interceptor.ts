import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import { IncomingMessage } from "http";
import { Observable } from "rxjs";

@Injectable()
export class GqlInterceptor implements NestInterceptor {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {

  }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const ctx = GqlExecutionContext.create(context);

    const req = ctx.getContext().req;
    const accessToken = req.headers.accesstoken;

    if (accessToken) {
      const tokenPayload = this.jwtService.verify(accessToken, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      });

      req.headers.profileId = tokenPayload.profileId;
    }

    return next.handle();
  }
}