# Дипломный проект по курсу NodeJS в Нетологии

## Общая информация
Проект реализован на фреймворке NestJS и в целом соответствует [заданию](https://github.com/netology-code/ndjs-diplom). По задумке авторов это API для бронирования номеров в гостиницах с доступом и функционалом для клиентов, менеджеров и администраторов. 

## Компоненты
* MongoDB/mongoose - в качестве базы данных для хранения всех объектов приложения: пользователей, отелей, номеров, бронирований и т.д.
* passport/session - для аутентификации пользователей (хранилище сессий в приложении). 
* multer - загрузка файлов
* socket io - для отправки уведомлений пользователям
* bcrypt - для хеша паролей

## Структура
Проект состоит из следующий NestJS модулей:
* auth - аутентификация и регистрация
* users - работа с пользователями
* hotels - работа с отелями
* hotel-rooms - работа с номерами (выделена в отдельный модуль)
* reservation - работа с бронированиями
* support - работа с обращениями в поддержку

Дополнительные компоненты проекта:
* common - вспомогательные функции и общие интерфейсы
* roles - компоненты работа с ролями
 
В проекте активно используются паттерны фреймворка NestJS: Guard, Pipe и Interceptor.
Для удобства проверки добавлен небольшой фронтэнд в папке socket-client. Тесты в проекте заданием не предусмотрены и реализованы не были.

## Запуск проекта
Для запуска проекта используйте docker-compose файл. Он включает:
* сам проект
* mongo - база данных Mongo DB
* mongo-express - инструмент для работы с базой данных
