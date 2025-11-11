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
            password: 'admin123',
            roleId: adminRole.id, 
            avatarId: 1,
            phone: 'alksndlaksnd'
        });

        console.log('Admin user yaradıldı');
    } else {
        console.log('Admin user artıq mövcuddur.');
    }

    await app.close();
}

bootstrap();
