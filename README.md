<p align="center">
  <img width="100%"  src="https://user-images.githubusercontent.com/14032427/101737680-383a4300-3aeb-11eb-8135-1ecd85f6e8a2.png" alt="Reverse Coding : Heimdall" /></a>
</p>

[![Build Status](https://travis-ci.com/YashKumarVerma/rc-heimdall.svg?token=bdYdpM7ki4qrmdCwJmGf&branch=master)](https://travis-ci.com/YashKumarVerma/rc-heimdall)
![Docker Image Version (latest by date)](https://img.shields.io/docker/v/yashkumarverma/rc-heimdall)
![Docker Image Size (tag)](https://img.shields.io/docker/image-size/yashkumarverma/rc-heimdall/latest)
![Docker Pulls](https://img.shields.io/docker/pulls/yashkumarverma/rc-heimdall)
![Docker Image Size (tag)](https://img.shields.io/docker/image-size/yashkumarverma/rc-heimdall/latest)
![GitHub](https://img.shields.io/github/license/yashkumarverma/rc-heimdall)
![GitHub contributors](https://img.shields.io/github/contributors/yashkumarverma/rc-heimdall)
![GitHub last commit](https://img.shields.io/github/last-commit/yashkumarverma/rc-heimdall)
![GitHub commit activity](https://img.shields.io/github/commit-activity/y/yashkumarverma/rc-heimdall)
![GitHub issues](https://img.shields.io/github/issues/yashkumarverma/rc-heimdall)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yashkumarverma/rc-heimdall)
![Lines of code](https://img.shields.io/tokei/lines/github/yashkumarverma/rc-heimdall)
![GitHub repo size](https://img.shields.io/github/repo-size/yashkumarverma/rc-heimdall)
![Documentation Coverage](http://rc-heimdall.ykv.surge.sh/images/coverage-badge-documentation.svg)

[![CodeFactor](https://www.codefactor.io/repository/github/yashkumarverma/rc-heimdall/badge?s=eabdf8d1d657fd0cfdb8988fad909011e443633a)](https://www.codefactor.io/repository/github/yashkumarverma/rc-heimdall)
[![DeepScan grade](https://deepscan.io/api/teams/12071/projects/15026/branches/293453/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=12071&pid=15026&bid=293453)
[![Maintainability](https://api.codeclimate.com/v1/badges/81f1b5a8a8b4c6addc2a/maintainability)](https://codeclimate.com/github/YashKumarVerma/rc-heimdall/maintainability)

  <p align="center">
  Heimdall is the main micro-service that is responsible for user-management, ingestion of problems from endpoints, providing API endpoints for main user interface, interaction with task-runners, code submission and evaluation. Since this service basically handles all requests from the client, it's named Heimdall. 
  </p>


## Description
- Code Documentation: [Compodocs](http://rc-heimdall.compodoc.surge.sh/)
- API Documentation: [Swagger](https://app.swaggerhub.com/apis-docs/YashKumarVerma/heimdall/1.0.0)
- API Playground to export client stubs : [Swagger](https://app.swaggerhub.com/apis/YashKumarVerma/heimdall/1.0.0)


## **Other Services**
- [Task Runner](https://github.com/YashKumarVerma/rc-task-runner)
- [Broadcaster](https://github.com/YashKumarVerma/rc-broadcaster)

## Architecture
![https://rc-atlan-preview.vercel.app/assets/rc-arch.png](https://rc-atlan-preview.vercel.app/assets/rc-arch.png)

## Running the app

There are two methods to run the application. First is by building the package locally and second is using the official docker image. 

```bash
# clone the repository
git clone https://github.com/YashKumarVerma/rc-heimdall
cd rc-heimdall

# install dependencies
yarn install

# start development server
yarn start:dev
```
Running from docker requires a hosted postgres instance (you can use a docker container for the same, just configure the network accordingly). Also note that heimdall depends on [judge0](https://github.com/judge0/judge0) and task-runner for it's operation. While testing, use something like [webhook.site](https://webhook.site/) to listen for outgoing requests.
```bash

# fetch the latest published image
docker pull yashkumarverma/rc-heimdall

# launch a container in production mode 
docker run -d \
    -p 80:80 \
    --name heimdall \
    -e NODE_ENV='production' \
    -e DB_HOST='some-domain.postgres.database.azure.com' \
    -e DB_USERNAME='username@xyz' \
    -e DB_PASSWORD='secure-password' \
    -e DB_NAME='postgres'\
    -e JUDGE_ENDPOINT='http://127.0.0.1:1974' \
    -e JUDGE_CALLBACK='http://52.171.196.193/judge/callback'\
    -e RUNNER_ENDPOINT_EXEC='http://127.0.0.1:8000/run' \
    -e RUNNER_ENDPOINT_SEED='http://127.0.0.1::8000/sync' \
    yashkumarverma/rc-heimdall:latest
```

## Open Source and Collaboration
Heimdall is (part of) a [MIT licensed](LICENSE) open source project. If there's a feature that you'd like to add to be added, please open a [issue/feature request](https://github.com/YashKumarVerma/rc-heimdall/issues/new/choose) for the same. We'd be happy to ship more features as needed.

## Events
If you are interested in organizing an event like Reverse Coding for your community / club / college / audience, feel free to reach out the author. To support events like these, we'd love to host the services free of cost for our fellow colleges. 



## Stay in touch

- [Yash Kumar Verma](https://github.com/yashkumarverma/)
  - Twitter: [@yash_kr_verma](https://twitter.com/yash_kr_verma)
  - Email: [yk.verma2000@gmail.com](mailto:yk.verma2000@gmail.com)
  - Stack Overflow: [yash-kumar-verma](https://stackoverflow.com/users/5131640/yash-kumar-verma)
