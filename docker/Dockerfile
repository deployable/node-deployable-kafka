FROM openjdk:8-jre-alpine

RUN set -uex; \
    cd /tmp; \
#    wget http://mirror.cc.columbia.edu/pub/software/apache/kafka/0.10.1.0/kafka_2.11-0.10.1.0.tgz; \
    wget http://apache.mirror.digitalpacific.com.au/kafka/0.10.1.0/kafka_2.11-0.10.1.0.tgz; \
    tar -xzf kafka_2.11-0.10.1.0.tgz; \
    rm kafka_2.11-0.10.1.0.tgz ;\
    mv kafka_2.11-0.10.1.0 /kafka

RUN set -uex; \
    apk update; \
    apk add bash

copy server.properties /kafka/config/server.properties
copy docker-entrypoint.sh /entrypoint.sh

WORKDIR /kafka
entrypoint ["/entrypoint.sh"]
cmd ["kafka"]

