import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, ClientTCP } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: { 
      retryAttempts: 5,
      retryDelay: 3000 ,
    },
  });

  // Some magic through TCP connection
  (async () => {
    const client = new ClientTCP({
      host: 'localhost',
      port: 1883,
    });

    await client.connect();

    const pattern = { cmd: 'sum' };
    const data = [2, 3, 4, 5];
    const result = await client.send(pattern, data).toPromise();

    console.log(result);
  })();

  await app.listen(3000);
}
bootstrap();
