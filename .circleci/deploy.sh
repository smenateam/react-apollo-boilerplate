#!/usr/bin/env bash

# Переводим переданный аргумент в uppercase на всякий случай
ENVIRONMENT="$(echo $1 | tr 'a-z' 'A-Z')"

# Вычисляем имена необходимые переменные для деплоя
HOST_VAR="SSH_${ENVIRONMENT}_HOST"
HOST=${!HOST_VAR}

USER_VAR="SSH_USER"
USER=${!USER_VAR}

DEPLOY_PATH_VAR="SSH_${ENVIRONMENT}_DEPLOY_PATH"
DEPLOY_PATH=${!DEPLOY_PATH_VAR}

# Деплоим
if [[ "$ENVIRONMENT" == "STAGING" ]] || [[ "$ENVIRONMENT" == "RELEASE" ]]; then
# В переменных circleci пути для стейджинга /staging, для релиза /release
# circle берет эти переменные и создает для них папки выгрузки
ssh-keyscan -H $HOST >> ~/.ssh/known_hosts
ssh $USER@$HOST "mkdir -p $DEPLOY_PATH"
ssh $USER@$HOST "rm -rf $DEPLOY_PATH/*"
scp -r ~/app/build/* "$USER@$HOST:$DEPLOY_PATH"
elif [[ "$ENVIRONMENT" == "FEATURE" ]]; then
ssh-keyscan -H $HOST >> ~/.ssh/known_hosts
# Для фича бранчей путь выгрузки у нас /
# Поэтому пытаемся распарсить название ветки и приводим его в нижний регистр
# Удаляем описание ветки при выгрузке
# НАПРИМЕР: Было SERVICES-666-hotfix-grand-master-remix => Стало SERVICES-666
FOLDER_NAME="$(echo $CIRCLE_BRANCH | egrep -o '[A-Z]+-[0-9]+' | tr '[:upper:]' '[:lower:]' || echo $CIRCLE_BRANCH)"
# ВАЖНО: Название ветки не должно содержать ничего кроме цифр, букв и '-' 
# Если название ветки содержит лишние символы, то просто выходим 
  if [ -z "${FOLDER_NAME}" ]; then
    echo 'Название не должно содержать ничего кроме букв, цифр и "-"'
    exit 1
  fi
ssh $USER@$HOST "mkdir -p $DEPLOY_PATH/$FOLDER_NAME"
ssh $USER@$HOST "rm -rf $DEPLOY_PATH/$FOLDER_NAME/*"
scp -r ~/app/build/* "$USER@$HOST:$DEPLOY_PATH/$FOLDER_NAME"
elif [[ "$ENVIRONMENT" == "MASTER" ]]; then
# Смотрим последний коммит и пытаемся найти там сообщение 'Merge pull request'
MESSAGE="$(git show -s --format=%s $1 | grep 'Merge pull request')"
  if [ -z "${MESSAGE}" ]; then
    # если не нашли, то просто выходим
    echo 'Сообщение коммита не содержит "Merge pull request"'
    exit 1
  fi
# Получаем название ветки, оно будет в себе содержать название репозитория
# Наример: CUSTOM_NAME/SERVICES-666
BRANCH="$(git show -s --format=%s $1 | grep -oE '[^ ]+$')"
# Удаляем название репозитория
BRANCH="$(echo $BRANCH | sed -e 's/CUSTOM_NAME\///g')"
# Обрезаем описание ветки, чтобы осталось только название задачи
FOLDER_NAME="$(echo $BRANCH | egrep -o '[A-Z]+-[0-9]+' | tr '[:upper:]' '[:lower:]' || echo $BRANCH)"
# Удаляем папку билда с сервера
ssh $USER@$HOST "rm -rf $DEPLOY_PATH/$FOLDER_NAME"
# Удаляем саму ветку
git push origin --delete $BRANCH
fi
