FROM alpine:latest
ARG PB_VERSION=0.28.4
RUN apk add --no-cache \
    unzip \
    ca-certificates
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/
COPY ./.slc-local/pocketbase/pb_hooks /pb/pb_hooks
COPY ./.slc-local/pocketbase/pb_migrations /pb/pb_migrations
EXPOSE 8097
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8097"]