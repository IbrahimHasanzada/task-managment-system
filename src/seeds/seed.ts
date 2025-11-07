import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../modules/user/user.service';
import { RoleService } from '../modules/role/role.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const userService = app.get(UserService);
    const roleService = app.get(RoleService);

    let adminRole = await roleService.findByName('admin');
    if (!adminRole) {
        adminRole = await roleService.create({ role: 'admin' });
        console.log('Role "admin" yaradıldı');
    }

    const adminUser = await userService.findByEmail('admin@example.com');
    if (!adminUser) {
        await userService.create({
            username: 'Admin',
            email: 'admin@example.com',
            password: '$2b$10$u1mSuX2qgxXz7FTvPuvU6Odc4A28BCHwZ8Jidc6Ncq04akqhdXEL6',
            roleId: adminRole.id, 
            avatar: 'alksdasd',
            phone: 'alksndlaksnd'
        });
        console.log('Admin user yaradıldı');
    } else {
        console.log('Admin user artıq mövcuddur.');
    }

    await app.close();
}

bootstrap();
