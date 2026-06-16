FROM alpine:latest
ARG PB_VERSION=0.39.4
RUN apk add --no-cache \
    unzip \
    ca-certificates \
    wget
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip -O /tmp/pb.zip && \
    unzip /tmp/pb.zip -d /pb/ && \
    rm /tmp/pb.zip
COPY ./.slc-production/pocketbase/pb_hooks /pb/pb_hooks
COPY ./.slc-production/pocketbase/pb_migrations /pb/pb_migrations
COPY ./.slc-production/pocketbase/pb_public /pb/pb_public
EXPOSE 8097
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8097"]