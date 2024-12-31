# ValidationPipe

npm i class-validator class-transformer

<!-- main.ts -->

app.useGlobalPipes(new ValidationPipe());

<!-- create middle ware -->

nest g mi common/middleware/logger --no-spec --flat
