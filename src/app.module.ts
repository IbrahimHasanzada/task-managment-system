import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import database from './config/database';
import { JwtModule } from '@nestjs/jwt';
import config from './config';
import { ClsModule } from 'nestjs-cls';
import { RoleModule } from './modules/role/role.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(database.options),
    JwtModule.register({
      global: true,
      secret: config.superSecret,
      signOptions: { expiresIn: '1d' }
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true
      }
    }),
    RoleModule,
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
