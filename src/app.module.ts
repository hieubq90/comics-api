import { join } from 'path'

import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ComicsModule } from './comics/comics.module'
import { GenresModule } from './genres/genres.module'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      serveRoot: '',
      exclude: ['/api/(.*)'],
    }),
    GenresModule,
    ComicsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
