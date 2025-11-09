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
import { UploadsModule } from './modules/uploads/uploads.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static'

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'uploads'),
      serveRoot: '/uploads',
    }),
    RoleModule,
    UserModule,
    AuthModule,
    UploadsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
