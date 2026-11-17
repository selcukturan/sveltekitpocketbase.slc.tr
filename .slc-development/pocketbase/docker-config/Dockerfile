FROM alpine:latest
ARG PB_VERSION=0.42.3
RUN apk add --no-cache \
    unzip \
    ca-certificates
# v0.41.0'dan itibaren sürümler GitHub yerine ganigeorgiev.com üzerinden dağıtılıyor
ADD https://ganigeorgiev.com/meta/pocketbase/pocketbase/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/ && rm /tmp/pb.zip
# COPY ./pb_migrations /pb/pb_migrations
# COPY ./pb_hooks /pb/pb_hooks
EXPOSE 8099
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8099"]
